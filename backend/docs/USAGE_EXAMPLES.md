# BaseRepository Usage Examples

## Overview

`BaseRepository` provides efficient bulk operations for all repositories. All custom repositories extend from this base class and inherit these methods.

---

## 1. bulkUpsert - Insert or Update Many Records

### Use Case: Sync users from external system

```typescript
import { toUserEntity } from 'src/users/mappers/user.mapper';
import { UserProfileDto } from 'src/users/dto/user.dto';

// In UserService or similar
async syncUsersFromExternalSystem(externalUsers: UserProfileDto[]) {
  // Upsert users: insert new, update existing based on username
  await this.userRepository.bulkUpsert(
    externalUsers,
    ['email', 'fullName', 'role'],  // columns to update on conflict
    ['username'],                    // conflict detection column
    toUserEntity,                    // mapper function
  );
}
```

### Performance Comparison

```typescript
// âŒ SLOW: Using save() - N queries (5000 queries for 5000 users)
for (const user of users) {
  await userRepository.save(user);
}

// âœ… FAST: Using bulkUpsert - 1 query
await userRepository.bulkUpsert(
  users,
  ['email', 'fullName', 'role'],
  ['username'],
  toUserEntity,
);
```

---

## 2. bulkInsert - Insert Many Records

### Use Case: Import books from CSV

```typescript
async importBooksFromCsv(books: Partial<BookEntity>[]) {
  // Insert all books at once
  await this.bookRepository.bulkInsert(books);
}

// With mapper
async importBooksWithMapper(bookDtos: CreateBookDto[]) {
  await this.bookRepository.bulkInsert(
    bookDtos,
    (dto) => ({
      title: dto.title,
      author: dto.author,
      isbn: dto.isbn,
      publishedYear: dto.publishedYear,
    }),
  );
}
```

---

## 3. bulkDeleteByIds - Delete Multiple Records

### Use Case: Delete multiple books

```typescript
async deleteMultipleBooks(bookIds: string[]) {
  const affected = await this.bookRepository.bulkDeleteByIds(bookIds);
  return { deleted: affected };
}

// With custom ID column
async deleteByIsbn(isbn: string[]) {
  const affected = await this.bookRepository.bulkDeleteByIds(isbn, 'isbn');
  return { deleted: affected };
}
```

---

## 4. bulkSoftDeleteByIds - Soft Delete Multiple Records

### Use Case: Archive old borrow records

```typescript
async archiveOldRecords(recordIds: string[]) {
  const affected = await this.borrowRecordRepository.bulkSoftDeleteByIds(recordIds);
  return { archived: affected };
}
```

**Note:** Only works if entity has `@DeleteDateColumn()` decorator.

---

## 5. bulkUpdateByIds - Update Multiple Records

### Use Case: Deactivate multiple users

```typescript
async deactivateUsers(userIds: string[]) {
  const affected = await this.userRepository.bulkUpdateByIds(
    userIds,
    { isActive: false },
  );
  return { deactivated: affected };
}

// Update multiple books' availability
async markBooksAsUnavailable(bookIds: string[]) {
  const affected = await this.bookRepository.bulkUpdateByIds(
    bookIds,
    { availableCopies: 0 },
  );
  return { updated: affected };
}
```

---

## 6. findByIds - Find Multiple Records

### Use Case: Get multiple users' details

```typescript
async getUsersByIds(userIds: string[]) {
  return await this.userRepository.findByIds(userIds);
}

// With custom ID column
async getBooksByIsbn(isbn: string[]) {
  return await this.bookRepository.findByIds(isbn, 'isbn');
}
```

---

## Complete Example: User Sync Service

```typescript
import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/database/repositories';
import { toUserEntity } from '../mappers/user.mapper';
import { UserProfileDto } from '../dto/user.dto';

@Injectable()
export class UserSyncService {
  constructor(private userRepository: UserRepository) {}

  async syncFromExternalApi(externalUsers: UserProfileDto[]) {
    // Step 1: Upsert all users (insert new, update existing)
    await this.userRepository.bulkUpsert(
      externalUsers,
      ['email', 'fullName', 'role'],
      ['username'],
      toUserEntity,
    );

    // Step 2: Get all synced usernames
    const syncedUsernames = externalUsers.map((u) => u.username);

    // Step 3: Find users not in external system and deactivate them
    const allUsers = await this.userRepository.find();
    const usersToDeactivate = allUsers
      .filter((user) => !syncedUsernames.includes(user.username))
      .map((user) => user.id);

    if (usersToDeactivate.length > 0) {
      await this.userRepository.bulkUpdateByIds(usersToDeactivate, {
        isActive: false,
      });
    }

    return {
      synced: externalUsers.length,
      deactivated: usersToDeactivate.length,
    };
  }
}
```

---

## Performance Benefits

| Operation          | Old Method                 | New Method                      | Performance Gain |
| ------------------ | -------------------------- | ------------------------------- | ---------------- |
| Insert 1000 users  | 1000 queries via `save()`  | 1 query via `bulkInsert()`      | ~100x faster     |
| Update 500 books   | 500 queries via `update()` | 1 query via `bulkUpdateByIds()` | ~50x faster      |
| Delete 200 records | 200 queries via `delete()` | 1 query via `bulkDeleteByIds()` | ~20x faster      |

---

## Best Practices

1. **Use bulk operations for > 10 records** - For small datasets, regular `save()` is fine
2. **Always provide a mapper** - Keep data transformation logic in mappers
3. **Check return values** - Methods return affected count for verification
4. **Handle empty arrays** - All methods handle empty arrays gracefully
5. **Use transactions** - For complex operations involving multiple bulk calls

```typescript
async complexBulkOperation(data: any[]) {
  await this.entityManager.transaction(async (transactionalEntityManager) => {
    const repo = transactionalEntityManager.getRepository(UserEntity);
    await repo.bulkInsert(data);
    // More operations...
  });
}
```
