import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1739704499598 implements MigrationInterface {
    name = 'SchemaUpdate1739704499598'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" ALTER COLUMN "content" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" ALTER COLUMN "content" SET NOT NULL`);
    }

}
