import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PickType,
} from '@nestjs/swagger';
import {
  PaginationResponse,
  ResultResponse,
} from 'src/helper/result-response.helper';

export class BookDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'The Great Gatsby', description: 'Book title' })
  title: string;

  @ApiProperty({ example: 'F. Scott Fitzgerald', description: 'Author name' })
  author: string;

  @ApiProperty({ example: '9780743273565', description: 'ISBN' })
  isbn: string;

  @ApiProperty({ example: 1925, description: 'Year of publication' })
  publicationYear: number;

  @ApiPropertyOptional({
    example: '/uploads/covers/book.jpg',
    description: 'Cover image path',
  })
  coverImage?: string;

  @ApiProperty({ example: 5, description: 'Total quantity' })
  quantity: number;

  @ApiProperty({ example: 3, description: 'Available quantity for borrowing' })
  availableQuantity: number;

  @ApiPropertyOptional({
    example: 'A classic American novel...',
    description: 'Book description',
  })
  description?: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

export class BookDetailDto extends OmitType(BookDto, [] as const) {}

export class BookListItemDto extends OmitType(BookDto, [
  'description',
  'createdAt',
  'updatedAt',
] as const) {}

export class BookSummaryDto extends PickType(BookDto, [
  'id',
  'title',
  'author',
  'isbn',
  'coverImage',
] as const) {}

export class BookDetailDtoResponse extends ResultResponse(BookDetailDto) {}
export class BookListItemDtoResponse extends PaginationResponse<BookListItemDto> {
  @ApiProperty({ example: 200 })
  statusCode: number;
}
