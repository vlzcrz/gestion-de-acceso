import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './Infrastructure/Entities/User.orm.entity';
import { Token } from './Infrastructure/Entities/Token.orm.entity';
import { AuthController } from './Presentation/Controllers/Auth.controller';
import { AuthService } from './Application/Services/Auth.service';
import { UserRepository } from './Infrastructure/Repositories/User.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenRepository } from './Infrastructure/Repositories/Token.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Token]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2h',
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, TokenRepository],
})
export class AuthModule {}
