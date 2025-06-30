import { ConnectedSocket, SubscribeMessage } from '@nestjs/websockets';
import { Socket } from 'socket.io';

export class GameGateway {
  @SubscribeMessage('ping')
  ping(@ConnectedSocket() c: Socket) {
    c.emit('pong', { message: 'The Game server module is up and running ' });
  }
}
