import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustApplication21742660169842 implements MigrationInterface {
    name = 'AdjustApplication21742660169842'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "FK_9e7594d5b474d9cbebba15c1ae7"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "FK_5a18e8914a1a55ae3be14764bd0"`);
        await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "user_id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "recruitment_post_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "recruitment_post_id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_18a836fd4614ea6282418239fa" ON "applications" ("user_id", "recruitment_post_id") `);
        await queryRunner.query(`ALTER TABLE "applications" ADD CONSTRAINT "FK_9e7594d5b474d9cbebba15c1ae7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "applications" ADD CONSTRAINT "FK_5a18e8914a1a55ae3be14764bd0" FOREIGN KEY ("recruitment_post_id") REFERENCES "recruitment_posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "FK_5a18e8914a1a55ae3be14764bd0"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "FK_9e7594d5b474d9cbebba15c1ae7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_18a836fd4614ea6282418239fa"`);
        await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "recruitment_post_id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "recruitment_post_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "user_id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "applications" ADD CONSTRAINT "FK_5a18e8914a1a55ae3be14764bd0" FOREIGN KEY ("recruitment_post_id") REFERENCES "recruitment_posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "applications" ADD CONSTRAINT "FK_9e7594d5b474d9cbebba15c1ae7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
