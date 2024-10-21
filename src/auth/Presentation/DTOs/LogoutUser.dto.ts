import { IsString } from 'class-validator';

export class LogoutUserDTO {
  @IsString()
  token: string;
}
