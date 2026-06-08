import { Category } from "../categories/entities/category.entity";

export type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: Category;
};
