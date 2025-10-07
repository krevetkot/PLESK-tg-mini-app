import {inject, Injectable} from '@angular/core';
import {Product} from '../models/product';
import {catchError, map, Observable, of, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl: string = environment.apiUrl;
  private http = inject(HttpClient);
  private foo: string = environment.foo;
  private readonly AUTH_COOKIE_NAME = 'tg_app_authenticated';

  constructor(private authService: AuthService) {
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<CatalogResponse>(this.apiUrl + 'catalog').pipe(
      map(response => {
        if (response.status === 'success') {
          return response.items.map(item => ({
            GUID: item.GUID,
            name: item.name,
            categoryName: item.categoryName,
            categoryGUID: item.categoryGUID,
            price: Number(item.price),
            file: item.file ? `${environment.photosUrl}${item.file}` : this.foo,
            popularity: item.popularity
          } as Product));
        }
        this.authService.deleteCookie(this.AUTH_COOKIE_NAME);
        this.authService.refreshAuthentication().then(r => console.log(r));
        throw new Error('API returned error status');
      }),
      catchError(error => {
        console.error('Error loading products:', error);
        return of([]);
      })
    );
  }

  getCategories(): Observable<string[]> {
    return this.http.get<CategoriesResponse>(this.apiUrl + 'categories').pipe(
      map(response => {
        if (response.status === 'success') {
          return response.items.map(item => item.categoryName);
        }
        throw new Error('API returned error status');
      }),
      catchError(error => {
        console.error('Error loading categories:', error);
        return of([]);
      })
    );
  }

  getProduct(guid: string): Observable<Product> {
    return this.http.get<ItemResponse>(`${this.apiUrl}catalog?productGUID=${guid}`).pipe(
      map(response => {
        if (response.status === 'success' && response.items.length > 0) {
          const apiProduct = response.items[0];

          let imgUrls: string[] | undefined = [];
          const productPhotos = response.photos;

          for (const key of Object.keys(productPhotos)) {
            if (productPhotos) {
              imgUrls.push(`${environment.photosUrl}${productPhotos[key]}`);
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
            file: imgUrls[0] ? imgUrls[0] : this.foo,
            popularity: 0,
            article: apiProduct.article,
            count: apiProduct.count,
            countInPack: apiProduct.countInPack,
            madeIn: apiProduct.madeIn
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


export interface CatalogResponse {
  status: string;
  items: { GUID: string;
        name: string;
        categoryName: string;
        categoryGUID: string;
        price: number;
        file: string;
        popularity: number; }[];
  photos: { [photoId: string]: string };
  token: string;
}

export interface ItemResponse {
  status: string;
  items: { GUID: string;
    name: string;
    categoryName: string;
    categoryGUID: string;
    price: number;
    description: string;
    imgUrl: string[];
    file: string;
    article: string;
    count: number;
    countInPack: number;
    madeIn: string;}[]
  photos: { [photoId: string]: string };
  token: string;
}

export interface CategoriesResponse {
  status: string;
  items: {categoryName: string; categoryGUID: string}[]
}
