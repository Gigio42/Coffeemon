import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Main Actions
  mainActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  mainActionButton: {
    flex: 1,
    backgroundColor: "#2C3E50",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#34495E",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: "#95A5A6",
    borderColor: "#7F8C8D",
    opacity: 0.5,
  },
  actionIconContainer: {
    marginBottom: 4,
  },
  mainActionButtonText: {
    color: "#ECF0F1",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Attack Actions
  backButton: {
    padding: 12,
    backgroundColor: "#34495E",
    borderRadius: 8,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: "#ECF0F1",
    fontSize: 14,
    fontWeight: "600",
  },
  attackScrollView: {
    maxHeight: 280,
  },
  attackScrollContent: {
    gap: 10,
    paddingBottom: 10,
  },
  attackButton: {
    backgroundColor: "#2C3E50",
    borderRadius: 10,
    padding: 12,
    borderWidth: 2,
    borderColor: "#34495E",
  },
  disabledAttackButton: {
    opacity: 0.4,
    backgroundColor: "#7F8C8D",
  },
  attackButtonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  attackButtonName: {
    color: "#ECF0F1",
    fontSize: 16,
    fontWeight: "700",
  },
  attackButtonPower: {
    color: "#F39C12",
    fontSize: 14,
    fontWeight: "600",
  },
  attackButtonDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  attackButtonType: {
    color: "#BDC3C7",
    fontSize: 12,
    textTransform: "uppercase",
  },
  attackButtonPP: {
    color: "#3498DB",
    fontSize: 12,
    fontWeight: "500",
  },
  attackButtonDisabledText: {
    color: "#E74C3C",
    fontSize: 11,
    marginTop: 4,
    fontStyle: "italic",
  },

  // Item Actions
  itemScrollView: {
    maxHeight: 280,
  },
  itemScrollContent: {
    gap: 10,
    paddingBottom: 10,
  },
  itemButton: {
    backgroundColor: "#2C3E50",
    borderRadius: 10,
    padding: 12,
    borderWidth: 2,
    borderColor: "#34495E",
  },
  itemButtonDisabled: {
    opacity: 0.3,
    backgroundColor: "#7F8C8D",
  },
  itemButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemIcon: {
    width: 40,
    height: 40,
  },
  itemIconDisabled: {
    opacity: 0.3,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemName: {
    color: "#ECF0F1",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  itemNameDisabled: {
    color: "#95A5A6",
  },
  itemDescription: {
    color: "#BDC3C7",
    fontSize: 12,
  },
  itemDescriptionDisabled: {
    color: "#7F8C8D",
  },
  itemQuantityBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 40,
    alignItems: "center",
  },
  itemQuantityText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "700",
  },
  itemOutOfStockBadge: {
    backgroundColor: "#E74C3C",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 40,
    alignItems: "center",
  },
  itemOutOfStockText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "700",
  },
});
