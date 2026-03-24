import { getServerUrl } from '../utils/config';
import { Friend, FriendRequest, Conversation, ChatMessage } from '../types/social';

async function apiFetch<T>(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = await getServerUrl();
  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Erro na requisição');
  }
  return res.json();
}

// ── Amigos ────────────────────────────────────────────────────────────────────

export function getFriends(token: string): Promise<Friend[]> {
  return apiFetch<Friend[]>('/social/friends', token);
}

export function getFriendRequests(token: string): Promise<FriendRequest[]> {
  return apiFetch<FriendRequest[]>('/social/friends/requests', token);
}

export function sendFriendRequest(
  token: string,
  uid: string
): Promise<{ message: string }> {
  return apiFetch('/social/friends/request', token, {
    method: 'POST',
    body: JSON.stringify({ uid: uid.toUpperCase() }),
  });
}

export function acceptFriendRequest(
  token: string,
  requestId: number
): Promise<{ message: string }> {
  return apiFetch(`/social/friends/request/${requestId}/accept`, token, {
    method: 'PUT',
  });
}

export function removeFriend(
  token: string,
  friendId: number
): Promise<{ message: string }> {
  return apiFetch(`/social/friends/${friendId}`, token, {
    method: 'DELETE',
  });
}

// ── Conversas ─────────────────────────────────────────────────────────────────

export function getConversations(token: string): Promise<Conversation[]> {
  return apiFetch<Conversation[]>('/social/conversations', token);
}

export function openOrCreateConversation(
  token: string,
  friendPlayerId: number
): Promise<{ id: string; player1Id: number; player2Id: number }> {
  return apiFetch('/social/conversations', token, {
    method: 'POST',
    body: JSON.stringify({ friendPlayerId }),
  });
}

export function getMessages(
  token: string,
  conversationId: string
): Promise<ChatMessage[]> {
  return apiFetch<ChatMessage[]>(
    `/social/conversations/${conversationId}/messages`,
    token
  );
}
