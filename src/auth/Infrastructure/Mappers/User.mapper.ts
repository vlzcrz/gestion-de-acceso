import { User as UserDomain } from 'src/auth/Domain/Entities/User.entity';
import { User as UserORM } from '../Entities/User.orm.entity';

export class UserMapper {
  public static toDomainEntity(UserOrmEntity: UserORM): UserDomain {
    return new UserDomain(
      UserOrmEntity.Name,
      UserOrmEntity.FirstLastName,
      UserOrmEntity.SecondLastName,
      UserOrmEntity.RUT,
      UserOrmEntity.Email,
      UserOrmEntity.CareerId,
      UserOrmEntity.HashedPassword,
      UserOrmEntity.Role,
    );
  }
}
