import { BorrowRecordEntity, BorrowStatus } from '../../database/entities/borrow-record.entity';
import { BorrowRecordDetailDto } from '../../books/dto/borrow-record.dto';
import { createMockBookEntity } from './book.mock';
import { createMockUserEntity } from './user.mock';


// Mock Borrow Record Entity
export const createMockBorrowRecordEntity = (
  overrides: Partial<BorrowRecordEntity> = {},
): BorrowRecordEntity => ({
  id: 'borrow-uuid-123',
  userId: 'user-uuid-123',
  bookId: 'book-uuid-123',
  status: BorrowStatus.BORROWED,
  borrowedAt: new Date('2024-01-01'),
  dueDate: new Date('2024-01-15'),
  returnedAt: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  book: createMockBookEntity(),
  user: createMockUserEntity(),
  ...overrides,
});

// Mock Borrow Record Detail DTO
export const createMockBorrowRecordDetailDto = (
  overrides: Partial<BorrowRecordDetailDto> = {},
): BorrowRecordDetailDto => ({
  id: 'borrow-uuid-123',
  status: BorrowStatus.BORROWED,
  borrowedAt: new Date('2024-01-01'),
  dueDate: new Date('2024-01-15'),
  returnedAt: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  book: {
    id: 'book-uuid-123',
    title: 'Test Book',
    author: 'Test Author',
    isbn: '1234567890123',
    coverImage: null,
  },
  user: {
    username: 'testuser',
    fullName: 'Test User',
  },
  ...overrides,
});

// Mock Borrow Record Repository
export const createMockBorrowRecordRepository = () => ({
  findActiveBorrow: jest.fn(),
  createBorrowRecord: jest.fn(),
  markAsReturned: jest.fn(),
  hasActiveBorrowByBook: jest.fn(),
  findActiveByUser: jest.fn(),
  findAllByUser: jest.fn(),
});
