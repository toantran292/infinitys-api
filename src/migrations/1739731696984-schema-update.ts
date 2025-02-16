import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1739731696984 implements MigrationInterface {
    name = 'SchemaUpdate1739731696984'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "pages" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "pages" ALTER COLUMN "content" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" ALTER COLUMN "content" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pages" ADD "url" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pages" ADD "address" character varying NOT NULL`);
    }

}
