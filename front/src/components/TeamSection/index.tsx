import React from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import CoffeemonCard from '../CoffeemonCard';
import { PlayerCoffeemon } from '../../api/coffeemonService';
import { styles } from './styles';

interface TeamSectionProps {
  title: string;
  coffeemons: PlayerCoffeemon[];
  loading: boolean;
  emptyMessage: string;
  onToggleParty: (coffeemon: PlayerCoffeemon) => void;
  partyLoading: number | null;
  variant?: 'grid' | 'horizontal';
}

export default function TeamSection({
  title,
  coffeemons,
  loading,
  emptyMessage,
  onToggleParty,
  partyLoading,
  variant = 'grid',
}: TeamSectionProps) {
  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="large"
          color={variant === 'grid' ? '#2ecc71' : '#3498db'}
        />
      );
    }

    if (coffeemons.length === 0) {
      return <Text style={styles.emptyText}>{emptyMessage}</Text>;
    }

    if (variant === 'horizontal') {
      return (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.availableScroll}
        >
          {coffeemons.map((pc) => (
            <CoffeemonCard
              key={pc.id}
              coffeemon={pc}
              onToggleParty={onToggleParty}
              isLoading={partyLoading === pc.id}
              variant="small"
            />
          ))}
        </ScrollView>
      );
    }

    return (
      <View style={styles.teamGrid}>
        {coffeemons.map((pc) => (
          <CoffeemonCard
            key={pc.id}
            coffeemon={pc}
            onToggleParty={onToggleParty}
            isLoading={partyLoading === pc.id}
            variant="large"
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.teamSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {renderContent()}
    </View>
  );
}
