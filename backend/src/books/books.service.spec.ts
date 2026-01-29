import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { BooksService } from './books.service';
import { BookRepository, BorrowRecordRepository } from '../database/repositories';
import {
  createMockBookRepository,
  createMockBookDetailDto,
  createMockBookEntity,
  createMockBorrowRecordRepository,
  createMockBorrowRecordDetailDto,
  createMockBorrowRecordEntity,
} from '../testing/mocks';
import { BorrowStatus } from '../database/entities/borrow-record.entity';

describe('BooksService', () => {
  let service: BooksService;
  let bookRepository: ReturnType<typeof createMockBookRepository>;
  let borrowRecordRepository: ReturnType<typeof createMockBorrowRecordRepository>;

  beforeEach(async () => {
    bookRepository = createMockBookRepository();
    borrowRecordRepository = createMockBorrowRecordRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: BookRepository, useValue: bookRepository },
        { provide: BorrowRecordRepository, useValue: borrowRecordRepository },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  describe('create', () => {
    it('should create a new book successfully', async () => {
      // Arrange
      const createBookDto = {
        title: 'New Book',
        author: 'Author',
        isbn: '1234567890123',
        publicationYear: 2024,
        quantity: 5,
      };
      const expectedBook = createMockBookDetailDto({
        ...createBookDto,
        availableQuantity: 5,
      });
      bookRepository.findByISBN.mockResolvedValue(null);
      bookRepository.createBookAndGetDetail.mockResolvedValue(expectedBook);

      // Act
      const result = await service.create(createBookDto);

      // Assert
      expect(result.statusCode).toBe(HttpStatus.CREATED);
      expect(result.data).toEqual(expectedBook);
      expect(bookRepository.findByISBN).toHaveBeenCalledWith(createBookDto.isbn);
    });

    it('should throw ConflictException when ISBN already exists', async () => {
      // Arrange
      const createBookDto = {
        title: 'New Book',
        author: 'Author',
        isbn: '1234567890123',
        publicationYear: 2024,
      };
      bookRepository.findByISBN.mockResolvedValue(createMockBookEntity());

      // Act & Assert
      await expect(service.create(createBookDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return book when found', async () => {
      // Arrange
      const bookId = 'book-uuid-123';
      const expectedBook = createMockBookDetailDto({ id: bookId });
      bookRepository.findByIdDetail.mockResolvedValue(expectedBook);

      // Act
      const result = await service.findOne(bookId);

      // Assert
      expect(result.statusCode).toBe(HttpStatus.OK);
      expect(result.data).toEqual(expectedBook);
    });

    it('should throw NotFoundException when book not found', async () => {
      // Arrange
      const bookId = 'non-existent-id';
      bookRepository.findByIdDetail.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(bookId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('borrowBook', () => {
    const userId = 'user-uuid-123';
    const bookId = 'book-uuid-123';

    it('should successfully borrow a book', async () => {
      // Arrange
      const bookEntity = createMockBookEntity({ availableQuantity: 3 });
      const borrowRecord = createMockBorrowRecordDetailDto();
      
      bookRepository.findById.mockResolvedValue(bookEntity);
      borrowRecordRepository.findActiveBorrow.mockResolvedValue(null);
      bookRepository.borrowBook.mockResolvedValue({ success: true, book: bookEntity });
      borrowRecordRepository.createBorrowRecord.mockResolvedValue(borrowRecord);

      // Act
      const result = await service.borrowBook(bookId, userId);

      // Assert
      expect(result.statusCode).toBe(HttpStatus.OK);
      expect(result.data).toEqual(borrowRecord);
      expect(bookRepository.borrowBook).toHaveBeenCalledWith(bookId);
    });

    it('should throw NotFoundException when book does not exist', async () => {
      // Arrange
      bookRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.borrowBook(bookId, userId)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when no copies available', async () => {
      // Arrange
      const bookEntity = createMockBookEntity({ availableQuantity: 0 });
      bookRepository.findById.mockResolvedValue(bookEntity);

      // Act & Assert
      await expect(service.borrowBook(bookId, userId)).rejects.toThrow(BadRequestException);
      await expect(service.borrowBook(bookId, userId)).rejects.toThrow('No available copies of this book');
    });

    it('should throw BadRequestException when user already borrowed the book', async () => {
      // Arrange
      const bookEntity = createMockBookEntity({ availableQuantity: 3 });
      const existingBorrow = createMockBorrowRecordEntity();
      
      bookRepository.findById.mockResolvedValue(bookEntity);
      borrowRecordRepository.findActiveBorrow.mockResolvedValue(existingBorrow);

      // Act & Assert
      await expect(service.borrowBook(bookId, userId)).rejects.toThrow(BadRequestException);
      await expect(service.borrowBook(bookId, userId)).rejects.toThrow('You have already borrowed this book');
    });
  });

  describe('returnBook', () => {
    const userId = 'user-uuid-123';
    const bookId = 'book-uuid-123';

    it('should successfully return a book', async () => {
      // Arrange
      const borrowRecord = createMockBorrowRecordEntity();
      const returnedRecord = createMockBorrowRecordDetailDto({
        status: BorrowStatus.RETURNED,
        returnedAt: new Date(),
      });
      const bookEntity = createMockBookEntity();
      
      borrowRecordRepository.findActiveBorrow.mockResolvedValue(borrowRecord);
      bookRepository.returnBook.mockResolvedValue({ success: true, book: bookEntity });
      borrowRecordRepository.markAsReturned.mockResolvedValue(returnedRecord);

      // Act
      const result = await service.returnBook(bookId, userId);

      // Assert
      expect(result.statusCode).toBe(HttpStatus.OK);
      expect(result.data).toEqual(returnedRecord);
      expect(bookRepository.returnBook).toHaveBeenCalledWith(bookId);
      expect(borrowRecordRepository.markAsReturned).toHaveBeenCalledWith(borrowRecord.id);
    });

    it('should throw BadRequestException when user has not borrowed the book', async () => {
      // Arrange
      borrowRecordRepository.findActiveBorrow.mockResolvedValue(null);

      // Act & Assert
      await expect(service.returnBook(bookId, userId)).rejects.toThrow(BadRequestException);
      await expect(service.returnBook(bookId, userId)).rejects.toThrow('You have not borrowed this book');
    });
  });

  describe('remove', () => {
    it('should delete book successfully when no active borrows', async () => {
      // Arrange
      const bookId = 'book-uuid-123';
      const bookEntity = createMockBookEntity({ id: bookId });
      
      bookRepository.findById.mockResolvedValue(bookEntity);
      borrowRecordRepository.hasActiveBorrowByBook.mockResolvedValue(false);
      bookRepository.softDeleteBook.mockResolvedValue(true);

      // Act
      await service.remove(bookId);

      // Assert
      expect(bookRepository.softDeleteBook).toHaveBeenCalledWith(bookId);
    });

    it('should throw ConflictException when book has active borrows', async () => {
      // Arrange
      const bookId = 'book-uuid-123';
      const bookEntity = createMockBookEntity({ id: bookId });
      
      bookRepository.findById.mockResolvedValue(bookEntity);
      borrowRecordRepository.hasActiveBorrowByBook.mockResolvedValue(true);

      // Act & Assert
      await expect(service.remove(bookId)).rejects.toThrow(ConflictException);
      await expect(service.remove(bookId)).rejects.toThrow('Book is currently borrowed and cannot be deleted');
    });

    it('should throw NotFoundException when book does not exist', async () => {
      // Arrange
      bookRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });
});
