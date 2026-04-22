import { StyleSheet } from "react-native";
import { theme } from "../../constants/theme";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: 24,
    paddingTop: 88,
    paddingBottom: 36,
  },
  container: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
  },
  headerCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
    marginBottom: 18,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
    color: theme.colors.primary,
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.textSoft,
    marginBottom: 18,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
    marginBottom: -8,
  },
  chip: {
    backgroundColor: "#F7FAF7",
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
    marginBottom: 8,
  },
  chipText: {
    color: theme.colors.text,
    fontWeight: "600",
    fontSize: 13,
  },
  statusCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: 22,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  statusTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.textSoft,
    marginBottom: 18,
  },
  errorTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "800",
    color: theme.colors.danger,
    marginBottom: 8,
  },
  buttonSpacing: {
    marginBottom: 12,
  },
});

export default styles;