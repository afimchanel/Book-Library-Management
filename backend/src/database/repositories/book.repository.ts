import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { BookEntity } from '../entities';
import { SearchBookDto } from '../../books/dto/search-book.dto';
import { BookDetailDto, BookListItemDto } from '../../books/dto/book.dto';
import {
  toBookDetailDto,
  toBookListItemDtoList,
} from '../../books/mappers/book.mapper';
import { ICreateBookData, IUpdateBookData } from '../../books/books.interface';

export type BookOperationResult =
  | { success: true; book: BookEntity }
  | { success: false; error: string };
export type BookDtoOperationResult =
  | { success: true; book: BookDetailDto }
  | { success: false; error: string };

@Injectable()
export class BookRepository extends Repository<BookEntity> {
  private alias = 'book';

  constructor(protected entityManager: EntityManager) {
    super(BookEntity, entityManager);
  }

  private baseQueryBuilder(): SelectQueryBuilder<BookEntity> {
    return this.createQueryBuilder(this.alias);
  }

  private applySearchFilters(
    queryBuilder: SelectQueryBuilder<BookEntity>,
    searchDto: SearchBookDto,
  ): SelectQueryBuilder<BookEntity> {
    const { search, title, author, isbn } = searchDto;

    if (search) {
      queryBuilder.andWhere(
        `(${this.alias}.title ILIKE :search OR ${this.alias}.author ILIKE :search OR ${this.alias}.isbn ILIKE :search)`,
        { search: `%${search}%` },
      );
    }

    if (title) {
      queryBuilder.andWhere(`${this.alias}.title ILIKE :title`, {
        title: `%${title}%`,
      });
    }
    if (author) {
      queryBuilder.andWhere(`${this.alias}.author ILIKE :author`, {
        author: `%${author}%`,
      });
    }
    if (isbn) {
      queryBuilder.andWhere(`${this.alias}.isbn = :isbn`, { isbn });
    }

    return queryBuilder;
  }

  private applyPagination(
    queryBuilder: SelectQueryBuilder<BookEntity>,
    page: number = 1,
    limit: number = 10,
  ): SelectQueryBuilder<BookEntity> {
    const skip = (page - 1) * limit;
    return queryBuilder.skip(skip).take(limit);
  }

  private applyDefaultOrdering(
    queryBuilder: SelectQueryBuilder<BookEntity>,
  ): SelectQueryBuilder<BookEntity> {
    return queryBuilder.orderBy(`${this.alias}.createdAt`, 'DESC');
  }

  async createBookAndGetDetail(
    bookData: ICreateBookData,
  ): Promise<BookDetailDto> {
    const book = await this.create(bookData);
    const saved = await this.save(book);
    return toBookDetailDto(saved);
  }

  async findAll(
    searchDto: SearchBookDto,
  ): Promise<[BookListItemDto[], number]> {
    const qb = this.baseQueryBuilder();
    this.applySearchFilters(qb, searchDto);
    this.applyPagination(qb, searchDto.page, searchDto.limit);
    this.applyDefaultOrdering(qb);

    const [books, count] = await qb.getManyAndCount();
    return [toBookListItemDtoList(books), count];
  }

  async findById(id: string): Promise<BookEntity | null> {
    const b = this.baseQueryBuilder();
    b.where(`${this.alias}.id = :id`, { id });
    return await b.getOne();
  }

  async findByIdDetail(id: string): Promise<BookDetailDto | null> {
    const b = this.baseQueryBuilder();
    b.where(`${this.alias}.id = :id`, { id });
    const book = await b.getOne();
    return book?.id ? toBookDetailDto(book) : null;
  }

  async findByISBN(isbn: string): Promise<BookEntity | null> {
    const b = this.baseQueryBuilder();
    b.where(`${this.alias}.isbn = :isbn`, { isbn });
    return await b.getOne();
  }

  async updateBook(
    id: string,
    updateData: IUpdateBookData,
  ): Promise<BookDetailDto | null> {
    await this.update(id, updateData);
    return await this.findByIdDetail(id);
  }

  async softDeleteBook(id: string): Promise<boolean> {
    const result = await this.softDelete(id);
    return (result.affected ?? 0) > 0;
  }

  async borrowBook(id: string): Promise<BookOperationResult> {
    const queryRunner = this.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const book = await queryRunner.manager.findOne(BookEntity, {
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });

      if (!book) {
        await queryRunner.rollbackTransaction();
        return { success: false, error: 'Book not found' };
      }

      if (book.availableQuantity <= 0) {
        await queryRunner.rollbackTransaction();
        return { success: false, error: 'No available copies' };
      }

      book.availableQuantity -= 1;
      const updatedBook = await queryRunner.manager.save(book);

      await queryRunner.commitTransaction();
      return { success: true, book: updatedBook };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return { success: false, error: error.message };
    } finally {
      await queryRunner.release();
    }
  }

  async returnBook(id: string): Promise<BookOperationResult> {
    const queryRunner = this.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const book = await queryRunner.manager.findOne(BookEntity, {
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });

      if (!book) {
        await queryRunner.rollbackTransaction();
        return { success: false, error: 'Book not found' };
      }

      if (book.availableQuantity >= book.quantity) {
        await queryRunner.rollbackTransaction();
        return { success: false, error: 'All copies are already available' };
      }

      book.availableQuantity += 1;
      const updatedBook = await queryRunner.manager.save(book);

      await queryRunner.commitTransaction();
      return { success: true, book: updatedBook };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    } finally {
      await queryRunner.release();
    }
  }

  async adjustQuantity(
    id: string,
    quantity: number,
    availableQuantity: number,
  ): Promise<BookEntity | null> {
    await this.update(id, { quantity, availableQuantity });
    return await this.findById(id);
  }
}
