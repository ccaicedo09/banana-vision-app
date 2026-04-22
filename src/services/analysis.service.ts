import { supabase } from "../lib/supabase";
import {
  AnalysisRecord,
  AnalysisWithSignedUrl,
} from "../types/database";
import { PredictionResult } from "../types/prediction";

const BUCKET_NAME = "leaf-images";

function getFileExtension(uri: string, mimeType?: string) {
  if (mimeType?.includes("/")) {
    return mimeType.split("/")[1].toLowerCase();
  }

  const cleanUri = uri.split("?")[0];
  const parts = cleanUri.split(".");
  const lastPart = parts[parts.length - 1]?.toLowerCase();

  if (!lastPart || lastPart === cleanUri.toLowerCase()) {
    return "jpg";
  }

  return lastPart;
}

function getMimeTypeFromExtension(extension: string) {
  switch (extension) {
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "heic":
      return "image/heic";
    case "jpeg":
    case "jpg":
    default:
      return "image/jpeg";
  }
}

async function localUriToUploadData(uri: string) {
  const response = await fetch(uri);

  if (!response.ok) {
    throw new Error("No se pudo leer la imagen local para subirla.");
  }

  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();

  const extension = getFileExtension(uri, blob.type);
  const contentType = blob.type || getMimeTypeFromExtension(extension);

  return {
    arrayBuffer,
    extension,
    contentType,
  };
}

async function getAuthenticatedUserOrThrow() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("No se pudo identificar al usuario autenticado.");
  }

  return user;
}

async function attachSignedUrl(
  record: AnalysisRecord
): Promise<AnalysisWithSignedUrl> {
  if (!record.image_path) {
    return {
      ...record,
      signed_image_url: null,
    };
  }

  try {
    const signedUrl = await getSignedImageUrl(record.image_path);

    return {
      ...record,
      signed_image_url: signedUrl,
    };
  } catch {
    return {
      ...record,
      signed_image_url: null,
    };
  }
}

export async function saveAnalysisResult(
  result: PredictionResult
): Promise<AnalysisRecord> {
  const user = await getAuthenticatedUserOrThrow();

  const uploadData = await localUriToUploadData(result.imageUri);

  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}.${uploadData.extension}`;

  const storagePath = `${user.id}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, uploadData.arrayBuffer, {
      contentType: uploadData.contentType,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`No se pudo subir la imagen: ${uploadError.message}`);
  }

  const insertPayload = {
    user_id: user.id,
    image_path: storagePath,
    image_url: null,
    prediction: result.prediction,
    confidence: result.confidence,
    probabilities: result.probabilities,
    gradcam_url: result.gradcamUrl ?? null,
    model_name: result.modelName ?? null,
  };

  const { data, error: insertError } = await supabase
    .from("analyses")
    .insert(insertPayload)
    .select("*")
    .single();

  if (insertError) {
    await supabase.storage.from(BUCKET_NAME).remove([storagePath]);

    throw new Error(`No se pudo guardar el análisis: ${insertError.message}`);
  }

  return data as AnalysisRecord;
}

export async function getSignedImageUrl(
  imagePath: string,
  expiresInSeconds = 3600
) {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(imagePath, expiresInSeconds);

  if (error || !data?.signedUrl) {
    throw new Error("No se pudo generar la URL temporal de la imagen.");
  }

  return data.signedUrl;
}

export async function listUserAnalyses(): Promise<AnalysisWithSignedUrl[]> {
  const user = await getAuthenticatedUserOrThrow();

  const { data, error } = await supabase
    .from("analyses")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`No se pudo cargar el historial: ${error.message}`);
  }

  const records = (data ?? []) as AnalysisRecord[];

  return Promise.all(records.map(attachSignedUrl));
}

export async function getAnalysisById(
  analysisId: string
): Promise<AnalysisWithSignedUrl> {
  const user = await getAuthenticatedUserOrThrow();

  const { data, error } = await supabase
    .from("analyses")
    .select("*")
    .eq("id", analysisId)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    throw new Error("No se pudo cargar el análisis seleccionado.");
  }

  return attachSignedUrl(data as AnalysisRecord);
}