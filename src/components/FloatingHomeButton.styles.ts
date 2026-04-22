import { StyleSheet } from "react-native";
import { theme } from "../constants/theme";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 18,
    left: 18,
    zIndex: 20,
  },
  button: {
    minHeight: 52,
    minWidth: 52,
    borderRadius: theme.radius.full,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.85,
  },
  arrow: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.text,
    marginRight: 8,
    lineHeight: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
  },
});

export default styles;