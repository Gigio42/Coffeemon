import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, SafeAreaView, Image } from 'react-native';
import { styles } from './styles';
import { fetchAllCoffeemons, fetchPlayerCoffeemons, fetchPlayerData, Coffeemon, PlayerCoffeemon } from '../../api/coffeemonService';
import { getItems, Item, getItemIcon, getItemColor } from '../../api/itemsService';
import CoffeemonCard from '../../components/CoffeemonCard';
import CoffeemonDetailsModal from '../../components/CoffeemonDetailsModal';

interface CatalogScreenProps {
  token: string | null;
}

export const CatalogScreen: React.FC<CatalogScreenProps> = ({ token }) => {
  const [coffeemons, setCoffeemons] = useState<Coffeemon[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [ownedCoffeemonsMap, setOwnedCoffeemonsMap] = useState<Map<number, PlayerCoffeemon>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedCoffeemon, setSelectedCoffeemon] = useState<PlayerCoffeemon | null>(null);

  useEffect(() => {
    const loadCatalog = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        
        // 1. Fetch basic catalog data
        const [coffeemonsData, itemsData] = await Promise.all([
          fetchAllCoffeemons(token),
          getItems(token)
        ]);
        
        setCoffeemons(coffeemonsData);
        setItems(itemsData);

        // 2. Fetch player data to know which Coffeemons are owned
        try {
          const playerData = await fetchPlayerData(token);
          if (playerData && playerData.id) {
            const playerCoffeemons = await fetchPlayerCoffeemons(token, playerData.id);
            
            // Sort by level desc to show best one
            playerCoffeemons.sort((a, b) => b.level - a.level);

            const map = new Map<number, PlayerCoffeemon>();
            playerCoffeemons.forEach(pc => {
              if (!map.has(pc.coffeemon.id)) {
                map.set(pc.coffeemon.id, pc);
              }
            });
            setOwnedCoffeemonsMap(map);
          }
        } catch (playerErr) {
          console.warn('Could not fetch player data for catalog ownership:', playerErr);
          // Don't block the catalog if player data fails, just show all as locked or unlocked?
          // Defaulting to empty set means all locked, which is safer/incentivizing.
        }

      } catch (err) {
        console.error('Error loading catalog:', err);
        setError('Falha ao carregar o catálogo.');
      } finally {
        setLoading(false);
      }
    };

    loadCatalog();
  }, [token]);

  const handleOpenDetails = (coffeemon: PlayerCoffeemon) => {
    setSelectedCoffeemon(coffeemon);
    setDetailsModalVisible(true);
  };

  const handleCloseDetails = () => {
    setDetailsModalVisible(false);
    setSelectedCoffeemon(null);
  };

  const renderItem = ({ item }: { item: Coffeemon }) => {
    const ownedInstance = ownedCoffeemonsMap.get(item.id);
    const isOwned = !!ownedInstance;

    // Create a mock PlayerCoffeemon to reuse the card component
    // If owned, use the actual instance. If not, use base stats.
    const displayCoffeemon: PlayerCoffeemon = ownedInstance || {
      id: item.id,
      hp: item.baseHp,
      attack: item.baseAttack,
      defense: item.baseDefense,
      level: 1,
      experience: 0,
      isInParty: false,
      coffeemon: {
        id: item.id,
        name: item.name,
        types: item.types,
        defaultImage: item.defaultImage,
        baseHp: item.baseHp,
        baseAttack: item.baseAttack,
        baseDefense: item.baseDefense,
        baseSpeed: item.baseSpeed,
      },
      learnedMoves: [],
    };

    return (
      <View style={styles.cardContainer}>
        <View style={{ transform: [{ scale: 0.65 }] }}>
          <CoffeemonCard
            coffeemon={displayCoffeemon}
            onToggleParty={async () => {}}
            onPress={() => handleOpenDetails(displayCoffeemon)}
            variant="small"
            locked={!isOwned}
          />
        </View>
      </View>
    );
  };

  const renderItemsSection = () => (
    <View style={styles.itemsSection}>
      <Text style={styles.sectionTitle}>Itens Disponíveis</Text>
      <View style={styles.itemsGrid}>
        {items.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <View style={[styles.itemIconContainer, { backgroundColor: getItemColor(item.effects[0]?.type || 'default') + '20' }]}>
              <Text style={styles.itemIcon}>{getItemIcon(item.id)}</Text>
            </View>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemCost}>💰 {item.cost}</Text>
            <Text style={styles.itemDescription} numberOfLines={2}>{item.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B4513" />
        <Text style={styles.loadingText}>Carregando catálogo...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Catálogo Coffeemon</Text>
        <Text style={styles.subtitle}>Conheça todas as espécies e itens</Text>
      </View>
      
      <FlatList
        data={coffeemons}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderItemsSection}
      />

      <CoffeemonDetailsModal
        visible={detailsModalVisible}
        coffeemon={selectedCoffeemon}
        onClose={handleCloseDetails}
      />
    </SafeAreaView>
  );
};
