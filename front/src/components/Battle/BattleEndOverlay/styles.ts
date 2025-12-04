import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  card: {
    backgroundColor: "#2C3E50",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    minWidth: 280,
    borderWidth: 3,
    borderColor: "#F39C12",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#F39C12",
    marginBottom: 16,
    textAlign: "center",
  },
  winner: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ECF0F1",
    marginBottom: 12,
    textAlign: "center",
  },
  subtext: {
    fontSize: 14,
    color: "#BDC3C7",
    marginBottom: 24,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#F39C12",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#E67E22",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
    textTransform: "uppercase",
  },
});
