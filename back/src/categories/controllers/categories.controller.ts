import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  ConflictException,
  NotFoundException,
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
  async getById(@Param("id") id: string): Promise<Category> {
    try {
      return await this.categoriesService.getById(Number(id));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          { message: "Category not found" },
          HttpStatus.NOT_FOUND,
        );
      }
      throw error;
    }
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() input: CreateCategoryDto): Promise<Category> {
    try {
      return await this.categoriesService.create(input);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new HttpException(
          { message: "Category name already exists" },
          HttpStatus.CONFLICT,
        );
      }
      throw error;
    }
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
    try {
      return await this.categoriesService.update(Number(id), input);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new HttpException(
          { message: "Category name already exists" },
          HttpStatus.CONFLICT,
        );
      }
      throw error;
    }
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  async delete(@Param("id") id: string): Promise<Category> {
    try {
      return await this.categoriesService.delete(Number(id));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          { message: "Category not found" },
          HttpStatus.NOT_FOUND,
        );
      }
      throw error;
    }
  }
}
