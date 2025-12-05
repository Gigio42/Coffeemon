import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TextInput, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { fetchAllCoffeemons, fetchPlayerCoffeemons, fetchPlayerData, Coffeemon, PlayerCoffeemon } from '../../api/coffeemonService';
import { getItems, Item, getItemIcon, getItemColor } from '../../api/itemsService';
import CoffeemonCard from '../../components/CoffeemonCard';
import CoffeemonDetailsModal from '../../components/CoffeemonDetailsModal';
import { useTheme } from '../../theme/ThemeContext';

interface CatalogScreenProps {
  token: string | null;
}

type TabType = 'coffeemons' | 'items';
type CoffeemonType = 'roasted' | 'sweet' | 'bitter' | 'milky' | 'iced' | 'nutty';

const TYPE_FILTERS: { label: string; value: CoffeemonType | 'all'; emoji: string }[] = [
  { label: 'Todos', value: 'all', emoji: '⭐' },
  { label: 'Torrado', value: 'roasted', emoji: '🔥' },
  { label: 'Doce', value: 'sweet', emoji: '🍬' },
  { label: 'Amargo', value: 'bitter', emoji: '☕' },
  { label: 'Cremoso', value: 'milky', emoji: '🥛' },
  { label: 'Gelado', value: 'iced', emoji: '❄️' },
  { label: 'Noz', value: 'nutty', emoji: '🌰' },
];

