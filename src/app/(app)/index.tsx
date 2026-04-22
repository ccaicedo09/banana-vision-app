import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../../auth/auth-context";
import AppButton from "../../components/AppButton";
import AnalysisSummaryCard from "../../components/AnalysisSummaryCard";
import { theme } from "../../constants/theme";
import { saveAnalysisResult } from "../../services/analysis.service";
import { predictLeafMock } from "../../services/prediction.mock";
import { PredictionResult } from "../../types/prediction";
import styles from "./home.styles";

type ImageSourceLabel = "Cámara" | "Galería" | null;

export default function HomeScreen() {
  const { signOut } = useAuth();

  const params = useLocalSearchParams<{
    capturedUri?: string | string[];
    source?: string | string[];
  }>();

  const incomingUri = Array.isArray(params.capturedUri)
    ? params.capturedUri[0]
    : params.capturedUri;

  const incomingSourceParam = Array.isArray(params.source)
    ? params.source[0]
    : params.source;

  const handledUriRef = useRef<string | null>(null);
  const requestIdRef = useRef(0);

  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<ImageSourceLabel>(null);
  const [analysisResult, setAnalysisResult] = useState<PredictionResult | null>(
    null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSavingAnalysis, setIsSavingAnalysis] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(
    null
  );
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);

  const openFullResult = () => {
    if (!selectedImageUri || !analysisResult) return;

    router.push({
      pathname: "/(app)/result",
      params: {
        uri: selectedImageUri,
        result: encodeURIComponent(JSON.stringify(analysisResult)),
      },
    });
  };

  const runAnalysis = async (uri: string) => {
    const currentRequestId = ++requestIdRef.current;

    setIsAnalyzing(true);
    setIsSavingAnalysis(false);
    setAnalysisResult(null);
    setSaveSuccessMessage(null);
    setSaveErrorMessage(null);

    try {
      const result = await predictLeafMock(uri);

      if (requestIdRef.current !== currentRequestId) {
        return;
      }

      setAnalysisResult(result);
      setIsAnalyzing(false);

      setIsSavingAnalysis(true);

      try {
        await saveAnalysisResult(result);

        if (requestIdRef.current === currentRequestId) {
          setSaveSuccessMessage("El análisis fue guardado en tu historial.");
          setSaveErrorMessage(null);
        }
      } catch (saveError) {
        if (requestIdRef.current === currentRequestId) {
          setSaveSuccessMessage(null);
          setSaveErrorMessage(
            saveError instanceof Error
              ? saveError.message
              : "No se pudo guardar el análisis en la base de datos."
          );
        }
      } finally {
        if (requestIdRef.current === currentRequestId) {
          setIsSavingAnalysis(false);
        }
      }
    } catch {
      if (requestIdRef.current === currentRequestId) {
        Alert.alert(
          "Error",
          "No se pudo completar el análisis de la imagen seleccionada."
        );
        setIsAnalyzing(false);
      }
    }
  };

  const handleImageSelected = async (
    uri: string,
    source: Exclude<ImageSourceLabel, null>
  ) => {
    setSelectedImageUri(uri);
    setSelectedSource(source);
    await runAnalysis(uri);
  };

  useEffect(() => {
    if (!incomingUri) return;
    if (handledUriRef.current === incomingUri) return;

    handledUriRef.current = incomingUri;

    const mappedSource: Exclude<ImageSourceLabel, null> =
      incomingSourceParam === "camera" ? "Cámara" : "Galería";

    void handleImageSelected(incomingUri, mappedSource);
  }, [incomingUri, incomingSourceParam]);

  const handleTakePhoto = () => {
    router.push("/(app)/camera");
  };

  const handlePickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permiso requerido",
        "Debes habilitar la galería para subir una imagen."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      await handleImageSelected(result.assets[0].uri, "Galería");
    }
  };

  const handleOpenPreview = () => {
    if (!selectedImageUri) return;

    router.push({
      pathname: "/(app)/preview",
      params: { uri: selectedImageUri },
    });
  };

  const handleReanalyze = async () => {
    if (!selectedImageUri) return;
    await runAnalysis(selectedImageUri);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.heroCard}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>ANÁLISIS FOLIAR</Text>
            </View>

            <Text style={styles.title}>Banana Vision</Text>
            <Text style={styles.subtitle}>
              Captura o sube una hoja para identificar la clase detectada y
              visualizar el mapa Grad-CAM enviado por el servidor.
            </Text>

            <View style={styles.infoRow}>
              <View style={styles.infoChip}>
                <Text style={styles.infoChipText}>4 clases</Text>
              </View>
              <View style={styles.infoChip}>
                <Text style={styles.infoChipText}>Grad-CAM</Text>
              </View>
              <View style={styles.infoChip}>
                <Text style={styles.infoChipText}>Historial</Text>
              </View>
            </View>
          </View>

          <View style={styles.actions}>
            <AppButton
              title="Tomar foto"
              onPress={handleTakePhoto}
              style={styles.actionButton}
            />

            <AppButton
              title="Subir desde galería"
              variant="dark"
              onPress={handlePickFromGallery}
              style={styles.actionButton}
            />

            <AppButton
              title="Ver historial"
              variant="outline"
              onPress={() => router.push("/(app)/history")}
              style={styles.actionButton}
            />

            <AppButton
              title="Perfil"
              variant="outline"
              onPress={() => router.push("/(app)/profile")}
            />
          </View>

          {selectedImageUri ? (
            <View style={styles.selectedCard}>
              <Text style={styles.selectedEyebrow}>IMAGEN SELECCIONADA</Text>
              <Text style={styles.selectedTitle}>Hoja lista para analizar</Text>
              <Text style={styles.selectedSubtitle}>
                La imagen ya fue capturada o cargada y el sistema está preparado
                para mostrar el análisis del modelo.
              </Text>

              <View style={styles.imageFrame}>
                <Image
                  source={{ uri: selectedImageUri }}
                  style={styles.selectedImage}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.imageMetaRow}>
                {selectedSource ? (
                  <View style={styles.metaChip}>
                    <Text style={styles.metaChipText}>{selectedSource}</Text>
                  </View>
                ) : null}

                <View style={styles.metaChip}>
                  <Text style={styles.metaChipText}>224x224 esperado</Text>
                </View>

                <View style={styles.metaChip}>
                  <Text style={styles.metaChipText}>Clasificación foliar</Text>
                </View>
              </View>

              <View style={styles.selectedActions}>
                <AppButton
                  title="Ver vista previa"
                  variant="outline"
                  onPress={handleOpenPreview}
                  style={styles.actionButton}
                />

                <AppButton
                  title="Analizar de nuevo"
                  onPress={handleReanalyze}
                  loading={isAnalyzing}
                />
              </View>
            </View>
          ) : null}

          {isAnalyzing ? (
            <View style={styles.analysisLoadingBox}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.analysisLoadingTitle}>
                Analizando la hoja
              </Text>
              <Text style={styles.analysisLoadingText}>
                Estamos generando la predicción y preparando el espacio para el
                resultado y Grad-CAM.
              </Text>
            </View>
          ) : null}

          {analysisResult ? (
            <AnalysisSummaryCard
              result={analysisResult}
              onOpenDetail={openFullResult}
            />
          ) : null}

          {analysisResult && isSavingAnalysis ? (
            <View style={styles.saveStatusCard}>
              <Text style={styles.saveStatusTitle}>Guardando análisis</Text>
              <Text style={styles.saveStatusText}>
                Estamos subiendo la imagen y registrando este resultado en tu
                historial.
              </Text>
            </View>
          ) : null}

          {analysisResult && saveSuccessMessage ? (
            <View style={styles.saveStatusCard}>
              <Text style={styles.saveStatusTitle}>Análisis guardado</Text>
              <Text style={styles.saveStatusText}>{saveSuccessMessage}</Text>
            </View>
          ) : null}

          {analysisResult && saveErrorMessage ? (
            <View style={styles.saveStatusCard}>
              <Text style={styles.saveStatusErrorTitle}>
                No se pudo guardar
              </Text>
              <Text style={styles.saveStatusText}>{saveErrorMessage}</Text>
            </View>
          ) : null}

          <View style={styles.footer}>
            <AppButton
              title="Cerrar sesión"
              variant="danger"
              onPress={signOut}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}