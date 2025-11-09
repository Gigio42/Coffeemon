import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { UserRole } from '../../../ecommerce/users/entities/user.entity';
import { CoffeemonService } from './coffeemon.service';
import { CreateCoffeemonDto } from './dto/create-coffeemon.dto';
import { CreateManyCoffeemonDto } from './dto/createMany-cofeemon.dto';
import { UpdateCoffeemonDto } from './dto/update-coffeemon.dto';
import { Coffeemon } from './entities/coffeemon.entity';

@Controller('game/coffeemons')
export class CoffeemonController {
  constructor(private readonly coffeemonService: CoffeemonService) {}

  @Get()
  findAll(): Promise<Coffeemon[]> {
    return this.coffeemonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Coffeemon> {
    return this.coffeemonService.findOne(+id);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createCoffeemonDto: CreateCoffeemonDto): Promise<Coffeemon> {
    return this.coffeemonService.create(createCoffeemonDto);
  }

  @Post('batch')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createMany(@Body() dto: CreateManyCoffeemonDto): Promise<Coffeemon[]> {
    return this.coffeemonService.createMany(dto.coffeemons);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateCoffeemonDto: UpdateCoffeemonDto
  ): Promise<Coffeemon> {
    return this.coffeemonService.update(+id, updateCoffeemonDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string): Promise<void> {
    return this.coffeemonService.remove(+id);
  }
}
