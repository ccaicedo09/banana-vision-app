import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  Text,
  ViewStyle,
} from "react-native";
import styles, {
  ButtonVariant,
  getButtonContainerStyle,
  getButtonTextStyle,
} from "./AppButton.styles";
import { theme } from "../constants/theme";

type Props = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function AppButton({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
}: Props) {
  const isInactive = disabled || loading;
  const spinnerColor =
    variant === "primary" || variant === "dark" || variant === "danger"
      ? theme.colors.white
      : variant === "ghost"
      ? theme.colors.danger
      : theme.colors.text;

  return (
    <Pressable
      disabled={isInactive}
      onPress={onPress}
      style={({ pressed }) => [
        ...getButtonContainerStyle(variant, pressed, isInactive),
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} />
      ) : (
        <Text style={getButtonTextStyle(variant)}>{title}</Text>
      )}
    </Pressable>
  );
}