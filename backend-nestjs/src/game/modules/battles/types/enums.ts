export enum BattleActionType {
  ATTACK = 'attack',
  SWITCH = 'switch',
  SELECT_COFFEEMON = 'select_coffeemon',
}

export enum BattleStatus {
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

export enum TurnPhase {
  SELECTION = 'SELECTION',
  SUBMISSION = 'SUBMISSION',
  RESOLUTION = 'RESOLUTION',
  END_OF_TURN = 'END_OF_TURN',
}
