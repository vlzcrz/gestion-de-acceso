import { IsEmail, IsString } from 'class-validator';

export class UpdateUserPasswordDTO {
  @IsString()
  currentPassword: string;

  @IsString()
  password: string;

  @IsString()
  repeatedPassword: string;
}
