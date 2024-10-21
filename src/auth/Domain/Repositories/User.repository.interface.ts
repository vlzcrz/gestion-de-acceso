import { User } from '../Entities/User.entity';

export interface IUserRepository {
  GetByEmail(User_email: string): Promise<User | null>;

  GetAll(): Promise<User[] | null>;

  SaveUser(User: User): Promise<User>;

  ChangeHashedPassword(
    Email: string,
    HashedPassword: string,
  ): Promise<User | null>;

  ChangeNameAndLastNames(
    Email: string,
    Name?: string,
    FirstLastName?: string,
    SecondLastName?: string,
  ): Promise<User | null>;
}
