import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1739163915739 implements MigrationInterface {
    name = 'SchemaUpdate1739163915739'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "applications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "recruitmentPostId" uuid, CONSTRAINT "PK_938c0a27255637bde919591888f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recruitment_posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "endDate" TIMESTAMP NOT NULL, "active" boolean NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "meta" jsonb NOT NULL, "pageUserId" uuid, CONSTRAINT "PK_d38c8d3adff01b768dfd5250486" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "follows" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "pageId" uuid, "userId" uuid, CONSTRAINT "PK_8988f607744e16ff79da3b8a627" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "assets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "url" character varying NOT NULL, "targetId" character varying NOT NULL, "targetType" character varying NOT NULL, CONSTRAINT "PK_da96729a8b113377cfb6a62439c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "pages_users" ADD "active" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "applications" ADD CONSTRAINT "FK_90ad8bec24861de0180f638b9cc" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "applications" ADD CONSTRAINT "FK_acc7fc39c7367b60eab73533845" FOREIGN KEY ("recruitmentPostId") REFERENCES "recruitment_posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recruitment_posts" ADD CONSTRAINT "FK_6c7bba92a275476c1531e6d0e3b" FOREIGN KEY ("pageUserId") REFERENCES "pages_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "FK_51f11e87e4dbc628d11a6543e70" FOREIGN KEY ("pageId") REFERENCES "pages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "FK_eeb492da6894abf2e0acceb53f2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "FK_eeb492da6894abf2e0acceb53f2"`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "FK_51f11e87e4dbc628d11a6543e70"`);
        await queryRunner.query(`ALTER TABLE "recruitment_posts" DROP CONSTRAINT "FK_6c7bba92a275476c1531e6d0e3b"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "FK_acc7fc39c7367b60eab73533845"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "FK_90ad8bec24861de0180f638b9cc"`);
        await queryRunner.query(`ALTER TABLE "pages_users" DROP COLUMN "active"`);
        await queryRunner.query(`DROP TABLE "assets"`);
        await queryRunner.query(`DROP TABLE "follows"`);
        await queryRunner.query(`DROP TABLE "recruitment_posts"`);
        await queryRunner.query(`DROP TABLE "applications"`);
    }

}
