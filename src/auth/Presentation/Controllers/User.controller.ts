import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UserService } from 'src/auth/Application/Services/User.service';
import { UserByEmailDTO } from '../DTOs/UserByEmail.dto';
import { UpdateProfileDTO } from '../DTOs/UpdateUserProfile.dto';

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

  @Patch('UpdateUserProfile')
  UpdateUserProfile(@Body() UpdateUserProfileDTO: UpdateProfileDTO) {
    return this.userService.UpdateProfile(UpdateUserProfileDTO);
  }
}
