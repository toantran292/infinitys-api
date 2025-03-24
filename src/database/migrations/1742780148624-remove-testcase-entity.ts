import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveTestcaseEntity1742780148624 implements MigrationInterface {
    name = 'RemoveTestcaseEntity1742780148624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "applications_problems" ADD "result" jsonb`);
        await queryRunner.query(`ALTER TABLE "problems_users" ADD "result" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "problems_users" DROP COLUMN "result"`);
        await queryRunner.query(`ALTER TABLE "applications_problems" DROP COLUMN "result"`);
    }

}
