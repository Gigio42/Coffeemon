import { PartialType } from '@nestjs/mapped-types';
import { CreateCoffeemonDto } from './create-coffeemon.dto';

export class UpdateCoffeemonDto extends PartialType(CreateCoffeemonDto) {}
