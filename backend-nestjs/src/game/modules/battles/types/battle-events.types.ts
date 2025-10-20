export interface BattleEvent {
  type: string;
  payload: any;
  message?: string;
  targetPlayerId?: number;
}
