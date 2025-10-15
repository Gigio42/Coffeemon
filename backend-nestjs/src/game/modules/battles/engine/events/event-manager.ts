import { Injectable } from '@nestjs/common';
import { I18nService } from 'src/i18n/i18n.service';
import { BattleEvent } from '../../types/battle-events.types';
import { ActionEventNotification } from '../actions/battle-action-interface';
import { BattleEventRegistry } from './battle-event.registry';

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

    event.message = this.i18n.translate(notification.eventKey, lang, notification.payload);

    return event;
  }
}
