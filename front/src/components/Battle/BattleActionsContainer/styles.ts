import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  actionsContainer: {
    backgroundColor: "#1A252F",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingBottom: 8,
    borderTopWidth: 3,
    borderTopColor: "#2C3E50",
  },
  statusBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#2C3E50",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#34495E",
  },
  statusText: {
    color: "#ECF0F1",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fleeButton: {
    backgroundColor: "#E74C3C",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#C0392B",
  },
  fleeButtonDisabled: {
    opacity: 0.4,
  },
  fleeButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
  },
});
