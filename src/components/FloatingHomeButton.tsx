import React from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import styles from "./FloatingHomeButton.styles";

export default function FloatingHomeButton() {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => router.replace("/")}
        style={({ pressed }) => [
          styles.button,
          pressed ? styles.buttonPressed : null,
        ]}
      >
        <Text style={styles.arrow}>←</Text>
        <Text style={styles.label}>Inicio</Text>
      </Pressable>
    </View>
  );
}