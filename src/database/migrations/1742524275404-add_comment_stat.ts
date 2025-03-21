import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCommentStat1742524275404 implements MigrationInterface {
    name = 'AddCommentStat1742524275404'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comment_statistics" ("comment_id" uuid NOT NULL, "react_count" integer NOT NULL DEFAULT '0', "commentId" uuid, CONSTRAINT "REL_2a7d2ee644c69167bb883296a4" UNIQUE ("commentId"), CONSTRAINT "PK_3bbda74aca343bbc36f039330cd" PRIMARY KEY ("comment_id"))`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "statistics_comment_id" uuid`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "UQ_6a8198b0a3bf6fd4584bc0932f8" UNIQUE ("statistics_comment_id")`);
        await queryRunner.query(`ALTER TABLE "comment_statistics" ADD CONSTRAINT "FK_2a7d2ee644c69167bb883296a46" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_6a8198b0a3bf6fd4584bc0932f8" FOREIGN KEY ("statistics_comment_id") REFERENCES "comment_statistics"("comment_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_6a8198b0a3bf6fd4584bc0932f8"`);
        await queryRunner.query(`ALTER TABLE "comment_statistics" DROP CONSTRAINT "FK_2a7d2ee644c69167bb883296a46"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "UQ_6a8198b0a3bf6fd4584bc0932f8"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "statistics_comment_id"`);
        await queryRunner.query(`DROP TABLE "comment_statistics"`);
    }

}
