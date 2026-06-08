import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { ProductsService } from "../services/products.service";
import { Product } from "../product.types";
import { CreateProductDto, UpdateProductDto } from "../../common/products.dto";
import { PaginatedResult } from "../../common/types/paginated-result.type";
import { paginate } from "../../common/utils/pagination.util";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query("name") name?: string,
    @Query("orderBy") orderBy?: string,
    @Query("order") order?: "asc" | "desc",
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ): Promise<PaginatedResult<Product>> {
    let products: Product[];
    if (name) {
      products = await this.productsService.findByName(name);
    } else if (orderBy && order) {
      products = await this.productsService.findAllOrdered(orderBy, order);
    } else {
      products = await this.productsService.findAll();
    }
    return paginate(products, page, limit);
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Product> {
    return this.productsService.findOne(Number(id));
  }

  @Post()
  async create(@Body() body: CreateProductDto): Promise<Product> {
    return this.productsService.create(body);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() body: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(Number(id), body);
  }

  @Patch(":id/stock")
  async reduceStock(
    @Param("id") id: string,
    @Body("quantity") quantity: number,
  ): Promise<Product> {
    return this.productsService.reduceStock(Number(id), quantity);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<Product> {
    return this.productsService.remove(Number(id));
  }
}
