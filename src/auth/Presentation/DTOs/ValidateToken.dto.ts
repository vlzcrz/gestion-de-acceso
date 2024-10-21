import { IsString } from 'class-validator';

export class ValidateTokenDTO {
  @IsString()
  token_uuid: string;
}
