import { Injectable } from '@nestjs/common';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { UserEntity } from '../entities';
import { UserProfileDto } from 'src/users/dto/user.dto';
import { toUserProfileDto } from 'src/users/mappers/user.mapper';
import { ICreateUserData, IUpdateUserData } from 'src/users/users.interface';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  private alias = 'user';

  constructor(protected entityManager: EntityManager) {
    super(UserEntity, entityManager);
  }

  private baseQueryBuilder(): SelectQueryBuilder<UserEntity> {
    const qb = this.createQueryBuilder(this.alias);
    qb.select([
      `${this.alias}.id`,
      `${this.alias}.username`,
      `${this.alias}.email`,
      `${this.alias}.fullName`,
      `${this.alias}.role`,
      `${this.alias}.isActive`,
    ]);
    return qb;
  }

  private baseQueryBuilderForAuth(): SelectQueryBuilder<UserEntity> {
    const qb = this.createQueryBuilder(this.alias);
    qb.select([
      `${this.alias}.id`,
      `${this.alias}.username`,
      `${this.alias}.email`,
      `${this.alias}.password`,
      `${this.alias}.fullName`,
      `${this.alias}.role`,
      `${this.alias}.isActive`,
    ]);
    return qb;
  }

  async createUser(userData: ICreateUserData): Promise<UserProfileDto> {
    const user = this.create(userData);
    const saved = await this.save(user);
    return toUserProfileDto(saved);
  }

  async findByIdForAuth(id: string): Promise<UserEntity | null> {
    const b = this.baseQueryBuilderForAuth();
    b.where(`${this.alias}.id = :id`, { id });
    return await b.getOne();
  }

  async findById(id: string): Promise<UserProfileDto | null> {
    const b = this.baseQueryBuilder();
    b.where(`${this.alias}.id = :id`, { id });
    const user = await b.getOne();
    return user ? toUserProfileDto(user) : null;
  }

  async findByUsernameForAuth(username: string): Promise<UserEntity | null> {
    const b = this.baseQueryBuilderForAuth();
    b.where(`${this.alias}.username = :username`, { username });
    return await b.getOne();
  }

  async findByUsernameOrEmailForDuplicateCheck(
    username: string,
    email: string,
  ): Promise<UserEntity | null> {
    const b = this.baseQueryBuilderForAuth();
    b.where(`${this.alias}.username = :username`, { username });
    b.orWhere(`${this.alias}.email = :email`, { email });
    return await b.getOne();
  }

  async updateUser(
    id: string,
    updateData: IUpdateUserData,
  ): Promise<UserProfileDto | null> {
    await this.update(id, updateData);
    return this.findById(id);
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
