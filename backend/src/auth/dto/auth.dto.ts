import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ResultResponse } from 'src/helper/result-response.helper';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { UserProfileDto } from 'src/users/dto/user.dto';
import { ApiResponseExamples } from 'src/common/examples/api-response.examples';

export class RegisterDto extends RegisterUserDto {}

export class LoginDto {
  @ApiProperty({ example: 'admin', description: 'Username of the user' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'admin123', description: 'Password of the user' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AuthDtoResponse {
  @ApiProperty({
    example: ApiResponseExamples.loginSuccess.data.accessToken,
    description: 'JWT access token for authentication',
  })
  accessToken: string;

  @ApiProperty({
    type: UserProfileDto,
    example: ApiResponseExamples.loginSuccess.data.user,
  })
  user: UserProfileDto;
}

export class RegisterDtoResponse extends ResultResponse(AuthDtoResponse) {}

export class LoginDtoResponse extends ResultResponse(AuthDtoResponse) {}
