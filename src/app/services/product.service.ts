import {inject, Injectable} from '@angular/core';
import { Product } from '../models/product';
import {catchError, map, Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Response} from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private categories = ['Все', 'Электроника', 'Одежда', 'Книги']; //при подключении бд, я их выгружу оттуда
  private products: Product[] = [];
  private apiUrl: string = environment.apiUrl;
  private http = inject(HttpClient);

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Response>(this.apiUrl + 'catalog').pipe(
      map(response => {
        if (response.status === 'success') {
          return response.items.map(item => ({
            GUID: item.GUID,
            name: item.name,
            category: item.categoryName,
            price: Number(item.price),
            file: item.file ? item.file : null
          }));
        }
        throw new Error('API returned error status');
      }),
      catchError(error => {
        console.error('Error loading products:', error);
        return of([]);
      })
    );
  }

  getCategories(): Observable<string[]>{
    return of(this.categories);
  }

  getProduct(guid: string): Observable<Product> {
    return this.http.get<Response>(`${this.apiUrl}catalog?productGUID=${guid}`).pipe(
      map(response => {
        if (response.status === 'success' && response.items.length > 0) {
          const apiProduct = response.items[0];
          return this.mapApiProductToModel(apiProduct, response.photos);
        }
        throw new Error('Product not found');
      }),
      // catchError(error => {
      //   console.error('Error loading product:', error);
      //   throw error;
      // })
    );
  }

  private mapApiProductToModel(apiProduct: Product, photos: any): Product {
    // Получаем URL фото из объекта photos
    let imageUrl: string | undefined;
    const productPhotos = photos[apiProduct.GUID];
    if (productPhotos) {
      const firstPhotoKey = Object.keys(productPhotos)[0];
      imageUrl = this.getFullImageUrl(productPhotos[firstPhotoKey]);
    }

    return {
      GUID: apiProduct.GUID,
      name: apiProduct.name,
      categoryName: apiProduct.categoryName,
      categoryGUID: apiProduct.categoryGUID,
      price: Number(apiProduct.price), // Конвертируем строку в число
      description: apiProduct.description || undefined,
      imageUrl: imageUrl,
      file: imageUrl ? this.extractFilePath(imageUrl) : undefined
    };
  }

  private getFullImageUrl(filePath: string): string {
    return `${environment.apiUrl}uploads/${filePath}`;
  }

  private extractFilePath(fullUrl: string): string {
    // Извлекаем часть пути после uploads/
    const parts = fullUrl.split('uploads/');
    return parts.length > 1 ? parts[1] : '';
  }

  // getProduct(id: string): Observable<Product> {
  //   return this.http.get<Response>(this.apiUrl + 'catalog?productGUID=' + id).pipe(
  //     map(response => {
  //       if (response.status === 'success') {
  //         return response.items.map(item => ({
  //           GUID: item.GUID,
  //           name: item.name,
  //           category: item.categoryName,
  //           price: Number(item.price),
  //           imageUrl: item.file ? item.file : null
  //         }));
  //       }
  //       throw new Error('API returned error status');
  //     }),
  //     catchError(error => {
  //       console.error('Error loading products:', error);
  //       // return of([]);
  //     })
  //   );
  // }
}
