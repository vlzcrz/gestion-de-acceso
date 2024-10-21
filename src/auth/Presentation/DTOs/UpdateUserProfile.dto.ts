import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDTO {
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
