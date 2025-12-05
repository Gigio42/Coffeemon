import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../../../auth/decorators/get-user.decorator';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { AddCoffeemonToPartyDto } from './dto/add-coffeemon-to-party.dto';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdateCoffeemonMovesDto } from './dto/update-coffeemon-moves.dto';
import { Player } from './entities/player.entity';
import { PlayerCoffeemons } from './entities/playerCoffeemons.entity';
import { PlayerService } from './player.service';

@ApiTags('players')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('game/players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @GetUser('id') userId: number,
    @Body() createPlayerDto: CreatePlayerDto
  ): Promise<Player> {
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

  //STUB SOMENTE PARA TESTES!!! - REMOVER DEPOIS
  @UseGuards(AuthGuard)
  @Post('me/coffeemons/give-all')
  async giveAllCoffeemonsToMe(
    @GetUser('id') userId: number
  ): Promise<{ message: string; count: number }> {
    const player = await this.playerService.findByUserId(userId);
    const count = await this.playerService.giveAllCoffeemonsToPlayer(player.id);
    return {
      message:
        count > 0
          ? `${count} Coffeemons adicionados com sucesso!`
          : 'Você já possui todos os Coffeemons!',
      count,
    };
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

  //STUB SOMENTE PARA TESTES!!! - ADICIONAR ITENS INICIAIS
  @UseGuards(AuthGuard)
  @Post('me/items/give-initial')
  async giveInitialItems(
    @GetUser('id') userId: number
  ): Promise<{ message: string; inventory: any }> {
    const player = await this.playerService.findByUserId(userId);
    const initialItems = {
      small_potion: 5,
      revive_bean: 2,
      antidote_espresso: 3,
    };

    await this.playerService.addItemsToPlayer(player.id, initialItems);
    const updatedPlayer = await this.playerService.findOne(player.id);

    return {
      message: 'Itens iniciais adicionados com sucesso!',
      inventory: updatedPlayer.inventory,
    };
  }

  //STUB PÚBLICO PARA ADICIONAR ITENS A TODOS OS PLAYERS - REMOVER DEPOIS!!!
  @Post('give-items-to-all')
  async giveItemsToAll(): Promise<{ message: string; count: number }> {
    const players = await this.playerService['playerRepository'].find();
    const initialItems = {
      small_potion: 5,
      revive_bean: 2,
      antidote_espresso: 3,
    };

    let count = 0;
    for (const player of players) {
      await this.playerService.addItemsToPlayer(player.id, initialItems);
      count++;
    }

    return {
      message: `Itens adicionados a ${count} players!`,
      count,
    };
  }

  @UseGuards(AuthGuard)
  @Put('me/coffeemons/:playerCoffeemonId/moves')
  async updateCoffeemonMoves(
    @GetUser('id') userId: number,
    @Param('playerCoffeemonId') playerCoffeemonId: string,
    @Body() dto: UpdateCoffeemonMovesDto
  ): Promise<PlayerCoffeemons> {
    const player = await this.playerService.findByUserId(userId);
    return this.playerService.updateCoffeemonMoves(player.id, +playerCoffeemonId, dto.moveIds);
  }

  @UseGuards(AuthGuard)
  @Get('me/coffeemons/:playerCoffeemonId/available-moves')
  async getAvailableMoves(
    @GetUser('id') userId: number,
    @Param('playerCoffeemonId') playerCoffeemonId: string
  ): Promise<any[]> {
    const player = await this.playerService.findByUserId(userId);
    return this.playerService.getAvailableMovesForCoffeemon(player.id, +playerCoffeemonId);
  }
}
