import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/infrastructure/redis/redis.service';
import { RoomData, RoomMember } from './types/rooms.types';

@Injectable()
export class RoomCacheService {
  constructor(private redis: RedisService) {}

  async joinRoom(
    roomId: string,
    playerId: number,
    socketId: string,
    roomType: 'matchmaking' | 'battle'
  ): Promise<void> {
    const roomKey = `room:${roomId}`;
    const playerKey = `player:${playerId}:rooms`;
    const socketKey = `socket:${socketId}:room`;

    let roomData = await this.getRoomData(roomId);
    if (!roomData) {
      roomData = {
        roomId,
        type: roomType,
        members: [],
        createdAt: new Date(),
        expiresAt: roomType === 'matchmaking' ? new Date(Date.now() + 600000) : undefined, // 10min para matchmaking
      };
    }

    roomData.members = roomData.members.filter((m) => m.playerId !== playerId);
    roomData.members.push({
      playerId,
      socketId,
      joinedAt: new Date(),
      status: 'active',
    });

    await Promise.all([
      this.redis.set(roomKey, JSON.stringify(roomData), roomType === 'matchmaking' ? 600 : 3600),
      this.redis.set(playerKey, roomId, 3600), // TTL de 1 hora
      this.redis.set(socketKey, roomId, 3600), // TTL de 1 hora
    ]);
  }

  async leaveRoom(roomId: string, playerId: number): Promise<RoomData | null> {
    const roomKey = `room:${roomId}`;
    const playerKey = `player:${playerId}:rooms`;

    const roomData = await this.getRoomData(roomId);
    if (!roomData) return null;

    roomData.members = roomData.members.filter((m) => m.playerId !== playerId);

    if (roomData.members.length === 0) {
      await this.redis.del(roomKey);
      await this.redis.del(playerKey);
      return null;
    } else {
      await this.redis.set(roomKey, JSON.stringify(roomData), 3600); //TODO 1 hora pra poder reentrar, ajustar dps
      await this.redis.del(playerKey);
      return roomData;
    }
  }

  async markPlayerDisconnected(
    socketId: string
  ): Promise<{ roomId: string; playerId: number } | null> {
    const socketKey = `socket:${socketId}:room`;
    const roomId = await this.redis.get(socketKey);
    if (!roomId) return null;

    const roomData = await this.getRoomData(roomId);
    if (!roomData) return null;

    const member = roomData.members.find((m) => m.socketId === socketId);
    if (!member) return null;

    member.status = 'disconnected';
    member.socketId = '';

    await this.redis.set(`room:${roomId}`, JSON.stringify(roomData), 3600); //TODO 1 hora pra poder reentrar, ajustar dps
    await this.redis.del(socketKey);

    return { roomId, playerId: member.playerId };
  }

  async findRoomByPlayer(playerId: number): Promise<string | null> {
    return await this.redis.get(`player:${playerId}:rooms`);
  }

  async findRoomBySocket(socketId: string): Promise<string | null> {
    return await this.redis.get(`socket:${socketId}:room`);
  }

  async getRoomData(roomId: string): Promise<RoomData | null> {
    const data = await this.redis.get(`room:${roomId}`);
    return data ? JSON.parse(data) : null;
  }

  async getActiveMembers(roomId: string): Promise<RoomMember[]> {
    const roomData = await this.getRoomData(roomId);
    return roomData ? roomData.members.filter((m) => m.status === 'active') : [];
  }

  // Não usado
  async cleanupExpiredRooms(): Promise<void> {
    const pattern = 'room:*';
    const keys = await this.redis.keys(pattern);
    const now = new Date();

    for (const key of keys) {
      const data = await this.redis.get(key);
      if (data) {
        const roomData: RoomData = JSON.parse(data);
        if (roomData.expiresAt && new Date(roomData.expiresAt) < now) {
          await this.redis.del(key);
          for (const member of roomData.members) {
            await this.redis.del(`player:${member.playerId}:rooms`);
            if (member.socketId) {
              await this.redis.del(`socket:${member.socketId}:room`);
            }
          }
        }
      }
    }
  }

  async findOpponentInRoom(roomId: string, playerId: number): Promise<RoomMember | null> {
    try {
      const roomData = await this.getRoomData(roomId);
      if (!roomData || roomData.type !== 'matchmaking') return null;

      // Encontra oponente via FIFO
      const availableOpponents = roomData.members.filter(
        (member) => member.playerId !== playerId && member.status === 'active'
      );

      if (availableOpponents.length === 0) return null;

      // Retorna o que está esperando há mais tempo
      return availableOpponents.sort(
        (a, b) => new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()
      )[0];
    } catch (error) {
      console.error('Erro ao procurar oponente:', error);
      return null;
    }
  }

  async makeMatch(
    roomId: string,
    player1Id: number,
    player2Id: number
  ): Promise<{ player1: RoomMember; player2: RoomMember } | null> {
    try {
      const roomData = await this.getRoomData(roomId);
      if (!roomData) return null;

      const player1 = roomData.members.find((m) => m.playerId === player1Id);
      const player2 = roomData.members.find((m) => m.playerId === player2Id);

      if (!player1 || !player2) return null;

      roomData.members = roomData.members.filter(
        (m) => m.playerId !== player1Id && m.playerId !== player2Id
      );

      if (roomData.members.length === 0) {
        await this.redis.del(`room:${roomId}`);
      } else {
        await this.redis.set(`room:${roomId}`, JSON.stringify(roomData), 600);
      }

      await Promise.all([
        this.redis.del(`player:${player1Id}:rooms`),
        this.redis.del(`player:${player2Id}:rooms`),
        this.redis.del(`socket:${player1.socketId}:rooms`),
        this.redis.del(`socket:${player2.socketId}:rooms`),
      ]);

      return { player1, player2 };
    } catch (error) {
      console.error('Erro ao fazer match:', error);
      return null;
    }
  }

  async getQueueStats(roomId: string): Promise<{
    count: number;
    avgWaitTime: number;
    roomCreatedAt?: Date;
  }> {
    try {
      const members = await this.getActiveMembers(roomId);
      const roomData = await this.getRoomData(roomId);

      if (!roomData) return { count: 0, avgWaitTime: 0 };

      const now = new Date().getTime();
      const totalWaitTime = members.reduce((sum, member) => {
        return sum + (now - new Date(member.joinedAt).getTime());
      }, 0);

      return {
        count: members.length,
        avgWaitTime: members.length > 0 ? totalWaitTime / members.length : 0,
        roomCreatedAt: roomData.createdAt,
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas da room:', error);
      return { count: 0, avgWaitTime: 0 };
    }
  }
}
