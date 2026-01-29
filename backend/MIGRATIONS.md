# Database Migrations

โปรเจคนี้ใช้ TypeORM Migrations สำหรับจัดการ database schema

## Scripts ที่มีให้ใช้งาน

```bash
# สร้าง migration ใหม่ (empty template)
npm run typeorm -- migration:create src/database/migrations/<MigrationName>

# สร้าง migration จาก entities (auto-generate)
npm run migration:generate src/database/migrations/<MigrationName>

# รัน migrations ที่ยังไม่ได้รัน
npm run migration:run

# Revert migration ล่าสุด
npm run migration:revert
```

## โครงสร้างไฟล์

```
src/
├── config/
│   ├── database.config.ts    # Config สำหรับ NestJS
│   └── data-source.ts         # DataSource สำหรับ TypeORM CLI
├── database/
│   ├── entities/              # Entity definitions
│   │   ├── index.ts          # Export ทั้งหมด
│   │   ├── book.entity.ts
│   │   └── user.entity.ts
│   ├── repositories/         # Custom repositories
│   │   ├── index.ts
│   │   ├── book.repository.ts
│   │   └── user.repository.ts
│   ├── migrations/           # Migration files
│   │   └── 1769603663490-InitialSchema.ts
│   └── database.module.ts
```

## การเพิ่ม Entity ใหม่

1. สร้างไฟล์ entity ใหม่ใน `src/database/entities/`
2. Export entity ใน `src/database/entities/index.ts`
3. Generate migration:
   ```bash
   npm run migration:generate src/database/migrations/Add<EntityName>Table
   ```
4. รัน migration:
   ```bash
   npm run migration:run
   ```

## หมายเหตุ

- **synchronize** ถูกปิดไว้ (`false`) เพื่อใช้ migrations แทน
- อย่า commit migration ที่ยังไม่ได้ test
- ก่อน deploy production ต้อง backup database ก่อนเสมอ
- Migration ควรเป็น reversible (มี `down()` method ที่ทำงานได้)

## Production Deployment

```bash
# 1. Backup database
pg_dump -U library_user library_db > backup.sql

# 2. Run migrations
npm run migration:run

# 3. Verify
npm run typeorm -- migration:show -d src/config/data-source.ts
```
