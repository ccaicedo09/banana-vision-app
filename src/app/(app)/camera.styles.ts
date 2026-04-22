import { StyleSheet } from "react-native";
import { theme } from "../../constants/theme";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  cameraWrapper: {
    flex: 1,
    overflow: "hidden",
    borderRadius: theme.radius.xl,
    margin: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  camera: {
    flex: 1,
  },
  overlayTop: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    zIndex: 2,
  },
  overlayTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleBox: {
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.full,
    maxWidth: "75%",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  subtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    marginTop: 2,
  },
  bottomPanel: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: theme.colors.overlayDark,
    borderRadius: theme.radius.xl,
    padding: 16,
    zIndex: 2,
  },
  helperText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 14,
    textAlign: "center",
  },
  actionSpacing: {
    marginBottom: 12,
  },
  permissionCard: {
    flex: 1,
    margin: 24,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: "center",
  },
  permissionTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 10,
  },
  permissionText: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.textSoft,
    marginBottom: 20,
  },
});

export default styles;