import { Injectable } from '@nestjs/common';
import { Token as TokenDomain } from 'src/auth/Domain/Entities/Token.entity';
import { ITokenRepository } from 'src/auth/Domain/Repositories/Token.repository.interface';
import { Repository } from 'typeorm';
import { Token as TokenORM } from '../Entities/Token.orm.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenMapper } from '../Mappers/Token.mapper';
import { User as UserORM } from '../Entities/User.orm.entity';

@Injectable()
export class TokenRepository implements ITokenRepository {
  constructor(
    @InjectRepository(TokenORM)
    private readonly tokenRepository: Repository<TokenORM>,
    @InjectRepository(UserORM)
    private readonly userRepository: Repository<UserORM>,
  ) {}

  async GetAll(): Promise<TokenDomain[] | null> {
    const tokens = await this.tokenRepository.find();
    if (tokens.length == 0) return null;
    const tokensDomainMapped = tokens.map((token) => {
      const tokenMapped = TokenMapper.toDomainEntity(token);
      return tokenMapped;
    });
    return tokensDomainMapped;
  }
  async GetByJwtUuid(Jwt_uuid: string): Promise<TokenDomain | null> {
    const queryBuilder =
      await this.tokenRepository.createQueryBuilder('tokens');
    const tokenExist = await queryBuilder
      .where('Jwt_uuid = :Jwt_uuid', {
        Jwt_uuid: Jwt_uuid,
      })
      .getExists();

    if (!tokenExist) return null;

    const token = await queryBuilder
      .where('Jwt_uuid = :Jwt_uuid', {
        Jwt_uuid: Jwt_uuid,
      })
      .getOne();
    const tokenMapped = TokenMapper.toDomainEntity(token);
    return tokenMapped;
  }
  async SaveToken(Token: TokenDomain): Promise<TokenDomain> {
    const queryBuilder = await this.userRepository.createQueryBuilder('users');
    const user = await queryBuilder
      .where('Email = :Email', {
        Email: Token.User.Email,
      })
      .getOne();
    const TokenToORM = {
      ...Token,
      User: user,
    };
    const token = await this.tokenRepository.create(TokenToORM);
    console.log(token);
    await this.tokenRepository.save(token);
    const TokenDomain = TokenMapper.toDomainEntity(token);
    return TokenDomain;
  }

  async ValidateTokenByUuid(Token_uuid: string): Promise<Boolean> {
    const queryBuilder =
      await this.tokenRepository.createQueryBuilder('tokens');
    const isBlackListed = await queryBuilder
      .where('jwt_uuid = :Token_uuid', {
        Token_uuid: Token_uuid,
      })
      .getExists();

    if (isBlackListed) return false;
    return true;
  }
}
