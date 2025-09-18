import {inject, Injectable} from '@angular/core';
import { Product } from '../models/product';
import {catchError, map, Observable, of, throwError} from 'rxjs';
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

          let imgUrls: string[] | undefined = [];
          const productPhotos = response.photos;
          for (let photo of productPhotos) {
            if (productPhotos.hasOwnProperty(photo)) {
              const firstPhotoKey = Object.keys(productPhotos)[0];
              imgUrls.push(`${environment.photosUrl}${productPhotos[firstPhotoKey]}`);
            }
          }

          return {
            GUID: apiProduct.GUID,
            name: apiProduct.name,
            categoryName: apiProduct.categoryName,
            categoryGUID: apiProduct.categoryGUID,
            price: Number(apiProduct.price),
            description: apiProduct.description || undefined,
            imageUrl: imgUrls,
            file: imgUrls[0] ? imgUrls[0] : undefined
          };
        }
        throw new Error('Product not found');
      }),
      catchError(error => {
        console.error('Error loading product:', error);
        return throwError(() => new Error('Failed to load product: ' + guid));
      })
    );
  }
}
