import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module';
import { CoffeemonController } from './coffeemon.controller';
import { CoffeemonService } from './coffeemon.service';
import { Coffeemon } from './entities/coffeemon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coffeemon]), AuthModule],
  controllers: [CoffeemonController],
  providers: [CoffeemonService],
  exports: [CoffeemonService],
})
export class CoffeemonModule {}
