import { router, useLocalSearchParams } from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppButton from "../../components/AppButton";
import styles from "./preview.styles";

export default function PreviewScreen() {
  const params = useLocalSearchParams<{ uri?: string | string[] }>();
  const uri = Array.isArray(params.uri) ? params.uri[0] : params.uri;

  if (!uri) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.container}>
            <View style={styles.card}>
              <Text style={styles.title}>Vista previa no disponible</Text>
              <Text style={styles.subtitle}>
                No se encontró una imagen para mostrar.
              </Text>
              <AppButton title="Volver al inicio" onPress={() => router.replace("/")} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const handleAnalyze = () => {
    router.push({
      pathname: "/result",
      params: { uri },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.eyebrow}>VISTA PREVIA</Text>
            <Text style={styles.title}>Revisión de la imagen</Text>
            <Text style={styles.subtitle}>
              Confirma que la hoja se ve correctamente antes de abrir el
              resultado completo del análisis.
            </Text>

            <View style={styles.imageFrame}>
              <Image
                source={{ uri }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>

            <View style={styles.footerActions}>
              <AppButton
                title="Analizar y abrir resultado"
                onPress={handleAnalyze}
                style={styles.buttonSpacing}
              />
              <AppButton
                title="Volver"
                variant="outline"
                onPress={() => router.back()}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}