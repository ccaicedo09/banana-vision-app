import { StyleSheet } from "react-native";
import { theme } from "../constants/theme";

export type ButtonVariant = "primary" | "dark" | "outline" | "ghost" | "danger";

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  disabled: {
    opacity: 0.6,
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  primaryPressed: {
    backgroundColor: theme.colors.primaryPressed,
  },
  dark: {
    backgroundColor: theme.colors.dark,
  },
  darkPressed: {
    backgroundColor: theme.colors.darkPressed,
  },
  danger: {
    backgroundColor: theme.colors.danger,
  },
  dangerPressed: {
    backgroundColor: theme.colors.dangerPressed,
  },
  outline: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  textBase: {
    fontSize: 16,
    fontWeight: "700",
  },
  textLight: {
    color: theme.colors.white,
  },
  textDark: {
    color: theme.colors.text,
  },
  textDanger: {
    color: theme.colors.danger,
  },
});

export default styles;

export function getButtonContainerStyle(
  variant: ButtonVariant,
  pressed: boolean,
  disabled: boolean
) {
  const variantStyle =
    variant === "primary"
      ? pressed
        ? styles.primaryPressed
        : styles.primary
      : variant === "dark"
      ? pressed
        ? styles.darkPressed
        : styles.dark
      : variant === "danger"
      ? pressed
        ? styles.dangerPressed
        : styles.danger
      : variant === "outline"
      ? styles.outline
      : styles.ghost;

  return [styles.base, variantStyle, disabled && styles.disabled];
}

export function getButtonTextStyle(variant: ButtonVariant) {
  if (variant === "danger") {
    return [styles.textBase, styles.textLight];
  }

  const textColorStyle =
    variant === "primary" || variant === "dark"
      ? styles.textLight
      : variant === "ghost"
      ? styles.textDanger
      : styles.textDark;

  return [styles.textBase, textColorStyle];
}