import { Token } from '../Entities/Token.entity';

export interface ITokenRepository {
  GetAll(): Promise<Token[] | null>;

  GetByJwtUuid(Jwt: string): Promise<Token | null>;

  SaveToken(Token: Token): Promise<Token>;

  ValidateTokenByUuid(Token_uuid: string): Promise<Boolean>;
}
