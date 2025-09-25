export interface MatchmakingInstructions {
  status: 'waiting' | 'matched' | 'error';
  data?: any;
  roomMovements?: RoomMovement[];
  emissions?: EmissionInstruction[];
  updateStats?: string[];
}

export interface RoomMovement {
  socketId: string;
  playerId?: number;
  action: 'join' | 'leave';
  roomId: string;
  roomType?: 'matchmaking' | 'battle';
}

export interface EmissionInstruction {
  target: EmissionTarget;
  event: string;
  data: any;
  exclude?: boolean;
}

export interface EmissionTarget {
  type: 'socket' | 'room' | 'broadcast';
  roomId?: string;
}
