import { IsString } from 'class-validator';

export class UserByEmailDTO {
  @IsString()
  Email: string;
}
