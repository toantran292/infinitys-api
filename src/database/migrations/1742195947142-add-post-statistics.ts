import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPostStatistics1742195947142 implements MigrationInterface {
    name = 'AddPostStatistics1742195947142'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "post_statistics" ("post_id" uuid NOT NULL, "comment_count" integer NOT NULL DEFAULT '0', "react_count" integer NOT NULL DEFAULT '0', "postId" uuid, CONSTRAINT "REL_8b47cd0a72b1d2161efedbde4a" UNIQUE ("postId"), CONSTRAINT "PK_ac42035005eced3155c787015fe" PRIMARY KEY ("post_id"))`);
        await queryRunner.query(`ALTER TABLE "post_statistics" ADD CONSTRAINT "FK_8b47cd0a72b1d2161efedbde4ab" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_statistics" DROP CONSTRAINT "FK_8b47cd0a72b1d2161efedbde4ab"`);
        await queryRunner.query(`DROP TABLE "post_statistics"`);
    }

}
