import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { styles } from './styles';
import { useCoffeemons } from '../../hooks/useCoffeemons';
import CoffeemonCard from '../../components/CoffeemonCard';
import CoffeemonDetailsModal from '../../components/CoffeemonDetailsModal';
import { PlayerCoffeemon } from '../../api/coffeemonService';
import { getPlayerItems, getItemIcon, getItemColor, Item } from '../../api/itemsService';

interface TeamScreenProps {
  token: string | null;
}

export const TeamScreen: React.FC<TeamScreenProps> = ({ token }) => {
  const { 
    partyMembers, 
    availableCoffeemons, 
    loading, 
    toggleParty, 
    swapPartyMembers,
    partyLoading 
  } = useCoffeemons({ token: token || '' });

  const [selectedCoffeemon, setSelectedCoffeemon] = useState<PlayerCoffeemon | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    if (token) {
      getPlayerItems(token)
        .then(setItems)
        .catch(err => console.error('Failed to load items:', err));
    }
  }, [token]);

  const handleCardPress = (coffeemon: PlayerCoffeemon) => {
    setSelectedCoffeemon(coffeemon);
    setDetailsVisible(true);
  };

  const handleToggle = async (coffeemon: PlayerCoffeemon) => {
    return await toggleParty(coffeemon);
  };

  const handleSwap = async (newMember: PlayerCoffeemon, oldMember: PlayerCoffeemon) => {
    return await swapPartyMembers(newMember, oldMember);
  };

  if (loading && !partyMembers.length && !availableCoffeemons.length) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B4513" />
        <Text style={styles.loadingText}>Carregando time...</Text>
      </View>
    );
  }

  // Fill empty slots
  const slots = [0, 1, 2];
  const deck = slots.map(i => partyMembers[i] || null);

  return (
    <View style={styles.container}>
      {/* Battle Deck Section */}
      <View style={styles.deckSection}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Battle Deck</Text>
          <View style={styles.elixirBadge}>
            <Text style={styles.elixirText}>{partyMembers.length}/3</Text>
          </View>
        </View>
        
        <View style={styles.deckContainer}>
          {deck.map((member, index) => (
            <View key={index} style={styles.deckSlotContainer}>
              {member ? (
                <View style={styles.cardContainer}>
                  <View style={styles.cardScaler}>
                    <CoffeemonCard 
                      coffeemon={member} 
                      onToggleParty={() => {}} 
                      onPress={() => handleCardPress(member)}
                      variant="small"
                      isLoading={partyLoading === member.id}
                    />
                  </View>
                </View>
              ) : (
                <View style={styles.emptySlot}>
                  <Text style={styles.emptySlotText}>Empty</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Collection Section */}
      <View style={styles.collectionSection}>
        <View style={styles.collectionHeader}>
          <Text style={styles.collectionTitle}>Card Collection</Text>
          <Text style={styles.collectionSubtitle}>Found: {partyMembers.length + availableCoffeemons.length}</Text>
        </View>

        <ScrollView 
          contentContainerStyle={styles.collectionGrid}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.gridRow}>
            {availableCoffeemons.map(coffeemon => (
               <View key={coffeemon.id} style={styles.collectionItem}>
                 <View style={styles.cardContainer}>
                   <View style={styles.cardScaler}>
                     <CoffeemonCard 
                       coffeemon={coffeemon} 
                       onToggleParty={() => {}}
                       onPress={() => handleCardPress(coffeemon)}
                       variant="small"
                       isLoading={partyLoading === coffeemon.id}
                     />
                   </View>
                 </View>
               </View>
            ))}
            {availableCoffeemons.length === 0 && (
              <Text style={styles.emptyCollectionText}>
                No other Coffeemons found. Capture more!
              </Text>
            )}
          </View>

          {/* Items Section */}
          <View style={styles.itemsHeader}>
            <Text style={styles.itemsTitle}>Inventory</Text>
            <Text style={styles.itemsSubtitle}>Items: {items.reduce((acc, item) => acc + (item.quantity || 0), 0)}</Text>
          </View>

          <View style={styles.gridRow}>
            {items.map(item => {
              const icon = getItemIcon(item.id);
              const effectType = item.effects[0]?.type || 'heal';
              const color = getItemColor(effectType);
              
              return (
                <View key={item.id} style={[styles.itemCard, { borderColor: color }]}>
                  <View style={styles.itemIconContainer}>
                    <Text style={styles.itemEmoji}>{icon}</Text>
                  </View>
                  <View style={[styles.itemBadge, { backgroundColor: color }]}>
                    <Text style={styles.itemBadgeText}>{item.quantity}</Text>
                  </View>
                  <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                </View>
              );
            })}
            {items.length === 0 && (
              <Text style={styles.emptyCollectionText}>No items found.</Text>
            )}
          </View>
        </ScrollView>
      </View>

      <CoffeemonDetailsModal
        visible={detailsVisible}
        coffeemon={selectedCoffeemon}
        onClose={() => setDetailsVisible(false)}
        onToggleParty={handleToggle}
        partyMembers={partyMembers}
        onSwapParty={handleSwap}
      />
    </View>
  );
};
