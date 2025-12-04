import React, { useMemo } from "react";
import { Text } from "react-native";

interface ColoredPart {
  text: string;
  color: string;
  type: "player" | "opponent" | "damage" | "default";
}

type MatchType = "player" | "opponent" | "damage";

interface ColoredLogTextProps {
  text: string;
  playerCoffeemonNames: string[];
  opponentCoffeemonNames: string[];
  style?: any;
}

export default function ColoredLogText({
  text,
  playerCoffeemonNames,
  opponentCoffeemonNames,
  style,
}: ColoredLogTextProps) {
  const coloredParts = useMemo(() => {
    if (
      !text ||
      !Array.isArray(playerCoffeemonNames) ||
      !Array.isArray(opponentCoffeemonNames)
    ) {
      return [{ text, color: "#FFFFFF", type: "default" as const }];
    }

    const parts: ColoredPart[] = [];
    let lastIndex = 0;

    interface MatchSegment {
      index: number;
      length: number;
      text: string;
      color: string;
      type: MatchType;
    }

    const allMatches: MatchSegment[] = [];

    // Coletar matches de nomes de player
    playerCoffeemonNames.forEach((name: string) => {
      const regex = new RegExp(`\\b${name}\\b`, "gi");
      let match;
      while ((match = regex.exec(text)) !== null) {
        allMatches.push({
          index: match.index,
          length: match[0].length,
          text: match[0],
          color: "#61D26A",
          type: "player",
        });
      }
    });

    // Coletar matches de nomes de oponente
    opponentCoffeemonNames.forEach((name: string) => {
      const regex = new RegExp(`\\b${name}\\b`, "gi");
      let match;
      while ((match = regex.exec(text)) !== null) {
        allMatches.push({
          index: match.index,
          length: match[0].length,
          text: match[0],
          color: "#FF5A5F",
          type: "opponent",
        });
      }
    });

    // Coletar matches de dano
    const damagePatterns = [
      /-\d+\s*(?:HP|hp)?/g,
      /\b\d+\s+de\s+dano\b/gi,
      /\b\d+\s*dano\b/gi,
    ];

    damagePatterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const matchText = match[0];
        const startIndex = match.index;
        const endIndex = startIndex + matchText.length;
        const overlaps = allMatches.some(
          (existing) =>
            startIndex < existing.index + existing.length &&
            existing.index < endIndex
        );

        if (!overlaps) {
          allMatches.push({
            index: startIndex,
            length: matchText.length,
            text: matchText,
            color: "#FF4B4B",
            type: "damage",
          });
        }
      }
    });

    // Ordenar por posição
    allMatches.sort((a, b) => a.index - b.index);

    // Construir partes
    allMatches.forEach((match) => {
      if (match.index > lastIndex) {
        parts.push({
          text: text.slice(lastIndex, match.index),
          color: "#FFFFFF",
          type: "default",
        });
      }
      parts.push({
        text: match.text,
        color: match.color,
        type: match.type,
      });
      lastIndex = match.index + match.length;
    });

    // Adicionar texto restante
    if (lastIndex < text.length) {
      parts.push({
        text: text.slice(lastIndex),
        color: "#FFFFFF",
        type: "default",
      });
    }

    return parts;
  }, [text, playerCoffeemonNames, opponentCoffeemonNames]);

  return (
    <Text style={style}>
      {coloredParts.map((part, idx) => (
        <Text key={idx} style={{ color: part.color }}>
          {part.text}
        </Text>
      ))}
    </Text>
  );
}
