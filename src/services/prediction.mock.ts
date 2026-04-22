import { DiseaseClass, PredictionResult } from "../types/prediction";

const classes: DiseaseClass[] = [
  "cordana",
  "pestalotiopsis",
  "sana",
  "sigatoka",
];

function buildProbabilities(
  prediction: DiseaseClass
): Record<DiseaseClass, number> {
  const base: Record<DiseaseClass, number> = {
    cordana: 0.02,
    pestalotiopsis: 0.03,
    sana: 0.04,
    sigatoka: 0.05,
  };

  base[prediction] = 0.91;
  return base;
}

export async function predictLeafMock(
  imageUri: string
): Promise<PredictionResult> {
  await new Promise((resolve) => setTimeout(resolve, 1800));

  const prediction = classes[Math.floor(Math.random() * classes.length)];

  return {
    prediction,
    confidence: 0.91,
    probabilities: buildProbabilities(prediction),
    imageUri,
    gradcamUrl: undefined,
    gradcamBase64: undefined,
    modelName: "Mock-MobileNetV3",
    createdAt: new Date().toISOString(),
  };
}