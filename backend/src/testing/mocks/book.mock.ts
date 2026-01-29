import { BookDetailDto, BookListItemDto } from '../../books/dto/book.dto';
import { BookEntity } from '../../database/entities';

// Mock Book Entity
export const createMockBookEntity = (
  overrides: Partial<BookEntity> = {},
): BookEntity => ({
  id: 'book-uuid-123',
  title: 'Test Book',
  author: 'Test Author',
  isbn: '1234567890123',
  description: 'Test description',
  publicationYear: 2024,
  coverImage: null,
  quantity: 5,
  availableQuantity: 5,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  deletedAt: null,
  ...overrides,
}) as BookEntity;

// Mock Book Detail DTO
export const createMockBookDetailDto = (
  overrides: Partial<BookDetailDto> = {},
): BookDetailDto => ({
  id: 'book-uuid-123',
  title: 'Test Book',
  author: 'Test Author',
  isbn: '1234567890123',
  description: 'Test description',
  publicationYear: 2024,
  coverImage: null,
  quantity: 5,
  availableQuantity: 5,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
});

// Mock Book List Item DTO
export const createMockBookListItemDto = (
  overrides: Partial<BookListItemDto> = {},
): BookListItemDto => ({
  id: 'book-uuid-123',
  title: 'Test Book',
  author: 'Test Author',
  isbn: '1234567890123',
  publicationYear: 2024,
  coverImage: null,
  quantity: 5,
  availableQuantity: 5,
  ...overrides,
});

// Mock Book Repository
export const createMockBookRepository = () => ({
  findById: jest.fn(),
  findByIdDetail: jest.fn(),
  findByISBN: jest.fn(),
  findAll: jest.fn(),
  createBookAndGetDetail: jest.fn(),
  updateBook: jest.fn(),
  softDeleteBook: jest.fn(),
  adjustQuantity: jest.fn(),
  borrowBook: jest.fn(),
  returnBook: jest.fn(),
});
