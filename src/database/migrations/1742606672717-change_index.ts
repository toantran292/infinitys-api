import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeIndex1742606672717 implements MigrationInterface {
    name = 'ChangeIndex1742606672717'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_8c6f1e9c0baca179cd2edf14a5"`);
        await queryRunner.query(`ALTER TABLE "reacts" DROP CONSTRAINT "FK_dfa61fb53fdd11941a52f05351e"`);
        await queryRunner.query(`ALTER TABLE "reacts" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_d95caa497b2292c730dd45d900" ON "reacts" ("target_id", "target_type", "user_id") `);
        await queryRunner.query(`ALTER TABLE "reacts" ADD CONSTRAINT "FK_dfa61fb53fdd11941a52f05351e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reacts" DROP CONSTRAINT "FK_dfa61fb53fdd11941a52f05351e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d95caa497b2292c730dd45d900"`);
        await queryRunner.query(`ALTER TABLE "reacts" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reacts" ADD CONSTRAINT "FK_dfa61fb53fdd11941a52f05351e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_8c6f1e9c0baca179cd2edf14a5" ON "reacts" ("target_type", "target_id") `);
    }

}
