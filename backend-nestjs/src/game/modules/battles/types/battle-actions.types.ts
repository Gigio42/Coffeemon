import { BattleActionType } from './enums';

export interface AttackPayload {
  moveId: number;
}

export interface SwitchPayload {
  newIndex: number;
}

type PayloadMap = {
  [BattleActionType.ATTACK]: AttackPayload;
  [BattleActionType.SWITCH]: SwitchPayload;
};

export type BattleActionUnion = {
  [K in keyof PayloadMap]: {
    battleId: string;
    actionType: K;
    payload: PayloadMap[K];
  };
}[keyof PayloadMap];

export type ExtractPayload<T extends BattleActionType> = Extract<
  BattleActionUnion,
  { actionType: T }
>['payload'];
