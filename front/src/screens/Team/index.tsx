import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar, FlatList, Dimensions, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { useCoffeemons } from '../../hooks/useCoffeemons';
import CoffeemonCard from '../../components/CoffeemonCard';
import CoffeemonDetailsModal from '../../components/CoffeemonDetailsModal';
import { PlayerCoffeemon } from '../../api/coffeemonService';
import { getPlayerItems, getItemIcon, getItemColor, Item } from '../../api/itemsService';
import { useTheme } from '../../theme/ThemeContext';
import { getTypeColorScheme } from '../../theme/colors';

const { width } = Dimensions.get('window');

interface TeamScreenProps {
  token: string | null;
}

const COFFEEMON_TYPES = ['all', 'roasted', 'sweet', 'bitter', 'milky', 'iced', 'nutty'];

export const TeamScreen: React.FC<TeamScreenProps> = ({ token }) => {
  const { colors } = useTheme();
  
  const { 
    partyMembers, 
    availableCoffeemons, 
    loading, 
    toggleParty, 
    swapPartyMembers,
    partyLoading,
    fetchCoffeemons
  } = useCoffeemons({ token: token || '' });

  const [selectedCoffeemon, setSelectedCoffeemon] = useState<PlayerCoffeemon | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

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

  // Minimalist Glass Styles
  const bgStyle = { backgroundColor: colors.background.primary };
  const cardStyle = { 
    backgroundColor: 'rgba(255, 255, 255, 0.85)', 
    borderColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2
  };
  const textPrimary = { color: colors.text.primary };
  const textSecondary = { color: colors.text.secondary };
  const textTertiary = { color: colors.text.tertiary };

  if (loading && !partyMembers.length && !availableCoffeemons.length) {
    return (
      <SafeAreaView style={[styles.container, bgStyle]} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background.primary} />
        <View style={[styles.loadingContainer, bgStyle]}>
          <ActivityIndicator size="large" color={colors.accent.primary} />
          <Text style={[styles.loadingText, textSecondary]}>Carregando time...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Fill empty slots
  const slots = [0, 1, 2];
  const deck = slots.map(i => partyMembers[i] || null);

  // Filter Logic
  const filteredCoffeemons = availableCoffeemons.filter(item => {
    const matchesSearch = item.coffeemon.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || item.coffeemon.types.includes(selectedType);
    return matchesSearch && matchesType;
  });

  const renderCollectionItem = ({ item }: { item: PlayerCoffeemon }) => (
    <View style={styles.collectionItem}>
      <CoffeemonCard 
        coffeemon={item} 
        onToggleParty={handleToggle}
        onPress={() => handleCardPress(item)}
        variant="small"
        isLoading={partyLoading === item.id}
        showHp={true}
        showStats={false}
        showPartyIndicator={true}
      />
    </View>
  );

  const renderInventory = () => (
    <View style={[styles.inventorySection, { borderTopColor: 'rgba(0,0,0,0.05)' }]}>
      <View style={styles.itemsHeader}>
        <Text style={[styles.itemsTitle, textPrimary]}>Inventário</Text>
        <Text style={[styles.itemsSubtitle, textTertiary]}>{items.reduce((acc, item) => acc + (item.quantity || 0), 0)} itens</Text>
      </View>

      <View style={styles.itemsGrid}>
        {items.map(item => {
          const icon = getItemIcon(item.id);
          const effectType = item.effects[0]?.type || 'heal';
          const color = getItemColor(effectType);
          
          return (
            <View key={item.id} style={[styles.itemCard, cardStyle, { borderColor: 'rgba(255,255,255,0.9)' }]}>
              <View style={[styles.itemIconContainer, { backgroundColor: 'rgba(0,0,0,0.03)' }]}>
                <Text style={styles.itemEmoji}>{icon}</Text>
              </View>
              <View style={[styles.itemBadge, { backgroundColor: color, borderColor: '#FFFFFF' }]}>
                <Text style={styles.itemBadgeText}>{item.quantity}</Text>
              </View>
              <Text style={[styles.itemName, textPrimary]} numberOfLines={2}>{item.name}</Text>
            </View>
          );
        })}
        {items.length === 0 && (
          <Text style={[styles.emptyCollectionText, textTertiary]}>Nenhum item encontrado.</Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, bgStyle]} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background.primary} />
      
      {/* Header */}
      <View style={[styles.header, bgStyle, { borderBottomColor: 'rgba(0,0,0,0.05)' }]}>
        <Text style={[styles.headerTitle, textPrimary]}>Minha Equipe</Text>
        <View style={styles.elixirBadge}>
          <Text style={styles.elixirText}>{partyMembers.length}/3</Text>
        </View>
      </View>
      
      {/* Battle Deck Section */}
      <View style={[styles.deckSection, { backgroundColor: '#FFFFFF' }]}>
        <View style={styles.deckContainer}>
          {deck.map((member, index) => (
            <View key={index} style={styles.deckSlotContainer}>
              {member ? (
                <CoffeemonCard 
                  coffeemon={member} 
                  onToggleParty={() => {}} 
                  onPress={() => handleCardPress(member)}
                  variant="small"
                  isLoading={partyLoading === member.id}
                  showHp={true}
                  showStats={false}
                  showPartyIndicator={false}
                />
              ) : (
                <View style={[styles.emptySlot, { borderColor: colors.border.medium, backgroundColor: 'rgba(0,0,0,0.02)' }]}>
                  <Text style={[styles.emptySlotText, textTertiary]}>Vazio</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Collection Section */}
      <View style={[styles.collectionSection, bgStyle]}>
        <View style={styles.collectionHeader}>
          <Text style={[styles.collectionTitle, textPrimary]}>Coleção</Text>
          <Text style={[styles.collectionSubtitle, textTertiary]}>{partyMembers.length + availableCoffeemons.length} Coffeemons</Text>
        </View>

        {/* Search & Filter */}
        <View style={styles.filterSection}>
          <View style={[styles.searchContainer, cardStyle]}>
            <Text style={[styles.searchIcon, textTertiary]}>🔍</Text>
            <TextInput
              style={[styles.searchInput, textPrimary]}
              placeholder="Buscar na coleção..."
              placeholderTextColor={colors.text.tertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={[styles.clearIcon, textTertiary]}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.typeFilterContainer}
            contentContainerStyle={styles.typeFilterContent}
          >
            {COFFEEMON_TYPES.map(type => {
              const isActive = selectedType === type;
              const typeColor = type === 'all' 
                ? { primary: colors.text.primary, secondary: colors.surface.base } 
                : getTypeColorScheme(type);
              
              return (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeChip,
                    { backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.05)' },
                    isActive && { backgroundColor: typeColor.primary, borderColor: typeColor.primary },
                  ]}
                  onPress={() => setSelectedType(type)}
                >
                  {type !== 'all' && (
                    <View style={[
                      styles.typeDot, 
                      { backgroundColor: isActive ? '#FFF' : typeColor.primary }
                    ]} />
                  )}
                  <Text style={[
                    styles.typeChipText,
                    { color: isActive ? '#FFF' : colors.text.secondary }
                  ]}>
                    {type === 'all' ? 'Todos' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <FlatList
          data={filteredCoffeemons}
          renderItem={renderCollectionItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          contentContainerStyle={styles.collectionList}
          columnWrapperStyle={styles.columnWrapper}
          ListFooterComponent={renderInventory}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyCollectionText, textTertiary]}>
                {searchQuery || selectedType !== 'all' 
                  ? 'Nenhum Coffeemon encontrado com esses filtros.' 
                  : 'Nenhum outro Coffeemon encontrado. Capture mais!'}
              </Text>
            </View>
          }
        />
      </View>

      <CoffeemonDetailsModal
        visible={detailsVisible}
        coffeemon={selectedCoffeemon}
        onClose={() => setDetailsVisible(false)}
        onToggleParty={handleToggle}
        partyMembers={partyMembers}
        onSwapParty={handleSwap}
        onRefresh={fetchCoffeemons}
        token={token}
      />
    </SafeAreaView>
  );
};
