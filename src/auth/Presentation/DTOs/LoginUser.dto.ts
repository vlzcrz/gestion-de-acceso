import { IsString } from 'class-validator';

export class LoginUserDTO {
  @IsString()
  password: string;

  @IsString()
  email: string;
}
