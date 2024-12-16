import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User as UserDomain } from 'src/auth/Domain/Entities/User.entity';
import { IUserRepository } from 'src/auth/Domain/Repositories/User.repository.interface';
import { User as UserOrm } from '../Entities/User.orm.entity';
import { Repository } from 'typeorm';
import { UserMapper } from '../Mappers/User.mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrm)
    private readonly userRepository: Repository<UserOrm>,
  ) {}

  async GetByEmail(User_email: string): Promise<UserDomain | null> {
    const userExist = await this.userRepository.existsBy({
      Email: User_email,
    });

    if (!userExist) throw new BadRequestException("The user doesn't exist");
    const user = await this.userRepository.findOneBy({
      Email: User_email,
    });

    const userDomainMapped = UserMapper.toDomainEntity(user);
    return userDomainMapped;
  }

  async GetByEmailLogin(User_email: string): Promise<UserOrm> {
    const userExist = await this.userRepository.existsBy({
      Email: User_email,
    });

    if (!userExist) throw new BadRequestException("The user doesn't exist");
    const user = await this.userRepository.findOneBy({
      Email: User_email,
    });

    return user;
  }

  async GetAll(): Promise<UserDomain[] | null> {
    const users = await this.userRepository.find();
    if (users.length == 0) {
      return null;
    }
    const usersDomainMapped = users.map((user) => {
      const userDomainMapped = UserMapper.toDomainEntity(user);
      return userDomainMapped;
    });
    return usersDomainMapped;
  }

  async CreateUser(User: UserDomain): Promise<UserOrm> {
    const existingUser = await this.userRepository.existsBy({
      Email: User.Email,
    });

    if (existingUser) {
      throw new BadRequestException(
        'This user has already been registered, please use another email',
      );
    }

    const user = await this.userRepository.create(User);
    const createdUser = await this.userRepository.save(user);
    return createdUser;
  }

  async SaveUser(User: UserDomain): Promise<UserDomain> {
    const existingUser = await this.userRepository.existsBy({
      Email: User.Email,
    });

    if (existingUser) {
      throw new BadRequestException(
        'This user has already been registered, please use another email',
      );
    }

    const user = await this.userRepository.create(User);
    await this.userRepository.save(user);
    const userDomainMapped = UserMapper.toDomainEntity(user);
    return userDomainMapped;
  }

  async ChangeHashedPassword(
    User_email: string,
    newHashedPassword: string,
  ): Promise<UserDomain | null> {
    const user = await this.userRepository.findOne({
      where: { Email: User_email },
    });
    if (!user) return null;
    user.HashedPassword = newHashedPassword;
    await this.userRepository.save(user);

    return UserMapper.toDomainEntity(user);
  }

  async ChangeNameAndLastNames(
    User_email: string,
    Name?: string,
    FirstLastName?: string,
    SecondLastName?: string,
  ): Promise<UserDomain | null> {
    const user = await this.userRepository.findOne({
      where: { Email: User_email },
    });
    if (!user) return null;

    if (Name != null) user.Name = Name;
    if (FirstLastName != null) user.FirstLastName = FirstLastName;
    if (SecondLastName != null) user.SecondLastName = SecondLastName;

    await this.userRepository.save(user);

    return UserMapper.toDomainEntity(user);
  }
}
