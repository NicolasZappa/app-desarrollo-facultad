import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CategoriesService } from "../services/categories.service";
import { Category } from "../categories.types";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../../common/categories.dto";
import { Product } from "../../products/product.types";
import { PaginatedResult } from "../../common/types/paginated-result.type";
import { paginate } from "../../common/utils/pagination.util";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { UserRole } from "../../users/enums/user-role.enum";

@Controller("categories")
@UseGuards(JwtAuthGuard, RolesGuard)
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
  @Roles(UserRole.ADMIN)
  async create(@Body() input: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(input);
  }

  @Get(":id/products")
  async getProductsByCategoryId(@Param("id") id: string): Promise<Product[]> {
    return this.categoriesService.getProductsByCategoryId(Number(id));
  }

  @Put(":id")
  @Roles(UserRole.ADMIN)
  async update(
    @Param("id") id: string,
    @Body() input: UpdateCategoryDto,
  ): Promise<Category | undefined> {
    return this.categoriesService.update(Number(id), input);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  async delete(@Param("id") id: string): Promise<Category | undefined> {
    return this.categoriesService.delete(Number(id));
  }
}
