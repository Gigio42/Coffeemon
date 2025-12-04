import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  Image,
  StatusBar,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { fetchGachaPacks, buyGachaPack, GachaPack } from '../../api/shopService';
import { getItems, Item, buyItem, getItemIcon } from '../../api/itemsService';
import { fetchPlayerData, fetchAllCoffeemons, Coffeemon } from '../../api/coffeemonService';
import { getTypeColorScheme } from '../../theme/colors';
import { getCoffeemonImage } from '../../../assets/coffeemons';
import CoffeemonDetailsModal from '../../components/CoffeemonDetailsModal';
import { useTheme } from '../../theme/ThemeContext';

const { width } = Dimensions.get('window');

interface ShopScreenProps {
  token?: string | null;
}

type TabType = 'gacha' | 'items';

export const ShopScreen: React.FC<ShopScreenProps> = ({ token }) => {
  const { colors } = useTheme();
  
  const [activeTab, setActiveTab] = useState<TabType>('gacha');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Player data
  const [playerCoins, setPlayerCoins] = useState(0);
  
  // Gacha data
  const [gachaPacks, setGachaPacks] = useState<GachaPack[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [allCoffeemons, setAllCoffeemons] = useState<Coffeemon[]>([]);
  
  // Items data
  const [items, setItems] = useState<Item[]>([]);
  
  // Coffeemon details modal
  const [selectedCoffeemon, setSelectedCoffeemon] = useState<any>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  
  const bannerScrollRef = useRef<FlatList>(null);

  useEffect(() => {
    if (token) {
      loadShopData();
    }
  }, [token]);

  const loadShopData = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const [playerData, packsData, itemsData, coffeemonsData] = await Promise.all([
        fetchPlayerData(token),
        fetchGachaPacks(token),
        getItems(token),
        fetchAllCoffeemons(token),
      ]);
      
      setPlayerCoins(playerData.coins || 0);
      setGachaPacks(packsData);
      setItems(itemsData);
      setAllCoffeemons(coffeemonsData);
    } catch (err) {
      console.error('Error loading shop data:', err);
      setError('Falha ao carregar dados da loja. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyGachaPack = async (pack: GachaPack) => {
    if (!token) return;
    
    if (playerCoins < pack.cost) {
      Alert.alert('Moedas Insuficientes', 'Você não tem moedas suficientes para comprar este pacote.');
      return;
    }
    
    Alert.alert(
      'Confirmar Compra',
      `Deseja comprar ${pack.name} por ${pack.cost} moedas?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Comprar',
          onPress: async () => {
            try {
              const result = await buyGachaPack(token, pack.id);
              setPlayerCoins(prev => prev - pack.cost);
              
              if (result.coffeemon) {
                Alert.alert(
                  '🎉 Parabéns!',
                  `Você obteve ${result.coffeemon.name}!`,
                  [{ text: 'OK' }]
                );
              } else {
                Alert.alert('Sucesso', 'Pacote comprado com sucesso!');
              }
              loadShopData();
            } catch (err: any) {
              Alert.alert('Erro', err.message || 'Falha ao comprar pacote.');
            }
          },
        },
      ]
    );
  };

  const handleBuyItem = async (item: Item) => {
    if (!token) return;
    
    if (playerCoins < item.cost) {
      Alert.alert('Moedas Insuficientes', 'Você não tem moedas suficientes para comprar este item.');
      return;
    }
    
    Alert.alert(
      'Confirmar Compra',
      `Deseja comprar ${item.name} por ${item.cost} moedas?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Comprar',
          onPress: async () => {
            try {
              await buyItem(token, item.id);
              setPlayerCoins(prev => prev - item.cost);
              Alert.alert('Sucesso', `${item.name} adicionado ao inventário!`);
              loadShopData();
            } catch (err: any) {
              Alert.alert('Erro', err.message || 'Falha ao comprar item.');
            }
          },
        },
      ]
    );
  };

  const getObtainableCoffeemons = (pack: GachaPack): Coffeemon[] => {
    if (!pack.notes || pack.notes.length === 0) return [];
    return allCoffeemons.filter(coffeemon => 
      coffeemon.types.some(type => pack.notes.includes(type))
    );
  };

  const handleCoffeemonPress = (coffeemon: Coffeemon) => {
    const playerCoffeemon = {
      id: coffeemon.id,
      hp: coffeemon.baseHp,
      attack: coffeemon.baseAttack,
      defense: coffeemon.baseDefense,
      level: 1,
      experience: 0,
      isInParty: false,
      coffeemon: {
        id: coffeemon.id,
        name: coffeemon.name,
        types: coffeemon.types,
        baseHp: coffeemon.baseHp,
        baseAttack: coffeemon.baseAttack,
        baseDefense: coffeemon.baseDefense,
        baseSpeed: coffeemon.baseSpeed,
        description: coffeemon.description,
        weight: coffeemon.weight,
        height: coffeemon.height,
        flavorProfile: coffeemon.flavorProfile,
      },
      learnedMoves: [],
    };
    setSelectedCoffeemon(playerCoffeemon as any);
    setDetailsModalVisible(true);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    if (index !== currentBannerIndex && index >= 0 && index < gachaPacks.length) {
      setCurrentBannerIndex(index);
    }
  };

  // Minimalist Glass Styles
  const bgStyle = { backgroundColor: colors.background.primary };
  const textPrimary = { color: colors.text.primary };
  const textSecondary = { color: colors.text.secondary };
  const textTertiary = { color: colors.text.tertiary };

  const renderBannerItem = ({ item: pack }: { item: GachaPack }) => {
    const typeColorScheme = getTypeColorScheme(pack.notes[0] || 'roasted');
    
    return (
      <View style={{ width: width, alignItems: 'center', paddingHorizontal: 24, paddingBottom: 40 }}>
        {/* Shadow Container - Separated from Content to avoid clipping */}
        <View style={{
          width: '100%',
          height: 220,
          borderRadius: 32,
          backgroundColor: '#FFFFFF',
          shadowColor: typeColorScheme.primary,
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.35,
          shadowRadius: 24,
          elevation: 12,
        }}>
          {/* Content Container - Clips the gradient */}
          <View style={[styles.bannerCard, { width: '100%', height: '100%', borderWidth: 0 }]}>
            <LinearGradient
              colors={typeColorScheme.gradient as any}
              style={styles.bannerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.bannerHeader}>
                <Text style={styles.bannerName}>{pack.name}</Text>
                <Text style={styles.bannerDescription}>{pack.description}</Text>
              </View>
              
              <View style={styles.bannerFooter}>
                <View style={styles.bannerCost}>
                  <Text style={styles.bannerCostIcon}>💰</Text>
                  <Text style={styles.bannerCostText}>{pack.cost}</Text>
                </View>
                
                <TouchableOpacity 
                  style={[styles.buyButton, { backgroundColor: colors.text.primary }]}
                  onPress={() => handleBuyGachaPack(pack)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.buyButtonText, { color: '#FFFFFF' }]}>Comprar</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>
      </View>
    );
  };

  const renderGachaContent = () => {
    if (gachaPacks.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, textTertiary]}>Nenhum pacote gacha disponível</Text>
        </View>
      );
    }

    const currentPack = gachaPacks[currentBannerIndex];
    const obtainableCoffeemons = currentPack ? getObtainableCoffeemons(currentPack) : [];

    return (
      <View style={{ flex: 1 }}>
        {/* Banners Swiper */}
        <View style={styles.bannersContainer}>
          <FlatList
            ref={bannerScrollRef}
            data={gachaPacks}
            renderItem={renderBannerItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            snapToInterval={width}
            decelerationRate="fast"
            snapToAlignment="center"
          />
          
          {/* Pagination Dots */}
          <View style={styles.paginationContainer}>
            {gachaPacks.map((_, dotIndex) => (
              <View
                key={dotIndex}
                style={[
                  styles.paginationDot,
                  dotIndex === currentBannerIndex && { backgroundColor: colors.accent.primary, width: 24 },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Dynamic Content based on selected banner */}
        <ScrollView 
          style={styles.dynamicContent} 
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {currentPack && (
            <View style={styles.obtainableSection}>
              <View style={styles.obtainableHeader}>
                <Text style={[styles.obtainableTitle, textPrimary]}>Coffeemons Disponíveis</Text>
                <Text style={[styles.obtainableSubtitle, textTertiary]}>
                  {currentPack.notes.map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' • ')}
                </Text>
              </View>
              
              <View style={styles.obtainableGrid}>
                {obtainableCoffeemons.map(coffeemon => {
                  const typeColor = getTypeColorScheme(coffeemon.types[0]);
                  const imageSource = getCoffeemonImage(coffeemon.name, 'default');
                  
                  // Tinted Glass Effect
                  const glassBg = typeColor.primary + '10'; // 6% opacity
                  const glassBorder = typeColor.primary + '20'; // 12% opacity
                  
                  return (
                    <TouchableOpacity
                      key={coffeemon.id}
                      style={[
                        styles.coffeemonIconContainer, 
                        { 
                          backgroundColor: glassBg,
                          borderColor: glassBorder,
                          borderWidth: 1,
                        }
                      ]}
                      onPress={() => handleCoffeemonPress(coffeemon)}
                      activeOpacity={0.7}
                    >
                      <View 
                        style={[
                          styles.typeIndicator,
                          { backgroundColor: typeColor.primary }
                        ]}
                      />
                      <Image 
                        source={imageSource} 
                        style={styles.coffeemonIcon}
                        resizeMode="contain"
                      />
                      <Text 
                        style={[styles.coffeemonIconName, textSecondary]}
                        numberOfLines={1}
                      >
                        {coffeemon.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                {obtainableCoffeemons.length === 0 && (
                  <Text style={[styles.emptyText, textTertiary]}>Nenhum Coffeemon específico listado.</Text>
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  const renderItemsTab = () => {
    if (items.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, textTertiary]}>Nenhum item disponível</Text>
        </View>
      );
    }
    
    return (
      <ScrollView style={styles.itemsContainer} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.itemsGrid}>
          {items.map(item => (
            <View key={item.id} style={styles.itemCard}>
              <View style={[styles.itemIconContainer, { backgroundColor: 'rgba(0,0,0,0.03)' }]}>
                <Text style={styles.itemIcon}>{getItemIcon(item.id)}</Text>
              </View>
              
              <Text style={[styles.itemName, textPrimary]}>{item.name}</Text>
              <Text style={[styles.itemDescription, textSecondary]} numberOfLines={2}>
                {item.description}
              </Text>
              
              <View style={styles.itemFooter}>
                <View style={styles.itemCost}>
                  <Text style={styles.itemCostIcon}>💰</Text>
                  <Text style={styles.itemCostText}>{item.cost}</Text>
                </View>
                
                <TouchableOpacity
                  style={[styles.itemBuyButton, { backgroundColor: colors.accent.primary }]}
                  onPress={() => handleBuyItem(item)}
                >
                  <Text style={styles.itemBuyButtonText}>Comprar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, bgStyle]} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background.primary} />
        <View style={[styles.loadingContainer, bgStyle]}>
          <ActivityIndicator size="large" color={colors.accent.primary} />
          <Text style={[styles.loadingText, textSecondary]}>Carregando loja...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, bgStyle]} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background.primary} />
        <View style={[styles.errorContainer, bgStyle]}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={loadShopData} style={[styles.retryButton, { backgroundColor: colors.accent.primary }]}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, bgStyle]} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background.primary} />
      
      {/* Header */}
      <View style={[styles.header, bgStyle]}>
        <View style={styles.headerTop}>
          <Text style={[styles.title, textPrimary]}>Loja</Text>
          <View style={[styles.coinsContainer, { backgroundColor: '#FFFBEB', borderColor: '#FEF3C7' }]}>
            <Text style={styles.coinIcon}>💰</Text>
            <Text style={styles.coinAmount}>{playerCoins.toLocaleString()}</Text>
          </View>
        </View>
        
        {/* Tab Navigation */}
        <View style={[styles.tabContainer, { backgroundColor: 'rgba(0,0,0,0.03)' }]}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'gacha' && [styles.activeTab, { backgroundColor: colors.surface.base }]]}
            onPress={() => setActiveTab('gacha')}
          >
            <Text style={[styles.tabText, textTertiary, activeTab === 'gacha' && [styles.activeTabText, textPrimary]]}>
              Gacha Banners
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'items' && [styles.activeTab, { backgroundColor: colors.surface.base }]]}
            onPress={() => setActiveTab('items')}
          >
            <Text style={[styles.tabText, textTertiary, activeTab === 'items' && [styles.activeTabText, textPrimary]]}>
              Itens
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'gacha' ? renderGachaContent() : renderItemsTab()}
      </View>
      
      {/* Coffeemon Details Modal */}
      <CoffeemonDetailsModal
        visible={detailsModalVisible}
        coffeemon={selectedCoffeemon}
        onClose={() => {
          setDetailsModalVisible(false);
          setSelectedCoffeemon(null);
        }}
      />
    </SafeAreaView>
  );
};
