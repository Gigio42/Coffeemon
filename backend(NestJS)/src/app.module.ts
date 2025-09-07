import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { config } from './ormconfig';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { GameModule } from './game/game.module';
import { EcommerceModule } from './ecommerce/ecommerce.module';
import { ShoppingCartModule } from './ecommerce/shopping-cart/shopping-cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(config),
    EcommerceModule, 
    AuthModule,
    HealthModule,
    GameModule,
    ShoppingCartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
