export type DiseaseClass =
  | "cordana"
  | "pestalotiopsis"
  | "sana"
  | "sigatoka";

export type PredictionResult = {
  prediction: DiseaseClass;
  confidence: number;
  probabilities: Record<DiseaseClass, number>;
  imageUri: string;
  gradcamUrl?: string;
  gradcamBase64?: string;
  modelName?: string;
  createdAt: string;
};