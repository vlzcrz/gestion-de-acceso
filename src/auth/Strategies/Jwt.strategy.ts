import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from './PayloadsDTO/Jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    return {
      jwt_uuid: payload.Jwt_uuid,
      name: payload.Name,
      firstLastName: payload.FirstLastName,
      secondLastName: payload.SecondLastName,
      email: payload.Email,
      rol: payload.Role,
      career: payload.Career,
      iat: payload.iat,
      exp: payload.exp,
    };
  }
}
