import React from "react";
import { Image, Text, View } from "react-native";

import { PredictionResult } from "../types/prediction";
import AppButton from "./AppButton";
import styles from "./AnalysisSummaryCard.styles";

type Props = {
  result: PredictionResult;
  onOpenDetail?: () => void;
};

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

export default function AnalysisSummaryCard({
  result,
  onOpenDetail,
}: Props) {
  const probabilityEntries = Object.entries(result.probabilities).sort(
    (a, b) => b[1] - a[1]
  );

  const gradcamUri = result.gradcamUrl
    ? result.gradcamUrl
    : result.gradcamBase64
    ? `data:image/png;base64,${result.gradcamBase64}`
    : null;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.eyebrow}>RESULTADO DEL ANÁLISIS</Text>
        <Text style={styles.title}>Detección de hoja de banano</Text>
        <Text style={styles.subtitle}>
          Esta sección muestra la clase predicha, el nivel de confianza y el
          espacio reservado para Grad-CAM.
        </Text>
      </View>

      <View style={styles.predictionBox}>
        <Text style={styles.predictionLabel}>Clase detectada</Text>
        <Text style={styles.predictionValue}>{result.prediction}</Text>
        <Text style={styles.confidenceText}>
          Confianza estimada: {formatPercent(result.confidence)}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Probabilidades por clase</Text>
      <View>
        {probabilityEntries.map(([label, value]) => (
          <View key={label} style={styles.probabilityRow}>
            <View style={styles.probabilityHeader}>
              <Text style={styles.probabilityLabel}>{label}</Text>
              <Text style={styles.probabilityValue}>{formatPercent(value)}</Text>
            </View>

            <View style={styles.track}>
              <View style={[styles.fill, { width: `${value * 100}%` }]} />
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Grad-CAM</Text>
      <View style={styles.gradcamBox}>
        {gradcamUri ? (
          <Image
            source={{ uri: gradcamUri }}
            style={styles.gradcamImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.gradcamPlaceholder}>
            <Text style={styles.gradcamPlaceholderTitle}>
              Grad-CAM pendiente
            </Text>
            <Text style={styles.gradcamPlaceholderText}>
              Cuando el backend envíe el mapa de calor, aparecerá aquí para
              mostrar en qué región de la hoja se enfocó el modelo.
            </Text>
          </View>
        )}
      </View>

      {onOpenDetail ? (
        <View style={styles.footer}>
          <AppButton
            title="Abrir resultado completo"
            variant="outline"
            onPress={onOpenDetail}
          />
        </View>
      ) : null}
    </View>
  );
}