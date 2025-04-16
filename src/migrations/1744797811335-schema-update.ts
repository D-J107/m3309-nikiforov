import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1744797811335 implements MigrationInterface {
    name = 'SchemaUpdate1744797811335'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_e2209f147ec1ee1396c7ed854b2"`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "purchase_id"`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD "item_id" integer`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD CONSTRAINT "UQ_1064c04bd5a56289865700b2403" UNIQUE ("item_id")`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD CONSTRAINT "FK_1064c04bd5a56289865700b2403" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "FK_1064c04bd5a56289865700b2403"`);
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "UQ_1064c04bd5a56289865700b2403"`);
        await queryRunner.query(`ALTER TABLE "purchases" DROP COLUMN "item_id"`);
        await queryRunner.query(`ALTER TABLE "items" ADD "purchase_id" integer`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_e2209f147ec1ee1396c7ed854b2" FOREIGN KEY ("purchase_id") REFERENCES "purchases"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
