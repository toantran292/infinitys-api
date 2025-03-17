import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustReactEntity1742194935976 implements MigrationInterface {
    name = 'AdjustReactEntity1742194935976'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_8c6f1e9c0baca179cd2edf14a5"`);
        await queryRunner.query(`ALTER TABLE "reacts" DROP COLUMN "target_id"`);
        await queryRunner.query(`ALTER TABLE "reacts" ADD "target_id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_8c6f1e9c0baca179cd2edf14a5" ON "reacts" ("target_id", "target_type") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_8c6f1e9c0baca179cd2edf14a5"`);
        await queryRunner.query(`ALTER TABLE "reacts" DROP COLUMN "target_id"`);
        await queryRunner.query(`ALTER TABLE "reacts" ADD "target_id" character varying NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_8c6f1e9c0baca179cd2edf14a5" ON "reacts" ("target_id", "target_type") `);
    }

}
