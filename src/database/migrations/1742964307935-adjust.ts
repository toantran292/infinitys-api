import { MigrationInterface, QueryRunner } from "typeorm";

export class Adjust1742964307935 implements MigrationInterface {
    name = 'Adjust1742964307935'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "problems" ADD "total_submissions" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "problems" ADD "total_accepted" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "problems" DROP COLUMN "total_accepted"`);
        await queryRunner.query(`ALTER TABLE "problems" DROP COLUMN "total_submissions"`);
    }

}
