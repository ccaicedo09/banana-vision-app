import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../../auth/auth-context";
import AppButton from "../../components/AppButton";
import FloatingHomeButton from "../../components/FloatingHomeButton";
import { getProfileSummary } from "../../services/profile.service";
import { ProfileSummary } from "../../types/database";
import styles from "./profile.styles";

function formatDate(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleString("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getInitials(fullName: string | null) {
  if (!fullName || fullName.trim().length === 0) {
    return "U";
  }

  const parts = fullName.trim().split(/\s+/).slice(0, 2);

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "U";
}

export default function ProfileScreen() {
  const { signOut } = useAuth();

  const [profile, setProfile] = useState<ProfileSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const initials = useMemo(
    () => getInitials(profile?.full_name ?? null),
    [profile?.full_name]
  );

  const loadProfile = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await getProfileSummary();
      setProfile(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo cargar la información del perfil."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadProfile();
  }, []);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <FloatingHomeButton />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.container}>
            <View style={styles.headerCard}>
              <Text style={styles.eyebrow}>PERFIL</Text>
              <Text style={styles.title}>Cuenta del usuario</Text>
              <Text style={styles.subtitle}>
                Estamos cargando la información del perfil y el resumen de la
                actividad.
              </Text>
            </View>

            <View style={styles.statusCard}>
              <Text style={styles.statusTitle}>Cargando perfil</Text>
              <Text style={styles.statusText}>
                Consultando los datos del usuario autenticado y la cantidad de
                análisis guardados.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (errorMessage || !profile) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <FloatingHomeButton />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.container}>
            <View style={styles.headerCard}>
              <Text style={styles.eyebrow}>PERFIL</Text>
              <Text style={styles.title}>Cuenta del usuario</Text>
              <Text style={styles.subtitle}>
                No fue posible completar la carga del perfil.
              </Text>
            </View>

            <View style={styles.statusCard}>
              <Text style={styles.errorTitle}>No se pudo cargar</Text>
              <Text style={styles.statusText}>
                {errorMessage ?? "No hay datos disponibles para este perfil."}
              </Text>

              <AppButton
                title="Intentar de nuevo"
                onPress={() => {
                  void loadProfile();
                }}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FloatingHomeButton />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.headerCard}>
            <Text style={styles.eyebrow}>PERFIL</Text>
            <Text style={styles.title}>Cuenta del usuario</Text>
            <Text style={styles.subtitle}>
              Esta vista resume la información del perfil autenticado y la
              actividad registrada en Supabase.
            </Text>
          </View>

          <View style={styles.profileCard}>
            <View style={styles.profileTop}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>

              <Text style={styles.fullName}>
                {profile.full_name ?? "Usuario"}
              </Text>
              <Text style={styles.email}>{profile.email}</Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Análisis guardados</Text>
                <Text style={styles.statValue}>{profile.analyses_count}</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Identificador</Text>
                <Text style={styles.statValue}>
                  {profile.id.slice(0, 8).toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Cuenta creada</Text>
              <Text style={styles.infoValue}>
                {formatDate(profile.created_at)}
              </Text>
            </View>
          </View>

          <View style={styles.actionsCard}>
            <AppButton
              title="Ver historial"
              onPress={() => router.push("/(app)/history")}
              style={styles.buttonSpacing}
            />

            <AppButton
              title="Actualizar perfil"
              variant="outline"
              onPress={() => {
                void loadProfile();
              }}
              style={styles.buttonSpacing}
            />

            <AppButton
              title="Cerrar sesión"
              variant="danger"
              onPress={handleSignOut}
              loading={isSigningOut}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}