import { BookEntity } from 'src/database/entities';
import {
  BookDetailDto,
  BookListItemDto,
  BookSummaryDto,
} from '../dto/book.dto';

export function toBookDetailDto(book: BookEntity): BookDetailDto {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    publicationYear: book.publicationYear,
    coverImage: book.coverImage,
    quantity: book.quantity,
    availableQuantity: book.availableQuantity,
    description: book.description,
    createdAt: book.createdAt,
    updatedAt: book.updatedAt,
  };
}

export function toBookListItemDto(book: BookEntity): BookListItemDto {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    publicationYear: book.publicationYear,
    coverImage: book.coverImage,
    quantity: book.quantity,
    availableQuantity: book.availableQuantity,
  };
}

export function toBookSummaryDto(book: BookEntity): BookSummaryDto {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    coverImage: book.coverImage,
  };
}

export function toBookDetailDtoList(books: BookEntity[]): BookDetailDto[] {
  return books.map(toBookDetailDto);
}

export function toBookListItemDtoList(books: BookEntity[]): BookListItemDto[] {
  return books.map(toBookListItemDto);
}

export function toBookSummaryDtoList(books: BookEntity[]): BookSummaryDto[] {
  return books.map(toBookSummaryDto);
}
