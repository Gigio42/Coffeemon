import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketManagerService {
  private readonly playerSocketMap = new Map<number, string>();
  private readonly socketPlayerMap = new Map<string, number>();

  register(playerId: number, socket: Socket): void {
    this.playerSocketMap.set(playerId, socket.id);
    this.socketPlayerMap.set(socket.id, playerId);
    console.log(`[SocketManager] Socket ${socket.id} registrado para Player ${playerId}`);
  }

  unregister(socket: Socket): void {
    const playerId = this.socketPlayerMap.get(socket.id);
    if (playerId) {
      this.playerSocketMap.delete(playerId);
      this.socketPlayerMap.delete(socket.id);
      console.log(`[SocketManager] Socket ${socket.id} (Player ${playerId}) desregistrado.`);
    }
  }

  getSocketId(playerId: number): string | undefined {
    return this.playerSocketMap.get(playerId);
  }

  getPlayerId(socketId: string): number | undefined {
    return this.socketPlayerMap.get(socketId);
  }
}
