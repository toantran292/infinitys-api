import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPostCounts1742197760873 implements MigrationInterface {
    name = 'AddPostCounts1742197760873';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "posts" ADD "comment_count" integer NOT NULL DEFAULT '0'`,
        );
        await queryRunner.query(
            `ALTER TABLE "posts" ADD "react_count" integer NOT NULL DEFAULT '0'`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "react_count"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "comment_count"`);
    }
} 