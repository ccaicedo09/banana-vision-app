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

export default function RegisterScreen() {
  const { signUp } = useAuth();

  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Faltan datos", "Completa todos los campos.");
      return;
    }

    if (password.trim().length < 6) {
      Alert.alert(
        "Contraseña inválida",
        "La contraseña debe tener al menos 6 caracteres."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const { error, needsEmailConfirmation } = await signUp(
        name,
        email,
        password
      );

      if (error) {
        Alert.alert("No se pudo registrar la cuenta", error);
        return;
      }

      if (needsEmailConfirmation) {
        Alert.alert(
          "Revisa tu correo",
          "La cuenta fue creada, pero debes confirmar tu correo antes de iniciar sesión."
        );
        router.replace("/(auth)/login");
        return;
      }

      Alert.alert("Registro exitoso", "Se registró un usuario con éxito.");
    } catch (err) {
      Alert.alert(
        "Error inesperado",
        err instanceof Error
          ? err.message
          : "Ocurrió un error inesperado al registrar la cuenta."
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
              <Text style={styles.brandChipText}>NUEVO USUARIO</Text>
            </View>

            <View style={styles.header}>
              <Text style={styles.title}>Crear cuenta</Text>
              <Text style={styles.subtitle}>
                Registra tu perfil para guardar análisis, imágenes y resultados
                del diagnóstico.
              </Text>
            </View>

            <View style={styles.card}>
              <AppInput
                label="Nombre"
                placeholder="Tu nombre completo"
                value={name}
                onChangeText={setName}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => emailRef.current?.focus()}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === "Enter") {
                    emailRef.current?.focus();
                  }
                }}
              />

              <AppInput
                ref={emailRef}
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
                placeholder="Crea una contraseña"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                returnKeyType="done"
                onSubmitEditing={handleRegister}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === "Enter") {
                    handleRegister();
                  }
                }}
              />

              <AppButton
                title="Registrarme"
                onPress={handleRegister}
                loading={isSubmitting}
                style={{ marginTop: 8 }}
              />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>¿Ya tienes cuenta?</Text>
              <Pressable onPress={() => router.replace("/(auth)/login")}>
                <Text style={styles.footerLink}>Inicia sesión</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}