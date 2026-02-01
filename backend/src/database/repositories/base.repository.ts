import { Repository, ObjectLiteral, QueryDeepPartialEntity } from 'typeorm';

/**
 * Base Repository with common bulk operations
 * All custom repositories should extend this class
 */
export abstract class BaseRepository<
  T extends ObjectLiteral,
> extends Repository<T> {
  /**
   * Bulk upsert (insert or update) records efficiently using a single query
   * @param payloads - Array of data to upsert
   * @param upsertColumns - Columns to update on conflict
   * @param conflictPaths - Columns to check for conflicts (unique constraints)
   * @param mapper - Optional mapper function to transform payload to entity
   * @returns Promise<void>
   *
   * @example
   * ```typescript
   * await repository.bulkUpsert(
   *   users,
   *   ['email', 'fullName', 'role'],
   *   ['username'],
   *   (user) => ({ ...user })
   * );
   * ```
   */
  async bulkUpsert<P = T>(
    payloads: P[],
    upsertColumns: (keyof T)[],
    conflictPaths: (keyof T)[],
    mapper?: (payload: P) => Partial<T>,
  ): Promise<void> {
    if (payloads.length === 0) {
      return;
    }

    const mappedData = mapper
      ? payloads.map(mapper)
      : (payloads as unknown as Partial<T>[]);

    await this.createQueryBuilder()
      .insert()
      .values(mappedData as QueryDeepPartialEntity<T>[])
      .orUpdate(upsertColumns as string[], conflictPaths as string[])
      .updateEntity(false)
      .execute();
  }

  /**
   * Bulk insert records efficiently using a single query
   * @param payloads - Array of data to insert
   * @param mapper - Optional mapper function to transform payload to entity
   * @returns Promise<void>
   */
  async bulkInsert<P = T>(
    payloads: P[],
    mapper?: (payload: P) => Partial<T>,
  ): Promise<void> {
    if (payloads.length === 0) {
      return;
    }

    const mappedData = mapper
      ? payloads.map(mapper)
      : (payloads as unknown as Partial<T>[]);

    await this.createQueryBuilder()
      .insert()
      .values(mappedData as QueryDeepPartialEntity<T>[])
      .execute();
  }

  /**
   * Bulk delete records by IDs efficiently
   * @param ids - Array of IDs to delete
   * @param idColumn - Name of the ID column (default: 'id')
   * @returns Promise<number> - Number of affected rows
   */
  async bulkDeleteByIds(
    ids: (string | number)[],
    idColumn: keyof T = 'id' as keyof T,
  ): Promise<number> {
    if (ids.length === 0) {
      return 0;
    }

    const result = await this.createQueryBuilder()
      .delete()
      .where(`${String(idColumn)} IN (:...ids)`, { ids })
      .execute();

    return result.affected || 0;
  }

  /**
   * Bulk soft delete records by IDs (sets deletedAt timestamp)
   * Only works if entity has @DeleteDateColumn
   * @param ids - Array of IDs to soft delete
   * @param idColumn - Name of the ID column (default: 'id')
   * @returns Promise<number> - Number of affected rows
   */
  async bulkSoftDeleteByIds(
    ids: (string | number)[],
    idColumn: keyof T = 'id' as keyof T,
  ): Promise<number> {
    if (ids.length === 0) {
      return 0;
    }

    const result = await this.createQueryBuilder()
      .softDelete()
      .where(`${String(idColumn)} IN (:...ids)`, { ids })
      .execute();

    return result.affected || 0;
  }

  /**
   * Bulk update records by IDs efficiently
   * @param ids - Array of IDs to update
   * @param updateData - Data to update
   * @param idColumn - Name of the ID column (default: 'id')
   * @returns Promise<number> - Number of affected rows
   */
  async bulkUpdateByIds(
    ids: (string | number)[],
    updateData: QueryDeepPartialEntity<T>,
    idColumn: keyof T = 'id' as keyof T,
  ): Promise<number> {
    if (ids.length === 0) {
      return 0;
    }

    const result = await this.createQueryBuilder()
      .update()
      .set(updateData)
      .where(`${String(idColumn)} IN (:...ids)`, { ids })
      .execute();

    return result.affected || 0;
  }

  /**
   * Find records by IDs efficiently
   * @param ids - Array of IDs to find
   * @param idColumn - Name of the ID column (default: 'id')
   * @returns Promise<T[]>
   */
  async findByIds(
    ids: (string | number)[],
    idColumn: keyof T = 'id' as keyof T,
  ): Promise<T[]> {
    if (ids.length === 0) {
      return [];
    }

    return this.createQueryBuilder()
      .where(`${String(idColumn)} IN (:...ids)`, { ids })
      .getMany();
  }
}
