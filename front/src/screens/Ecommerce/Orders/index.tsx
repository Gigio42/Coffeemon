import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useOrders } from '../../../hooks/useOrders';
import OrderCard from '../../../components/Ecommerce/OrderCard';
import EmptyState from '../../../components/Ecommerce/EmptyState';
import { styles } from './styles';

interface OrderHistoryScreenProps {
  token: string;
  onBack: () => void;
  onLogout: () => void;
}

export default function OrderHistoryScreen({ token, onBack, onLogout }: OrderHistoryScreenProps) {
  const { orders, loading, refreshing, error, refetch, onRefresh } = useOrders(token);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  const toggleOrderDetails = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B4513" />
        <Text style={styles.loadingText}>Carregando pedidos...</Text>
      </View>
    );
  }

  if (error && orders.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>Erro ao carregar pedidos</Text>
          <Text style={styles.errorSubtext}>Não foi possível autenticar sua sessão</Text>

          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>🔄 Tentar Novamente</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={async () => {
              await AsyncStorage.clear();
              onLogout();
            }}
          >
            <Text style={styles.loginButtonText}>🔐 Voltar ao Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📦 Meus Pedidos</Text>
        <View style={{ width: 80 }} />
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState icon="📦" message="Nenhum pedido realizado" />
          <TouchableOpacity style={styles.shopButton} onPress={onBack}>
            <Text style={styles.shopButtonText}>Começar a Comprar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isExpanded={expandedOrder === order.id}
              onToggle={() => toggleOrderDetails(order.id)}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
