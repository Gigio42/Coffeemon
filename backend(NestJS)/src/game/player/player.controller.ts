import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { AddCoffeemonToPartyDto } from './dto/add-coffeemon-to-party.dto';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Player } from './entities/player.entity';
import { PlayerCoffeemons } from './entities/playerCoffeemons.entity';
import { PlayerService } from './player.service';

@ApiTags('players')
@ApiBearerAuth()
@Controller('game/players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @GetUser('id') userId: number,
    @Body() createPlayerDto: CreatePlayerDto
  ): Promise<Player> {
    console.log('Creating player for user ID:', userId);
    return this.playerService.create(userId, createPlayerDto);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getMyPlayer(@GetUser('id') userId: number): Promise<Player> {
    return this.playerService.findByUserId(userId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Player> {
    return this.playerService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Get(':playerId/coffeemons')
  async getPlayerCoffeemons(@Param('playerId') playerId: string): Promise<PlayerCoffeemons[]> {
    return this.playerService.getPlayerCoffeemons(+playerId);
  }

  @UseGuards(AuthGuard)
  @Get('me/party')
  async getMyParty(@GetUser('id') userId: number): Promise<PlayerCoffeemons[]> {
    const player = await this.playerService.findByUserId(userId);
    return this.playerService.getPlayerParty(player.id);
  }

  @UseGuards(AuthGuard)
  @Post('me/coffeemons/:coffeemonId')
  async addCoffeemon(
    @GetUser('id') userId: number,
    @Param('coffeemonId') coffeemonId: string
  ): Promise<PlayerCoffeemons> {
    const player = await this.playerService.findByUserId(userId);
    return this.playerService.addCoffeemonToPlayer(player.id, +coffeemonId);
  }

  @UseGuards(AuthGuard)
  @Put('me/party')
  async addToParty(
    @GetUser('id') userId: number,
    @Body() dto: AddCoffeemonToPartyDto
  ): Promise<PlayerCoffeemons> {
    const player = await this.playerService.findByUserId(userId);
    return this.playerService.addCoffeemonToParty(player.id, dto.playerCoffeemonId);
  }

  @UseGuards(AuthGuard)
  @Put('me/party/remove/:playerCoffeemonId')
  async removeFromParty(
    @GetUser('id') userId: number,
    @Param('playerCoffeemonId') playerCoffeemonId: string
  ): Promise<PlayerCoffeemons> {
    const player = await this.playerService.findByUserId(userId);
    return this.playerService.removeCoffeemonFromParty(player.id, +playerCoffeemonId);
  }
}
