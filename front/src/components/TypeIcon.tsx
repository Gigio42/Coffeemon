import React from 'react';
import type { LucideProps } from 'lucide-react-native';
import { Bubbles, Candy, Cherry, Coffee, Flame, Flower, Nut, Snowflake, BottleWine } from 'lucide-react-native';

interface TypeIconProps extends LucideProps {
  type?: string | null;
}

const TYPE_ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  roasted: Flame,
  sweet: Candy,
  fruity: Cherry,
  nutty: Nut,
  sour: Bubbles,
  acido: Bubbles,
  acidic: Bubbles,
  floral: Flower,
  spicy: BottleWine,
  bitter: Coffee,
  milky: Coffee,
  iced: Snowflake,
};

const TYPE_COLOR_MAP: Record<string, string> = {
  roasted: '#E88743',
  sweet: '#E36AA8',
  fruity: '#C85A66',
  nutty: '#BC9467',
  sour: '#63B6CF',
  acido: '#63B6CF',
  acidic: '#63B6CF',
  floral: '#9A63D8',
  spicy: '#9A3B3B',
  bitter: '#7A5B46',
  milky: '#8E7A68',
  iced: '#6FAFCC',
};

export default function TypeIcon({ type, color, ...props }: TypeIconProps) {
  const normalizedType = type?.toLowerCase() || 'roasted';
  const IconComponent = TYPE_ICON_MAP[normalizedType] || Flame;
  const resolvedColor = color ?? TYPE_COLOR_MAP[normalizedType] ?? TYPE_COLOR_MAP.roasted;

  return <IconComponent color={resolvedColor} {...props} />;
}
