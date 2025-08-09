import { Injectable } from '@nestjs/common';
import { BattleEvent } from '../../types/batlle.types';
import { ActionEventNotification } from '../actions/battle-action-interface';
import { BattleEventRegistry } from './battle-event.registry';

@Injectable()
export class EventManager {
  public createEvent(notification: ActionEventNotification): BattleEvent {
    const eventBuilder = BattleEventRegistry[notification.eventKey];

    if (!eventBuilder) {
      console.error(
        `[EventManager] Attempted to create event with invalid key: ${notification.eventKey}`
      );
      return {
        type: 'UnknownEventError',
        payload: { eventKey: notification.eventKey },
        message: 'An unknown and uncatalogued event occurred.',
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return eventBuilder(notification.payload);
  }
}
