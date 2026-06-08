import { Product } from "../product.types";
import { CreateProductDto, UpdateProductDto } from "../../common/products.dto";

export const PRODUCTS_REPOSITORY = "PRODUCTS_REPOSITORY";

export interface ProductsRepository {
  findAllAsync(): Promise<Product[]>;
  findByNameAsync(name: string): Promise<Product[]>;
  findByIdAsync(id: number): Promise<Product | undefined>;
  findAllOrderedAsync(
    orderBy: string,
    order: "asc" | "desc",
  ): Promise<Product[]>;
  createAsync(input: CreateProductDto): Promise<Product>;
  updateAsync(
    id: number,
    input: UpdateProductDto,
  ): Promise<Product | undefined>;
  reduceStockAsync(id: number, quantity: number): Promise<Product | undefined>;
  removeAsync(id: number): Promise<Product | undefined>;
}
