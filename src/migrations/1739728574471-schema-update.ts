import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1739728574471 implements MigrationInterface {
    name = 'SchemaUpdate1739728574471'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" ALTER COLUMN "address" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "pages" ALTER COLUMN "url" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" ALTER COLUMN "url" SET DEFAULT 'http://example.com'`);
        await queryRunner.query(`ALTER TABLE "pages" ALTER COLUMN "address" SET DEFAULT 'Unknown'`);
    }

}
