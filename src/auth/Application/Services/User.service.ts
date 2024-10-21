import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from 'src/auth/Infrastructure/Repositories/User.repository';
import { UpdateUserPasswordDTO } from 'src/auth/Presentation/DTOs/UpdateUserPassword.dto';
import { UpdateProfileDTO } from 'src/auth/Presentation/DTOs/UpdateUserProfile.dto';
import { UserByEmailDTO } from 'src/auth/Presentation/DTOs/UserByEmail.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async GetUsers() {
    const users = await this.userRepository.GetAll();
    if (!users) throw new NotFoundException('Users have not registered yet');
    return users;
  }

  async GetUserByEmail(UserByEmailDTO: UserByEmailDTO) {
    const { Email } = UserByEmailDTO;
    const user = await this.userRepository.GetByEmail(Email);
    if (!user)
      throw new BadRequestException(
        'There is no user associated with this Email',
      );
    return user;
  }

  async UpdateProfile(UpdateProfileDTO: UpdateProfileDTO) {
    const { Email, Name, FirstLastName, SecondLastName } = UpdateProfileDTO;
    const updateUser = await this.userRepository.ChangeNameAndLastNames(
      Email,
      Name,
      FirstLastName,
      SecondLastName,
    );
    if (!updateUser)
      throw new BadRequestException(
        'There is no user associated with this Email',
      );
    return updateUser;
  }
}
