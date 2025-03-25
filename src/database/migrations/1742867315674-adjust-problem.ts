import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustProblem1742867315674 implements MigrationInterface {
    name = 'AdjustProblem1742867315674'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."problems_difficulty_enum" AS ENUM('easy', 'medium', 'hard')`);
        await queryRunner.query(`ALTER TABLE "problems" ADD "difficulty" "public"."problems_difficulty_enum" NOT NULL DEFAULT 'easy'`);
        await queryRunner.query(`ALTER TABLE "problems" ADD "time_limit" integer NOT NULL DEFAULT '1000'`);
        await queryRunner.query(`ALTER TABLE "problems" ADD "memory_limit" integer NOT NULL DEFAULT '1024'`);
        await queryRunner.query(`ALTER TABLE "problems" ADD "example" jsonb`);
        await queryRunner.query(`ALTER TABLE "problems" ADD "constraints" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "problems" DROP COLUMN "constraints"`);
        await queryRunner.query(`ALTER TABLE "problems" DROP COLUMN "example"`);
        await queryRunner.query(`ALTER TABLE "problems" DROP COLUMN "memory_limit"`);
        await queryRunner.query(`ALTER TABLE "problems" DROP COLUMN "time_limit"`);
        await queryRunner.query(`ALTER TABLE "problems" DROP COLUMN "difficulty"`);
        await queryRunner.query(`DROP TYPE "public"."problems_difficulty_enum"`);
    }

}
