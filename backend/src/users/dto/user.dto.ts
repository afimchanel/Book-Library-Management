import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { UserRole } from 'src/common/constant/library.constant';
import { ResultResponse } from 'src/helper/result-response.helper';


export class UserDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'johndoe', description: 'Username of the user' })
  username: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Email of the user',
  })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  fullName?: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.USER,
    description: 'Role of the user',
  })
  role: (typeof UserRole)[keyof typeof UserRole];

  @ApiProperty({ example: true, description: 'Whether the user is active' })
  isActive: boolean;
}

export class UserProfileDto extends OmitType(UserDto, [
  'id',
  'isActive',
] as const) {}

export class UserPublicDto extends PickType(UserDto, [
  'username',
  'fullName',
] as const) {}

export class UserProfileDtoResponse extends ResultResponse(UserProfileDto) {}
