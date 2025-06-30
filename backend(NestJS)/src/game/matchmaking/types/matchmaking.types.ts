export interface QueuePlayer {
  userId: number;
  socketId: string;
}

export type EnqueueResult =
  | { status: 'waiting' }
  | { status: 'matched'; player1SocketId: string; player2SocketId: string; battleId: string };

export type DisconnectResult = { opponentSocketId: string } | undefined;
