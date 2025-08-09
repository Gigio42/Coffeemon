import { BattleState } from 'src/game/battles/types/batlle.types';

export interface QueuePlayer {
  userId: number;
  socketId: string;
}

export type EnqueueResult =
  | { status: 'waiting' }
  | { status: 'matched'; battleId: string; battleState: BattleState };

export type DisconnectResult = { opponentSocketId: string } | undefined;
