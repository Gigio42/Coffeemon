import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Username of the user',
    example: 'Dark',
  })
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @ApiProperty({
    description: 'E-mail of the user',
    example: 'Dark@email.com',
  })
  @IsEmail({}, { message: 'E-mail must be a valid email address' })
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'Jubarte@1234',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    { message: 'Password must be strong' }
  )
  password: string;
}
