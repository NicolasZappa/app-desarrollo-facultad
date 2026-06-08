import {
  IsNumber,
  IsString,
  MinLength,
  MaxLength,
  IsPositive,
  IsOptional,
} from "class-validator";

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  stock: number;

  @IsNumber()
  categoryId: number;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  stock?: number;

  @IsOptional()
  @IsNumber()
  categoryId?: number;
}
