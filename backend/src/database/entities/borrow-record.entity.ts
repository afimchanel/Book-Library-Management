import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/entities/base.entity';
import { UserEntity } from './user.entity';
import { BookEntity } from './book.entity';

export enum BorrowStatus {
  BORROWED = 'borrowed',
  RETURNED = 'returned',
  OVERDUE = 'overdue',
}

@Entity('borrow_records')
export class BorrowRecordEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Index()
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => BookEntity, { eager: true })
  @JoinColumn({ name: 'book_id' })
  book: BookEntity;

  @Index()
  @Column({ name: 'book_id' })
  bookId: string;

  @Column({
    type: 'enum',
    enum: BorrowStatus,
    default: BorrowStatus.BORROWED,
  })
  status: BorrowStatus;

  @Column({
    name: 'borrowed_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  borrowedAt: Date;

  @Column({ name: 'due_date', type: 'timestamp' })
  dueDate: Date;

  @Column({ name: 'returned_at', type: 'timestamp', nullable: true })
  returnedAt: Date | null;
}
