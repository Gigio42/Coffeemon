import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../../../auth/decorators/get-user.decorator';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { Player } from '../player/entities/player.entity';
import { PlayerCoffeemons } from '../player/entities/playerCoffeemons.entity';
import { BuyProductDto } from './dto/buy-product.dto';
import { GachaPack } from './entities/gacha-pack.entity';
import { ShopService } from './shop.service';

@ApiTags('Game - Shop')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('game/shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get('packs')
  async getGachaPacks(): Promise<GachaPack[]> {
    return this.shopService.findAllPacks();
  }

  @Post('buy')
  async buyProduct(
    @GetUser('id') userId: number,
    @Body() buyProductDto: BuyProductDto
  ): Promise<Player | PlayerCoffeemons> {
    return this.shopService.buyProduct(userId, buyProductDto.productId, buyProductDto.productType);
  }
}
