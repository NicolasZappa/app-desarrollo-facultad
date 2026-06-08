import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
  forwardRef,
} from "@nestjs/common";
import { Product } from "../product.types";
import { CreateProductDto, UpdateProductDto } from "../../common/products.dto";
import {
  PRODUCTS_REPOSITORY,
  ProductsRepository,
} from "../repositories/products.repository";
import { CategoriesService } from "../../categories/services/categories.service";

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productsRepository: ProductsRepository,
    private readonly categoriesService: CategoriesService,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productsRepository.findAllAsync();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findByIdAsync(id);
    if (!product) throw new NotFoundException("Product not found");
    return product;
  }

  async findByName(name: string): Promise<Product[]> {
    return this.productsRepository.findByNameAsync(name);
  }

  async findAllOrdered(
    orderBy: string,
    order: "asc" | "desc",
  ): Promise<Product[]> {
    return this.productsRepository.findAllOrderedAsync(orderBy, order);
  }

  async create(input: CreateProductDto): Promise<Product> {
    // si pasa un id que no existe lanzame un error badrequest
    const category = this.categoriesService.getById(input.categoryId);
    if (!category) throw new BadRequestException("Category not found");
    return this.productsRepository.createAsync(input);
  }

  async update(id: number, input: UpdateProductDto): Promise<Product> {
    const product = await this.productsRepository.updateAsync(id, input);
    if (!product) throw new NotFoundException("Product not found");
    return product;
  }

  async reduceStock(id: number, quantity: number): Promise<Product> {
    const product = await this.productsRepository.reduceStockAsync(
      id,
      quantity,
    );
    if (!product) throw new NotFoundException("Product not found");
    return product;
  }

  async remove(id: number): Promise<Product> {
    const product = await this.productsRepository.removeAsync(id);
    if (!product) throw new NotFoundException("Product not found");
    return product;
  }
}
