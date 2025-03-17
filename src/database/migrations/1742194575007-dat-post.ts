import { MigrationInterface, QueryRunner } from "typeorm";

export class DatPost1742194575007 implements MigrationInterface {
    name = 'DatPost1742194575007'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_44e1259209788918353e6e9cf3e"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "comments_id"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "post_id" uuid`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "post_id"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "comments_id" uuid`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_44e1259209788918353e6e9cf3e" FOREIGN KEY ("comments_id") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
