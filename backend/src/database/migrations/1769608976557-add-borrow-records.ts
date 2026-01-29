import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBorrowRecords1769608976557 implements MigrationInterface {
    name = 'AddBorrowRecords1769608976557'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."borrow_records_status_enum" AS ENUM('borrowed', 'returned', 'overdue')`);
        await queryRunner.query(`CREATE TABLE "borrow_records" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "book_id" uuid NOT NULL, "status" "public"."borrow_records_status_enum" NOT NULL DEFAULT 'borrowed', "borrowed_at" TIMESTAMP NOT NULL DEFAULT now(), "due_date" TIMESTAMP NOT NULL, "returned_at" TIMESTAMP, CONSTRAINT "PK_b403bf5f85354e7a86867585152" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a7a3485206681944a704936f13" ON "borrow_records" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_ffe42824c6619410ae86622542" ON "borrow_records" ("book_id") `);
        await queryRunner.query(`ALTER TABLE "borrow_records" ADD CONSTRAINT "FK_a7a3485206681944a704936f130" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "borrow_records" ADD CONSTRAINT "FK_ffe42824c6619410ae86622542a" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "borrow_records" DROP CONSTRAINT "FK_ffe42824c6619410ae86622542a"`);
        await queryRunner.query(`ALTER TABLE "borrow_records" DROP CONSTRAINT "FK_a7a3485206681944a704936f130"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ffe42824c6619410ae86622542"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a7a3485206681944a704936f13"`);
        await queryRunner.query(`DROP TABLE "borrow_records"`);
        await queryRunner.query(`DROP TYPE "public"."borrow_records_status_enum"`);
    }

}
