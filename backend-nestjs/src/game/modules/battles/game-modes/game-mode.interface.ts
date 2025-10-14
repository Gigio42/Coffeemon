import { BattleActionCommand } from '../../../shared/events/game.events';
import { BattleService } from '../battles.service';

export interface IGameMode {
  setBattleService(service: BattleService): void;
  handlePlayerAction(command: BattleActionCommand): Promise<void>;
}
