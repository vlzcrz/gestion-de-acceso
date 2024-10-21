import { IsNumber, IsString } from 'class-validator';

export class RegisterUserDTO {
  @IsString()
  name: string;

  @IsString()
  firstLastName: string;

  @IsString()
  secondLastName: string;

  @IsString()
  rut: string;

  @IsString()
  email: string;

  @IsNumber()
  careerId: number;

  @IsString()
  password: string;

  @IsString()
  repeatedPassword: string;
}
