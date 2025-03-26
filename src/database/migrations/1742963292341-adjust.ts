import { MigrationInterface, QueryRunner } from "typeorm";

export class Adjust1742963292341 implements MigrationInterface {
    name = 'Adjust1742963292341'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "submissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying NOT NULL, "result" jsonb, "summary" jsonb, "problem_id" uuid, "user_id" uuid, CONSTRAINT "PK_10b3be95b8b2fb1e482e07d706b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "submission_summaries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "total" integer NOT NULL DEFAULT '0', "accepted" integer NOT NULL DEFAULT '0', "wrong_answer" integer NOT NULL DEFAULT '0', "time_limit_exceeded" integer NOT NULL DEFAULT '0', "runtime_error" integer NOT NULL DEFAULT '0', "compilation_error" integer NOT NULL DEFAULT '0', "best_runtime" double precision NOT NULL DEFAULT '0', "best_memory" double precision NOT NULL DEFAULT '0', "problem_id" uuid, "user_id" uuid, CONSTRAINT "PK_6ae4796948ea0982cd53a935d1f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e8e6fa42e21fec0666516da3ba" ON "submission_summaries" ("problem_id", "user_id") `);
        await queryRunner.query(`ALTER TABLE "submissions" ADD CONSTRAINT "FK_d7613a2172f2115adb054c4c16e" FOREIGN KEY ("problem_id") REFERENCES "problems"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "submissions" ADD CONSTRAINT "FK_fca12c4ddd646dea4572c6815a9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "submission_summaries" ADD CONSTRAINT "FK_1be72d96bb9effa453ce20c70a6" FOREIGN KEY ("problem_id") REFERENCES "problems"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "submission_summaries" ADD CONSTRAINT "FK_08cab0ea6b9780ed12b5fcce2b6" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "submission_summaries" DROP CONSTRAINT "FK_08cab0ea6b9780ed12b5fcce2b6"`);
        await queryRunner.query(`ALTER TABLE "submission_summaries" DROP CONSTRAINT "FK_1be72d96bb9effa453ce20c70a6"`);
        await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "FK_fca12c4ddd646dea4572c6815a9"`);
        await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "FK_d7613a2172f2115adb054c4c16e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e8e6fa42e21fec0666516da3ba"`);
        await queryRunner.query(`DROP TABLE "submission_summaries"`);
        await queryRunner.query(`DROP TABLE "submissions"`);
    }

}
