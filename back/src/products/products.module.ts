import { Global, Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsController } from "./controllers/products.controller";
import { PRODUCTS_REPOSITORY } from "./repositories/products.repository";
import { ProductsService } from "./services/products.service";
import { CategoriesModule } from "../categories/categories.module";
import { TypeOrmProductsRepository } from "./repositories/typeorm-products.repository";
import { Product } from "./entities/product.entity";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Product]), CategoriesModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    { provide: PRODUCTS_REPOSITORY, useClass: TypeOrmProductsRepository },
  ],
  exports: [ProductsService, PRODUCTS_REPOSITORY],
})
export class ProductsModule {}
