import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PickType,
} from '@nestjs/swagger';
import { BorrowStatus } from '../../database/entities/borrow-record.entity';
import {
  PaginationResponse,
  ResultResponse,
  ResultResponseList,
} from 'src/helper/result-response.helper';
import { BookSummaryDto } from 'src/books/dto/book.dto';
import { UserPublicDto } from 'src/users/dto/user.dto';

export class BorrowRecordDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  userId: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440002' })
  bookId: string;

  @ApiProperty({
    enum: BorrowStatus,
    example: BorrowStatus.BORROWED,
    description: 'Current status of the borrow record',
  })
  status: BorrowStatus;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Date when book was borrowed',
  })
  borrowedAt: Date;

  @ApiProperty({
    example: '2024-01-15T00:00:00.000Z',
    description: 'Expected return date',
  })
  dueDate: Date;

  @ApiPropertyOptional({
    example: '2024-01-10T00:00:00.000Z',
    description: 'Actual return date',
  })
  returnedAt: Date | null;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

export class BorrowRecordDetailDto extends OmitType(BorrowRecordDto, [
  'userId',
  'bookId',
] as const) {
  @ApiProperty({ type: () => BookSummaryDto })
  book: BookSummaryDto;

  @ApiProperty({ type: () => UserPublicDto })
  user: UserPublicDto;
}

export class BorrowRecordListItemDto extends OmitType(BorrowRecordDto, [
  'createdAt',
  'updatedAt',
  'userId',
  'bookId',
] as const) {
  @ApiProperty({ type: () => BookSummaryDto })
  book: BookSummaryDto;

  @ApiProperty({ type: () => UserPublicDto })
  user: UserPublicDto;
}

export class BorrowRecordSummaryDto extends PickType(BorrowRecordDto, [
  'id',
  'status',
  'borrowedAt',
  'dueDate',
  'returnedAt',
] as const) {}

export class BorrowRecordDetailDtoResponse extends ResultResponse(
  BorrowRecordDetailDto,
) {}

export class BorrowRecordDetailsDtoResponse extends ResultResponseList(
  BorrowRecordDetailDto,
) {}

export class BorrowRecordListItemDtoResponse extends PaginationResponse<BorrowRecordListItemDto> {
  @ApiProperty({ example: 200 })
  statusCode: number;
}
