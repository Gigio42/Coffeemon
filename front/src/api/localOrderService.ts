import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Order, OrderItem } from '../types';

const LOCAL_ORDERS_KEY = 'local_orders_history';

function buildOrderItems(cartItems: CartItem[], orderId: number): OrderItem[] {
  return cartItems.map((item, index) => {
    const unitPrice = item.product.price;
    const quantity = item.quantity;

    return {
      id: Number(`${orderId}${index + 1}`),
      quantity,
      price: unitPrice,
      unit_price: unitPrice,
      total: unitPrice * quantity,
      product: item.product,
    };
  });
}

export async function getLocalOrders(): Promise<Order[]> {
  const raw = await AsyncStorage.getItem(LOCAL_ORDERS_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as Order[];
    if (!Array.isArray(parsed)) return [];
    return parsed.sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );
  } catch (error) {
    console.error('Erro ao carregar pedidos locais:', error);
    return [];
  }
}

export async function saveLocalOrder(orderId: number, cartItems: CartItem[]): Promise<void> {
  const existingOrders = await getLocalOrders();
  const orderItems = buildOrderItems(cartItems, orderId);
  const totalQuantity = orderItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = orderItems.reduce((sum, item) => sum + item.total, 0);

  const localOrder: Order = {
    id: orderId,
    total_amount: totalAmount,
    total_quantity: totalQuantity,
    status: 'completed',
    updated_at: new Date().toISOString(),
    orderItem: orderItems,
  };

  await AsyncStorage.setItem(
    LOCAL_ORDERS_KEY,
    JSON.stringify([localOrder, ...existingOrders]),
  );
}
