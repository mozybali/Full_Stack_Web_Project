import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { env } from './config/env.config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { GamesModule } from './games/games.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [env] }),

    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const cfg = env();
        return {
          type: 'postgres',
          host: cfg.db.host,
          port: cfg.db.port,
          username: cfg.db.user,
          password: cfg.db.pass,
          database: cfg.db.name,
          autoLoadEntities: true,
          synchronize: true
        };
      },
    }),

    AuthModule,
    UsersModule,
    RolesModule,
    GamesModule,
    ProductsModule,
    OrdersModule,
  ],
})
export class AppModule {}
