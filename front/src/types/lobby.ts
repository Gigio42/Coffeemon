export type BattleFormat = '1v1' | '2v2' | '3v3';

export const FORMAT_SIZE: Record<BattleFormat, number> = {
  '1v1': 1,
  '2v2': 2,
  '3v3': 3,
};

export const FORMAT_LABELS: Record<BattleFormat, string> = {
  '1v1': '1 vs 1',
  '2v2': '2 vs 2',
  '3v3': '3 vs 3',
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
