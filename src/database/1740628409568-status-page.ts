import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1740628409568 implements MigrationInterface {
	name = 'Migrations1740628409568';

	public async up(queryRunner: QueryRunner): Promise<void> {
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
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
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
	}
}
