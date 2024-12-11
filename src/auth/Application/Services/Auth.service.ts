import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User as UserDomain } from 'src/auth/Domain/Entities/User.entity';
import { UserRepository } from 'src/auth/Infrastructure/Repositories/User.repository';
import { LoginUserDTO } from 'src/auth/Presentation/DTOs/LoginUser.dto';
import { RegisterUserDTO } from 'src/auth/Presentation/DTOs/RegisterUser.dto';
import { UpdateUserPasswordDTO } from 'src/auth/Presentation/DTOs/UpdateUserPassword.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LogoutUserDTO } from 'src/auth/Presentation/DTOs/LogoutUser.dto';
import { TokenRepository } from 'src/auth/Infrastructure/Repositories/Token.repository';
import { Token } from 'src/auth/Domain/Entities/Token.entity';
import { ValidateTokenDTO } from 'src/auth/Presentation/DTOs/ValidateToken.dto';
import { v4 as uuidv4 } from 'uuid';
import { CareerRepository } from 'src/auth/Infrastructure/Repositories/Career.repository';
import { User } from 'src/auth/Infrastructure/Entities/User.orm.entity';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class AuthService {
  private client: ClientProxy;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly tokenRepository: TokenRepository,
    private readonly careerRepopsitory: CareerRepository,
  ) {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'RegisterQueue',
        queueOptions: { durable: true },
      },
    });
  }

  async registerUser(RegisterUserDTO: RegisterUserDTO) {
    const {
      name,
      firstLastName,
      secondLastName,
      rut,
      email,
      careerId,
      password,
      repeatedPassword,
    } = RegisterUserDTO;

    if (password != repeatedPassword)
      throw new BadRequestException("Password doesn't match repeated password");

    const career = await this.careerRepopsitory.GetCareerById(careerId);
    const Role = 'student';
    const salt = await bcrypt.genSalt(12);
    const HashedPassword = await bcrypt.hash(password, salt);
    const user = new UserDomain(
      name,
      firstLastName,
      secondLastName,
      rut,
      email,
      career,
      HashedPassword,
      Role,
    );

    const userInserted = await this.userRepository.CreateUser(user);
    await this.client.connect();
    const data = {
      UserId: userInserted.User_uuid,
      Name: userInserted.Name,
      FirstLastName: userInserted.FirstLastName,
      SecondLastName: userInserted.SecondLastName,
      RUT: userInserted.RUT,
      Email: userInserted.Email,
    };
    this.client.emit('UserCreatedEvent', data); // se emite el mensaje al MQ
    const payload = {
      Jwt_uuid: uuidv4(),
      name: userInserted.Name,
      firstLastName: userInserted.FirstLastName,
      secondLastName: userInserted.SecondLastName,
      email: userInserted.Email,
      role: userInserted.Role,
      career: userInserted.Career.Name,
    };
    const jwt = await this.jwtService.sign(payload);
    const response = {
      ...payload,
      token: jwt,
    };
    return response;
  }

  async login(LoginUserDTO: LoginUserDTO) {
    const { email, password } = LoginUserDTO;
    const user: UserDomain = await this.userRepository.GetByEmail(email);
    if (!user) throw new BadRequestException('Email not found');
    const isPasswordMatch = await bcrypt.compare(password, user.HashedPassword);
    if (!isPasswordMatch) throw new BadRequestException('Incorrect Password');
    const payload = {
      Jwt_uuid: uuidv4(),
      name: user.Name,
      firstLastName: user.FirstLastName,
      secondLastName: user.SecondLastName,
      email: user.Email,
      role: user.Role,
      career: user.Career.Name,
    };
    const jwt = await this.jwtService.sign(payload);
    const response = {
      ...payload,
      token: jwt,
    };
    return response;
  }

  /*
  async logoutWithDto(LogoutUserDTO: LogoutUserDTO) {
    // aqui mediante el DTO me entregan el JWT token
    // lo que debe de hacer logout es agregar el token a la base de datos (ya que estaria agregandose a la blacklist de token para no ser utilizado nuevamente)
    const { token } = LogoutUserDTO;
    const decodedToken = await this.jwtService.decode(token);
    if (!decodedToken) {
      throw new BadRequestException('Invalid jwt token');
    }
    const userEmail = decodedToken.Email;
    const jwt_uuid = decodedToken.Jwt_uuid;

    const isRevoked = await this.tokenRepository.GetByJwtUuid(jwt_uuid);
    if (isRevoked != null)
      throw new BadRequestException('This token is already blacklisted');

    const user = await this.userRepository.GetByEmail(userEmail);
    const issued_at = new Date(decodedToken.iat);
    const revoked_at = new Date();
    const expired_at = new Date(decodedToken.exp);
    const blacklistToken = new Token(
      jwt_uuid,
      user,
      issued_at,
      revoked_at,
      expired_at,
    );

    console.log(blacklistToken);
    await this.tokenRepository.SaveToken(blacklistToken);
    const response = {
      message: 'The token is now blacklisted',
    };
    return response;
  }
    */

  async logout(
    Jwt_uuid: string,
    Email: string,
    Issued_at: number,
    Expired_at: number,
  ) {
    const userEmail = Email;
    const jwt_uuid = Jwt_uuid;

    const isRevoked = await this.tokenRepository.ValidateTokenByUuid(jwt_uuid);
    if (!isRevoked)
      throw new BadRequestException('This token is already blacklisted');

    const user = await this.userRepository.GetByEmail(userEmail);
    const issued_at = new Date(Issued_at);
    const revoked_at = new Date();
    const expired_at = new Date(Expired_at);
    const blacklistToken = new Token(
      jwt_uuid,
      user,
      issued_at,
      revoked_at,
      expired_at,
    );

    console.log(blacklistToken);
    await this.tokenRepository.SaveToken(blacklistToken);
    const response = {
      message: 'The token is now blacklisted',
    };
    return response;
  }

  async updatePassword(
    UpdateUserPasswordDTO: UpdateUserPasswordDTO,
    Jwt_uuid: string,
    Email: string,
  ) {
    const isValid = await this.tokenRepository.ValidateTokenByUuid(Jwt_uuid);
    if (!isValid) throw new BadRequestException('This token is blacklisted');
    const { currentPassword, password, repeatedPassword } =
      UpdateUserPasswordDTO;
    if (password != repeatedPassword)
      throw new BadRequestException("The new password doesn't match");
    const user = await this.userRepository.GetByEmail(Email);
    if (!user) throw new BadRequestException('This Email is not valid'); //aqui bien ya es un indicador que el token ha sido modificado o bien el usuario ha eliminado la cuenta
    const isCurrendPasswordValid = await bcrypt.compare(
      currentPassword,
      user.HashedPassword,
    );
    if (!isCurrendPasswordValid)
      throw new BadRequestException(
        'The current password provided is wrong, try again',
      );
    const salt = await bcrypt.genSalt(12);
    const newHashedPassword = await bcrypt.hash(password, salt);
    await this.userRepository.ChangeHashedPassword(Email, newHashedPassword);
  }

  async validate(jwt_uuid: string) {
    const isBlackListed =
      await this.tokenRepository.ValidateTokenByUuid(jwt_uuid);
    const response = {
      isValid: isBlackListed,
    };
    return response;
  }

  async sendUserCreatedEvent(data: any) {
    await this.client.connect();
    return this.client.emit('UserCreatedEvent', data); // Envía el evento
  }
}
