import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AnalysisSummaryCard from "../../components/AnalysisSummaryCard";
import AppButton from "../../components/AppButton";
import { theme } from "../../constants/theme";
import { getAnalysisById } from "../../services/analysis.service";
import { predictLeafMock } from "../../services/prediction.mock";
import { AnalysisWithSignedUrl } from "../../types/database";
import { PredictionResult } from "../../types/prediction";
import styles from "./result.styles";

function mapAnalysisToPrediction(
  analysis: AnalysisWithSignedUrl
): PredictionResult {
  return {
    prediction: analysis.prediction,
    confidence: analysis.confidence ?? 0,
    probabilities: analysis.probabilities,
    imageUri: analysis.signed_image_url ?? analysis.image_url ?? "",
    gradcamUrl: analysis.gradcam_url ?? undefined,
    gradcamBase64: undefined,
    modelName: analysis.model_name ?? undefined,
    createdAt: analysis.created_at,
  };
}

export default function ResultScreen() {
  const params = useLocalSearchParams<{
    uri?: string | string[];
    result?: string | string[];
    analysisId?: string | string[];
  }>();

  const uriParam = Array.isArray(params.uri) ? params.uri[0] : params.uri;
  const resultParam = Array.isArray(params.result)
    ? params.result[0]
    : params.result;
  const analysisId = Array.isArray(params.analysisId)
    ? params.analysisId[0]
    : params.analysisId;

  const preloadedResult = useMemo<PredictionResult | null>(() => {
    if (!resultParam) return null;

    try {
      return JSON.parse(decodeURIComponent(resultParam)) as PredictionResult;
    } catch {
      return null;
    }
  }, [resultParam]);

  const [loading, setLoading] = useState(Boolean(analysisId) || !preloadedResult);
  const [result, setResult] = useState<PredictionResult | null>(
    preloadedResult
  );
  const [displayUri, setDisplayUri] = useState<string>(uriParam ?? preloadedResult?.imageUri ?? "");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (analysisId) {
        setLoading(true);
        setErrorMessage(null);

        try {
          const analysis = await getAnalysisById(analysisId);
          const mapped = mapAnalysisToPrediction(analysis);

          setResult(mapped);
          setDisplayUri(analysis.signed_image_url ?? analysis.image_url ?? "");
        } catch (error) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "No se pudo cargar el análisis seleccionado."
          );
        } finally {
          setLoading(false);
        }

        return;
      }

      if (preloadedResult) {
        setLoading(false);
        setErrorMessage(null);
        setResult(preloadedResult);
        setDisplayUri(uriParam ?? preloadedResult.imageUri);
        return;
      }

      if (!uriParam) {
        setLoading(false);
        setErrorMessage("No se encontró una imagen asociada al análisis.");
        return;
      }

      setLoading(true);
      setErrorMessage(null);

      try {
        const data = await predictLeafMock(uriParam);
        setResult(data);
        setDisplayUri(uriParam);
      } catch {
        setErrorMessage("No se pudo generar el resultado del análisis.");
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [analysisId, preloadedResult, uriParam]);

  if (errorMessage) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.container}>
            <View style={styles.headerCard}>
              <Text style={styles.title}>Resultado no disponible</Text>
              <Text style={styles.subtitle}>{errorMessage}</Text>
              <AppButton
                title="Volver al inicio"
                onPress={() => router.replace("/")}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!loading && !displayUri && !result) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.container}>
            <View style={styles.headerCard}>
              <Text style={styles.title}>Resultado no disponible</Text>
              <Text style={styles.subtitle}>
                No se encontraron datos suficientes para mostrar este análisis.
              </Text>
              <AppButton
                title="Volver al inicio"
                onPress={() => router.replace("/")}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.headerCard}>
            <Text style={styles.eyebrow}>RESULTADO COMPLETO</Text>
            <Text style={styles.title}>Diagnóstico de hoja de banano</Text>
            <Text style={styles.subtitle}>
              Aquí se presenta la imagen original y el bloque completo del
              análisis con clase, confianza, probabilidades y Grad-CAM.
            </Text>

            {displayUri ? (
              <View style={styles.imageFrame}>
                <Image
                  source={{ uri: displayUri }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            ) : null}
          </View>

          {loading ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingTitle}>Generando resultado</Text>
              <Text style={styles.loadingText}>
                El sistema está procesando la información para mostrar el
                diagnóstico completo.
              </Text>
            </View>
          ) : result ? (
            <AnalysisSummaryCard result={result} />
          ) : null}

          <View style={styles.footer}>
            <AppButton
              title="Analizar otra imagen"
              onPress={() => router.replace("/")}
              style={styles.buttonSpacing}
            />
            <AppButton
              title="Volver"
              variant="outline"
              onPress={() => router.back()}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}