import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCodeToProblemUser1742950349601 implements MigrationInterface {
    name = 'AddCodeToProblemUser1742950349601'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "problems_users" ADD "code" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "problems_users" DROP COLUMN "code"`);
    }

}
