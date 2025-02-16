import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1739457019673 implements MigrationInterface {
    name = 'SchemaUpdate1739457019673'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "active" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "active"`);
    }

}
