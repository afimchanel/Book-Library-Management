import { UserEntity } from '../../database/entities/user.entity';
import { UserProfileDto } from '../../users/dto/user.dto';
import { UserRole } from '../../common/constant/library.constant';

// Mock User Entity
export const createMockUserEntity = (
  overrides: Partial<UserEntity> = {},
): UserEntity =>
  ({
    id: 'user-uuid-123',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword123',
    fullName: 'Test User',
    role: UserRole.USER,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    deletedAt: null,
    ...overrides,
  }) as UserEntity;

// Mock User Profile DTO
export const createMockUserProfileDto = (
  overrides: Partial<UserProfileDto> = {},
): UserProfileDto => ({
  username: 'testuser',
  email: 'test@example.com',
  fullName: 'Test User',
  role: UserRole.USER,
  ...overrides,
});

// Mock Users Service
export const createMockUsersService = () => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByUsername: jest.fn(),
  validatePassword: jest.fn(),
});

// Mock JWT Service
export const createMockJwtService = () => ({
  sign: jest.fn().mockReturnValue('mock-jwt-token'),
  verify: jest.fn(),
});
