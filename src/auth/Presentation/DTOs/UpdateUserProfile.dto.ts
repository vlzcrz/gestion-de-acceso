import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDTO {
  @IsString()
  @IsEmail()
  Email: string;

  @IsString()
  @IsOptional()
  Name: string;

  @IsString()
  @IsOptional()
  FirstLastName: string;

  @IsString()
  @IsOptional()
  SecondLastName: string;
}
