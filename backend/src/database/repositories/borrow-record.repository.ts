import { Injectable } from '@nestjs/common';
import { EntityManager, In, Repository, SelectQueryBuilder } from 'typeorm';
import { BorrowRecordEntity, BorrowStatus } from '../entities/borrow-record.entity';

@Injectable()
export class BorrowRecordRepository extends Repository<BorrowRecordEntity> {
  private alias = 'borrowRecord';

  constructor(protected entityManager: EntityManager) {
    super(BorrowRecordEntity, entityManager);
  }

  private baseQueryBuilder(): SelectQueryBuilder<BorrowRecordEntity> {
    return this.createQueryBuilder(this.alias);
  }

  async createBorrowRecord(
    userId: string,
    bookId: string,
    dueDate: Date,
  ): Promise<BorrowRecordEntity> {
    const record = await this.create({
      userId,
      bookId,
      dueDate,
      status: BorrowStatus.BORROWED,
      borrowedAt: new Date(),
    });
    return await this.save(record);
  }

  async findActiveBorrow(
    userId: string,
    bookId: string,
  ): Promise<BorrowRecordEntity | null> {
    const b = this.baseQueryBuilder();
    b.where(`${this.alias}.userId = :userId`, { userId });
    b.andWhere(`${this.alias}.bookId = :bookId`, { bookId });
    b.andWhere(`${this.alias}.status = :status`, {
      status: BorrowStatus.BORROWED,
    });
    return await b.getOne();
  }

  async findActiveByUser(userId: string): Promise<BorrowRecordEntity[]> {
    const b = this.baseQueryBuilder();
    b.leftJoinAndSelect(`${this.alias}.book`, 'book');
    b.where(`${this.alias}.userId = :userId`, { userId });
    b.andWhere(`${this.alias}.status = :status`, {
      status: BorrowStatus.BORROWED,
    });
    b.orderBy(`${this.alias}.borrowedAt`, 'DESC');
    return await b.getMany();
  }

  async findAllByUser(userId: string): Promise<BorrowRecordEntity[]> {
    const b = this.baseQueryBuilder();
    b.leftJoinAndSelect(`${this.alias}.book`, 'book');
    b.where(`${this.alias}.userId = :userId`, { userId });
    b.orderBy(`${this.alias}.borrowedAt`, 'DESC');
    return await b.getMany();
  }

  async hasActiveBorrowByBook(bookId: string): Promise<boolean> {
    const activeStatuses = [BorrowStatus.BORROWED, BorrowStatus.OVERDUE];
    const count = await this.count({
      where: {
        bookId,
        status: In(activeStatuses),
      },
    });
    return count > 0;
  }

  async markAsReturned(recordId: string): Promise<BorrowRecordEntity | null> {
    await this.update(recordId, {
      status: BorrowStatus.RETURNED,
      returnedAt: new Date(),
    });
    const b = this.baseQueryBuilder();
    b.where(`${this.alias}.id = :recordId`, { recordId });
    return await b.getOne();
  }
}
