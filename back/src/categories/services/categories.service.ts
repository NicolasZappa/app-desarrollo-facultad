import { Inject, Injectable } from "@nestjs/common";
import { Category, CreateCategoryInput } from "../categories.types";
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

  async getById(id: number): Promise<Category | undefined> {
    return this.categoriesRepository.getById(id);
  }

  async create(input: CreateCategoryInput): Promise<Category> {
    return this.categoriesRepository.create(input);
  }

  async delete(id: number): Promise<Category | undefined> {
    return this.categoriesRepository.delete(id);
  }

  async getProductsByCategoryId(categoryId: number): Promise<Product[]> {
    return this.categoriesRepository.getProductsByCategoryId(categoryId);
  }
}
