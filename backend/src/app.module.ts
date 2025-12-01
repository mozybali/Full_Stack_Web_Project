import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { env } from './config/env.config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { GamesModule } from './games/games.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { SeedingModule } from './seeding/seeding.module';
import { UploadModule } from './upload/upload.module';
import { SeedingService } from './seeding/seeding.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [env] }),

    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const cfg = env();
        const isProduction = process.env.NODE_ENV === 'production';
        return {
          type: 'postgres',
          host: cfg.db.host,
          port: cfg.db.port,
          username: cfg.db.user,
          password: cfg.db.pass,
          database: cfg.db.name,
          autoLoadEntities: true,
          synchronize: !isProduction, // Only sync in development!
          logging: process.env.DB_LOGGING === 'true'
        };
      },
    }),

    AuthModule,
    UsersModule,
    RolesModule,
    GamesModule,
    ProductsModule,
    OrdersModule,
    SeedingModule,
    UploadModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly seedingService: SeedingService) {}

  /**
   * Module başlatıldığında veritabanını seed et
   * Varsayılan rolleri ve diğer gerekli verileri oluştur
   */
  async onModuleInit() {
    await this.seedingService.seed();
  }
}
