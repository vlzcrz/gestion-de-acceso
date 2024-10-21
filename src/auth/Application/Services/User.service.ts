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
    const { email } = UserByEmailDTO;
    const user = await this.userRepository.GetByEmail(email);
    if (!user)
      throw new BadRequestException(
        'There is no user associated with this Email',
      );
    return user;
  }

  async UpdateProfile(UpdateProfileDTO: UpdateProfileDTO, email: string) {
    const { name, firstLastName, secondLastName } = UpdateProfileDTO;
    const updateUser = await this.userRepository.ChangeNameAndLastNames(
      email,
      name,
      firstLastName,
      secondLastName,
    );
    if (!updateUser)
      throw new BadRequestException(
        'There is no user associated with this Email',
      );
    return updateUser;
  }
}
