import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class FindMatchDto {
  @IsNumber()
  @Type(() => Number)
  userId: number;
}
