import { supabase } from "../lib/supabase";
import { ProfileRecord, ProfileSummary } from "../types/database";

function normalizeProfileName(
  fullName: string | null,
  email: string | null | undefined
) {
  if (fullName && fullName.trim().length > 0) {
    return fullName.trim();
  }

  if (email) {
    return email.split("@")[0];
  }

  return "Usuario";
}

export async function getProfileSummary(): Promise<ProfileSummary> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("No se pudo identificar al usuario autenticado.");
  }

  const profilePromise = supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const analysesCountPromise = supabase
    .from("analyses")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const [{ data: profileData, error: profileError }, { count, error: countError }] =
    await Promise.all([profilePromise, analysesCountPromise]);

  if (profileError) {
    throw new Error(`No se pudo cargar el perfil: ${profileError.message}`);
  }

  if (countError) {
    throw new Error(
      `No se pudo consultar la cantidad de análisis: ${countError.message}`
    );
  }

  const profile = profileData as ProfileRecord | null;

  return {
    id: user.id,
    full_name: normalizeProfileName(
      profile?.full_name ?? (user.user_metadata?.full_name as string | null),
      user.email
    ),
    avatar_url: profile?.avatar_url ?? null,
    created_at: profile?.created_at ?? user.created_at ?? new Date().toISOString(),
    email: user.email ?? "",
    analyses_count: count ?? 0,
  };
}