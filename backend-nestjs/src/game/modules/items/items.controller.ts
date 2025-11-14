import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { Item } from './item.entity';
import { ItemsService } from './items.service';

@ApiTags('Game - Items')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('game/items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  async findAll(): Promise<Item[]> {
    return this.itemsService.findAll();
  }
}
