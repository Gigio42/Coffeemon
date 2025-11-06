import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Order } from '../../../types';
import { styles } from './styles';

interface OrderCardProps {
  order: Order;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function OrderCard({ order, isExpanded, onToggle }: OrderCardProps) {
  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'cancelled':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅ Concluído';
      case 'pending':
        return '⏳ Pendente';
      case 'cancelled':
        return '❌ Cancelado';
      default:
        return status;
    }
  };

  return (
    <View style={styles.orderCard}>
      <TouchableOpacity onPress={onToggle} style={styles.orderHeader}>
        <View style={styles.orderMainInfo}>
          <Text style={styles.orderId}>Pedido #{order.id}</Text>
          <Text style={[styles.orderStatus, { color: getStatusColor(order.status) }]}>
            {getStatusText(order.status)}
          </Text>
        </View>
        <View style={styles.orderSummary}>
          <Text style={styles.orderDate}>{formatDate(order.updated_at)}</Text>
          <Text style={styles.orderTotal}>{formatPrice(order.total_amount)}</Text>
          <Text style={styles.orderQuantity}>
            {order.total_quantity} {order.total_quantity === 1 ? 'item' : 'itens'}
          </Text>
        </View>
      </TouchableOpacity>

      {isExpanded && order.orderItem && (
        <View style={styles.orderDetails}>
          <Text style={styles.detailsTitle}>Itens do pedido:</Text>
          {order.orderItem.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Text style={styles.itemName}>
                {item.quantity}x {item.product.name}
              </Text>
              <Text style={styles.itemPrice}>{formatPrice(item.total || 0)}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
