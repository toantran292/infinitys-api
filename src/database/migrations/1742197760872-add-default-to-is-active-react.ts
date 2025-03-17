import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDefaultToIsActiveReact1742197760872 implements MigrationInterface {
    name = 'AddDefaultToIsActiveReact1742197760872'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reacts" ALTER COLUMN "is_active" SET DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reacts" ALTER COLUMN "is_active" DROP DEFAULT`);
    }

}
