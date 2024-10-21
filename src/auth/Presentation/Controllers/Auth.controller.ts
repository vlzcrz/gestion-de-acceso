import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { AuthService } from '../../Application/Services/Auth.service';
import { RegisterUserDTO } from '../DTOs/RegisterUser.dto';
import { LoginUserDTO } from '../DTOs/LoginUser.dto';
import { UpdateUserPasswordDTO } from '../DTOs/UpdateUserPassword.dto';
import { LogoutUserDTO } from '../DTOs/LogoutUser.dto';
import { ValidateTokenDTO } from '../DTOs/ValidateToken.dto';
import { AuthGuard } from '@nestjs/passport';

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
  @UseGuards(AuthGuard('jwt'))
  logout(@Request() req) {
    return this.authService.logout(
      req.user.jwt_uuid,
      req.user.email,
      req.user.iat,
      req.user.exp,
    );
  }

  @Post('Validate')
  validateToken(@Body() ValidateTokenDTO: ValidateTokenDTO) {
    return this.authService.validate(ValidateTokenDTO);
  }

  @Put('update-password')
  @UseGuards(AuthGuard('jwt'))
  updatePassword(
    @Body() UpdateUserPasswordDTO: UpdateUserPasswordDTO,
    @Request() req,
  ) {
    return this.authService.updatePassword(
      UpdateUserPasswordDTO,
      req.user.jwt_uuid,
      req.user.email,
    );
  }
}
