import React from 'react';
import { Text } from 'react-native';

/**
 * Adiciona marcadores de cor a mensagens de batalha
 * Formato: <color:tipo>texto</color>
 */
export function addMessageColors(message: string, event?: any): string {
  let coloredMessage = message;

  // Dano (números com HP ou "de dano")
  coloredMessage = coloredMessage.replace(
    /(-\d+\s*HP)/gi,
    '<color:damage>$1</color>'
  );
  
  // Cura (números com "pontos de vida")
  coloredMessage = coloredMessage.replace(
    /(\d+\s*pontos de vida)/gi,
    '<color:heal>$1</color>'
  );
  
  // Efeitos de status e buffs
  coloredMessage = coloredMessage.replace(
    /(Queimadura|Envenenamento|Sono|Congelamento|(?:um )?efeito de cura|Roubo de Vida|Aumento de (?:Ataque|Defesa)|Redução de Defesa|(?:um )?item|revitalização|(?:um )?efeito de status)/gi,
    '<color:effect>$1</color>'
  );
  
  // Crítico
  coloredMessage = coloredMessage.replace(
    /(crítico|devastador|Acerto crítico)/gi,
    '<color:crit>$1</color>'
  );
  
  // Números de dano soltos
  coloredMessage = coloredMessage.replace(
    /\b(\d+)\s*de dano/gi,
    '<color:damage>$1 de dano</color>'
  );

  // Nomes de coffeemons (capitalizados terminando com padrões comuns)
  coloredMessage = coloredMessage.replace(
    /\b([A-Z][a-z]+(?:ley|lette|eon|elle|ino|lynn|ion|etto))\b/g,
    '<color:coffeemon>$1</color>'
  );

  return coloredMessage;
}

/**
 * Renderiza texto com marcadores de cor como componentes React Native Text
 */
export function renderColoredText(text: string, baseStyle?: any): React.ReactNode {
  const COLORS = {
    damage: '#FF4444',
    heal: '#44FF44',
    effect: '#FFA500',
    coffeemon: '#FFD700',
    crit: '#FF00FF',
  };

  const parts: React.ReactNode[] = [];
  const regex = /<color:(\w+)>(.*?)<\/color>/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    // Texto antes da tag
    if (match.index > lastIndex) {
      parts.push(
        <Text key={`plain-${key++}`} style={baseStyle}>
          {text.substring(lastIndex, match.index)}
        </Text>
      );
    }

    // Texto colorido
    const colorType = match[1] as keyof typeof COLORS;
    const content = match[2];
    parts.push(
      <Text
        key={`colored-${key++}`}
        style={[baseStyle, { color: COLORS[colorType] || '#FFFFFF', fontWeight: 'bold' }]}
      >
        {content}
      </Text>
    );

    lastIndex = regex.lastIndex;
  }

  // Texto restante
  if (lastIndex < text.length) {
    parts.push(
      <Text key={`plain-${key++}`} style={baseStyle}>
        {text.substring(lastIndex)}
      </Text>
    );
  }

  return parts.length > 0 ? <>{parts}</> : <Text style={baseStyle}>{text}</Text>;
}

