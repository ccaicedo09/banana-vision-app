import { router } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";

import AppButton from "../../components/AppButton";
import styles from "./camera.styles";

export default function CameraScreen() {
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<"back" | "front">("back");
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
      });

      if (photo?.uri) {
        router.replace({
          pathname: "/",
          params: {
            capturedUri: photo.uri,
            source: "camera",
          },
        });
      }
    } catch {
      Alert.alert(
        "Error",
        "No fue posible capturar la imagen desde la cámara."
      );
    } finally {
      setIsCapturing(false);
    }
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.permissionCard}>
          <Text style={styles.permissionTitle}>Cargando cámara</Text>
          <Text style={styles.permissionText}>
            Estamos preparando el acceso a la cámara del dispositivo.
          </Text>
          <AppButton
            title="Volver al inicio"
            variant="outline"
            onPress={() => router.replace("/")}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.permissionCard}>
          <Text style={styles.permissionTitle}>Permiso de cámara requerido</Text>
          <Text style={styles.permissionText}>
            Debes permitir el acceso a la cámara para tomar una foto de la hoja
            y enviarla al análisis.
          </Text>
          <AppButton
            title="Conceder permiso"
            onPress={requestPermission}
            style={styles.actionSpacing}
          />
          <AppButton
            title="Volver al inicio"
            variant="outline"
            onPress={() => router.replace("/")}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.cameraWrapper}>
          <View style={styles.overlayTop}>
            <View style={styles.overlayTopRow}>
              <View style={styles.titleBox}>
                <Text style={styles.title}>Captura de hoja</Text>
                <Text style={styles.subtitle}>
                  Enfoca la hoja y toma la fotografía
                </Text>
              </View>
            </View>
          </View>

          <CameraView ref={cameraRef} style={styles.camera} facing={facing} />

          <View style={styles.bottomPanel}>
            <Text style={styles.helperText}>
              Asegúrate de que la hoja esté visible y con buena iluminación.
            </Text>

            <AppButton
              title="Capturar foto"
              variant="danger"
              onPress={handleCapture}
              loading={isCapturing}
              style={styles.actionSpacing}
            />

            <AppButton
              title="Cambiar cámara"
              variant="outline"
              onPress={toggleFacing}
              style={styles.actionSpacing}
            />

            <AppButton
              title="Cancelar"
              variant="outline"
              onPress={() => router.replace("/")}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}