import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAdminOrders } from '../../../hooks/useAdminOrders';
import { AdminOrder } from '../../../api/adminService';

interface AdminScreenProps {
  token: string;
  onBack: () => void;
}

type AdminTab = 'orders' | 'analytics';

const STATUS_FILTERS = [
  { label: 'Todos', value: '' },
  { label: 'Aguardando', value: 'finalizado' },
  { label: 'Entregue', value: 'entregue' },
  { label: 'Cancelado', value: 'cancelado' },
];

function fmtCurrency(n: number) {
  return `R$ ${Number(n).toFixed(2).replace('.', ',')}`;
}

function fmtDateTime(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString('pt-BR');
  const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${date} às ${time}`;
}

function orderSummary(order: AdminOrder): string {
  if (!order.orderItem?.length) return `${order.total_quantity} item(s)`;
  const parts = order.orderItem
    .slice(0, 2)
    .map((i) => `${i.quantity}x ${i.product?.name ?? 'Produto'}`);
  const extra = order.orderItem.length > 2 ? ` +${order.orderItem.length - 2}` : '';
  return parts.join(', ') + extra;
}

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { label: string; bg: string; fg: string }> = {
    finalizado: { label: 'Aguardando entrega', bg: '#FFF7E0', fg: '#92620A' },
    entregue:   { label: 'Entregue',           bg: '#E6F9EE', fg: '#1A7A40' },
    cancelado:  { label: 'Cancelado',          bg: '#FDE8E8', fg: '#B42318' },
    carrinho:   { label: 'Carrinho',           bg: '#F0F0F0', fg: '#555'    },
  };
  const c = cfg[status] ?? { label: status, bg: '#F0F0F0', fg: '#555' };
  return (
    <View style={[s.badge, { backgroundColor: c.bg }]}>
      <Text style={[s.badgeText, { color: c.fg }]}>{c.label}</Text>
    </View>
  );
}

function StatCard({ value, label, color = '#1C1007', small = false }: {
  value: string | number; label: string; color?: string; small?: boolean;
}) {
  return (
    <View style={s.statCard}>
      <Text style={[s.statNum, { color, fontSize: small ? 13 : 20 }]}>{value}</Text>
      <Text style={s.statLbl}>{label}</Text>
    </View>
  );
}

function BarRow({ label, value, max, revenue }: {
  label: string; value: number; max: number; revenue: number;
}) {
  const pct = max > 0 ? value / max : 0;
  return (
    <View style={s.barRow}>
      <Text style={s.barLabel} numberOfLines={1}>{label}</Text>
      <View style={s.barTrack}>
        <View style={[s.barFill, { width: `${Math.round(pct * 100)}%` as any }]} />
      </View>
      <View style={s.barRight}>
        <Text style={s.barQty}>{value} un</Text>
        <Text style={s.barRevenue}>{fmtCurrency(revenue)}</Text>
      </View>
    </View>
  );
}

function OrderCard({
  order,
  onMarkDelivered,
  onMarkPending,
  onCancel,
}: {
  order: AdminOrder;
  onMarkDelivered: () => void;
  onMarkPending: () => void;
  onCancel: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isGuest = order.user?.isGuest ?? false;
  const clientLabel = isGuest || !order.user
    ? 'Cliente anônimo'
    : order.user.username;

  return (
    <View style={s.orderCard}>
      <TouchableOpacity
        onPress={() => setExpanded((v) => !v)}
        activeOpacity={0.85}
        style={s.orderCardInner}
      >
        <View style={s.orderRow1}>
          <View style={s.orderIdBlock}>
            <Text style={s.orderId}>#{order.id}</Text>
            <Text style={s.orderClient}>{clientLabel}</Text>
          </View>
          <View style={s.orderRightBlock}>
            <Text style={s.orderTotal}>{fmtCurrency(order.total_amount)}</Text>
            <StatusBadge status={order.status} />
          </View>
        </View>

        <View style={s.orderRow2}>
          <Text style={s.orderSummary} numberOfLines={1}>{orderSummary(order)}</Text>
          <Text style={s.orderDate}>{fmtDateTime(order.updated_at)}</Text>
        </View>

        <Text style={s.chevron}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={s.orderDetails}>
          <View style={s.divider} />
          {order.orderItem?.map((item) => (
            <View key={item.id} style={s.itemRow}>
              <Text style={s.itemName} numberOfLines={1}>{item.product?.name ?? `Item #${item.id}`}</Text>
              <Text style={s.itemQty}>×{item.quantity}</Text>
              <Text style={s.itemPrice}>{fmtCurrency(item.total)}</Text>
            </View>
          ))}
          <View style={s.itemTotalRow}>
            <Text style={s.itemTotalLabel}>Total do pedido</Text>
            <Text style={s.itemTotalValue}>{fmtCurrency(order.total_amount)}</Text>
          </View>

          {order.status === 'finalizado' && (
            <>
              <TouchableOpacity style={[s.actionBtn, s.deliverBtn]} onPress={onMarkDelivered}>
                <Text style={s.actionBtnText}>Confirmar Entrega</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.actionBtn, s.cancelBtn]}
                onPress={() =>
                  Alert.alert(
                    'Cancelar pedido',
                    `Cancelar o pedido #${order.id}? Ele deixa de contar na receita.`,
                    [
                      { text: 'Voltar', style: 'cancel' },
                      { text: 'Cancelar pedido', style: 'destructive', onPress: onCancel },
                    ],
                  )
                }
              >
                <Text style={s.actionBtnText}>Cancelar Pedido</Text>
              </TouchableOpacity>
            </>
          )}
          {order.status === 'entregue' && (
            <TouchableOpacity style={[s.actionBtn, s.revertBtn]} onPress={onMarkPending}>
              <Text style={s.actionBtnText}>Reverter para Aguardando</Text>
            </TouchableOpacity>
          )}
          {order.status === 'cancelado' && (
            <TouchableOpacity style={[s.actionBtn, s.revertBtn]} onPress={onMarkPending}>
              <Text style={s.actionBtnText}>Reabrir (Aguardando)</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

function AnalyticsPanel({ stats, analytics }: {
  stats: NonNullable<ReturnType<typeof useAdminOrders>['stats']>;
  analytics: NonNullable<ReturnType<typeof useAdminOrders>['analytics']>;
}) {
  const maxQty = Math.max(...(analytics.topProducts.map((p) => p.qty)), 1);
  const maxDay = Math.max(...(analytics.recentDays.map((d) => d.count)), 1);

  const totalUsers = stats.registeredUsers + stats.guestUsers;

  return (
    <ScrollView contentContainerStyle={s.analyticsList}>
      <Text style={s.sectionTitle}>Contas de Usuário</Text>
      <View style={s.userStatsRow}>
        <View style={[s.userStatCard, { borderLeftColor: '#8B4513' }]}>
          <Text style={[s.userStatNum, { color: '#8B4513' }]}>{stats.registeredUsers}</Text>
          <Text style={s.userStatLbl}>Contas registradas</Text>
        </View>
        <View style={[s.userStatCard, { borderLeftColor: '#A89070' }]}>
          <Text style={[s.userStatNum, { color: '#A89070' }]}>{stats.guestUsers}</Text>
          <Text style={s.userStatLbl}>Contas temporárias</Text>
        </View>
      </View>
      {totalUsers > 0 && (
        <View style={s.userBar}>
          <View style={[s.userBarFill, { flex: stats.registeredUsers }]} />
          <View style={[s.userBarGuest, { flex: Math.max(stats.guestUsers, 0.01) }]} />
        </View>
      )}
      <Text style={s.userBarCaption}>
        {totalUsers > 0
          ? `${Math.round((stats.registeredUsers / totalUsers) * 100)}% contas permanentes`
          : 'Nenhuma conta'}
      </Text>

      <Text style={[s.sectionTitle, { marginTop: 20 }]}>Top Produtos</Text>
      {analytics.topProducts.length === 0 ? (
        <Text style={s.emptyText}>Nenhum dado disponível ainda</Text>
      ) : (
        analytics.topProducts.map((p) => (
          <BarRow
            key={p.name}
            label={p.name}
            value={p.qty}
            max={maxQty}
            revenue={p.revenue}
          />
        ))
      )}

      <Text style={[s.sectionTitle, { marginTop: 20 }]}>Pedidos — Últimos 7 dias</Text>
      {analytics.recentDays.map((d) => {
        const label = new Date(d.date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
        return (
          <View key={d.date} style={s.dayRow}>
            <Text style={s.dayLabel}>{label}</Text>
            <View style={s.dayBarTrack}>
              <View style={[s.dayBarFill, {
                width: maxDay > 0 ? `${Math.round((d.count / maxDay) * 100)}%` as any : '0%',
              }]} />
            </View>
            <Text style={s.dayCount}>{d.count} pedido{d.count !== 1 ? 's' : ''}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

export default function AdminScreen({ token, onBack }: AdminScreenProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');
  const {
    orders, stats, analytics,
    loading, refreshing, error,
    statusFilter, setStatusFilter,
    load, onRefresh,
    markDelivered, markPending, markCancelled,
  } = useAdminOrders(token);

  useEffect(() => { load(); }, []);

  const totalRevenue = stats?.totalRevenue ?? 0;

  return (
    <SafeAreaView style={s.root}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={onBack}>
          <Text style={s.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Painel Admin</Text>
        <TouchableOpacity style={s.refreshBtn} onPress={() => load()}>
          <Text style={s.refreshBtnText}>↻</Text>
        </TouchableOpacity>
      </View>

      {stats && (
        <View style={s.statsBar}>
          <StatCard value={stats.pendingOrders} label="Aguardando" color="#92620A" />
          <View style={s.statDivider} />
          <StatCard value={stats.deliveredOrders} label="Entregues" color="#1A7A40" />
          <View style={s.statDivider} />
          <StatCard value={stats.totalOrders} label="Total" />
          <View style={s.statDivider} />
          <StatCard value={fmtCurrency(totalRevenue)} label="Receita" color="#8B4513" small />
        </View>
      )}

      <View style={s.tabRow}>
        <TouchableOpacity
          style={[s.tabBtn, activeTab === 'orders' && s.tabBtnActive]}
          onPress={() => setActiveTab('orders')}
        >
          <Text style={[s.tabBtnText, activeTab === 'orders' && s.tabBtnTextActive]}>Pedidos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.tabBtn, activeTab === 'analytics' && s.tabBtnActive]}
          onPress={() => setActiveTab('analytics')}
        >
          <Text style={[s.tabBtnText, activeTab === 'analytics' && s.tabBtnTextActive]}>Análises</Text>
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color="#8B4513" />
          <Text style={s.loadingText}>Carregando...</Text>
        </View>
      ) : error ? (
        <View style={s.center}>
          <Text style={s.errorText}>{error}</Text>
          <TouchableOpacity style={s.retryBtn} onPress={() => load()}>
            <Text style={s.retryBtnText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : activeTab === 'analytics' && stats && analytics ? (
        <AnalyticsPanel stats={stats} analytics={analytics} />
      ) : (
        <>
          <View style={s.filterRow}>
            {STATUS_FILTERS.map((f) => (
              <TouchableOpacity
                key={f.value}
                style={[s.filterChip, statusFilter === f.value && s.filterChipActive]}
                onPress={() => setStatusFilter(f.value)}
              >
                <Text style={[s.filterChipText, statusFilter === f.value && s.filterChipTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView
            contentContainerStyle={s.list}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8B4513" />}
          >
            {orders.length === 0 ? (
              <View style={s.center}>
                <Text style={s.emptyText}>Nenhum pedido encontrado</Text>
              </View>
            ) : (
              orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onMarkDelivered={() => markDelivered(order.id)}
                  onMarkPending={() => markPending(order.id)}
                  onCancel={() => markCancelled(order.id)}
                />
              ))
            )}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}

const C = {
  bg:        '#FAF7F2',
  surface:   '#FFFFFF',
  border:    'rgba(196,165,120,0.25)',
  espresso:  '#1C1007',
  coffee:    '#8B4513',
  muted:     '#A89070',
  success:   '#1A7A40',
  warning:   '#92620A',
};

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.espresso,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backBtn: { padding: 6 },
  backBtnText: { fontSize: 22, color: '#fff' },
  headerTitle: { fontSize: 14, fontWeight: '800', color: '#fff', fontFamily: 'monospace', letterSpacing: 1 },
  refreshBtn: { padding: 6 },
  refreshBtnText: { fontSize: 20, color: '#C8793A' },

  statsBar: {
    flexDirection: 'row',
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  statCard: { flex: 1, alignItems: 'center', gap: 2 },
  statNum: { fontSize: 20, fontWeight: '900', fontFamily: 'monospace' },
  statLbl: { fontSize: 9, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.4 },
  statDivider: { width: 1, backgroundColor: C.border, marginVertical: 4 },

  tabRow: {
    flexDirection: 'row',
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: { borderBottomColor: C.coffee },
  tabBtnText: { fontSize: 12, color: C.muted, fontFamily: 'monospace' },
  tabBtnTextActive: { color: C.coffee, fontWeight: '700' },

  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.bg,
  },
  filterChipActive: { backgroundColor: C.coffee, borderColor: C.coffee },
  filterChipText: { fontSize: 11, color: C.coffee, fontFamily: 'monospace' },
  filterChipTextActive: { color: '#fff' },

  list: { padding: 12, gap: 10, paddingBottom: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyText: { color: C.muted, fontSize: 13, textAlign: 'center' },
  loadingText: { color: C.muted, fontSize: 12, marginTop: 10 },
  errorText: { color: '#c0392b', fontSize: 13, marginBottom: 14, textAlign: 'center' },
  retryBtn: { backgroundColor: C.coffee, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  retryBtnText: { color: '#fff', fontFamily: 'monospace', fontSize: 12 },

  orderCard: {
    backgroundColor: C.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
    shadowColor: C.espresso,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  orderCardInner: { padding: 14 },
  orderRow1: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  orderIdBlock: { flex: 1 },
  orderId: { fontSize: 14, fontWeight: '800', color: C.espresso, fontFamily: 'monospace' },
  orderClient: { fontSize: 11, color: C.muted, marginTop: 2 },
  orderRightBlock: { alignItems: 'flex-end', gap: 5 },
  orderTotal: { fontSize: 16, fontWeight: '900', color: C.coffee },
  orderRow2: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderSummary: { flex: 1, fontSize: 11, color: '#6B5040', marginRight: 8 },
  orderDate: { fontSize: 10, color: C.muted },
  chevron: { textAlign: 'right', color: C.muted, fontSize: 10, marginTop: 6 },

  orderDetails: { paddingHorizontal: 14, paddingBottom: 14 },
  divider: { height: 1, backgroundColor: C.border, marginBottom: 10 },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  itemName: { flex: 1, fontSize: 12, color: C.espresso },
  itemQty: { fontSize: 12, color: C.muted, marginHorizontal: 8 },
  itemPrice: { fontSize: 12, fontWeight: '700', color: C.coffee },
  itemTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: C.border,
    marginBottom: 12,
  },
  itemTotalLabel: { fontSize: 12, fontWeight: '600', color: C.espresso },
  itemTotalValue: { fontSize: 14, fontWeight: '900', color: C.coffee },
  actionBtn: { paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  deliverBtn: { backgroundColor: '#1A7A40' },
  cancelBtn: { backgroundColor: '#B42318' },
  revertBtn: { backgroundColor: '#6c757d' },
  actionBtnText: { color: '#fff', fontSize: 12, fontWeight: '700', fontFamily: 'monospace', letterSpacing: 0.5 },

  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: '700' },

  analyticsList: { padding: 16, gap: 6, paddingBottom: 40 },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, marginTop: 4 },

  userStatsRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  userStatCard: {
    flex: 1, backgroundColor: C.surface, borderRadius: 12, padding: 14,
    borderLeftWidth: 4, borderWidth: 1, borderColor: C.border,
  },
  userStatNum: { fontSize: 26, fontWeight: '900', fontFamily: 'monospace' },
  userStatLbl: { fontSize: 10, color: C.muted, marginTop: 4 },

  userBar: { flexDirection: 'row', height: 6, borderRadius: 3, overflow: 'hidden', marginBottom: 6 },
  userBarFill: { backgroundColor: C.coffee },
  userBarGuest: { backgroundColor: '#D4BFA0' },
  userBarCaption: { fontSize: 10, color: C.muted, marginBottom: 4 },

  barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  barLabel: { width: 100, fontSize: 11, color: C.espresso },
  barTrack: { flex: 1, height: 8, backgroundColor: '#F0E8DC', borderRadius: 4, overflow: 'hidden', marginHorizontal: 8 },
  barFill: { height: 8, backgroundColor: C.coffee, borderRadius: 4 },
  barRight: { alignItems: 'flex-end', minWidth: 70 },
  barQty: { fontSize: 10, fontWeight: '700', color: C.espresso },
  barRevenue: { fontSize: 9, color: C.muted },

  dayRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  dayLabel: { width: 90, fontSize: 10, color: C.espresso },
  dayBarTrack: { flex: 1, height: 8, backgroundColor: '#F0E8DC', borderRadius: 4, overflow: 'hidden', marginHorizontal: 8 },
  dayBarFill: { height: 8, backgroundColor: '#C8793A', borderRadius: 4 },
  dayCount: { fontSize: 10, color: C.muted, minWidth: 60, textAlign: 'right' },
});
