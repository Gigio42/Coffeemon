import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { WsGameAuthGuard } from './guards/ws-game-auth-guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [WsGameAuthGuard],
  exports: [WsGameAuthGuard, JwtModule],
})
export class GameAuthModule {}
