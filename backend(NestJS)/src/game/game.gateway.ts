import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GetUserWs } from 'src/auth/decorators/get-user-ws.decorator';
import { WsAuthGuard } from 'src/auth/guards/ws-auth.guard';
import { User } from 'src/users/entities/user.entity';

@UseGuards(WsAuthGuard)
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
