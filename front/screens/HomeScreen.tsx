/**
 * ========================================
 * HOME SCREEN - TELA PRINCIPAL DO SISTEMA DE PEDIDOS
 * ========================================
 * 
 * RESPONSABILIDADES DESTA TELA:
 * 1. Exibir interface principal da cafeteria (como na imagem de referência)
 * 2. Mostrar categorias de produtos (Cafés, Lanches, Doces, Especiais)
 * 3. Exibir ofertas do dia
 * 4. Permitir navegação para o jogo e outras funcionalidades
 */

import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView,
  Image,
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native';

export default function HomeScreen(props: any) {
  const { onNavigateToMatchmaking, onNavigateToLogin, authData } = props;

  // Funções para diferentes categorias
  const handleCategory = (category: string) => {
    Alert.alert(category, `Funcionalidade de ${category.toLowerCase()} em desenvolvimento.`);
  };

  const handleOffer = (offer: string) => {
    Alert.alert('Oferta', `Você selecionou: ${offer}`);
  };

  const handlePlayGame = () => {
    onNavigateToMatchmaking(authData.token, authData.playerId);
  };

  const handleProfile = () => {
    Alert.alert(
      'Perfil',
      'Opções do perfil',
      [
        { text: 'Ver Perfil', onPress: () => Alert.alert('Perfil', 'Tela de perfil em desenvolvimento') },
        { text: 'Logout', onPress: onNavigateToLogin },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6B4E3D" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuIcon}>
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerIcon}>☕</Text>
          <Text style={styles.headerTitle}>Cafémon</Text>
        </View>
        
        <TouchableOpacity style={styles.profileIcon} onPress={handleProfile}>
          <Text style={styles.profileIconText}>👤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cards de Boas-vindas */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeTitle}>Bom dia,</Text>
            <Text style={styles.welcomeTitle}>Treinador!</Text>
          </View>
          
          <View style={styles.coffeeWaitCard}>
            <Text style={styles.coffeeWaitText}>Seu café espera!</Text>
            <View style={styles.coffeeIcon}>
              <Text style={styles.coffeeIconText}>☕</Text>
            </View>
          </View>
        </View>

        {/* Menu de Categorias */}
        <View style={styles.categoriesCard}>
          <TouchableOpacity style={styles.categoryItem} onPress={() => handleCategory('Cafés')}>
            <View style={styles.categoryIcon}>
              <Text style={styles.categoryIconText}>☕</Text>
            </View>
            <Text style={styles.categoryText}>Cafés</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryItem} onPress={() => handleCategory('Lanches')}>
            <View style={[styles.categoryIcon, styles.categoryIconDark]}>
              <Text style={styles.categoryIconTextWhite}>🥪</Text>
            </View>
            <Text style={styles.categoryText}>Lanches</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryItem} onPress={() => handleCategory('Doces')}>
            <View style={styles.categoryIcon}>
              <Text style={styles.categoryIconText}>🧁</Text>
            </View>
            <Text style={styles.categoryText}>Doces</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryItem} onPress={() => handleCategory('Especiais')}>
            <View style={styles.categoryIcon}>
              <Text style={styles.categoryIconText}>⭐</Text>
            </View>
            <Text style={styles.categoryText}>Especiais</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryItem} onPress={handlePlayGame}>
            <View style={styles.categoryIcon}>
              <Text style={styles.categoryIconText}>🎮</Text>
            </View>
            <Text style={styles.categoryText}>Jogo</Text>
          </TouchableOpacity>
        </View>

        {/* Ofertas do Dia */}
        <Text style={styles.sectionTitle}>Ofertas do Dia</Text>
        
        <View style={styles.offersSection}>
          <TouchableOpacity style={styles.offerCard} onPress={() => handleOffer('Latte Cremoso')}>
            <View style={styles.offerContent}>
              <Text style={styles.offerTitle}>Latte Cremoso</Text>
              <Text style={styles.offerSubtitle}>- Ganhe 10XP!</Text>
            </View>
            <Text style={styles.offerEmoji}>☕</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.offerCardGreen} onPress={() => handleOffer('Pão de Queijo')}>
            <View style={styles.offerContent}>
              <Text style={styles.offerTitleWhite}>Pão de Queijo -</Text>
              <Text style={styles.offerTitleWhite}>- 2 por R$8</Text>
            </View>
            <Text style={styles.offerEmoji}>🥖</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconActive}>🏠</Text>
          <Text style={styles.navTextActive}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => handleCategory('Menu')}>
          <Text style={styles.navIcon}>📋</Text>
          <Text style={styles.navText}>Menu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={handlePlayGame}>
          <Text style={styles.navIcon}>🎮</Text>
          <Text style={styles.navText}>Jogo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => Alert.alert('Pedidos', 'Histórico de pedidos em desenvolvimento')}>
          <Text style={styles.navIcon}>📦</Text>
          <Text style={styles.navText}>Pedidos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={handleProfile}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  
  // Header Styles
  header: {
    backgroundColor: '#6B4E3D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 20,
  },
  menuIcon: {
    width: 24,
    height: 24,
    justifyContent: 'space-between',
  },
  menuLine: {
    width: 20,
    height: 2,
    backgroundColor: '#fff',
    borderRadius: 1,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIconText: {
    fontSize: 16,
    color: '#fff',
  },

  // Content Styles
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Welcome Section
  welcomeSection: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  welcomeCard: {
    flex: 2,
    backgroundColor: '#D4A574',
    borderRadius: 16,
    padding: 20,
    justifyContent: 'center',
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A3429',
    lineHeight: 22,
  },
  coffeeWaitCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coffeeWaitText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  coffeeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#D4A574',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coffeeIconText: {
    fontSize: 20,
  },

  // Categories Section
  categoriesCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryItem: {
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#D4A574',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIconDark: {
    backgroundColor: '#4A3429',
    borderColor: '#4A3429',
  },
  categoryIconText: {
    fontSize: 16,
  },
  categoryIconTextWhite: {
    fontSize: 16,
    color: '#fff',
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },

  // Offers Section
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A3429',
    marginBottom: 16,
  },
  offersSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  offerCard: {
    flex: 1,
    backgroundColor: '#D4A574',
    borderRadius: 16,
    padding: 20,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  offerCardGreen: {
    flex: 1,
    backgroundColor: '#8FA68E',
    borderRadius: 16,
    padding: 20,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  offerContent: {
    flex: 1,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 20,
  },
  offerTitleWhite: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 20,
  },
  offerSubtitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
  },
  offerEmoji: {
    fontSize: 32,
    alignSelf: 'flex-end',
  },

  // Bottom Navigation
  bottomNav: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navIcon: {
    fontSize: 20,
    color: '#999',
    marginBottom: 4,
  },
  navIconActive: {
    fontSize: 20,
    color: '#D4A574',
    marginBottom: 4,
  },
  navText: {
    fontSize: 10,
    color: '#999',
  },
  navTextActive: {
    fontSize: 10,
    color: '#D4A574',
    fontWeight: '600',
  },
});
