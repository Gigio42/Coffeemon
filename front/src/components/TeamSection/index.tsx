import React from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import CoffeemonCard from '../CoffeemonCard';
import { PlayerCoffeemon } from '../../api/coffeemonService';
import { styles } from './styles';

interface TeamSectionProps {
  title: string;
  coffeemons: PlayerCoffeemon[];
  loading: boolean;
  emptyMessage: string;
  onToggleParty: (coffeemon: PlayerCoffeemon) => Promise<void>;
  partyLoading: number | null;
  variant: 'grid' | 'horizontal';
  showAddButton?: boolean;
  onAddCoffeemon?: () => void;
}

export default function TeamSection({
  title,
  coffeemons,
  loading,
  emptyMessage,
  onToggleParty,
  partyLoading,
  variant,
  showAddButton = false,
  onAddCoffeemon,
}: TeamSectionProps) {
  const hasAction = showAddButton && !!onAddCoffeemon;
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
      variant === 'horizontal' ? (
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContent}
          style={styles.carousel}
        >
          {coffeemons.map((pc) => (
            <View key={pc.id} style={styles.availableCardWrapper}>
              <CoffeemonCard
                coffeemon={pc}
                onToggleParty={onToggleParty}
                isLoading={partyLoading === pc.id}
                variant="large"
              />
            </View>
          ))}
        </ScrollView>
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContent}
          style={styles.grid}
        >
          <View style={styles.gridContainer}>
            {coffeemons.map((pc) => (
              <CoffeemonCard
                key={pc.id}
                coffeemon={pc}
                onToggleParty={onToggleParty}
                isLoading={partyLoading === pc.id}
                variant="small" // Assuming small for grid
              />
            ))}
          </View>
        </ScrollView>
      )
    );
  };

  return (
    <View style={styles.teamSection}>
      <View
        style={[
          styles.sectionHeader,
          hasAction ? styles.sectionHeaderWithAction : styles.sectionHeaderCentered,
        ]}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        {hasAction && (
          <TouchableOpacity style={styles.addButton} onPress={onAddCoffeemon}>
            <Text style={styles.addButtonText}>+ Adicionar</Text>
          </TouchableOpacity>
        )}
      </View>
      {renderContent()}
    </View>
  );
}
