import { Injectable, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CategoriesRepository } from "./categories.repositories";
import {
  Category as CategoryType,
  CreateCategoryInput,
} from "../categories.types";
import { Category } from "../entities/category.entity";

@Injectable()
export class TypeOrmCategoriesRepository implements CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getAll(): Promise<CategoryType[]> {
    return await this.categoryRepository.find();
  }

  async getById(id: number): Promise<CategoryType | undefined> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    return category || undefined;
  }

  async create(input: CreateCategoryInput): Promise<CategoryType> {
    const newCategory = this.categoryRepository.create(input);
    return await this.categoryRepository.save(newCategory);
  }

  async delete(id: number): Promise<CategoryType | undefined> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ["products"],
    });
    if (!category) return undefined;

    if (category.products && category.products.length > 0) {
      throw new ConflictException("Category has products");
    }

    await this.categoryRepository.delete(id);
    return category;
  }

  async getProductsByCategoryId(categoryId: number): Promise<any[]> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ["products"],
    });
    return category?.products || [];
  }
}
