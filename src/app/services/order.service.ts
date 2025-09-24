import {inject, Injectable} from '@angular/core';
import {catchError, map, Observable, of, throwError} from 'rxjs';
import {Order} from '../models/order';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {OrderItem} from '../models/order-item';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl: string = environment.apiUrl;
  private http = inject(HttpClient);
  private foo: string = environment.foo;

  constructor() {}

  getOrders(): Observable<Order[]> {
    return this.http.get<OrdersResponse>(this.apiUrl + 'orders').pipe(
      map(response => {
        if (response.status === 'success') {
          return response.items.map(item => ({
            id: item.id,
            status_id: item.status_id,
            ordered: item.ordered,
            total: item.total,
            comment: item.comment,
            shippingDate: item.shippingDate ?? undefined
          }));
        }
        throw new Error('API returned error status');
      }),
      catchError(error => {
        console.error('Error loading orders:', error);
        return of([]);
      })
    );
  }

  getOrderDetails(orderId: number): Observable<OrderItem[]> {
    return this.http.get<any>(this.apiUrl + 'orders?id=' + orderId).pipe(
      map(response => {
        if (response.status === 'success') {
          return response.items.map(item => ({
            GUID: item.GUID,
            name: item.name,
            price: Number(item.price),
            count: item.count,
            file: item.file ? `${environment.photosUrl}${item.file}` : null
          }));
        }
        throw new Error('API returned error status');
      }),
      catchError(error => {
        console.error('Error loading order details:', error);
        return throwError(() => new Error('Failed to load order details'));
      })
    );
  }
}


export interface OrdersResponse {
  status: string;
  items: Order[];
  token: string;
}

export interface OrderDetailsResponse {
  status: string;
  items: OrderItem[];
  token: string;
}
