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
}

export default function TeamSection({
  title,
  coffeemons,
  loading,
  emptyMessage,
  onToggleParty,
  partyLoading,
}: TeamSectionProps) {
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B4513" />
        </View>
      );
    }

    if (coffeemons.length === 0) {
      return <Text style={styles.emptyText}>{emptyMessage}</Text>;
    }

    return (
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContent}
        style={styles.carousel}
      >
        {coffeemons.map((pc) => (
          <CoffeemonCard
            key={pc.id}
            coffeemon={pc}
            onToggleParty={onToggleParty}
            isLoading={partyLoading === pc.id}
            variant="large"
          />
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.teamSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {renderContent()}
    </View>
  );
}
