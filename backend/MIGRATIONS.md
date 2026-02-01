# Database Migrations

à¹‚à¸›à¸£à¹€à¸ˆà¸„à¸™à¸µà¹‰à¹ƒà¸Šà¹‰ TypeORM Migrations à¸ªà¸³à¸«à¸£à¸±à¸šà¸ˆà¸±à¸”à¸à¸²à¸£ database schema

## Scripts à¸—à¸µà¹ˆà¸¡à¸µà¹ƒà¸«à¹‰à¹ƒà¸Šà¹‰à¸‡à¸²à¸™

```bash
# à¸ªà¸£à¹‰à¸²à¸‡ migration à¹ƒà¸«à¸¡à¹ˆ (empty template)
npm run typeorm -- migration:create src/database/migrations/<MigrationName>

# à¸ªà¸£à¹‰à¸²à¸‡ migration à¸ˆà¸²à¸ entities (auto-generate)
npm run migration:generate src/database/migrations/<MigrationName>

# à¸£à¸±à¸™ migrations à¸—à¸µà¹ˆà¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¹„à¸”à¹‰à¸£à¸±à¸™
npm run migration:run

# Revert migration à¸¥à¹ˆà¸²à¸ªà¸¸à¸”
npm run migration:revert
```

## à¹‚à¸„à¸£à¸‡à¸ªà¸£à¹‰à¸²à¸‡à¹„à¸Ÿà¸¥à¹Œ

```
src/
â”œâ”€â”€ config/
â”‚   â”œâ”€â”€ database.config.ts    # Config à¸ªà¸³à¸«à¸£à¸±à¸š NestJS
â”‚   â””â”€â”€ data-source.ts         # DataSource à¸ªà¸³à¸«à¸£à¸±à¸š TypeORM CLI
â”œâ”€â”€ database/
â”‚   â”œâ”€â”€ entities/              # Entity definitions
â”‚   â”‚   â”œâ”€â”€ index.ts          # Export à¸—à¸±à¹‰à¸‡à¸«à¸¡à¸”
â”‚   â”‚   â”œâ”€â”€ book.entity.ts
â”‚   â”‚   â””â”€â”€ user.entity.ts
â”‚   â”œâ”€â”€ repositories/         # Custom repositories
â”‚   â”‚   â”œâ”€â”€ index.ts
â”‚   â”‚   â”œâ”€â”€ book.repository.ts
â”‚   â”‚   â””â”€â”€ user.repository.ts
â”‚   â”œâ”€â”€ migrations/           # Migration files
â”‚   â”‚   â””â”€â”€ 1769603663490-InitialSchema.ts
â”‚   â””â”€â”€ database.module.ts
```

## à¸à¸²à¸£à¹€à¸žà¸´à¹ˆà¸¡ Entity à¹ƒà¸«à¸¡à¹ˆ

1. à¸ªà¸£à¹‰à¸²à¸‡à¹„à¸Ÿà¸¥à¹Œ entity à¹ƒà¸«à¸¡à¹ˆà¹ƒà¸™ `src/database/entities/`
2. Export entity à¹ƒà¸™ `src/database/entities/index.ts`
3. Generate migration:
   ```bash
   npm run migration:generate src/database/migrations/Add<EntityName>Table
   ```
4. à¸£à¸±à¸™ migration:
   ```bash
   npm run migration:run
   ```

## à¸«à¸¡à¸²à¸¢à¹€à¸«à¸•à¸¸

- **synchronize** à¸–à¸¹à¸à¸›à¸´à¸”à¹„à¸§à¹‰ (`false`) à¹€à¸žà¸·à¹ˆà¸­à¹ƒà¸Šà¹‰ migrations à¹à¸—à¸™
- à¸­à¸¢à¹ˆà¸² commit migration à¸—à¸µà¹ˆà¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¹„à¸”à¹‰ test
- à¸à¹ˆà¸­à¸™ deploy production à¸•à¹‰à¸­à¸‡ backup database à¸à¹ˆà¸­à¸™à¹€à¸ªà¸¡à¸­
- Migration à¸„à¸§à¸£à¹€à¸›à¹‡à¸™ reversible (à¸¡à¸µ `down()` method à¸—à¸µà¹ˆà¸—à¸³à¸‡à¸²à¸™à¹„à¸”à¹‰)

## Production Deployment

```bash
# 1. Backup database
pg_dump -U library_user library_db > backup.sql

# 2. Run migrations
npm run migration:run

# 3. Verify
npm run typeorm -- migration:show -d src/config/data-source.ts
```
