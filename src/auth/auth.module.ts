import { Module, OnModuleInit } from '@nestjs/common';
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
import { JwtStrategy } from './Strategies/Jwt.strategy';
import { UserController } from './Presentation/Controllers/User.controller';
import { UserService } from './Application/Services/User.service';
import { Career } from './Infrastructure/Entities/Career.orm.entity';
import { CareerRepository } from './Infrastructure/Repositories/Career.repository';
import { CareerSeedService } from './Seeders/Services/CareerSeed.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Token, Career]),
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
  controllers: [AuthController, UserController],
  providers: [
    AuthService,
    UserService,
    UserRepository,
    TokenRepository,
    CareerRepository,
    CareerSeedService,
    JwtStrategy,
  ],
})
export class AuthModule implements OnModuleInit {
  constructor(private readonly careerSeedService: CareerSeedService) {}
  async onModuleInit() {
    await this.careerSeedService.seedCareer();
  }
}
