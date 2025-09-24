import {inject, Injectable} from '@angular/core';
import { Profile} from '../models/profile';
import {catchError, map, Observable, of} from 'rxjs';
import {Order} from '../models/order';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Product} from '../models/product';
import {Response} from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl: string = environment.apiUrl;
  private http = inject(HttpClient);

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
}


export interface OrdersResponse {
  status: string;
  items: Order[];
  token: string;
}
