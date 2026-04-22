import { DiseaseClass } from "./prediction";

export type AnalysisRecord = {
  id: string;
  user_id: string;
  image_path: string;
  image_url: string | null;
  prediction: DiseaseClass;
  confidence: number | null;
  probabilities: Record<DiseaseClass, number>;
  gradcam_url: string | null;
  model_name: string | null;
  created_at: string;
};

export type AnalysisInsert = Omit<AnalysisRecord, "id" | "created_at">;

export type AnalysisWithSignedUrl = AnalysisRecord & {
  signed_image_url: string | null;
};

export type ProfileRecord = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type ProfileSummary = ProfileRecord & {
  email: string;
  analyses_count: number;
};