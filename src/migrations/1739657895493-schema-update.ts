import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1739657895493 implements MigrationInterface {
    name = 'SchemaUpdate1739657895493'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "targetId"`);
        await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "targetType"`);
        await queryRunner.query(`ALTER TABLE "assets" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "assets" ADD "owner_type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "assets" ADD "owner_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "assets" ADD "file_data" jsonb NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "file_data"`);
        await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "owner_id"`);
        await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "owner_type"`);
        await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "assets" ADD "targetType" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "assets" ADD "targetId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "assets" ADD "url" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "assets" ADD "name" character varying NOT NULL`);
    }

}
