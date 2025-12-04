import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  spriteContainer: {
    position: "absolute",
    zIndex: 10,
  },
  playerSprite: {
    bottom: "20%",
    left: "15%",
    width: 140,
    height: 140,
  },
  opponentSprite: {
    top: "15%",
    right: "15%",
    width: 120,
    height: 120,
  },
  spriteImage: {
    width: "100%",
    height: "100%",
  },
  playerSpriteImage: {
    transform: [{ scaleX: -1 }],
  },
});
