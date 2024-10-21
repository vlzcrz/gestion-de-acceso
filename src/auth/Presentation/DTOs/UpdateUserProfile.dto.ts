import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDTO {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  firstLastName: string;

  @IsString()
  @IsOptional()
  secondLastName: string;
}
