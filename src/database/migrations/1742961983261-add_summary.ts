import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSummary1742961983261 implements MigrationInterface {
    name = 'AddSummary1742961983261'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "problems_users" ADD "summary" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "problems_users" DROP COLUMN "summary"`);
    }

}
