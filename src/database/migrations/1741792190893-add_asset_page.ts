import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1741792190893 implements MigrationInterface {
	name = 'Migrations1741792190893';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "assets" ADD "user_id" uuid`);
		await queryRunner.query(`ALTER TABLE "assets" ADD "page_id" uuid`);
		await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "owner_id"`);
		await queryRunner.query(
			`ALTER TABLE "assets" ADD "owner_id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
		);
		await queryRunner.query(
			`ALTER TABLE "assets" ADD CONSTRAINT "FK_95e68ec694262926f1af7176a1e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "assets" ADD CONSTRAINT "FK_54452c549f3d3c399243aa5b66a" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "assets" DROP CONSTRAINT "FK_54452c549f3d3c399243aa5b66a"`,
		);
		await queryRunner.query(
			`ALTER TABLE "assets" DROP CONSTRAINT "FK_95e68ec694262926f1af7176a1e"`,
		);
		await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "owner_id"`);
		await queryRunner.query(
			`ALTER TABLE "assets" ADD "owner_id" character varying NOT NULL`,
		);
		await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "page_id"`);
		await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "user_id"`);
	}
}
