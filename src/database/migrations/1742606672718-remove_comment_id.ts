import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveCommentId1742606672718 implements MigrationInterface {
    name = 'RemoveCommentId1742606672718'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment_statistics" DROP COLUMN "commentId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment_statistics" ADD "commentId" uuid`);
    }

}
