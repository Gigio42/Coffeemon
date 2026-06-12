import { getServerUrl } from '../utils/config';

export interface AdminOrder {
  id: number;
  total_amount: number;
  total_quantity: number;
  status: string;
  updated_at: string;
  user?: { id: number; username: string; email: string; isGuest: boolean } | null;
  orderItem?: { id: number; quantity: number; unit_price: number; total: number; product?: { id: number; name: string } }[];
}

export interface AdminStats {
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
  registeredUsers: number;
  guestUsers: number;
}

export interface AdminAnalytics {
  topProducts: { name: string; qty: number; revenue: number }[];
  recentDays: { date: string; count: number; revenue: number }[];
}

export interface AuditLogEntry {
  id: number;
  action: string;
  userId: number | null;
  targetId: string | null;
  targetType: string | null;
  metadata: Record<string, any> | null;
  ipAddress: string | null;
  createdAt: string;
}

export interface AuditLogsResponse {
  logs: AuditLogEntry[];
  total: number;
  page: number;
  limit: number;
}

async function authFetch(url: string, token: string, options?: RequestInit) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options?.headers ?? {}),
    },
  });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`HTTP ${response.status}: ${text}`);
  }
  return response.json();
}

export async function fetchAdminOrders(token: string, status?: string): Promise<AdminOrder[]> {
  const url = await getServerUrl();
  const qs = status ? `?status=${encodeURIComponent(status)}` : '';
  return authFetch(`${url}/admin/orders${qs}`, token);
}

export async function updateOrderStatus(token: string, orderId: number, status: string): Promise<AdminOrder> {
  const url = await getServerUrl();
  return authFetch(`${url}/admin/orders/${orderId}/status`, token, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function fetchAdminStats(token: string): Promise<AdminStats> {
  const url = await getServerUrl();
  return authFetch(`${url}/admin/stats`, token);
}

export async function fetchAdminAnalytics(token: string): Promise<AdminAnalytics> {
  const url = await getServerUrl();
  return authFetch(`${url}/admin/analytics`, token);
}

export async function fetchAuditLogs(
  token: string,
  page = 1,
  limit = 50,
  action?: string,
  userId?: number,
): Promise<AuditLogsResponse> {
  const url = await getServerUrl();
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (action) params.set('action', action);
  if (userId != null) params.set('userId', String(userId));
  return authFetch(`${url}/admin/audit-logs?${params}`, token);
}
