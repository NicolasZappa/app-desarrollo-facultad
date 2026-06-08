/*
import {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '../product.types';
import { ProductsRepository } from './products.repository';
import { NotFoundException, BadRequestException } from '@nestjs/common';

export class InMemoryProductsRepository implements ProductsRepository {
  private products: Product[] = [];
  private nextId = 1;

  findAll(): Product[] {
    return this.products;
  }

  async findAllAsync(): Promise<Product[]> {
    return this.findAll();
  }

  findByName(name: string): Product[] {
    return this.products.filter((p) =>
      p.name.toLowerCase().includes(name.toLowerCase()),
    );
  }

  async findByNameAsync(name: string): Promise<Product[]> {
    return this.findByName(name);
  }

  findAllOrdered(orderBy: string, order: 'asc' | 'desc'): Product[] {
    let sortedProducts = [...this.products];

    if (orderBy === 'name') {
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (orderBy === 'price') {
      sortedProducts.sort((a, b) => a.price - b.price);
    }

    if (order === 'desc') {
      sortedProducts.reverse();
    }

    return sortedProducts;
  }

  async findAllOrderedAsync(orderBy: string, order: 'asc' | 'desc'): Promise<Product[]> {
    return this.findAllOrdered(orderBy, order);
  }


  findById(id: number): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  async findByIdAsync(id: number): Promise<Product | undefined> {
    return this.findById(id);
  }

  create(input: CreateProductInput): Product {
    const product: Product = {
      id: this.nextId++,
      name: input.name,
      price: input.price,
      stock: input.stock,
      idCategory: input.idCategory,
    };

    this.products.push(product);
    return product;
  }

  async createAsync(input: CreateProductInput): Promise<Product> {
    return this.create(input);
  }

  update(id: number, input: UpdateProductInput): Product | undefined {
    const product = this.findById(id);
    if (!product) return undefined;

    if (input.name !== undefined) product.name = input.name;
    if (input.price !== undefined) product.price = input.price;
    if (input.stock !== undefined) product.stock = input.stock;
    if (input.idCategory !== undefined) product.idCategory = input.idCategory;

    return product;
  }

  async updateAsync(id: number, input: UpdateProductInput): Promise<Product | undefined> {
    return this.update(id, input);
  }

  reduceStock(id: number, quantity: number): Product | undefined {
    const product = this.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    };

    if (product.stock < quantity) {
      throw new BadRequestException('Not enough stock');
    }

    product.stock -= quantity;
    return product;
  }

  async reduceStockAsync(id: number, quantity: number): Promise<Product | undefined> {
    return this.reduceStock(id, quantity);
  }

  remove(id: number): Product | undefined {
    const product = this.findById(id);
    if (!product) return undefined;

    this.products = this.products.filter((p) => p.id !== id);
    return product;
  }

  async removeAsync(id: number): Promise<Product | undefined> {
    return this.remove(id);
  }
}
*/
