import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1739624315290 implements MigrationInterface {
    name = 'SchemaUpdate1739624315290'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "dateOfBirth" date`);
        await queryRunner.query(`CREATE TYPE "public"."users_gender_enum" AS ENUM('Male', 'Female')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "gender" "public"."users_gender_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "major" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "desiredJobPosition" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "desiredJobPosition"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "major"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "gender"`);
        await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "dateOfBirth"`);
    }

}
