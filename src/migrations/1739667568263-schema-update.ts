import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1739667568263 implements MigrationInterface {
    name = 'SchemaUpdate1739667568263'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" ADD "address" character varying NOT NULL DEFAULT 'Unknown'`);
        await queryRunner.query(`ALTER TABLE "pages" ADD "url" character varying NOT NULL DEFAULT 'http://example.com'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "pages" DROP COLUMN "address"`);
    }

}
