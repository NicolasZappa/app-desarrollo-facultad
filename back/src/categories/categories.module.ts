import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoriesController } from "./controllers/categories.controller";
import { CategoriesService } from "./services/categories.service";
import { CATEGORIES_REPOSITORY } from "./repositories/categories.repositories";
import { TypeOrmCategoriesRepository } from "./repositories/typeorm-categories.repository";
import { Category } from "./entities/category.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    { provide: CATEGORIES_REPOSITORY, useClass: TypeOrmCategoriesRepository },
  ],
  exports: [CategoriesService, CATEGORIES_REPOSITORY],
})
export class CategoriesModule {}
