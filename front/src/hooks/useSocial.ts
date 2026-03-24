import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import {
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
} from '../api/socialService';
import { fetchPlayerData } from '../api/playerService';
import { Friend, FriendRequest } from '../types/social';

export function useSocial(token: string | null) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [myUid, setMyUid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFriends = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const [friendsList, requests, player] = await Promise.all([
        getFriends(token),
        getFriendRequests(token),
        fetchPlayerData(token),
      ]);
      setFriends(friendsList);
      setPendingRequests(requests);
      setMyUid(player.uid ?? null);
    } catch (err: any) {
      setError(err.message ?? 'Erro ao carregar amigos');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const addFriend = useCallback(
    async (uid: string) => {
      if (!token) return;
      try {
        await sendFriendRequest(token, uid);
        Alert.alert('Pedido enviado', `Pedido de amizade enviado!`);
      } catch (err: any) {
        Alert.alert('Erro', err.message ?? 'Não foi possível enviar o pedido');
      }
    },
    [token]
  );

  const acceptRequest = useCallback(
    async (requestId: number) => {
      if (!token) return;
      try {
        await acceptFriendRequest(token, requestId);
        setPendingRequests((prev) => prev.filter((r) => r.id !== requestId));
        await loadFriends();
      } catch (err: any) {
        Alert.alert('Erro', err.message ?? 'Não foi possível aceitar o pedido');
      }
    },
    [token, loadFriends]
  );

  const deleteFriend = useCallback(
    async (friendId: number) => {
      if (!token) return;
      try {
        await removeFriend(token, friendId);
        setFriends((prev) => prev.filter((f) => f.id !== friendId));
      } catch (err: any) {
        Alert.alert('Erro', err.message ?? 'Não foi possível remover o amigo');
      }
    },
    [token]
  );

  // Mark a friend as online/offline from socket events
  const setFriendOnline = useCallback((playerId: number, isOnline: boolean) => {
    setFriends((prev) =>
      prev.map((f) => (f.playerId === playerId ? { ...f, isOnline } : f))
    );
  }, []);

  const addPendingRequest = useCallback(
    (data: { requestId: number; fromPlayerId: number; fromUsername: string }) => {
      setPendingRequests((prev) => {
        if (prev.some((r) => r.id === data.requestId)) return prev;
        return [
          ...prev,
          {
            id: data.requestId,
            fromPlayerId: data.fromPlayerId,
            fromUid: '',
            fromUsername: data.fromUsername,
            createdAt: new Date().toISOString(),
          },
        ];
      });
    },
    []
  );

  return {
    friends,
    pendingRequests,
    myUid,
    isLoading,
    error,
    loadFriends,
    addFriend,
    acceptRequest,
    deleteFriend,
    setFriendOnline,
    addPendingRequest,
  };
}
