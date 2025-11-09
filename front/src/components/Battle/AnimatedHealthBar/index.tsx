import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

interface AnimatedHealthBarProps {
  currentHp: number;
  maxHp: number;
}

const AnimatedHealthBar = React.memo(({ currentHp, maxHp }: AnimatedHealthBarProps) => {
  // Validação de valores
  const validCurrentHp = Math.max(0, currentHp || 0);
  const validMaxHp = Math.max(1, maxHp || 1);
  
  const hpPercent = (validCurrentHp / validMaxHp) * 100;
  
  // Calcular cor baseado no HP
  const getHpColor = (percent: number) => {
    if (percent <= 20) return '#e74c3c';
    if (percent <= 50) return '#f1c40f';
    return '#2ecc71';
  };

  return (
    <View style={styles.hudHpBarContainer}>
      <View style={styles.hudHpBarBackground}>
        <View 
          style={[
            styles.hudHpBarFill, 
            { 
              width: `${Math.max(0, hpPercent)}%`,
              backgroundColor: getHpColor(hpPercent)
            }
          ]} 
        />
      </View>
      <Text style={styles.hudHpText}>
        {Math.floor(validCurrentHp)}/{validMaxHp}
      </Text>
    </View>
  );
});

export default AnimatedHealthBar;
