import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustRecruitmentPosts1741936690504 implements MigrationInterface {
    name = 'AdjustRecruitmentPosts1741936690504'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recruitment_posts" RENAME COLUMN "address" TO "location"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recruitment_posts" RENAME COLUMN "location" TO "address"`);
    }

}
