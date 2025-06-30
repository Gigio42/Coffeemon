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
        `[EventManager] Tentativa de criar evento com chave inválida: ${notification.eventKey}`
      );
      return {
        type: 'UnknownEventError',
        payload: { eventKey: notification.eventKey },
        message: 'Um evento desconhecido e não catalogado ocorreu.',
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return eventBuilder(notification.payload);
  }
}
