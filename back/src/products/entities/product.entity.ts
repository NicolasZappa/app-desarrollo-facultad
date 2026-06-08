import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Category } from "../../categories/entities/category.entity";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column({ type: "int", default: 0 })
  stock: number;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;
}
