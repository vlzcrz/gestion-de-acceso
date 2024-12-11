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
  HttpCode,
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

  @Post('register')
  register(@Body() RegisterUserDTO: RegisterUserDTO) {
    return this.authService.registerUser(RegisterUserDTO);
  }

  @Post('login')
  login(@Body() LoginUserDTO: LoginUserDTO) {
    return this.authService.login(LoginUserDTO);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  logout(@Request() req) {
    return this.authService.logout(
      req.user.jwt_uuid,
      req.user.email,
      req.user.iat,
      req.user.exp,
    );
  }

  @Post('validate')
  @UseGuards(AuthGuard('jwt'))
  validateToken(@Request() req) {
    // Esto verifica que tanto el token este firmado por el servicio y ademas que no se encuentre el token baneado (blacklist)
    return this.authService.validate(req.user.jwt_uuid);
  }

  @Put('update-password')
  @HttpCode(204)
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