export const CatalogScreen: React.FC<CatalogScreenProps> = ({ token }) => {
  const { colors } = useTheme();
  
  const [activeTab, setActiveTab] = useState<TabType>('coffeemons');
  const [coffeemons, setCoffeemons] = useState<Coffeemon[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [ownedCoffeemonsMap, setOwnedCoffeemonsMap] = useState<Map<number, PlayerCoffeemon>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedCoffeemon, setSelectedCoffeemon] = useState<PlayerCoffeemon | null>(null);
  
  // Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<CoffeemonType | 'all'>('all');
  const [showOnlyOwned, setShowOnlyOwned] = useState(false);

  const loadCatalog = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      
      const [coffeemonsData, itemsData] = await Promise.all([
        fetchAllCoffeemons(token),
        getItems(token)
      ]);
      
      setCoffeemons(coffeemonsData);
      setItems(itemsData);

      try {
        const playerData = await fetchPlayerData(token);
        if (playerData && playerData.id) {
          const playerCoffeemons = await fetchPlayerCoffeemons(token, playerData.id);
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
      }

    } catch (err) {
      console.error('Error loading catalog:', err);
      setError('Falha ao carregar o catálogo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {    loadCatalog();
  }, [token]);

  const handleOpenDetails = (coffeemon: PlayerCoffeemon) => {
    setSelectedCoffeemon(coffeemon);
    setDetailsModalVisible(true);
  };

  const handleCloseDetails = () => {
    setDetailsModalVisible(false);
    setSelectedCoffeemon(null);
  };

  // Dynamic Styles - Universal Premium
  const bgStyle = { backgroundColor: colors.background.primary };
  const textPrimary = { color: colors.text.primary };
  const textSecondary = { color: colors.text.secondary };
  const textTertiary = { color: colors.text.tertiary };

  // Filtrar Coffeemons
  const filteredCoffeemons = coffeemons.filter(item => {
    // Filtro de pesquisa
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Filtro de tipo
    if (selectedType !== 'all' && !item.types.includes(selectedType)) {
      return false;
    }

    // Filtro de posse
    if (showOnlyOwned && !ownedCoffeemonsMap.has(item.id)) {
      return false;
    }

    return true;
  });

  // Filtrar Items
  const filteredItems = items.filter(item => {
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const renderCoffeemonItem = ({ item }: { item: Coffeemon }) => {
    const ownedInstance = ownedCoffeemonsMap.get(item.id);
    const isOwned = !!ownedInstance;

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
        <CoffeemonCard
          coffeemon={displayCoffeemon}
          onToggleParty={async () => {}}
          onPress={() => handleOpenDetails(displayCoffeemon)}
          variant="large"
          disabled={!isOwned}
          showHp={false}
          showStats={false}
          showPartyIndicator={false}
        />
        {!isOwned && <View style={styles.lockedOverlay} />}
      </View>
    );
  };

  const renderItemCard = (item: Item) => (
    <View key={item.id} style={styles.itemCard}>
      <View style={[
        styles.itemIconContainer, 
        { backgroundColor: getItemColor(item.effects[0]?.type || 'default') + '15' }
      ]}>
        <Text style={styles.itemIcon}>{getItemIcon(item.id)}</Text>
      </View>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemCost}>💰 {item.cost}</Text>
      <Text style={styles.itemDescription} numberOfLines={2}>{item.description}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, bgStyle]} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background.primary} />
        <View style={[styles.loadingContainer, bgStyle]}>
          <ActivityIndicator size="large" color={colors.accent.primary} />
          <Text style={[styles.loadingText, textSecondary]}>Carregando catálogo...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, bgStyle]} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background.primary} />
        <View style={[styles.errorContainer, bgStyle]}>
          <Text style={[styles.errorText, { color: colors.feedback.error }]}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, bgStyle]} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background.primary} />
      
      {/* Header */}
      <View style={[styles.header, bgStyle]}>
        <Text style={[styles.title, textPrimary]}>Catálogo</Text>
        <Text style={[styles.subtitle, textTertiary]}>
          {activeTab === 'coffeemons' 
            ? `${ownedCoffeemonsMap.size}/${coffeemons.length} Coffeemons`
            : `${items.length} Itens`
          }
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'coffeemons' && styles.tabActive]}
          onPress={() => setActiveTab('coffeemons')}
        >
          <Text style={[styles.tabText, activeTab === 'coffeemons' && styles.tabTextActive]}>
            Coffeemons
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'items' && styles.tabActive]}
          onPress={() => setActiveTab('items')}
        >
          <Text style={[styles.tabText, activeTab === 'items' && styles.tabTextActive]}>
            Itens
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={[styles.searchIcon, textTertiary]}>🔍</Text>
        <TextInput
          style={[styles.searchInput, textPrimary]}
          placeholder={activeTab === 'coffeemons' ? "Buscar Coffeemon..." : "Buscar item..."}
          placeholderTextColor={colors.text.tertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filters (apenas para Coffeemons) */}
      {activeTab === 'coffeemons' && (
        <>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filtersContainer}
            contentContainerStyle={styles.filtersContent}
          >
            {TYPE_FILTERS.map(filter => (
              <TouchableOpacity
                key={filter.value}
                style={[
                  styles.filterChip,
                  selectedType === filter.value && { backgroundColor: colors.accent.primary, borderColor: colors.accent.primary }
                ]}
                onPress={() => setSelectedType(filter.value)}
              >
                <Text style={styles.filterEmoji}>{filter.emoji}</Text>
                <Text style={[
                  styles.filterText,
                  selectedType === filter.value && { color: '#FFFFFF' }
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Toggle Owned */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setShowOnlyOwned(!showOnlyOwned)}
            >
              <View style={[styles.checkbox, showOnlyOwned && { backgroundColor: colors.accent.primary, borderColor: colors.accent.primary }]}>
                {showOnlyOwned && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={[styles.toggleText, textSecondary]}>Mostrar apenas capturados</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Content */}
      {activeTab === 'coffeemons' ? (
        <FlatList
          data={filteredCoffeemons}
          renderItem={renderCoffeemonItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, textTertiary]}>
                {searchQuery || selectedType !== 'all' || showOnlyOwned
                  ? 'Nenhum Coffeemon encontrado com esses filtros'
                  : 'Nenhum Coffeemon disponível'}
              </Text>
            </View>
          }
        />
      ) : (
        <ScrollView contentContainerStyle={styles.listContent}>
          <View style={styles.itemsGrid}>
            {filteredItems.map(renderItemCard)}
          </View>
          {filteredItems.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, textTertiary]}>
                {searchQuery ? 'Nenhum item encontrado' : 'Nenhum item disponível'}
              </Text>
            </View>
          )}
        </ScrollView>
      )}
      
      {/* Details Modal */}
      <CoffeemonDetailsModal
        visible={detailsModalVisible}
        coffeemon={selectedCoffeemon}
        onClose={handleCloseDetails}
        onRefresh={loadCatalog}
        token={token}
      />
    </SafeAreaView>
  );
};
