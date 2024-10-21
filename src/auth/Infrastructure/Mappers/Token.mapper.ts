import { Token as TokenDomain } from 'src/auth/Domain/Entities/Token.entity';
import { Token as TokenORM } from '../Entities/Token.orm.entity';
import { UserMapper } from './User.mapper';

export class TokenMapper {
  public static toDomainEntity(TokenOrmEntity: TokenORM) {
    const userDomain = UserMapper.toDomainEntity(TokenOrmEntity.User);

    return new TokenDomain(
      TokenOrmEntity.Jwt_uuid,
      userDomain,
      TokenOrmEntity.Issued_at,
      TokenOrmEntity.Revoked_at,
      TokenOrmEntity.Expired_at,
    );
  }
}
