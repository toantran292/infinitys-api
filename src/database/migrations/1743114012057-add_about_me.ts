import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAboutMe1743114012057 implements MigrationInterface {
    name = 'AddAboutMe1743114012057'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "about_me" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "about_me"`);
    }

}
