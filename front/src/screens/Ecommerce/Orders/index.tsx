import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useOrders } from '../../../hooks/useOrders';
import OrderCard from '../../../components/Ecommerce/OrderCard';
import EmptyState from '../../../components/Ecommerce/EmptyState';
import { styles } from './styles';
import { Order } from '../../../types';
import { getLocalOrders } from '../../../api/localOrderService';

interface OrderHistoryScreenProps {
  token?: string;
  onBack: () => void;
  onNavigateToLogin?: () => void;
}

function OrderHistoryContent({ token, onBack }: { token: string; onBack: () => void }) {
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
      <View style={styles.centerContainer}>
        <Image source={require('../../../../assets/icons/help_ajuda.png')} style={styles.helpIcon} resizeMode="contain" />
        <Text style={styles.errorText}>Erro ao carregar pedidos</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <View style={styles.retryButtonContent}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#e0f0ff', '#f0d0e0']} style={styles.gradientContainer}>
      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState iconSource={require('../../../../assets/icons/icone_caixa_produto.png')} message="Nenhum pedido realizado" />
          <TouchableOpacity style={styles.shopButton} onPress={onBack}>
            <Text style={styles.shopButtonText}>Começar a Comprar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
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
    </LinearGradient>
  );
}

export default function OrderHistoryScreen({ token, onBack, onNavigateToLogin }: OrderHistoryScreenProps) {
  const [localOrders, setLocalOrders] = useState<Order[]>([]);
  const [localLoading, setLocalLoading] = useState(false);

  const loadLocalOrders = async () => {
    try {
      setLocalLoading(true);
      const data = await getLocalOrders();
      setLocalOrders(data);
    } catch (error) {
      console.error('Erro ao carregar histórico local:', error);
      setLocalOrders([]);
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      loadLocalOrders();
    }
  }, [token]);

  const [expandedLocalOrder, setExpandedLocalOrder] = useState<number | null>(null);

  const toggleLocalOrderDetails = (orderId: number) => {
    setExpandedLocalOrder(expandedLocalOrder === orderId ? null : orderId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Image source={require('../../../../assets/icons/icone_caixa_produto.png')} style={styles.emptyIcon} resizeMode="contain" />
          <Text style={styles.headerTitle}>Meus Pedidos</Text>
        </View>
        <View style={{ width: 80 }} />
      </View>

      {token ? (
        <OrderHistoryContent token={token} onBack={onBack} />
      ) : (
        <LinearGradient colors={['#e0f0ff', '#f0d0e0']} style={styles.gradientContainer}>
          {localLoading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#8B4513" />
              <Text style={styles.loadingText}>Carregando pedidos...</Text>
            </View>
          ) : localOrders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <EmptyState
                iconSource={require('../../../../assets/icons/icone_caixa_produto.png')}
                message="Nenhum pedido local encontrado"
              />
              {onNavigateToLogin && (
                <TouchableOpacity style={styles.loginButton} onPress={onNavigateToLogin}>
                  <View style={styles.loginButtonContent}>
                    <Image source={require('../../../../assets/icons/icone_perfil_usuario_generico.png')} style={styles.profileIcon} resizeMode="contain" />
                    <Text style={styles.loginButtonText}>Entrar para ver histórico da conta</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <ScrollView
              style={styles.scrollView}
              refreshControl={<RefreshControl refreshing={localLoading} onRefresh={loadLocalOrders} />}
            >
              {localOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isExpanded={expandedLocalOrder === order.id}
                  onToggle={() => toggleLocalOrderDetails(order.id)}
                />
              ))}
              {onNavigateToLogin && (
                <View style={styles.emptyContainer}>
                  <TouchableOpacity style={styles.loginButton} onPress={onNavigateToLogin}>
                    <View style={styles.loginButtonContent}>
                      <Image source={require('../../../../assets/icons/icone_perfil_usuario_generico.png')} style={styles.profileIcon} resizeMode="contain" />
                      <Text style={styles.loginButtonText}>Entrar para ver histórico da conta</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          )}
        </LinearGradient>
      )}
    </SafeAreaView>
  );
}
