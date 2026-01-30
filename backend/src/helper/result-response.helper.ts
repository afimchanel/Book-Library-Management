import { Type } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';

import { Expose, Type as TypeDecorator } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class TResponse<T> {
  @ApiPropertyOptional({ example: 200 })
  @Expose()
  statusCode?: number;

  @Expose()
  data: T;
}

export function ResultResponse<T>(classRef: Type<T>): Type<TResponse<T>> {
  class ResultResponseClass extends TResponse<T> {
    @ApiProperty({
      type: classRef,
    })
    @TypeDecorator(() => classRef)
    data: T;
  }

  return ResultResponseClass as Type<TResponse<T>>;
}

export function ResultResponseList<T>(classRef: Type<T>): Type<TResponse<T[]>> {
  class ResultResponseClass extends TResponse<T[]> {
    @ApiProperty({
      type: classRef,
      isArray: true,
      nullable: true,
    })
    @TypeDecorator(() => classRef)
    data: T[];
  }

  return ResultResponseClass as Type<TResponse<T[]>>;
}

export function ResultResponseListNullable<T>(
  classRef: Type<T>,
): Type<TResponse<T[]>> {
  class ResultResponseClass extends TResponse<T[]> {
    @ApiProperty({
      type: classRef,
      isArray: true,
      nullable: true,
    })
    @TypeDecorator(() => classRef)
    data: T[] | null;
  }

  return ResultResponseClass as Type<TResponse<T[]>>;
}

export function PaginationResultResponse<T>(
  classRef: Type<T>,
): Type<PaginationResponse<T>> {
  class PaginationResultResponseClass extends PaginationResponse<T> {
    @ApiProperty({
      type: [classRef],
    })
    @TypeDecorator(() => classRef)
    data: T[];
  }

  return PaginationResultResponseClass;
}

export class Pagination {
  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @TypeDecorator(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    default: 50,
  })
  @IsInt()
  @Min(1)
  @Max(1000)
  @IsOptional()
  @TypeDecorator(() => Number)
  limit: number = 50;

  @ApiProperty({ example: 40 })
  totalRows: number;

  @ApiProperty({ example: 2 })
  totalPages: number;
}

export class PaginationResponse<T> {
  @ApiProperty({ type: Pagination })
  pagination: Pagination;

  @ApiProperty({ description: 'message' })
  message: string;

  @ApiProperty({ description: 'actual data of the operation' })
  data: T[];

  @ApiPropertyOptional({ description: 'source key of master data' })
  sourceKey?: string | null;
}
export class PaginationQuery extends OmitType(Pagination, [
  'totalPages',
  'totalRows',
]) {}

export class PaginationHelper extends Pagination {
  constructor(input: PaginationQuery) {
    super();
    const isLimitNan = Number.isNaN(input.limit);
    this.limit = isLimitNan ? 50 : +input.limit;

    this.page = input.page;
  }

  getPage(): number {
    const page = this.page <= 1 ? 0 : this.page - 1;
    return page * this.getLimit();
  }

  getLimit(): number {
    return this.limit;
  }

  setMeta(count: number) {
    const parseCount = count ? +count : 0;

    const isNegativeNumber = this.limit < 0 ? 99999 : this.limit;

    const totalPages = Math.ceil(parseCount / isNegativeNumber) || 1;
    this.totalPages = Number.isFinite(totalPages) ? totalPages : 1;
    this.totalRows = parseCount;
  }
}

export class ErrorsTypeDto {
  @ApiProperty({
    type: Number,
    example: 400,
    description: 'HTTP status code',
  })
  @Expose()
  statusCode: number;

  @ApiPropertyOptional({
    description: 'message of the error',
  })
  @Expose()
  message: string;
}

export class ErrorsResponse {
  @ApiProperty({ type: ErrorsTypeDto })
  error?: ErrorsTypeDto; // will have errors?
}