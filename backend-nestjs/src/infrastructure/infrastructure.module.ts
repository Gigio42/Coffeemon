import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { config } from './ormconfig';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TypeOrmModule.forRoot(config), RedisModule],
  exports: [TypeOrmModule, RedisModule, ConfigModule],
})
export class InfrastructureModule {}
