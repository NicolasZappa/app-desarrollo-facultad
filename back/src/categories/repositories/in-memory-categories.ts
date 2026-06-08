/*
import { Inject, Injectable } from '@nestjs/common';
import { Category, CreateCategoryInput, UpdateCategoryInput } from '../categories.types';
import { Product } from '../../products/product.types';
import { PRODUCTS_REPOSITORY, ProductsRepository } from '../../products/repositories/products.repository';
import { CategoriesRepository } from './categories.repositories';
import { ConflictException } from '@nestjs/common';


let categories: Category[] = [
    { id: 1, name: 'comida' },
    { id: 2, name: 'bebida' },
    { id: 3, name: 'limpieza' },
];

@Injectable()
export class InMemoryCategoriesRepository implements CategoriesRepository {
    constructor(@Inject(PRODUCTS_REPOSITORY) private readonly productsRepository: ProductsRepository) { }

    getAll(): Category[] {
        return categories;
    }

    getById(id: number): Category | undefined {
        return categories.find(category => category.id === id);
    }

    getProductsByCategoryId(categoryId: number): Product[] {
        return this.productsRepository.findAll().filter(product => product.idCategory === categoryId);
    }

    create(input: CreateCategoryInput): Category {
        const newCategory: Category = {
            id: categories.length + 1,
            name: input.name
        };
        categories.push(newCategory);
        return newCategory;
    }

    delete(id: number): Category | undefined {
        if (this.getProductsByCategoryId(id).length > 0) {
            throw new ConflictException('Category has products');
        }
        const deleted = categories.find(category => category.id === id);
        if (deleted) {
            let newCategories: Category[] = categories.filter(category => category.id !== id);
            categories = newCategories;
        }
        return deleted;
    }
}
*/
