import {
  Body,
  Controller,
  Get,
  Patch,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from 'src/auth/Application/Services/User.service';
import { UserByEmailDTO } from '../DTOs/UserByEmail.dto';
import { UpdateProfileDTO } from '../DTOs/UpdateUserProfile.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  GetUsers() {
    return this.userService.GetUsers();
  }

  @Get('GetUserByEmail')
  GetUserByEmail(@Body() UserByEmailDTO: UserByEmailDTO) {
    return this.userService.GetUserByEmail(UserByEmailDTO);
  }

  @Put('update-profile')
  @UseGuards(AuthGuard('jwt'))
  UpdateUserProfile(
    @Body() UpdateUserProfileDTO: UpdateProfileDTO,
    @Request() req,
  ) {
    return this.userService.UpdateProfile(UpdateUserProfileDTO, req.user.email);
  }
}
