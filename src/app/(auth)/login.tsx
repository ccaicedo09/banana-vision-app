import { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { useAuth } from "../../auth/auth-context";
import AppButton from "../../components/AppButton";
import AppInput from "../../components/AppInput";
import styles from "./auth.styles";

export default function LoginScreen() {
  const { signIn } = useAuth();

  const passwordRef = useRef<TextInput | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Faltan datos", "Ingresa correo y contraseña.");
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await signIn(email, password);

      if (error) {
        Alert.alert("No se pudo iniciar sesión", error);
        return;
      }

      Alert.alert("Ingreso exitoso", "Entraste al perfil con éxito.");
    } catch (err) {
      Alert.alert(
        "Error inesperado",
        err instanceof Error
          ? err.message
          : "Ocurrió un error inesperado al iniciar sesión."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.brandChip}>
              <Text style={styles.brandChipText}>BANANA VISION</Text>
            </View>

            <View style={styles.header}>
              <Text style={styles.title}>Diagnóstico foliar inteligente</Text>
              <Text style={styles.subtitle}>
                Inicia sesión para analizar hojas de banano, revisar resultados
                y visualizar Grad-CAM.
              </Text>
            </View>

            <View style={styles.card}>
              <AppInput
                label="Correo"
                placeholder="usuario@correo.com"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => passwordRef.current?.focus()}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === "Enter") {
                    passwordRef.current?.focus();
                  }
                }}
              />

              <AppInput
                ref={passwordRef}
                label="Contraseña"
                placeholder="Ingresa tu contraseña"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === "Enter") {
                    handleLogin();
                  }
                }}
              />

              <AppButton
                title="Entrar"
                onPress={handleLogin}
                loading={isSubmitting}
                style={{ marginTop: 8 }}
              />

              <Text style={styles.helperText}>
                Accede a tu historial, imágenes y resultados guardados.
              </Text>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>¿No tienes cuenta?</Text>
              <Pressable onPress={() => router.push("/(auth)/register")}>
                <Text style={styles.footerLink}>Regístrate</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}