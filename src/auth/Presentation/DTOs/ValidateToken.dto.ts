import { IsString } from 'class-validator';

export class ValidateTokenDTO {
  @IsString()
  token: string;
}
