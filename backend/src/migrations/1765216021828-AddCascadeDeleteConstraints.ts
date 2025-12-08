import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascadeDeleteConstraints1765216021828 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Products tablosunda seller_id foreign key'i CASCADE olarak güncelle
        await queryRunner.query(`
            ALTER TABLE "products" 
            DROP CONSTRAINT IF EXISTS "FK_products_seller_id";
        `);
        
        await queryRunner.query(`
            ALTER TABLE "products" 
            ADD CONSTRAINT "FK_products_seller_id" 
            FOREIGN KEY ("seller_id") 
            REFERENCES "users"("id") 
            ON DELETE CASCADE;
        `);

        // Orders tablosunda buyer_id foreign key'i CASCADE olarak güncelle
        await queryRunner.query(`
            ALTER TABLE "orders" 
            DROP CONSTRAINT IF EXISTS "FK_orders_buyer_id";
        `);
        
        await queryRunner.query(`
            ALTER TABLE "orders" 
            ADD CONSTRAINT "FK_orders_buyer_id" 
            FOREIGN KEY ("buyer_id") 
            REFERENCES "users"("id") 
            ON DELETE CASCADE;
        `);

        // User_roles tablosunda user_id foreign key'i CASCADE olarak güncelle
        await queryRunner.query(`
            ALTER TABLE "user_roles" 
            DROP CONSTRAINT IF EXISTS "FK_user_roles_user_id";
        `);
        
        await queryRunner.query(`
            ALTER TABLE "user_roles" 
            ADD CONSTRAINT "FK_user_roles_user_id" 
            FOREIGN KEY ("user_id") 
            REFERENCES "users"("id") 
            ON DELETE CASCADE;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Geri alma işlemleri - CASCADE'i kaldır
        await queryRunner.query(`
            ALTER TABLE "products" 
            DROP CONSTRAINT IF EXISTS "FK_products_seller_id";
        `);
        
        await queryRunner.query(`
            ALTER TABLE "products" 
            ADD CONSTRAINT "FK_products_seller_id" 
            FOREIGN KEY ("seller_id") 
            REFERENCES "users"("id");
        `);

        await queryRunner.query(`
            ALTER TABLE "orders" 
            DROP CONSTRAINT IF EXISTS "FK_orders_buyer_id";
        `);
        
        await queryRunner.query(`
            ALTER TABLE "orders" 
            ADD CONSTRAINT "FK_orders_buyer_id" 
            FOREIGN KEY ("buyer_id") 
            REFERENCES "users"("id");
        `);

        await queryRunner.query(`
            ALTER TABLE "user_roles" 
            DROP CONSTRAINT IF EXISTS "FK_user_roles_user_id";
        `);
        
        await queryRunner.query(`
            ALTER TABLE "user_roles" 
            ADD CONSTRAINT "FK_user_roles_user_id" 
            FOREIGN KEY ("user_id") 
            REFERENCES "users"("id");
        `);
    }

}
