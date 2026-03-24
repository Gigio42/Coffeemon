import { BattleActionUnion } from 'src/game/modules/battles/types/battle-actions.types';
import { BattleState } from 'src/game/modules/battles/types/battle-state.types';
import { Player } from 'src/game/modules/player/entities/player.entity';

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
    public readonly action: BattleActionUnion
  ) {}
}

// --- Eventos (Fatos que Ocorreram no Sistema) ---
export class PlayerCreatedEvent {
  constructor(
    public readonly playerId: number,
    public readonly userId: number
  ) {}
}

export class PlayerInventoryUpdateEvent {
  constructor(
    public readonly playerId: number,
    public readonly updatedPlayer: Player
  ) {}
}
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
export class PlayerLeveledUpEvent {
  constructor(
    public readonly playerId: number,
    public readonly newLevel: number
  ) {}
}
export class CoffeemonLeveledUpEvent {
  constructor(
    public readonly playerId: number,
    public readonly playerCoffeemonId: number,
    public readonly newLevel: number,
    public readonly expGained: number
  ) {}
}

export class CoffeemonLearnedMoveEvent {
  constructor(
    public readonly playerId: number,
    public readonly playerCoffeemonId: number,
    public readonly moveName: string
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

export class PlayerWantsToBattleBotCommand {
  constructor(
    public readonly playerId: number,
    public readonly socketId: string,
    public readonly botProfileId: string
  ) {}
}

export class ExecuteBotTurnCommand {
  constructor(public readonly battleId: string) {}
}
export class MatchChatMessageEvent {
  constructor(
    public readonly battleId: string,
    public readonly senderId: number,
    public readonly senderUsername: string,
    public readonly content: string,
    public readonly timestamp: Date
  ) {}
}

export class PlayerOnlineEvent {
  constructor(public readonly playerId: number) {}
}

export class PlayerOfflineEvent {
  constructor(public readonly playerId: number) {}
}

export class SocialFriendRequestSentEvent {
  constructor(
    public readonly fromPlayerId: number,
    public readonly toPlayerId: number,
    public readonly requestId: number,
    public readonly fromUsername: string
  ) {}
}

export class SocialMessageSentEvent {
  constructor(
    public readonly conversationId: string,
    public readonly messageId: string,
    public readonly senderId: number,
    public readonly senderUsername: string,
    public readonly content: string,
    public readonly createdAt: Date,
    public readonly player1Id: number,
    public readonly player2Id: number
  ) {}
}

export class SocialFriendRequestAcceptedEvent {
  constructor(
    public readonly requestId: number,
    public readonly acceptorPlayerId: number,
    public readonly acceptorUsername: string,
    public readonly requesterPlayerId: number
  ) {}
}
