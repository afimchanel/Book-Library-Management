import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import {
  BookRepository,
  BorrowRecordRepository,
} from '../database/repositories';
import { ICreateBookData } from './books.interface';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { SearchBookDto } from './dto/search-book.dto';
import { BookDetailDtoResponse, BookListItemDtoResponse } from './dto/book.dto';
import { PaginationHelper } from '../helper/result-response.helper';
import { DueDate } from 'src/common/constant/library.constant';
import {
  BorrowRecordDetailDtoResponse,
  BorrowRecordDetailsDtoResponse,
} from './dto/borrow-record.dto';
import {
  toBorrowRecordDetailDto,
  toBorrowRecordDetailDtoList,
} from './mappers/borrow-record.mapper';

@Injectable()
export class BooksService {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly borrowRecordRepository: BorrowRecordRepository,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<BookDetailDtoResponse> {
    const existingBook = await this.bookRepository.findByISBN(
      createBookDto.isbn,
    );
    if (existingBook?.id) {
      throw new ConflictException(
        `Book with ISBN ${createBookDto.isbn} already exists`,
      );
    }

    const bookData: ICreateBookData = {
      ...createBookDto,
      availableQuantity: createBookDto.quantity || 1,
    };

    const data = await this.bookRepository.createBookAndGetDetail(bookData);
    return {
      statusCode: HttpStatus.CREATED,
      data,
    };
  }

  async findAll(searchDto: SearchBookDto): Promise<BookListItemDtoResponse> {
    const [books, total] = await this.bookRepository.findAll(searchDto);
    const paginationHelper = new PaginationHelper({
      page: searchDto.page || 1,
      limit: searchDto.limit || 10,
    });
    paginationHelper.setMeta(total);

    return {
      statusCode: HttpStatus.OK,
      message: 'Books retrieved successfully',
      data: books,
      pagination: paginationHelper,
    };
  }

  async findOne(id: string): Promise<BookDetailDtoResponse> {
    const book = await this.bookRepository.findByIdDetail(id);
    if (!book?.id) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      data: book,
    };
  }

  async update(
    id: string,
    updateBookDto: UpdateBookDto,
  ): Promise<BookDetailDtoResponse> {
    const book = await this.bookRepository.findById(id);

    if (!book?.id) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    if (updateBookDto.isbn && updateBookDto.isbn !== book.isbn) {
      const existingBook = await this.bookRepository.findByISBN(
        updateBookDto.isbn,
      );
      if (existingBook) {
        throw new ConflictException(
          `Book with ISBN ${updateBookDto.isbn} already exists`,
        );
      }
    }

    if (updateBookDto.quantity !== undefined) {
      const borrowedCount = book.quantity - book.availableQuantity;
      const newAvailableQuantity = Math.max(
        0,
        updateBookDto.quantity - borrowedCount,
      );

      await this.bookRepository.adjustQuantity(
        id,
        updateBookDto.quantity,
        newAvailableQuantity,
      );
    }

    const updatedBook = await this.bookRepository.updateBook(id, updateBookDto);
    if (!updatedBook) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      data: updatedBook,
    };
  }

  async remove(id: string): Promise<void> {
    const book = await this.bookRepository.findById(id);

    if (!book?.id) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    const hasActiveBorrow =
      await this.borrowRecordRepository.hasActiveBorrowByBook(id);
    if (hasActiveBorrow) {
      throw new ConflictException(
        'Book is currently borrowed and cannot be deleted',
      );
    }

    const deleted = await this.bookRepository.softDeleteBook(id);
    if (!deleted) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
  }

  async updateCoverImage(
    id: string,
    coverImagePath: string,
  ): Promise<BookDetailDtoResponse> {
    const book = await this.bookRepository.findById(id);
    if (!book?.id) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    const updated = await this.bookRepository.updateBook(id, {
      coverImage: coverImagePath,
    });
    if (!updated) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      data: updated,
    };
  }

  async borrowBook(
    id: string,
    userId: string,
  ): Promise<BorrowRecordDetailDtoResponse> {
    const book = await this.bookRepository.findById(id);
    if (!book?.id) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    if (book.availableQuantity <= 0) {
      throw new BadRequestException('No available copies of this book');
    }

    const existingBorrow = await this.borrowRecordRepository.findActiveBorrow(
      userId,
      id,
    );
    if (existingBorrow?.id) {
      throw new BadRequestException('You have already borrowed this book');
    }

    const result = await this.bookRepository.borrowBook(id);
    if (!result?.success) {
      throw new BadRequestException(
        (result as { success: false; error: string }).error,
      );
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + DueDate);

    const data = await this.borrowRecordRepository.createBorrowRecord(
      userId,
      id,
      dueDate,
    );

    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  async returnBook(
    id: string,
    userId: string,
  ): Promise<BorrowRecordDetailDtoResponse> {
    const borrowRecord = await this.borrowRecordRepository.findActiveBorrow(
      userId,
      id,
    );
    if (!borrowRecord?.id) {
      throw new BadRequestException('You have not borrowed this book');
    }

    const result = await this.bookRepository.returnBook(id);
    if (!result?.success) {
      throw new BadRequestException(
        (result as { success: false; error: string }).error,
      );
    }

    const returned = await this.borrowRecordRepository.markAsReturned(
      borrowRecord.id,
    );
    if (!returned?.id) {
      throw new BadRequestException('Failed to return book');
    }

    return {
      statusCode: HttpStatus.OK,
      data: toBorrowRecordDetailDto(returned),
    };
  }

  async getUserBorrowedBooks(
    userId: string,
  ): Promise<BorrowRecordDetailsDtoResponse> {
    const records = await this.borrowRecordRepository.findActiveByUser(userId);
    return {
      statusCode: HttpStatus.OK,
      data: toBorrowRecordDetailDtoList(records),
    };
  }

  async getUserBorrowHistory(
    userId: string,
  ): Promise<BorrowRecordDetailsDtoResponse> {
    const records = await this.borrowRecordRepository.findAllByUser(userId);
    return {
      statusCode: HttpStatus.OK,
      data: toBorrowRecordDetailDtoList(records),
    };
  }
}
