import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStat1742511900588 implements MigrationInterface {
    name = 'AddStat1742511900588'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_statistics" DROP CONSTRAINT "FK_8b47cd0a72b1d2161efedbde4ab"`);
        await queryRunner.query(`ALTER TABLE "pages_users" DROP COLUMN "start_date"`);
        await queryRunner.query(`ALTER TABLE "pages_users" DROP COLUMN "end_date"`);
        await queryRunner.query(`ALTER TABLE "post_statistics" DROP CONSTRAINT "REL_8b47cd0a72b1d2161efedbde4a"`);
        await queryRunner.query(`ALTER TABLE "post_statistics" DROP COLUMN "postId"`);
        await queryRunner.query(`ALTER TABLE "post_statistics" ADD CONSTRAINT "FK_ac42035005eced3155c787015fe" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_statistics" DROP CONSTRAINT "FK_ac42035005eced3155c787015fe"`);
        await queryRunner.query(`ALTER TABLE "post_statistics" ADD "postId" uuid`);
        await queryRunner.query(`ALTER TABLE "post_statistics" ADD CONSTRAINT "REL_8b47cd0a72b1d2161efedbde4a" UNIQUE ("postId")`);
        await queryRunner.query(`ALTER TABLE "pages_users" ADD "end_date" date`);
        await queryRunner.query(`ALTER TABLE "pages_users" ADD "start_date" date`);
        await queryRunner.query(`ALTER TABLE "post_statistics" ADD CONSTRAINT "FK_8b47cd0a72b1d2161efedbde4ab" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
