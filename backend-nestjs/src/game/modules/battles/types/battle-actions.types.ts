import { BattleActionType } from './enums';

export interface AttackPayload {
  moveId: number;
  targetCoffeemonIndex?: number;
}

export interface SwitchPayload {
  newIndex: number;
}

export interface SelectCoffeemonPayload {
  coffeemonIndex: number;
}

export interface UseItemPayload {
  itemId: string;
  targetCoffeemonIndex?: number;
}

type PayloadMap = {
  [BattleActionType.ATTACK]: AttackPayload;
  [BattleActionType.SWITCH]: SwitchPayload;
  [BattleActionType.SELECT_COFFEEMON]: SelectCoffeemonPayload;
  [BattleActionType.USE_ITEM]: UseItemPayload;
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
