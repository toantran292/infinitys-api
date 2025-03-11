import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustTypeOfOwnerId1740672993378 implements MigrationInterface {
    name = 'AdjustTypeOfOwnerId1740672993378'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "owner_id"`);
        await queryRunner.query(`ALTER TABLE "assets" ADD "owner_id" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "owner_id"`);
        await queryRunner.query(`ALTER TABLE "assets" ADD "owner_id" integer NOT NULL`);
    }

}
