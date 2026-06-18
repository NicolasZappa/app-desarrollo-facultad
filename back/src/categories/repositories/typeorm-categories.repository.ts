import { Injectable, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CategoriesRepository } from "./categories.repositories";
import { Category as CategoryType } from "../categories.types";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../../common/categories.dto";
import { Category } from "../entities/category.entity";

@Injectable()
export class TypeOrmCategoriesRepository implements CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getAll(): Promise<CategoryType[]> {
    return await this.categoryRepository.find({ order: { name: "ASC" } });
  }

  async findByName(name: string): Promise<CategoryType | undefined> {
    const category = await this.categoryRepository.findOne({
      where: { name },
    });
    return category || undefined;
  }

  async getById(id: number): Promise<CategoryType | undefined> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    return category || undefined;
  }

  async create(input: CreateCategoryDto): Promise<CategoryType> {
    const newCategory = this.categoryRepository.create(input);
    return await this.categoryRepository.save(newCategory);
  }

  async update(
    id: number,
    input: UpdateCategoryDto,
  ): Promise<CategoryType | undefined> {
    await this.categoryRepository.update(id, input);
    return this.getById(id);
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
    const { products, ...result } = category;
    return result;
  }

  async getProductsByCategoryId(categoryId: number): Promise<any[]> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ["products"],
    });
    return category?.products || [];
  }
}
