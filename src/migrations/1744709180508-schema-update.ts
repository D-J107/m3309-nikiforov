import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1744709180508 implements MigrationInterface {
    name = 'SchemaUpdate1744709180508'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "balance" integer NOT NULL DEFAULT '3000'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "balance"`);
    }

}
