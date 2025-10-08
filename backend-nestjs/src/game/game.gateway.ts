import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GetUserWs } from '../auth/decorators/get-user-ws.decorator';
import { User } from '../ecommerce/users/entities/user.entity';
import { WsGameAuthGuard } from './auth/guards/ws-game-auth-guard';

@UseGuards(WsGameAuthGuard)
@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class GameGateway {
  @SubscribeMessage('ping')
  ping(@ConnectedSocket() c: Socket, @GetUserWs() user: User) {
    c.emit('pong', { message: 'The Game server module is up and running ' });
    console.log('User connected:', user);
  }
}
