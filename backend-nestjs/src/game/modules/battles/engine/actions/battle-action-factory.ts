import { Injectable, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { BattleActionType } from '../../types/enums';
import { AttackAction } from './attack.action';
import { IBattleAction } from './battle-action-interface';
import { SwitchAction } from './switch.action';

const actionMap: Record<BattleActionType, Type<IBattleAction<any>>> = {
  [BattleActionType.ATTACK]: AttackAction,
  [BattleActionType.SWITCH]: SwitchAction,
};

@Injectable()
export class BattleActionFactory {
  constructor(private readonly moduleRef: ModuleRef) {}

  getAction<T extends BattleActionType>(actionType: T): IBattleAction<T> {
    const ActionClass = actionMap[actionType] as Type<IBattleAction<T>>;
    if (!ActionClass) {
      throw new Error(`Action type '${actionType}' is not registered or supported.`);
    }
    return this.moduleRef.get(ActionClass, { strict: false });
  }
}
