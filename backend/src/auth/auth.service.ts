import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

import { UserEntity } from '../database/entities';
import { JwtPayload, AuthenticatedUser } from './auth.interface';
import {
  AuthDtoResponse,
  LoginDto,
  LoginDtoResponse,
  RegisterDto,
  RegisterDtoResponse,
} from './dto/auth.dto';
import { UserProfileDto } from '../users/dto/user.dto';
import { toUserProfileDto } from '../users/mappers/user.mapper';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<RegisterDtoResponse> {
    const userProfile = await this.usersService.create(registerDto);

    const userFromDb = await this.usersService.findByUsername(
      registerDto.username,
    );

    if (!userFromDb) {
      throw new UnauthorizedException('User not found');
    }

    const data = this.generateAuthResponse(
      userFromDb.id,
      registerDto.username,
      userProfile,
    );
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  async login(loginDto: LoginDto): Promise<LoginDtoResponse> {
    const { username, password } = loginDto;

    const user = await this.usersService.findByUsername(username);
    if (!user?.id) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      user,
      password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const userProfile = toUserProfileDto(user);
    const data = this.generateAuthResponse(user.id, user.username, userProfile);

    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  async validateUser(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await this.usersService.findById(payload.sub);
    if (!user?.id || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }
    
    // Return only necessary fields (not the full entity)
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };
  }

  generateAuthResponse(
    userId: string,
    username: string,
    userProfile: UserProfileDto,
  ): AuthDtoResponse {
    const payload: JwtPayload = { sub: userId, username };

    return {
      accessToken: this.jwtService.sign(payload),
      user: userProfile,
    };
  }
}
