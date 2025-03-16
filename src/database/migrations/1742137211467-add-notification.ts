import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNotification1742137211467 implements MigrationInterface {
    name = 'AddNotification1742137211467'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "meta" jsonb NOT NULL DEFAULT '{}', "is_readed" boolean NOT NULL DEFAULT false, "user_id" uuid, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "pages_users" ADD "start_date" date`);
        await queryRunner.query(`ALTER TABLE "pages_users" ADD "end_date" date`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"`);
        await queryRunner.query(`ALTER TABLE "pages_users" DROP COLUMN "end_date"`);
        await queryRunner.query(`ALTER TABLE "pages_users" DROP COLUMN "start_date"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
    }

}
