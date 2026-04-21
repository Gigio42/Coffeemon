export type BattleFormat = '1v1' | '2v2' | '3v3';

export const BATTLE_FORMAT_SIZES: Record<BattleFormat, number> = {
  '1v1': 1,
  '2v2': 2,
  '3v3': 3,
};

export interface GameLobby {
  id: string;
  hostId: number;
  hostUsername: string;
  hostSocketId: string;
  guestId?: number;
  guestUsername?: string;
  guestSocketId?: string;
  format: BattleFormat;
  type: 'public' | 'private';
  status: 'waiting' | 'ready' | 'started' | 'cancelled';
  createdAt: string;
}
