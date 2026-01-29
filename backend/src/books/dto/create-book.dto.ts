import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsOptional,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ example: 'The Great Gatsby', description: 'Book title' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  title: string;

  @ApiProperty({ example: 'F. Scott Fitzgerald', description: 'Author name' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  author: string;

  @ApiProperty({ example: '9780743273565', description: 'ISBN (10 or 13 digits)' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?:\d{10}|\d{13})$/, {
    message: 'ISBN must be 10 or 13 digits',
  })
  isbn: string;

  @ApiProperty({ example: 1925, description: 'Year of publication' })
  @IsInt()
  @Min(1000)
  @Max(new Date().getFullYear() + 1)
  publicationYear: number;

  @ApiPropertyOptional({ example: 5, description: 'Number of copies', default: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number = 1;

  @ApiPropertyOptional({ example: 'A classic American novel...', description: 'Book description' })
  @IsString()
  @IsOptional()
  description?: string;
}
