import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from '../../Application/Services/Auth.service';
import { RegisterUserDTO } from '../DTOs/RegisterUser.dto';
import { LoginUserDTO } from '../DTOs/LoginUser.dto';
import { UpdateUserPasswordDTO } from '../DTOs/UpdateUserPassword.dto';
import { LogoutUserDTO } from '../DTOs/LogoutUser.dto';
import { ValidateTokenDTO } from '../DTOs/ValidateToken.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('Register')
  register(@Body() RegisterUserDTO: RegisterUserDTO) {
    return this.authService.registerUser(RegisterUserDTO);
  }

  @Post('Login')
  login(@Body() LoginUserDTO: LoginUserDTO) {
    return this.authService.login(LoginUserDTO);
  }

  @Post('Logout')
  logout(@Body() LogoutUserDTO: LogoutUserDTO) {
    return this.authService.logout(LogoutUserDTO);
  }

  @Post('Validate')
  validateToken(@Body() ValidateTokenDTO: ValidateTokenDTO) {
    return this.authService.validate(ValidateTokenDTO);
  }

  @Post('UpdatePassword')
  updatePassword(@Body() UpdateUserPasswordDTO: UpdateUserPasswordDTO) {
    return this.authService.updatePassword(UpdateUserPasswordDTO);
  }
}
