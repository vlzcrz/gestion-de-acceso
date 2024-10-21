import { IsEmail, IsString } from 'class-validator';

export class UpdateUserPasswordDTO {
  @IsString()
  @IsEmail()
  Email: string;

  @IsString()
  newPassword: string;
}
