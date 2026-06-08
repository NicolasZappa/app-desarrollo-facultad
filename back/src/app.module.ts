import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ProductsModule } from "./products/products.module";
import { UsersModule } from "./users/users.module";
import { CategoriesModule } from "./categories/categories.module";
import { AuthModule } from "./auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./products/entities/product.entity";
import { Category } from "./categories/entities/category.entity";
import { LoggerMiddleware, TimingMiddleware } from "./common/logger.middleware";
import { MiddlewareConsumer, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UserEntity } from "./users/entities/user.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", ".env.example"],
    }),
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "database.sqlite",
      entities: [Product, Category, UserEntity],
      synchronize: true,
    }),
    AuthModule,
    ProductsModule,
    UsersModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, TimingMiddleware).forRoutes("*");
  }
}
