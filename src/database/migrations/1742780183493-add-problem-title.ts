import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProblemTitle1742780183493 implements MigrationInterface {
    name = 'AddProblemTitle1742780183493'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "problems" ADD "title" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "problems" DROP COLUMN "title"`);
    }

}
