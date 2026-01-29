import {
  Entity,
  Column,
  Index,
  VersionColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntity } from '../../common/entities/base.entity';
import { SoftDeleteEntity } from 'src/common/entities/soft-delete.entity';

@Entity('books')
export class BookEntity extends SoftDeleteEntity {
  @Index()
  @Column({ length: 255 })
  title: string;

  @Index()
  @Column({ length: 255 })
  author: string;

  @Index({ unique: true })
  @Column({ length: 20 })
  isbn: string;

  @Column({ name: 'publication_year', type: 'int' })
  publicationYear: number;

  @Column({ name: 'cover_image', nullable: true })
  coverImage: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ name: 'available_quantity', type: 'int', default: 1 })
  availableQuantity: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @VersionColumn()
  version: number;
}
