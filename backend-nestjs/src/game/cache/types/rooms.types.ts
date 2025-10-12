export interface RoomMember {
  playerId: number;
  socketId: string;
  joinedAt: Date;
  status: 'active' | 'disconnected';
}

export interface RoomData {
  roomId: string;
  type: 'matchmaking' | 'battle';
  members: RoomMember[];
  metadata?: any;
  createdAt: Date;
  expiresAt?: Date;
}
