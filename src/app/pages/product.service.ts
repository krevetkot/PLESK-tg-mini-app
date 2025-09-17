import { Injectable } from '@angular/core';
import { Product } from './product';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
      id: 'sku-1',
      name: 'iPhone 15 Pro',
      price: 999.99,
      stock: 0,
      number_in_box: 1,
      imageUrl: '1.bmp',
      description: 'Флагманский смартфон от Apple',
      origin_country: 'Russian'
    },
    {
      id: 'sku-2',
      name: 'Samsung Galaxy S24',
      price: 899.99,
      stock: 18,
      number_in_box: 1,
      imageUrl: '1.bmp',
      description: 'Мощный Android смартфон',
      origin_country: 'Russian'
    },
    {
      id: 'sku-3',
      name: 'MacBook Air M2',
      price: 1299.99,
      stock: 12,
      number_in_box: 1,
      imageUrl: '1.bmp',
      description: 'Легкий и мощный ноутбук',
      origin_country: 'Russian'
    },
    {
      id: 'sku-4',
      name: 'Sony PlayStation 5',
      price: 499.99,
      stock: 8,
      number_in_box: 1,
      imageUrl: '1.bmp',
      description: 'Игровая консоль нового поколения',
      origin_country: 'Russian'
    },
    {
      id: 'sku-5',
      name: 'Nike Air Max',
      price: 129.99,
      stock: 42,
      number_in_box: 1,
      imageUrl: '1.bmp',
      description: 'Спортивная обувь премиум класса',
      origin_country: 'Russian'
    },
    {
      id: 'sku-6',
      name: 'Apple Watch Series 9',
      price: 399.99,
      stock: 30,
      number_in_box: 1,
      imageUrl: '1.bmp',
      description: 'Умные часы с продвинутыми функциями',
      origin_country: 'Russian'
    }
  ];

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  // getProduct(id: number): Observable<Product | undefined> {
  //   const product = this.products.find(p => p.id == id);
  //   return of(product);
  // }
}
