import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveRedudent1742045781959 implements MigrationInterface {
	name = 'RemoveRedudent1742045781959';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "assets" DROP CONSTRAINT "FK_95e68ec694262926f1af7176a1e"`,
		);
		await queryRunner.query(
			`ALTER TABLE "assets" DROP CONSTRAINT "FK_54452c549f3d3c399243aa5b66a"`,
		);
		await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "user_id"`);
		await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "page_id"`);
		await queryRunner.query(
			`CREATE TYPE "public"."pages_status_enum" AS ENUM('started', 'approved', 'rejected')`,
		);
		await queryRunner.query(
			`ALTER TABLE "pages" ADD "status" "public"."pages_status_enum" NOT NULL DEFAULT 'started'`,
		);
		await queryRunner.query(
			`ALTER TABLE "pages" ADD CONSTRAINT "UQ_3edf1d1cf08691a0a432589ac93" UNIQUE ("email")`,
		);
		await queryRunner.query(
			`ALTER TABLE "pages_users" ALTER COLUMN "active" SET DEFAULT true`,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_3edf1d1cf08691a0a432589ac9" ON "pages" ("email") `,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_ddb83c9599ff3fc19dfef0692c" ON "assets" ("owner_id", "type", "owner_type") `,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DROP INDEX "public"."IDX_ddb83c9599ff3fc19dfef0692c"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_3edf1d1cf08691a0a432589ac9"`,
		);
		await queryRunner.query(
			`ALTER TABLE "pages_users" ALTER COLUMN "active" DROP DEFAULT`,
		);
		await queryRunner.query(
			`ALTER TABLE "pages" DROP CONSTRAINT "UQ_3edf1d1cf08691a0a432589ac93"`,
		);
		await queryRunner.query(`ALTER TABLE "pages" DROP COLUMN "status"`);
		await queryRunner.query(`DROP TYPE "public"."pages_status_enum"`);
		await queryRunner.query(`ALTER TABLE "assets" ADD "page_id" uuid`);
		await queryRunner.query(`ALTER TABLE "assets" ADD "user_id" uuid`);
		await queryRunner.query(
			`ALTER TABLE "assets" ADD CONSTRAINT "FK_54452c549f3d3c399243aa5b66a" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "assets" ADD CONSTRAINT "FK_95e68ec694262926f1af7176a1e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}
}
