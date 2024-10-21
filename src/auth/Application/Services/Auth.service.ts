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

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly tokenRepository: TokenRepository,
  ) {}

  async registerUser(RegisterUserDTO: RegisterUserDTO): Promise<UserDomain> {
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

    const Role = 'student';
    const salt = await bcrypt.genSalt(12);
    const HashedPassword = await bcrypt.hash(password, salt);
    const user = new UserDomain(
      name,
      firstLastName,
      secondLastName,
      rut,
      email,
      careerId,
      HashedPassword,
      Role,
    );

    const userInserted = await this.userRepository.SaveUser(user);
    return userInserted;
  }

  async login(LoginUserDTO: LoginUserDTO) {
    const { email, password } = LoginUserDTO;
    const user = await this.userRepository.GetByEmail(email);
    if (!user) throw new BadRequestException('Email not found');
    const isPasswordMatch = await bcrypt.compare(password, user.HashedPassword);
    if (!isPasswordMatch) throw new BadRequestException('Incorrect Password');
    const payload = {
      Jwt_uuid: uuidv4(),
      Name: user.Name,
      FirstLastName: user.FirstLastName,
      SecondLastName: user.SecondLastName,
      Email: user.Email,
      Role: user.Role,
    };
    const jwt = await this.jwtService.sign(payload);
    const token = {
      token: jwt,
    };
    return token;
  }

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

  async logout(
    Jwt_uuid: string,
    Email: string,
    Issued_at: number,
    Expired_at: number,
  ) {
    // aqui mediante el DTO me entregan el JWT token
    // lo que debe de hacer logout es agregar el token a la base de datos (ya que estaria agregandose a la blacklist de token para no ser utilizado nuevamente)

    const userEmail = Email;
    const jwt_uuid = Jwt_uuid;

    const isRevoked = await this.tokenRepository.GetByJwtUuid(jwt_uuid);
    if (isRevoked != null)
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
    console.log(Jwt_uuid);
    console.log(Email);
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
    const updateUser = await this.userRepository.ChangeHashedPassword(
      Email,
      newHashedPassword,
    );
    return updateUser;
  }

  async validate(ValidateTokenDTO: ValidateTokenDTO) {
    const { token_uuid } = ValidateTokenDTO;
    const isBlackListed =
      await this.tokenRepository.ValidateTokenByUuid(token_uuid);
    return isBlackListed;
  }
}
