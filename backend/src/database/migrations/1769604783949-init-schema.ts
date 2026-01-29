import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1769604783949 implements MigrationInterface {
    name = 'InitSchema1769604783949'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "username" character varying(100) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying NOT NULL, "full_name" character varying(255), "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_fe0bb3f6520ee0469504521e71" ON "users" ("username") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE TABLE "books" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "title" character varying(255) NOT NULL, "author" character varying(255) NOT NULL, "isbn" character varying(20) NOT NULL, "publication_year" integer NOT NULL, "cover_image" character varying, "quantity" integer NOT NULL DEFAULT '1', "available_quantity" integer NOT NULL DEFAULT '1', "description" text, "version" integer NOT NULL, CONSTRAINT "PK_f3f2f25a099d24e12545b70b022" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3cd818eaf734a9d8814843f119" ON "books" ("title") `);
        await queryRunner.query(`CREATE INDEX "IDX_4675aad2c57a7a793d26afbae9" ON "books" ("author") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_54337dc30d9bb2c3fadebc6909" ON "books" ("isbn") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_54337dc30d9bb2c3fadebc6909"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4675aad2c57a7a793d26afbae9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3cd818eaf734a9d8814843f119"`);
        await queryRunner.query(`DROP TABLE "books"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fe0bb3f6520ee0469504521e71"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
