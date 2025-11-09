import { Injectable } from '@nestjs/common';
import { I18nService } from 'src/i18n/i18n.service';
import { BattleEvent } from '../../types/battle-events.types';
import { ActionEventNotification } from '../actions/battle-action-interface';
import { BattleEventKey, BattleEventRegistry } from './battle-event.registry';

const PLAYER_SPECIFIC_EVENT_KEYS: Set<BattleEventKey> = new Set([
  'KNOCKOUT_BLOCK',
  'STATUS_BLOCK',
  'ACTION_ERROR',
  'SWITCH_FAILED_SAME_COFFEEMON',
  'SWITCH_FAILED_FAINTED_COFFEEMON',
  'SWITCH_FAILED_INVALID_INDEX',
]);

@Injectable()
export class EventManager {
  constructor(private readonly i18n: I18nService) {}

  public createEvent(notification: ActionEventNotification, lang: string = 'pt-br'): BattleEvent {
    const eventBuilder = BattleEventRegistry[notification.eventKey];

    if (!eventBuilder) {
      console.error(`[EventManager] Invalid event key: ${notification.eventKey}`);
      return {
        type: 'UnknownEventError',
        payload: { eventKey: notification.eventKey },
        message: 'An unknown event occurred.',
      };
    }

    const event = eventBuilder(notification.payload);
    event.payload = notification.payload || {};

    if (
      PLAYER_SPECIFIC_EVENT_KEYS.has(notification.eventKey) &&
      notification.payload?.playerId !== undefined &&
      notification.payload?.playerId !== null
    ) {
      event.targetPlayerId = notification.payload.playerId;
    }

    event.message = this.i18n.translate(notification.eventKey, lang, event.payload);

    return event;
  }
}
