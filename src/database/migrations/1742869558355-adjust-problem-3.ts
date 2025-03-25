import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustProblem31742869558355 implements MigrationInterface {
    name = 'AdjustProblem31742869558355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "problems" ALTER COLUMN "memory_limit" SET DEFAULT '262144'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "problems" ALTER COLUMN "memory_limit" SET DEFAULT '1024'`);
    }

}
