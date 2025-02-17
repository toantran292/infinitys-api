import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1739792443805 implements MigrationInterface {
    name = 'SchemaUpdate1739792443805'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "friends" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "sourceId" uuid, "targetId" uuid, CONSTRAINT "PK_65e1b06a9f379ee5255054021e1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "friends_requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "is_available" boolean NOT NULL DEFAULT true, "sourceId" uuid, "targetId" uuid, CONSTRAINT "PK_44b734b20b071c5d930b63c9b3c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "friends" ADD CONSTRAINT "FK_ea0679a1b610875f9a45c3edcfb" FOREIGN KEY ("sourceId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friends" ADD CONSTRAINT "FK_fb7070d5a1a1d0c893373f1032d" FOREIGN KEY ("targetId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friends_requests" ADD CONSTRAINT "FK_2e28325b731413ca77da7e3947e" FOREIGN KEY ("sourceId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friends_requests" ADD CONSTRAINT "FK_18a4c1f79eedcba46cd9bbbc952" FOREIGN KEY ("targetId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "friends_requests" DROP CONSTRAINT "FK_18a4c1f79eedcba46cd9bbbc952"`);
        await queryRunner.query(`ALTER TABLE "friends_requests" DROP CONSTRAINT "FK_2e28325b731413ca77da7e3947e"`);
        await queryRunner.query(`ALTER TABLE "friends" DROP CONSTRAINT "FK_fb7070d5a1a1d0c893373f1032d"`);
        await queryRunner.query(`ALTER TABLE "friends" DROP CONSTRAINT "FK_ea0679a1b610875f9a45c3edcfb"`);
        await queryRunner.query(`DROP TABLE "friends_requests"`);
        await queryRunner.query(`DROP TABLE "friends"`);
    }

}
