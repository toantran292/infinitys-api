import { MigrationInterface, QueryRunner } from "typeorm";

export class Newfeeds1743082855969 implements MigrationInterface {
    name = 'Newfeeds1743082855969'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "newsfeed_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "post_id" uuid NOT NULL, "edge_rank" double precision NOT NULL DEFAULT '0', "is_seen" boolean NOT NULL DEFAULT false, "seen_at" TIMESTAMP, CONSTRAINT "PK_4409ed45558e2bf3240e8ae5431" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "friends" DROP CONSTRAINT "FK_23fac43a0543182b1f1bdd644c7"`);
        await queryRunner.query(`ALTER TABLE "friends" DROP CONSTRAINT "FK_7228831e05ab7a5a7bf260c5ce6"`);
        await queryRunner.query(`ALTER TABLE "friends" ALTER COLUMN "source_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "friends" ALTER COLUMN "source_id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "friends" ALTER COLUMN "target_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "friends" ALTER COLUMN "target_id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "friends" ADD CONSTRAINT "FK_23fac43a0543182b1f1bdd644c7" FOREIGN KEY ("source_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friends" ADD CONSTRAINT "FK_7228831e05ab7a5a7bf260c5ce6" FOREIGN KEY ("target_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "newsfeed_items" ADD CONSTRAINT "FK_6ddeade5fa5dce42aca7fe49183" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "newsfeed_items" ADD CONSTRAINT "FK_79f17e4754c592a2a4dee219538" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "newsfeed_items" DROP CONSTRAINT "FK_79f17e4754c592a2a4dee219538"`);
        await queryRunner.query(`ALTER TABLE "newsfeed_items" DROP CONSTRAINT "FK_6ddeade5fa5dce42aca7fe49183"`);
        await queryRunner.query(`ALTER TABLE "friends" DROP CONSTRAINT "FK_7228831e05ab7a5a7bf260c5ce6"`);
        await queryRunner.query(`ALTER TABLE "friends" DROP CONSTRAINT "FK_23fac43a0543182b1f1bdd644c7"`);
        await queryRunner.query(`ALTER TABLE "friends" ALTER COLUMN "target_id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "friends" ALTER COLUMN "target_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "friends" ALTER COLUMN "source_id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "friends" ALTER COLUMN "source_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "friends" ADD CONSTRAINT "FK_7228831e05ab7a5a7bf260c5ce6" FOREIGN KEY ("target_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friends" ADD CONSTRAINT "FK_23fac43a0543182b1f1bdd644c7" FOREIGN KEY ("source_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "newsfeed_items"`);
    }

}
