import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { UserRole } from '../../../ecommerce/users/entities/user.entity';
import { CreateMoveDto } from './dto/create-move.dto';
import { Move } from './entities/move.entity';
import { MovesService } from './moves.service';

@ApiTags('Game - Moves')
@Controller('game/moves')
export class MovesController {
  constructor(private readonly movesService: MovesService) {}

  @Get()
  findAll(): Promise<Move[]> {
    return this.movesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Move> {
    return this.movesService.findOne(+id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createMoveDto: CreateMoveDto): Promise<Move> {
    return this.movesService.create(createMoveDto);
  }
}
