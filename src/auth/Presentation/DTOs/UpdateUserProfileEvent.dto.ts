import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateProfileEventDTO {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  firstLastName: string;

  @IsString()
  @IsOptional()
  secondLastName: string;

  @IsEmail()
  email: string;
}
