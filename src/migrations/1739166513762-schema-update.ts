import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1739166513762 implements MigrationInterface {
	name = 'SchemaUpdate1739166513762';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "recruitment_posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "endDate" TIMESTAMP NOT NULL, "active" boolean NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "meta" jsonb NOT NULL, "problemStartDate" TIMESTAMP WITH TIME ZONE NOT NULL, "problemEndDate" TIMESTAMP WITH TIME ZONE NOT NULL, "pageUserId" uuid, CONSTRAINT "PK_d38c8d3adff01b768dfd5250486" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "applications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "problemFinishedAt" TIMESTAMP WITH TIME ZONE, "userId" uuid, "recruitmentPostId" uuid, CONSTRAINT "PK_938c0a27255637bde919591888f" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "applications_problems" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "applicationId" uuid, "problemId" uuid, CONSTRAINT "PK_53aa2b732f257029256057125fb" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "applications_problems_testcases" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isAccepted" boolean NOT NULL, "applicationProblemId" uuid, "testcaseId" uuid, CONSTRAINT "PK_6c9701eb3a87c719586ef70adb7" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "testcases" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "score" integer NOT NULL, "problemId" uuid, CONSTRAINT "PK_25560eb2d0f98f583b26ee906ff" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "problems" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "content" character varying NOT NULL, "pageId" uuid, CONSTRAINT "PK_b3994afba6ab64a42cda1ccaeff" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "problems_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "problemId" uuid, "userId" uuid, CONSTRAINT "PK_6b893533ff3cf559e8b7a63f731" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "problems_users_testcases" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isAccepted" boolean NOT NULL, "problemUserId" uuid, "testcaseId" uuid, CONSTRAINT "PK_6ce59a2d0b4ca15e4e87c1177cc" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "problems_recruitment_posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "problemId" uuid, "recruitmentPostId" uuid, CONSTRAINT "PK_ad955bc0d76bad986f0205035a7" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "pages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "content" character varying NOT NULL, CONSTRAINT "PK_8f21ed625aa34c8391d636b7d3b" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."pages_users_role_enum" AS ENUM('MEMBER', 'OPERATOR', 'ADMIN')`,
		);
		await queryRunner.query(
			`CREATE TABLE "pages_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "active" boolean NOT NULL, "role" "public"."pages_users_role_enum" NOT NULL DEFAULT 'MEMBER', "pageId" uuid, "userId" uuid, CONSTRAINT "PK_733d2c569fa8a65acfc63f5c454" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "content" text NOT NULL, "userId" uuid, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "content" text NOT NULL, "authorId" uuid, "commentsId" uuid, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "reacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isActive" boolean NOT NULL, "targetId" character varying NOT NULL, "targetType" character varying NOT NULL, "userId" uuid, CONSTRAINT "PK_e9a4e287e70372a267d7f363a12" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_60735a0fa029076a327a42f376" ON "reacts" ("targetId", "targetType") `,
		);
		await queryRunner.query(
			`CREATE TABLE "group_chats" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_2850524c61524bab74e754a2335" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "group_chat_members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isAdmin" boolean NOT NULL, "groupChatId" uuid, "userId" uuid, CONSTRAINT "PK_bd8582df0cd3399e06dffeac53e" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "group_chat_messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "content" character varying NOT NULL, "groupChatId" uuid, "userId" uuid, CONSTRAINT "PK_c92640c08db1752043a7b77e97a" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."users_role_enum" AS ENUM('USER', 'ADMIN')`,
		);
		await queryRunner.query(
			`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER', "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "follows" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "pageId" uuid, "userId" uuid, CONSTRAINT "PK_8988f607744e16ff79da3b8a627" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "assets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "url" character varying NOT NULL, "targetId" character varying NOT NULL, "targetType" character varying NOT NULL, CONSTRAINT "PK_da96729a8b113377cfb6a62439c" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`ALTER TABLE "recruitment_posts" ADD CONSTRAINT "FK_6c7bba92a275476c1531e6d0e3b" FOREIGN KEY ("pageUserId") REFERENCES "pages_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "applications" ADD CONSTRAINT "FK_90ad8bec24861de0180f638b9cc" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "applications" ADD CONSTRAINT "FK_acc7fc39c7367b60eab73533845" FOREIGN KEY ("recruitmentPostId") REFERENCES "recruitment_posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "applications_problems" ADD CONSTRAINT "FK_abee30461be4e9ef8f16d6a0659" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "applications_problems" ADD CONSTRAINT "FK_e9cc1fa9d2d112ac1371860a564" FOREIGN KEY ("problemId") REFERENCES "problems_recruitment_posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "applications_problems_testcases" ADD CONSTRAINT "FK_ca276c87e73c85ffc8acff46c62" FOREIGN KEY ("applicationProblemId") REFERENCES "applications_problems"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "applications_problems_testcases" ADD CONSTRAINT "FK_d901092520c5918f07a392064d9" FOREIGN KEY ("testcaseId") REFERENCES "testcases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "testcases" ADD CONSTRAINT "FK_5ddd91fa9b1c308a8ae01771691" FOREIGN KEY ("problemId") REFERENCES "problems"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "problems" ADD CONSTRAINT "FK_07ef20d7dcc12ffdeeab24f6005" FOREIGN KEY ("pageId") REFERENCES "pages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "problems_users" ADD CONSTRAINT "FK_bca03547c75c64ba108d382dc5a" FOREIGN KEY ("problemId") REFERENCES "problems"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "problems_users" ADD CONSTRAINT "FK_f469beaa7e311c862e862a6a721" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "problems_users_testcases" ADD CONSTRAINT "FK_5bdd4c53f578e660be4a088bfd1" FOREIGN KEY ("problemUserId") REFERENCES "problems_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "problems_users_testcases" ADD CONSTRAINT "FK_4620949f848a3d9d8f764e5c929" FOREIGN KEY ("testcaseId") REFERENCES "testcases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "problems_recruitment_posts" ADD CONSTRAINT "FK_772993edc4079662819d543e702" FOREIGN KEY ("problemId") REFERENCES "problems"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "problems_recruitment_posts" ADD CONSTRAINT "FK_70760d5ded4e1964ea51bdf5f12" FOREIGN KEY ("recruitmentPostId") REFERENCES "recruitment_posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "pages_users" ADD CONSTRAINT "FK_b9e52df14e127f3d5a2bc2c668a" FOREIGN KEY ("pageId") REFERENCES "pages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "pages_users" ADD CONSTRAINT "FK_f21e8bdd33fb54b397a4c1ba434" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "comments" ADD CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "posts" ADD CONSTRAINT "FK_c5a322ad12a7bf95460c958e80e" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "posts" ADD CONSTRAINT "FK_4413d216289808afda0de2bdfd4" FOREIGN KEY ("commentsId") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "reacts" ADD CONSTRAINT "FK_2f601a6e7d63a573da728d0a2e9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "group_chat_members" ADD CONSTRAINT "FK_3e10d1fa41e9acc7e9faf56bc1c" FOREIGN KEY ("groupChatId") REFERENCES "group_chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "group_chat_members" ADD CONSTRAINT "FK_06e6f5c3a52a413657ee2f229f6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "group_chat_messages" ADD CONSTRAINT "FK_591f0505b79f756be2b6f2b9738" FOREIGN KEY ("groupChatId") REFERENCES "group_chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "group_chat_messages" ADD CONSTRAINT "FK_e51e4708e5f35fd051b2f68e5ba" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "follows" ADD CONSTRAINT "FK_51f11e87e4dbc628d11a6543e70" FOREIGN KEY ("pageId") REFERENCES "pages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "follows" ADD CONSTRAINT "FK_eeb492da6894abf2e0acceb53f2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "follows" DROP CONSTRAINT "FK_eeb492da6894abf2e0acceb53f2"`,
		);
		await queryRunner.query(
			`ALTER TABLE "follows" DROP CONSTRAINT "FK_51f11e87e4dbc628d11a6543e70"`,
		);
		await queryRunner.query(
			`ALTER TABLE "group_chat_messages" DROP CONSTRAINT "FK_e51e4708e5f35fd051b2f68e5ba"`,
		);
		await queryRunner.query(
			`ALTER TABLE "group_chat_messages" DROP CONSTRAINT "FK_591f0505b79f756be2b6f2b9738"`,
		);
		await queryRunner.query(
			`ALTER TABLE "group_chat_members" DROP CONSTRAINT "FK_06e6f5c3a52a413657ee2f229f6"`,
		);
		await queryRunner.query(
			`ALTER TABLE "group_chat_members" DROP CONSTRAINT "FK_3e10d1fa41e9acc7e9faf56bc1c"`,
		);
		await queryRunner.query(
			`ALTER TABLE "reacts" DROP CONSTRAINT "FK_2f601a6e7d63a573da728d0a2e9"`,
		);
		await queryRunner.query(
			`ALTER TABLE "posts" DROP CONSTRAINT "FK_4413d216289808afda0de2bdfd4"`,
		);
		await queryRunner.query(
			`ALTER TABLE "posts" DROP CONSTRAINT "FK_c5a322ad12a7bf95460c958e80e"`,
		);
		await queryRunner.query(
			`ALTER TABLE "comments" DROP CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749"`,
		);
		await queryRunner.query(
			`ALTER TABLE "pages_users" DROP CONSTRAINT "FK_f21e8bdd33fb54b397a4c1ba434"`,
		);
		await queryRunner.query(
			`ALTER TABLE "pages_users" DROP CONSTRAINT "FK_b9e52df14e127f3d5a2bc2c668a"`,
		);
		await queryRunner.query(
			`ALTER TABLE "problems_recruitment_posts" DROP CONSTRAINT "FK_70760d5ded4e1964ea51bdf5f12"`,
		);
		await queryRunner.query(
			`ALTER TABLE "problems_recruitment_posts" DROP CONSTRAINT "FK_772993edc4079662819d543e702"`,
		);
		await queryRunner.query(
			`ALTER TABLE "problems_users_testcases" DROP CONSTRAINT "FK_4620949f848a3d9d8f764e5c929"`,
		);
		await queryRunner.query(
			`ALTER TABLE "problems_users_testcases" DROP CONSTRAINT "FK_5bdd4c53f578e660be4a088bfd1"`,
		);
		await queryRunner.query(
			`ALTER TABLE "problems_users" DROP CONSTRAINT "FK_f469beaa7e311c862e862a6a721"`,
		);
		await queryRunner.query(
			`ALTER TABLE "problems_users" DROP CONSTRAINT "FK_bca03547c75c64ba108d382dc5a"`,
		);
		await queryRunner.query(
			`ALTER TABLE "problems" DROP CONSTRAINT "FK_07ef20d7dcc12ffdeeab24f6005"`,
		);
		await queryRunner.query(
			`ALTER TABLE "testcases" DROP CONSTRAINT "FK_5ddd91fa9b1c308a8ae01771691"`,
		);
		await queryRunner.query(
			`ALTER TABLE "applications_problems_testcases" DROP CONSTRAINT "FK_d901092520c5918f07a392064d9"`,
		);
		await queryRunner.query(
			`ALTER TABLE "applications_problems_testcases" DROP CONSTRAINT "FK_ca276c87e73c85ffc8acff46c62"`,
		);
		await queryRunner.query(
			`ALTER TABLE "applications_problems" DROP CONSTRAINT "FK_e9cc1fa9d2d112ac1371860a564"`,
		);
		await queryRunner.query(
			`ALTER TABLE "applications_problems" DROP CONSTRAINT "FK_abee30461be4e9ef8f16d6a0659"`,
		);
		await queryRunner.query(
			`ALTER TABLE "applications" DROP CONSTRAINT "FK_acc7fc39c7367b60eab73533845"`,
		);
		await queryRunner.query(
			`ALTER TABLE "applications" DROP CONSTRAINT "FK_90ad8bec24861de0180f638b9cc"`,
		);
		await queryRunner.query(
			`ALTER TABLE "recruitment_posts" DROP CONSTRAINT "FK_6c7bba92a275476c1531e6d0e3b"`,
		);
		await queryRunner.query(`DROP TABLE "assets"`);
		await queryRunner.query(`DROP TABLE "follows"`);
		await queryRunner.query(`DROP TABLE "users"`);
		await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
		await queryRunner.query(`DROP TABLE "group_chat_messages"`);
		await queryRunner.query(`DROP TABLE "group_chat_members"`);
		await queryRunner.query(`DROP TABLE "group_chats"`);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_60735a0fa029076a327a42f376"`,
		);
		await queryRunner.query(`DROP TABLE "reacts"`);
		await queryRunner.query(`DROP TABLE "posts"`);
		await queryRunner.query(`DROP TABLE "comments"`);
		await queryRunner.query(`DROP TABLE "pages_users"`);
		await queryRunner.query(`DROP TYPE "public"."pages_users_role_enum"`);
		await queryRunner.query(`DROP TABLE "pages"`);
		await queryRunner.query(`DROP TABLE "problems_recruitment_posts"`);
		await queryRunner.query(`DROP TABLE "problems_users_testcases"`);
		await queryRunner.query(`DROP TABLE "problems_users"`);
		await queryRunner.query(`DROP TABLE "problems"`);
		await queryRunner.query(`DROP TABLE "testcases"`);
		await queryRunner.query(`DROP TABLE "applications_problems_testcases"`);
		await queryRunner.query(`DROP TABLE "applications_problems"`);
		await queryRunner.query(`DROP TABLE "applications"`);
		await queryRunner.query(`DROP TABLE "recruitment_posts"`);
	}
}
