import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { CategoriesService } from "../services/categories.service";
import { Category, CreateCategoryInput } from "../categories.types";
import { Product } from "../../products/product.types";
import { PaginatedResult } from "../../common/types/paginated-result.type";
import { paginate } from "../../common/utils/pagination.util";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ): Promise<PaginatedResult<Category>> {
    const categories = await this.categoriesService.getAll();
    return paginate(categories, page, limit);
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<Category | undefined> {
    return this.categoriesService.getById(Number(id));
  }

  @Post()
  async create(@Body() input: CreateCategoryInput): Promise<Category> {
    return this.categoriesService.create(input);
  }

  @Get(":id/products")
  async getProductsByCategoryId(@Param("id") id: string): Promise<Product[]> {
    return this.categoriesService.getProductsByCategoryId(Number(id));
  }

  @Delete(":id")
  async delete(@Param("id") id: string): Promise<Category | undefined> {
    return this.categoriesService.delete(Number(id));
  }
}
