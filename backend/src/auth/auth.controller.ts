import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, LoginDtoResponse, RegisterDtoResponse } from './dto/auth.dto';
import { ApiCreatedResponse, ApiReadResponses } from 'src/common/decorators/api-responses.decorator';
import { ApiResponseExamples } from 'src/common/examples/api-response.examples';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({
    description: 'User registered successfully',
    type: RegisterDtoResponse,
    success: {
      success: {
        value: ApiResponseExamples.registerSuccess,
      },
    },
  })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ strict: { ttl: 60000, limit: 5 } }) // 5 login attempts per minute
  @ApiOperation({ summary: 'Login and get JWT token' })
  @ApiReadResponses({
    description: 'Login successful',
    type: LoginDtoResponse,
    success: {
      success: {
        value: ApiResponseExamples.loginSuccess,
      },
    },
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
