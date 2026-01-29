import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../database/entities';
import { UserRepository } from '../database/repositories';
import { CreateUserDto } from './dto/create-user.dto';
import { UserProfileDto } from './dto/user.dto';
import { ICreateUserData } from './users.interface';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserProfileDto> {
    const { username, email, password, fullName, role } = createUserDto;

    const existingUser =
      await this.userRepository.findByUsernameOrEmailForDuplicateCheck(
        username,
        email,
      );
    if (existingUser?.id) {
      throw new ConflictException('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData: ICreateUserData = {
      username,
      email,
      password: hashedPassword,
      fullName,
      role,
    };

    return await this.userRepository.createUser(userData);
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    return await this.userRepository.findByUsernameForAuth(username);
  }

  async findById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findByIdForAuth(id);
    if (!user?.id) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Validate password (internal use)
   */
  async validatePassword(user: UserEntity, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}
