import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { CategoriesService } from "../services/categories.service";
import { Category } from "../categories.types";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../../common/categories.dto";
import { Product } from "../../products/product.types";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { UserRole } from "../../users/enums/user-role.enum";

@Controller("categories")
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getAll(): Promise<Category[]> {
    return this.categoriesService.getAll();
  }

  @Get(":id")
  async getById(
    @Param("id") id: string,
  ): Promise<{ message: string; category: Category }> {
    const category = await this.categoriesService.getById(Number(id));
    return { message: "Response 200", category };
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() input: CreateCategoryDto): Promise<{ message: string }> {
    await this.categoriesService.create(input);
    return { message: "Response 201" };
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
  ): Promise<{ message: string; category: Category | undefined }> {
    const category = await this.categoriesService.update(Number(id), input);
    return { message: "Response 200", category };
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  async delete(
    @Param("id") id: string,
  ): Promise<{ message: string; category: Category }> {
    const category = await this.categoriesService.delete(Number(id));
    return { message: "Response 200", category };
  }
}
