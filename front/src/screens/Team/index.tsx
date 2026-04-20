import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  FlatList,
  Dimensions,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { useCoffeemons } from '../../hooks/useCoffeemons';
import CoffeemonCard from '../../components/CoffeemonCard';
import CoffeemonDetailsModal from '../../components/CoffeemonDetailsModal';
import { PlayerCoffeemon } from '../../api/coffeemonService';
import { useTheme } from '../../theme/ThemeContext';
import { getTypeColorScheme } from '../../theme/colors';

const { width } = Dimensions.get('window');

interface TeamScreenProps {
  token: string | null;
}

const COFFEEMON_TYPES = ['all', 'roasted', 'sweet', 'fruity', 'nutty', 'sour', 'floral', 'spicy'] as const;

const TYPE_LABELS: Record<(typeof COFFEEMON_TYPES)[number], string> = {
  all: 'Todos',
  roasted: 'Roasted',
  sweet: 'Sweet',
  fruity: 'Fruity',
  nutty: 'Nutty',
  sour: 'Sour',
  floral: 'Floral',
  spicy: 'Spicy',
};

export const TeamScreen: React.FC<TeamScreenProps> = ({ token }) => {
  const { colors } = useTheme();

  const {
    partyMembers,
    availableCoffeemons,
    loading,
    toggleParty,
    swapPartyMembers,
    partyLoading,
    fetchCoffeemons,
  } = useCoffeemons({ token: token || '' });

  const [selectedCoffeemon, setSelectedCoffeemon] = useState<PlayerCoffeemon | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  };
  const textPrimary = { color: colors.text.primary };
  const textSecondary = { color: colors.text.secondary };
  const textTertiary = { color: colors.text.tertiary };
  const bgStyle = { backgroundColor: colors.background.primary };

  if (loading && !partyMembers.length && !availableCoffeemons.length) {
    return (
      <SafeAreaView style={[styles.container, bgStyle]} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background.primary} />
        <View style={[styles.loadingContainer, bgStyle]}>
          <ActivityIndicator size="large" color={colors.accent.primary} />
          <Text style={[styles.loadingText, textSecondary]}>Carregando equipe...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const slots = [0, 1, 2];
  const deck = slots.map((i) => partyMembers[i] || null);

  const filteredCoffeemons = availableCoffeemons.filter((item) => {
    const matchesSearch = item.coffeemon.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      selectedType === 'all' || item.coffeemon.types.includes(selectedType);
    return matchesSearch && matchesType;
  });

  const renderCollectionItem = ({ item }: { item: PlayerCoffeemon }) => (
    <View style={styles.collectionItem}>
      <CoffeemonCard
        coffeemon={item}
        onToggleParty={toggleParty}
        onPress={() => {
          setSelectedCoffeemon(item);
          setDetailsVisible(true);
        }}
        variant="small"
        isLoading={partyLoading === item.id}
        showHp={true}
        showStats={false}
        showPartyIndicator={true}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, bgStyle]} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background.primary} />

      {/* Header */}
      <View
        style={[
          styles.header,
          bgStyle,
          { borderBottomColor: 'rgba(0,0,0,0.05)' },
        ]}
      >
        <Text style={[styles.headerTitle, textPrimary]}>Minha Equipe</Text>
        <View style={styles.elixirBadge}>
          <Text style={styles.elixirText}>{partyMembers.length}/3</Text>
        </View>
      </View>

      {/* Party slots */}
      <View style={[styles.deckSection, { backgroundColor: colors.surface.base }]}>
        <View style={styles.deckContainer}>
          {deck.map((member, index) => (
            <View key={index} style={styles.deckSlotContainer}>
              {member ? (
                <CoffeemonCard
                  coffeemon={member}
                  onToggleParty={toggleParty}
                  onPress={() => {
                    setSelectedCoffeemon(member);
                    setDetailsVisible(true);
                  }}
                  variant="small"
                  isLoading={partyLoading === member.id}
                  showHp={false}
                  showStats={false}
                  showPartyIndicator={false}
                />
              ) : (
                <View
                  style={[
                    styles.emptySlot,
                    {
                      borderColor: colors.border.medium,
                      backgroundColor: 'transparent',
                    },
                  ]}
                >
                  <Text style={[styles.emptySlotText, textTertiary]}>Vazio</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Collection */}
      <View style={[styles.collectionSection, bgStyle]}>
        {/* Search & Type filter */}
        <View style={styles.filterSection}>
          <View style={[styles.searchContainer, cardStyle]}>
            <Text style={[styles.searchIcon, textTertiary]}>🔍</Text>
            <TextInput
              style={[styles.searchInput, textPrimary]}
              placeholder="Buscar Coffeemon..."
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
            {COFFEEMON_TYPES.map((type) => {
              const isActive = selectedType === type;
              const typeColor =
                type === 'all'
                  ? { primary: colors.text.primary }
                  : getTypeColorScheme(type);
              return (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeChip,
                    { backgroundColor: colors.surface.base, borderColor: colors.border.light },
                    isActive && {
                      backgroundColor: typeColor.primary,
                      borderColor: typeColor.primary,
                    },
                  ]}
                  onPress={() => setSelectedType(type)}
                >
                  {type !== 'all' && (
                    <View
                      style={[
                        styles.typeDot,
                        { backgroundColor: isActive ? '#FFF' : typeColor.primary },
                      ]}
                    />
                  )}
                  <Text
                    style={[
                      styles.typeChipText,
                      { color: isActive ? '#FFF' : colors.text.secondary },
                    ]}
                  >
                     {TYPE_LABELS[type]}
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
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyCollectionText, textTertiary]}>
                {searchQuery || selectedType !== 'all'
                  ? 'Nenhum Coffeemon encontrado com esses filtros.'
                  : 'Nenhum Coffeemon disponível. Capture mais!'}
              </Text>
            </View>
          }
        />
      </View>

      <CoffeemonDetailsModal
        visible={detailsVisible}
        coffeemon={selectedCoffeemon}
        onClose={() => setDetailsVisible(false)}
        onToggleParty={toggleParty}
        partyMembers={partyMembers}
        onSwapParty={swapPartyMembers}
        onRefresh={fetchCoffeemons}
        token={token}
      />
    </SafeAreaView>
  );
};
