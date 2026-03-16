import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SendFriendRequestDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'UID deve ter exatamente 6 caracteres' })
  uid: string;
}
