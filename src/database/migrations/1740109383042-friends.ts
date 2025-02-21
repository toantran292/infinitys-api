import { MigrationInterface, QueryRunner } from "typeorm";

export class Friends1740109383042 implements MigrationInterface {
    name = 'Friends1740109383042'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "friends" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "source_id" uuid, "target_id" uuid, CONSTRAINT "PK_65e1b06a9f379ee5255054021e1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "friends_requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_available" boolean NOT NULL DEFAULT true, "source_id" uuid, "target_id" uuid, CONSTRAINT "PK_44b734b20b071c5d930b63c9b3c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "friends" ADD CONSTRAINT "FK_23fac43a0543182b1f1bdd644c7" FOREIGN KEY ("source_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friends" ADD CONSTRAINT "FK_7228831e05ab7a5a7bf260c5ce6" FOREIGN KEY ("target_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friends_requests" ADD CONSTRAINT "FK_7914ec6460702eabeddbd9b77f8" FOREIGN KEY ("source_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friends_requests" ADD CONSTRAINT "FK_e06dd257e072a8aa3c4299ec33e" FOREIGN KEY ("target_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "friends_requests" DROP CONSTRAINT "FK_e06dd257e072a8aa3c4299ec33e"`);
        await queryRunner.query(`ALTER TABLE "friends_requests" DROP CONSTRAINT "FK_7914ec6460702eabeddbd9b77f8"`);
        await queryRunner.query(`ALTER TABLE "friends" DROP CONSTRAINT "FK_7228831e05ab7a5a7bf260c5ce6"`);
        await queryRunner.query(`ALTER TABLE "friends" DROP CONSTRAINT "FK_23fac43a0543182b1f1bdd644c7"`);
        await queryRunner.query(`DROP TABLE "friends_requests"`);
        await queryRunner.query(`DROP TABLE "friends"`);
    }

}
