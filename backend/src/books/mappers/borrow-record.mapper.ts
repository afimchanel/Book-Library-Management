import { BorrowRecordEntity } from 'src/database/entities/borrow-record.entity';
import {
  BorrowRecordDetailDto,
  BorrowRecordListItemDto,
  BorrowRecordSummaryDto,
} from '../dto/borrow-record.dto';
import { toBookSummaryDto } from './book.mapper';
import { toUserPublicDto } from 'src/users/mappers/user.mapper';

export function toBorrowRecordDetailDto(
  record: BorrowRecordEntity,
): BorrowRecordDetailDto {
  return {
    id: record.id,
    status: record.status,
    borrowedAt: record.borrowedAt,
    dueDate: record.dueDate,
    returnedAt: record.returnedAt,
    book: toBookSummaryDto(record.book),
    user: toUserPublicDto(record.user),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export function toBorrowRecordListItemDto(
  record: BorrowRecordEntity,
): BorrowRecordListItemDto {
  return {
    id: record.id,
    status: record.status,
    borrowedAt: record.borrowedAt,
    dueDate: record.dueDate,
    returnedAt: record.returnedAt,
    book: toBookSummaryDto(record.book),
    user: toUserPublicDto(record.user),
  };
}

export function toBorrowRecordSummaryDto(
  record: BorrowRecordEntity,
): BorrowRecordSummaryDto {
  return {
    id: record.id,
    status: record.status,
    borrowedAt: record.borrowedAt,
    dueDate: record.dueDate,
    returnedAt: record.returnedAt,
  };
}

export function toBorrowRecordDetailDtoList(
  records: BorrowRecordEntity[],
): BorrowRecordDetailDto[] {
  return records.map(toBorrowRecordDetailDto);
}

export function toBorrowRecordListItemDtoList(
  records: BorrowRecordEntity[],
): BorrowRecordListItemDto[] {
  return records.map(toBorrowRecordListItemDto);
}
