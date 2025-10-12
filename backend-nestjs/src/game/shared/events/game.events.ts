import { BattleState } from '../../modules/battles/types/batlle.types';

// --- Comandos (Intenções do Usuário ou do Sistema) ---
export class PlayerWantsToJoinQueueCommand {
  constructor(
    public readonly playerId: number,
    public readonly socketId: string
  ) {}
}
export class PlayerWantsToLeaveQueueCommand {
  constructor(
    public readonly playerId: number,
    public readonly socketId: string
  ) {}
}
export class PlayerWantsToRejoinBattleCommand {
  constructor(
    public readonly playerId: number,
    public readonly socketId: string,
    public readonly battleId: string
  ) {}
}
export class PlayerWantsToLeaveBattleCommand {
  constructor(
    public readonly playerId: number,
    public readonly socketId: string,
    public readonly battleId: string
  ) {}
}
export class PlayerDisconnectedCommand {
  constructor(
    public readonly playerId: number,
    public readonly socketId: string
  ) {}
}
export class BattleActionCommand {
  constructor(
    public readonly battleId: string,
    public readonly playerId: number,
    public readonly socketId: string,
    public readonly actionType: any,
    public readonly payload: any
  ) {}
}

// --- Eventos (Fatos que Ocorreram no Sistema) ---
export class PlayerJoinedQueueEvent {
  constructor(
    public readonly playerId: number,
    public readonly socketId: string
  ) {}
}
export class PlayerLeftQueueEvent {
  constructor(
    public readonly playerId: number,
    public readonly socketId: string
  ) {}
}
export class MatchPairFoundEvent {
  constructor(
    public readonly player1Id: number,
    public readonly player1SocketId: string,
    public readonly player2Id: number,
    public readonly player2SocketId: string
  ) {}
}
export class BattleCreatedEvent {
  constructor(
    public readonly battleId: string,
    public readonly battleState: BattleState
  ) {}
}
export class BattleStateUpdatedEvent {
  constructor(
    public readonly battleId: string,
    public readonly battleState: BattleState
  ) {}
}
export class BattleEndedEvent {
  constructor(
    public readonly battleId: string,
    public readonly winnerId: number,
    public readonly battleState: BattleState
  ) {}
}
export class PlayerReconnectedEvent {
  constructor(
    public readonly battleId: string,
    public readonly playerId: number,
    public readonly battleState: BattleState
  ) {}
}
export class PlayerLeftBattleEvent {
  constructor(
    public readonly battleId: string,
    public readonly playerId: number,
    public readonly socketId: string
  ) {}
}
export class OpponentDisconnectedEvent {
  constructor(
    public readonly battleId: string,
    public readonly disconnectedPlayerId: number
  ) {}
}
export class BattleCancelledEvent {
  constructor(
    public readonly battleId: string,
    public readonly disconnectedPlayerId: number
  ) {}
}
