import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product as ProductEntity } from "../entities/product.entity";
import { Product } from "../product.types";
import { CreateProductDto, UpdateProductDto } from "../../common/products.dto";
import { ProductsRepository } from "./products.repository";
import { NotFoundException, BadRequestException } from "@nestjs/common";

@Injectable()
export class TypeOrmProductsRepository implements ProductsRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {}

  async findAllAsync(): Promise<Product[]> {
    return this.productRepo.find({ relations: ["category"] });
  }

  async findByNameAsync(name: string): Promise<Product[]> {
    return this.productRepo
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .where("LOWER(product.name) LIKE :name", {
        name: `%${name.toLowerCase()}%`,
      })
      .getMany();
  }

  async findByIdAsync(id: number): Promise<Product | undefined> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ["category"],
    });
    return product ?? undefined;
  }

  async findAllOrderedAsync(
    orderBy: string,
    order: "asc" | "desc",
  ): Promise<Product[]> {
    const orderField = ["name", "price"].includes(orderBy) ? orderBy : "id";
    return this.productRepo.find({
      relations: ["category"],
      order: { [orderField]: order.toUpperCase() },
    });
  }

  async createAsync(input: CreateProductDto): Promise<Product> {
    const product = this.productRepo.create({
      name: input.name,
      price: input.price,
      stock: input.stock,
      category: { id: input.categoryId },
    });
    const saved = await this.productRepo.save(product);
    return this.productRepo.findOne({
      where: { id: saved.id },
      relations: ["category"],
    }) as Promise<Product>;
  }

  async updateAsync(
    id: number,
    input: UpdateProductDto,
  ): Promise<Product | undefined> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ["category"],
    });
    if (!product) return undefined;

    if (input.categoryId) {
      input["category"] = { id: input.categoryId };
      delete input.categoryId;
    }

    Object.assign(product, input);
    const saved = await this.productRepo.save(product);
    return this.productRepo.findOne({
      where: { id: saved.id },
      relations: ["category"],
    }) as Promise<Product>;
  }

  async reduceStockAsync(
    id: number,
    quantity: number,
  ): Promise<Product | undefined> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ["category"],
    });
    if (!product) {
      throw new NotFoundException("Product not found");
    }

    if (product.stock < quantity) {
      throw new BadRequestException("Not enough stock");
    }

    product.stock -= quantity;
    const saved = await this.productRepo.save(product);
    return this.productRepo.findOne({
      where: { id: saved.id },
      relations: ["category"],
    }) as Promise<Product>;
  }

  async removeAsync(id: number): Promise<Product | undefined> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ["category"],
    });
    if (!product) return undefined;

    await this.productRepo.remove(product);
    return { ...product, id };
  }
}
