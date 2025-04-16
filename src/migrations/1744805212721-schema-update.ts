import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1744805212721 implements MigrationInterface {
    name = 'SchemaUpdate1744805212721'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "items" ADD "purchase_id" integer`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "UQ_e2209f147ec1ee1396c7ed854b2" UNIQUE ("purchase_id")`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_e2209f147ec1ee1396c7ed854b2" FOREIGN KEY ("purchase_id") REFERENCES "purchases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_e2209f147ec1ee1396c7ed854b2"`);
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "UQ_e2209f147ec1ee1396c7ed854b2"`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "purchase_id"`);
    }

}
