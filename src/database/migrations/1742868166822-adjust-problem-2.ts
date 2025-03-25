import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustProblem21742868166822 implements MigrationInterface {
    name = 'AdjustProblem21742868166822'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "problems" RENAME COLUMN "example" TO "examples"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "problems" RENAME COLUMN "examples" TO "example"`);
    }

}
