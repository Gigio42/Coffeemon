import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/infrastructure/redis/redis.service';
import { RoomData, RoomMember } from '../types/rooms.types';

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

  async findAndClaimOpponent(
    roomId: string,
    joiningPlayerId: number,
    joiningSocketId: string
  ): Promise<RoomMember | null> {
    const client = this.redis.getClient();
    const roomKey = `room:${roomId}`;
    const MAX_RETRIES = 5;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      await client.watch(roomKey);

      const raw = await client.get(roomKey);
      if (!raw) {
        await client.unwatch();
        return null;
      }

      const data = JSON.parse(raw) as RoomData;
      if (data.type !== 'matchmaking') {
        await client.unwatch();
        return null;
      }

      const opponent = data.members
        .filter((m) => m.playerId !== joiningPlayerId && m.status === 'active')
        .sort((a, b) => new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime())[0];

      if (!opponent) {
        await client.unwatch();
        return null;
      }

      data.members = data.members.filter(
        (m) => m.playerId !== joiningPlayerId && m.playerId !== opponent.playerId
      );

      const pipeline = client.multi();

      if (data.members.length === 0) {
        pipeline.del(roomKey);
      } else {
        pipeline.set(roomKey, JSON.stringify(data), 'EX', 600);
      }

      pipeline.del(`player:${joiningPlayerId}:rooms`);
      pipeline.del(`player:${opponent.playerId}:rooms`);
      pipeline.del(`socket:${joiningSocketId}:room`);
      pipeline.del(`socket:${opponent.socketId}:room`);

      const results = await pipeline.exec();
      if (results !== null) {
        return opponent;
      }
    }

    console.error('[RoomCache] findAndClaimOpponent: máximo de tentativas atingido');
    return null;
  }
}
