import { UserEntity } from 'src/database/entities';
import { UserProfileDto, UserPublicDto } from '../dto/user.dto';

export function toUserProfileDto(user: UserEntity): UserProfileDto {
  return {
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  };
}

export function toUserPublicDto(user: UserEntity): UserPublicDto {
  return {
    username: user.username,
    fullName: user.fullName,
  };
}

export function toUserProfileDtoList(users: UserEntity[]): UserProfileDto[] {
  return users.map(toUserProfileDto);
}

export function toUserPublicDtoList(users: UserEntity[]): UserPublicDto[] {
  return users.map(toUserPublicDto);
}
