import { ExtractPayload } from '../../types/battle-actions.types';
import { BattleState } from '../../types/battle-state.types';
import { BattleActionType } from '../../types/enums';
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
  readonly priority: number;

  execute(context: BattleActionContext<T>): Promise<BattleActionResult>;
}
