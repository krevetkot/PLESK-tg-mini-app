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
          return response.items.map(apiOrder => ({
            id: apiOrder.id,
            status_id: apiOrder.status_id,
            ordered: apiOrder.ordered,
            total: apiOrder.total,
            comment: apiOrder.comment,
            shippingDate: apiOrder.shippingDate ? new Date(apiOrder.shippingDate) : undefined,
            items: []
          } as Order));
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
    return this.http.get<OrderDetailsResponse>(this.apiUrl + 'orders?id=' + orderId).pipe(
      map(response => {
        if (response.status === 'success') {
          return response.items.map(apiItem => ({
            GUID: apiItem.GUID,
            name: apiItem.name,
            price: Number(apiItem.price),
            count: apiItem.count,
            file: apiItem.file ? `${environment.photosUrl}${apiItem.file}` : undefined,
            total: Number(apiItem.price) * apiItem.count
          } as OrderItem));
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

interface OrdersResponse {
  status: string;
  items: ApiOrder[];
  token?: string;
}

interface OrderDetailsResponse {
  status: string;
  items: ApiOrderItem[];
  token?: string;
}

interface ApiOrder {
  id: number;
  status_id: number;
  ordered: string;
  total: number;
  comment?: string;
  shippingDate?: string;
}

interface ApiOrderItem {
  GUID: string;
  name: string;
  price: string;
  count: number;
  file?: string | null;
}
