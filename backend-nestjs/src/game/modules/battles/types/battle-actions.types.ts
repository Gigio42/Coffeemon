import { BattleActionType } from './enums';

export interface AttackPayload {
  moveId: number;
}

export interface SwitchPayload {
  newIndex: number;
}

export interface SelectCoffeemonPayload {
  coffeemonIndex: number;
}

type PayloadMap = {
  [BattleActionType.ATTACK]: AttackPayload;
  [BattleActionType.SWITCH]: SwitchPayload;
  [BattleActionType.SELECT_COFFEEMON]: SelectCoffeemonPayload;
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
