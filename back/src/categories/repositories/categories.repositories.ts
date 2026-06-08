import { Category, CreateCategoryInput } from "../categories.types";
import { Product } from "../../products/product.types";

export const CATEGORIES_REPOSITORY = "CATEGORIES_REPOSITORY";

export interface CategoriesRepository {
  getAll(): Promise<Category[]>;
  getById(id: number): Promise<Category | undefined>;
  create(input: CreateCategoryInput): Promise<Category>;
  delete(id: number): Promise<Category | undefined>;
  getProductsByCategoryId(categoryId: number): Promise<any[]>;
}
