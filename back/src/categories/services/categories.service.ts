import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { Category } from "../categories.types";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../../common/categories.dto";
import { Product } from "../../products/product.types";
import {
  CATEGORIES_REPOSITORY,
  CategoriesRepository,
} from "../repositories/categories.repositories";

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(CATEGORIES_REPOSITORY)
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async getAll(): Promise<Category[]> {
    return this.categoriesRepository.getAll();
  }

  async getById(id: number): Promise<Category> {
    const category = await this.categoriesRepository.getById(id);
    if (!category) throw new NotFoundException("Category not found");
    return category;
  }

  async create(input: CreateCategoryDto): Promise<Category> {
    const existing = await this.categoriesRepository.findByName(input.name);
    if (existing) {
      throw new ConflictException("Category name already exists");
    }
    return this.categoriesRepository.create(input);
  }

  async update(
    id: number,
    input: UpdateCategoryDto,
  ): Promise<Category | undefined> {
    if (input.name) {
      const existing = await this.categoriesRepository.findByName(input.name);
      if (existing && existing.id !== id) {
        throw new ConflictException("Category name already exists");
      }
    }
    return this.categoriesRepository.update(id, input);
  }

  async delete(id: number): Promise<Category> {
    const category = await this.categoriesRepository.delete(id);
    if (!category) throw new NotFoundException("Category not found");
    return category;
  }

  async getProductsByCategoryId(categoryId: number): Promise<Product[]> {
    return this.categoriesRepository.getProductsByCategoryId(categoryId);
  }
}
