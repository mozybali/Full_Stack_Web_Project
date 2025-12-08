import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascadeDeleteConstraints1765216021828 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Bu migration gereksiz çünkü InitialSchema zaten CASCADE DELETE içeriyor
        // Ancak emin olmak için kontrol ediyoruz
        
        // Products tablosunda seller_id foreign key'ini kontrol et ve gerekirse yeniden oluştur
        await queryRunner.query(`
            ALTER TABLE "products" 
            DROP CONSTRAINT IF EXISTS "FK_425ee27c69d6b8adc5d6475dcfe";
        `);
        
        await queryRunner.query(`
            ALTER TABLE "products" 
            ADD CONSTRAINT "FK_425ee27c69d6b8adc5d6475dcfe" 
            FOREIGN KEY ("seller_id") 
            REFERENCES "users"("id") 
            ON DELETE CASCADE ON UPDATE NO ACTION;
        `);

        // Orders tablosunda buyer_id foreign key'ini kontrol et ve gerekirse yeniden oluştur
        await queryRunner.query(`
            ALTER TABLE "orders" 
            DROP CONSTRAINT IF EXISTS "FK_5e90e93d0e036c3fadbaefa4d0a";
        `);
        
        await queryRunner.query(`
            ALTER TABLE "orders" 
            ADD CONSTRAINT "FK_5e90e93d0e036c3fadbaefa4d0a" 
            FOREIGN KEY ("buyer_id") 
            REFERENCES "users"("id") 
            ON DELETE CASCADE ON UPDATE NO ACTION;
        `);

        // User_roles tablosunda user_id foreign key'ini kontrol et ve gerekirse yeniden oluştur
        await queryRunner.query(`
            ALTER TABLE "user_roles" 
            DROP CONSTRAINT IF EXISTS "FK_87b8888186ca9769c960e926870";
        `);
        
        await queryRunner.query(`
            ALTER TABLE "user_roles" 
            ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" 
            FOREIGN KEY ("user_id") 
            REFERENCES "users"("id") 
            ON DELETE CASCADE ON UPDATE CASCADE;
        `);

        // KRITIK: Order_items tablosunda product_id'yi RESTRICT'ten SET NULL'a değiştir
        // Bu sayede ürün silindiğinde sipariş geçmişi korunur
        await queryRunner.query(`
            ALTER TABLE "order_items" 
            DROP CONSTRAINT IF EXISTS "FK_9263386c35b6b242540f9493b00";
        `);
        
        await queryRunner.query(`
            ALTER TABLE "order_items" 
            ADD CONSTRAINT "FK_9263386c35b6b242540f9493b00" 
            FOREIGN KEY ("product_id") 
            REFERENCES "products"("id") 
            ON DELETE SET NULL ON UPDATE NO ACTION;
        `);

        // product_id kolonunu nullable yap
        await queryRunner.query(`
            ALTER TABLE "order_items" 
            ALTER COLUMN "product_id" DROP NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Geri alma işlemleri - CASCADE ve SET NULL'ı kaldır
        
        // product_id kolonunu NOT NULL yap
        await queryRunner.query(`
            ALTER TABLE "order_items" 
            ALTER COLUMN "product_id" SET NOT NULL;
        `);
        
        await queryRunner.query(`
            ALTER TABLE "order_items" 
            DROP CONSTRAINT IF EXISTS "FK_9263386c35b6b242540f9493b00";
        `);
        
        await queryRunner.query(`
            ALTER TABLE "order_items" 
            ADD CONSTRAINT "FK_9263386c35b6b242540f9493b00" 
            FOREIGN KEY ("product_id") 
            REFERENCES "products"("id") 
            ON DELETE RESTRICT ON UPDATE NO ACTION;
        `);
        
        await queryRunner.query(`
            ALTER TABLE "products" 
            DROP CONSTRAINT IF EXISTS "FK_425ee27c69d6b8adc5d6475dcfe";
        `);
        
        await queryRunner.query(`
            ALTER TABLE "products" 
            ADD CONSTRAINT "FK_425ee27c69d6b8adc5d6475dcfe" 
            FOREIGN KEY ("seller_id") 
            REFERENCES "users"("id") 
            ON DELETE NO ACTION ON UPDATE NO ACTION;
        `);

        await queryRunner.query(`
            ALTER TABLE "orders" 
            DROP CONSTRAINT IF EXISTS "FK_5e90e93d0e036c3fadbaefa4d0a";
        `);
        
        await queryRunner.query(`
            ALTER TABLE "orders" 
            ADD CONSTRAINT "FK_5e90e93d0e036c3fadbaefa4d0a" 
            FOREIGN KEY ("buyer_id") 
            REFERENCES "users"("id") 
            ON DELETE NO ACTION ON UPDATE NO ACTION;
        `);

        await queryRunner.query(`
            ALTER TABLE "user_roles" 
            DROP CONSTRAINT IF EXISTS "FK_87b8888186ca9769c960e926870";
        `);
        
        await queryRunner.query(`
            ALTER TABLE "user_roles" 
            ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" 
            FOREIGN KEY ("user_id") 
            REFERENCES "users"("id") 
            ON DELETE NO ACTION ON UPDATE NO ACTION;
        `);
    }

}
