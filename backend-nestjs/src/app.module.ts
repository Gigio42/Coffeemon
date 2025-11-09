import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './auth/auth.module';
import { EcommerceModule } from './ecommerce/ecommerce.module';
import { GameModule } from './game/game.module';
import { HealthModule } from './health/health.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    InfrastructureModule,
    EcommerceModule,
    AuthModule,
    HealthModule,
    GameModule,
  ],
})
export class AppModule {}
