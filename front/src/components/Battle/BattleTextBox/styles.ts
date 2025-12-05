import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  textBox: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: "rgba(44, 62, 80, 0.95)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#34495E",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  textBoxContent: {
    marginBottom: 8,
  },
  textBoxMessage: {
    color: "#ECF0F1",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
  textBoxIndicator: {
    color: "#3498DB",
    fontWeight: "700",
  },
  textBoxCounterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 4,
  },
  textBoxNavButton: {
    padding: 4,
  },
  textBoxNavArrow: {
    color: "#3498DB",
    fontSize: 18,
    fontWeight: "700",
  },
  textBoxNavArrowDisabled: {
    color: "#7F8C8D",
    opacity: 0.4,
  },
  textBoxCounter: {
    color: "#BDC3C7",
    fontSize: 12,
    fontWeight: "600",
  },
});
