import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLocation1742389058948 implements MigrationInterface {
	name = 'AddLocation1742389058948';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "recruitment_posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "active" boolean NOT NULL, "title" character varying NOT NULL, "job_position" character varying NOT NULL, "location" character varying NOT NULL, "work_type" character varying NOT NULL, "job_type" character varying NOT NULL, "description" text NOT NULL, "page_user_id" uuid, CONSTRAINT "PK_d38c8d3adff01b768dfd5250486" PRIMARY KEY ("id")); COMMENT ON COLUMN "recruitment_posts"."description" IS 'Markdown formatted text for job description'`,
		);
		await queryRunner.query(
			`CREATE TABLE "applications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "problem_finished_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid, "recruitment_post_id" uuid, CONSTRAINT "PK_938c0a27255637bde919591888f" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "applications_problems" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "application_id" uuid, "problem_id" uuid, CONSTRAINT "PK_53aa2b732f257029256057125fb" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "applications_problems_testcases" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_accepted" boolean NOT NULL, "application_problem_id" uuid, "testcase_id" uuid, CONSTRAINT "PK_6c9701eb3a87c719586ef70adb7" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "testcases" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "score" integer NOT NULL DEFAULT '0', "problem_id" uuid, CONSTRAINT "PK_25560eb2d0f98f583b26ee906ff" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "problems" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "content" character varying NOT NULL, "page_id" uuid, CONSTRAINT "PK_b3994afba6ab64a42cda1ccaeff" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "problems_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "problem_id" uuid, "user_id" uuid, CONSTRAINT "PK_6b893533ff3cf559e8b7a63f731" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "problems_users_testcases" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_accepted" boolean NOT NULL, "problem_user_id" uuid, "testcase_id" uuid, CONSTRAINT "PK_6ce59a2d0b4ca15e4e87c1177cc" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "problems_recruitment_posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "problem_id" uuid, "recruitment_post_id" uuid, CONSTRAINT "PK_ad955bc0d76bad986f0205035a7" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."pages_status_enum" AS ENUM('started', 'approved', 'rejected')`,
		);
		await queryRunner.query(
			`CREATE TABLE "pages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "content" character varying, "address" character varying NOT NULL, "url" character varying NOT NULL, "email" character varying NOT NULL, "status" "public"."pages_status_enum" NOT NULL DEFAULT 'started', CONSTRAINT "UQ_3edf1d1cf08691a0a432589ac93" UNIQUE ("email"), CONSTRAINT "PK_8f21ed625aa34c8391d636b7d3b" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_3edf1d1cf08691a0a432589ac9" ON "pages" ("email") `,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."pages_users_role_enum" AS ENUM('MEMBER', 'OPERATOR', 'ADMIN')`,
		);
		await queryRunner.query(
			`CREATE TABLE "pages_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "active" boolean NOT NULL DEFAULT true, "role" "public"."pages_users_role_enum" NOT NULL DEFAULT 'MEMBER', "start_date" date, "end_date" date, "page_id" uuid, "user_id" uuid, CONSTRAINT "PK_733d2c569fa8a65acfc63f5c454" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "content" text NOT NULL, "user_id" uuid, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "content" text NOT NULL, "author_id" uuid, "comments_id" uuid, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "reacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_active" boolean NOT NULL, "target_id" character varying NOT NULL, "target_type" character varying NOT NULL, "user_id" uuid, CONSTRAINT "PK_e9a4e287e70372a267d7f363a12" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_8c6f1e9c0baca179cd2edf14a5" ON "reacts" ("target_id", "target_type") `,
		);
		await queryRunner.query(
			`CREATE TABLE "group_chats" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_2850524c61524bab74e754a2335" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "group_chat_members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_admin" boolean NOT NULL, "group_chat_id" uuid, "user_id" uuid, CONSTRAINT "PK_bd8582df0cd3399e06dffeac53e" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "group_chat_messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "content" character varying NOT NULL, "group_chat_id" uuid, "user_id" uuid, CONSTRAINT "PK_c92640c08db1752043a7b77e97a" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "friends" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "source_id" uuid, "target_id" uuid, CONSTRAINT "PK_65e1b06a9f379ee5255054021e1" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "friends_requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_available" boolean NOT NULL DEFAULT true, "source_id" uuid, "target_id" uuid, CONSTRAINT "PK_44b734b20b071c5d930b63c9b3c" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."users_role_enum" AS ENUM('USER', 'ADMIN')`,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."users_gender_enum" AS ENUM('Male', 'Female')`,
		);
		await queryRunner.query(
			`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER', "email" character varying NOT NULL, "password" character varying NOT NULL, "date_of_birth" date, "gender" "public"."users_gender_enum", "major" character varying, "desired_job_position" character varying, "active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "follows" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "page_id" uuid, "user_id" uuid, CONSTRAINT "PK_8988f607744e16ff79da3b8a627" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "meta" jsonb NOT NULL DEFAULT '{}', "is_readed" boolean NOT NULL DEFAULT false, "user_id" uuid, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "assets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying NOT NULL, "owner_type" character varying NOT NULL, "owner_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "file_data" jsonb NOT NULL DEFAULT '{}', CONSTRAINT "PK_da96729a8b113377cfb6a62439c" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_ddb83c9599ff3fc19dfef0692c" ON "assets" ("owner_id", "type", "owner_type") `,
		);
		await queryRunner.query(
			`ALTER TABLE "recruitment_posts" ADD CONSTRAINT "FK_2a74bde895d01c06cb61456062e" FOREIGN KEY ("page_user_id") REFERENCES "pages_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "applications" ADD CONSTRAINT "FK_9e7594d5b474d9cbebba15c1ae7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "applications" ADD CONSTRAINT "FK_5a18e8914a1a55ae3be14764bd0" FOREIGN KEY ("recruitment_post_id") REFERENCES "recruitment_posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "applications_problems" ADD CONSTRAINT "FK_f2effc129801d702f1cde963896" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "applications_problems" ADD CONSTRAINT "FK_7d017d4fe48c00bacc849aaac12" FOREIGN KEY ("problem_id") REFERENCES "problems_recruitment_posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "applications_problems_testcases" ADD CONSTRAINT "FK_32ffc2e530a99ae7c86318af638" FOREIGN KEY ("application_problem_id") REFERENCES "applications_problems"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "applications_problems_testcases" ADD CONSTRAINT "FK_0b39f2f8fecb726cebf319a6ab9" FOREIGN KEY ("testcase_id") REFERENCES "testcases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "testcases" ADD CONSTRAINT "FK_0261feefe07a8ae77ea9a2b219b" FOREIGN KEY ("problem_id") REFERENCES "problems"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "problems" ADD CONSTRAINT "FK_d70540d9e2b2264909c84148825" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "problems_users" ADD CONSTRAINT "FK_6bf973a1955c5f27079f446155c" FOREIGN KEY ("problem_id") REFERENCES "problems"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "problems_users" ADD CONSTRAINT "FK_8776019c9132730ba3af6abe99b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "problems_users_testcases" ADD CONSTRAINT "FK_5bb69d5602f847e6846a036bef6" FOREIGN KEY ("problem_user_id") REFERENCES "problems_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "problems_users_testcases" ADD CONSTRAINT "FK_04cf53664c4c9be010f48d36cc1" FOREIGN KEY ("testcase_id") REFERENCES "testcases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "problems_recruitment_posts" ADD CONSTRAINT "FK_3cd0e939eeacc5e3944a29fff7b" FOREIGN KEY ("problem_id") REFERENCES "problems"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "problems_recruitment_posts" ADD CONSTRAINT "FK_c38fcf53c82ab17f72db6f748cd" FOREIGN KEY ("recruitment_post_id") REFERENCES "recruitment_posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "pages_users" ADD CONSTRAINT "FK_1d9fdc44c36ca56b4f81ca1bf14" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "pages_users" ADD CONSTRAINT "FK_020256cb575d3ff6302315630b6" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "comments" ADD CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "posts" ADD CONSTRAINT "FK_312c63be865c81b922e39c2475e" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "posts" ADD CONSTRAINT "FK_44e1259209788918353e6e9cf3e" FOREIGN KEY ("comments_id") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "reacts" ADD CONSTRAINT "FK_dfa61fb53fdd11941a52f05351e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "group_chat_members" ADD CONSTRAINT "FK_ca9a417b2418094a3e8ce22a2fd" FOREIGN KEY ("group_chat_id") REFERENCES "group_chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "group_chat_members" ADD CONSTRAINT "FK_d7aa348bcb7487c56107054b996" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "group_chat_messages" ADD CONSTRAINT "FK_500f385783f0188a5891036983d" FOREIGN KEY ("group_chat_id") REFERENCES "group_chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "group_chat_messages" ADD CONSTRAINT "FK_08c2c17bfecc16fa9c536618f5b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "friends" ADD CONSTRAINT "FK_23fac43a0543182b1f1bdd644c7" FOREIGN KEY ("source_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "friends" ADD CONSTRAINT "FK_7228831e05ab7a5a7bf260c5ce6" FOREIGN KEY ("target_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "friends_requests" ADD CONSTRAINT "FK_7914ec6460702eabeddbd9b77f8" FOREIGN KEY ("source_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "friends_requests" ADD CONSTRAINT "FK_e06dd257e072a8aa3c4299ec33e" FOREIGN KEY ("target_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "follows" ADD CONSTRAINT "FK_b7ce63a5ae8f154be7de989ea12" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "follows" ADD CONSTRAINT "FK_941d172275662c2b9d8b9f4270c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "notifications" ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"`,
		);
		await queryRunner.query(
			`ALTER TABLE "follows" DROP CONSTRAINT "FK_941d172275662c2b9d8b9f4270c"`,
		);
		await queryRunner.query(
			`ALTER TABLE "follows" DROP CONSTRAINT "FK_b7ce63a5ae8f154be7de989ea12"`,
		);
		await queryRunner.query(
			`ALTER TABLE "friends_requests" DROP CONSTRAINT "FK_e06dd257e072a8aa3c4299ec33e"`,
		);
		await queryRunner.query(
			`ALTER TABLE "friends_requests" DROP CONSTRAINT "FK_7914ec6460702eabeddbd9b77f8"`,
		);
		await queryRunner.query(
			`ALTER TABLE "friends" DROP CONSTRAINT "FK_7228831e05ab7a5a7bf260c5ce6"`,
		);
		await queryRunner.query(
			`ALTER TABLE "friends" DROP CONSTRAINT "FK_23fac43a0543182b1f1bdd644c7"`,
		);
		await queryRunner.query(
			`ALTER TABLE "group_chat_messages" DROP CONSTRAINT "FK_08c2c17bfecc16fa9c536618f5b"`,
		);
		await queryRunner.query(
			`ALTER TABLE "group_chat_messages" DROP CONSTRAINT "FK_500f385783f0188a5891036983d"`,
		);
		await queryRunner.query(
			`ALTER TABLE "group_chat_members" DROP CONSTRAINT "FK_d7aa348bcb7487c56107054b996"`,
		);
		await queryRunner.query(
			`ALTER TABLE "group_chat_members" DROP CONSTRAINT "FK_ca9a417b2418094a3e8ce22a2fd"`,
		);
		await queryRunner.query(
			`ALTER TABLE "reacts" DROP CONSTRAINT "FK_dfa61fb53fdd11941a52f05351e"`,
		);
		await queryRunner.query(
			`ALTER TABLE "posts" DROP CONSTRAINT "FK_44e1259209788918353e6e9cf3e"`,
		);
		await queryRunner.query(
			`ALTER TABLE "posts" DROP CONSTRAINT "FK_312c63be865c81b922e39c2475e"`,
		);
		await queryRunner.query(
			`ALTER TABLE "comments" DROP CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d"`,
		);
		await queryRunner.query(
			`ALTER TABLE "pages_users" DROP CONSTRAINT "FK_020256cb575d3ff6302315630b6"`,
		);
		await queryRunner.query(
			`ALTER TABLE "pages_users" DROP CONSTRAINT "FK_1d9fdc44c36ca56b4f81ca1bf14"`,
		);
		await queryRunner.query(
			`ALTER TABLE "problems_recruitment_posts" DROP CONSTRAINT "FK_c38fcf53c82ab17f72db6f748cd"`,
		);
		await queryRunner.query(
			`ALTER TABLE "problems_recruitment_posts" DROP CONSTRAINT "FK_3cd0e939eeacc5e3944a29fff7b"`,
		);
		await queryRunner.query(
			`ALTER TABLE "problems_users_testcases" DROP CONSTRAINT "FK_04cf53664c4c9be010f48d36cc1"`,
		);
		await queryRunner.query(
			`ALTER TABLE "problems_users_testcases" DROP CONSTRAINT "FK_5bb69d5602f847e6846a036bef6"`,
		);
		await queryRunner.query(
			`ALTER TABLE "problems_users" DROP CONSTRAINT "FK_8776019c9132730ba3af6abe99b"`,
		);
		await queryRunner.query(
			`ALTER TABLE "problems_users" DROP CONSTRAINT "FK_6bf973a1955c5f27079f446155c"`,
		);
		await queryRunner.query(
			`ALTER TABLE "problems" DROP CONSTRAINT "FK_d70540d9e2b2264909c84148825"`,
		);
		await queryRunner.query(
			`ALTER TABLE "testcases" DROP CONSTRAINT "FK_0261feefe07a8ae77ea9a2b219b"`,
		);
		await queryRunner.query(
			`ALTER TABLE "applications_problems_testcases" DROP CONSTRAINT "FK_0b39f2f8fecb726cebf319a6ab9"`,
		);
		await queryRunner.query(
			`ALTER TABLE "applications_problems_testcases" DROP CONSTRAINT "FK_32ffc2e530a99ae7c86318af638"`,
		);
		await queryRunner.query(
			`ALTER TABLE "applications_problems" DROP CONSTRAINT "FK_7d017d4fe48c00bacc849aaac12"`,
		);
		await queryRunner.query(
			`ALTER TABLE "applications_problems" DROP CONSTRAINT "FK_f2effc129801d702f1cde963896"`,
		);
		await queryRunner.query(
			`ALTER TABLE "applications" DROP CONSTRAINT "FK_5a18e8914a1a55ae3be14764bd0"`,
		);
		await queryRunner.query(
			`ALTER TABLE "applications" DROP CONSTRAINT "FK_9e7594d5b474d9cbebba15c1ae7"`,
		);
		await queryRunner.query(
			`ALTER TABLE "recruitment_posts" DROP CONSTRAINT "FK_2a74bde895d01c06cb61456062e"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_ddb83c9599ff3fc19dfef0692c"`,
		);
		await queryRunner.query(`DROP TABLE "assets"`);
		await queryRunner.query(`DROP TABLE "notifications"`);
		await queryRunner.query(`DROP TABLE "follows"`);
		await queryRunner.query(`DROP TABLE "users"`);
		await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`);
		await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
		await queryRunner.query(`DROP TABLE "friends_requests"`);
		await queryRunner.query(`DROP TABLE "friends"`);
		await queryRunner.query(`DROP TABLE "group_chat_messages"`);
		await queryRunner.query(`DROP TABLE "group_chat_members"`);
		await queryRunner.query(`DROP TABLE "group_chats"`);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_8c6f1e9c0baca179cd2edf14a5"`,
		);
		await queryRunner.query(`DROP TABLE "reacts"`);
		await queryRunner.query(`DROP TABLE "posts"`);
		await queryRunner.query(`DROP TABLE "comments"`);
		await queryRunner.query(`DROP TABLE "pages_users"`);
		await queryRunner.query(`DROP TYPE "public"."pages_users_role_enum"`);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_3edf1d1cf08691a0a432589ac9"`,
		);
		await queryRunner.query(`DROP TABLE "pages"`);
		await queryRunner.query(`DROP TYPE "public"."pages_status_enum"`);
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
