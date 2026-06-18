import { Category } from "../categories.types";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../../common/categories.dto";
import { Product } from "../../products/product.types";

export const CATEGORIES_REPOSITORY = "CATEGORIES_REPOSITORY";

export interface CategoriesRepository {
  getAll(): Promise<Category[]>;
  getById(id: number): Promise<Category | undefined>;
  create(input: CreateCategoryDto): Promise<Category>;
  update(id: number, input: UpdateCategoryDto): Promise<Category | undefined>;
  delete(id: number): Promise<Category | undefined>;
  getProductsByCategoryId(categoryId: number): Promise<any[]>;
}
