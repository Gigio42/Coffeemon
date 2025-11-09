import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../../auth/auth.module';
import { Move } from './entities/move.entity';
import { MovesController } from './moves.controller';
import { MovesService } from './moves.service';

@Module({
  imports: [TypeOrmModule.forFeature([Move]), AuthModule],
  controllers: [MovesController],
  providers: [MovesService],
  exports: [TypeOrmModule],
})
export class MovesModule {}
