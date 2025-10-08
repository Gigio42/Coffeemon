import { BattleState, BattleActionType, ExtractPayload } from '../../types/batlle.types';
import { BattleEventKey } from '../events/battle-event.registry';

export interface ActionEventNotification {
  eventKey: BattleEventKey;
  payload: any;
}

export interface BattleActionResult {
  advanceTurn: boolean;
  notifications: ActionEventNotification[];
}

export interface BattleActionContext<T extends BattleActionType = BattleActionType> {
  battleState: BattleState;
  playerId: number;
  payload: ExtractPayload<T>;
}

export interface IBattleAction<T extends BattleActionType = BattleActionType> {
  execute(context: BattleActionContext<T>): Promise<BattleActionResult>;
}
