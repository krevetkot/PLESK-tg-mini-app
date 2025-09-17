import { Injectable } from '@angular/core';
import { Profile} from './profile';
import { Observable, of } from 'rxjs';
import {Order} from './order';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profile: Profile = {
    id: 1,
    firstName: 'Иван',
    lastName: 'Иванов',
    phone: '+7 (999) 444-44-44',
    organization: 'ООО "Вкусно и точка"',
    avatar: '1.bmp'
  };

  private orders: Order[] = [
    {
      id: 1,
      orderNumber: 1,
      date: new Date('2024-01-15'),
      status: 'delivered',
      total: 14999.97,
      items: [
        {
          quantity: 1,
          product:     {
            id: 'sku-1',
            name: 'iPhone 15 Pro',
            category: 'Электроника',
            price: 999.99,
            stock: 0,
            number_in_box: 1,
            imageUrl: '1.bmp',
            description: 'Флагманский смартфон от Apple',
            origin_country: 'Russian'
          },
          total: 129.99
        }
      ]
    }
  ];

  getProfile(): Observable<Profile> {
    return of(this.profile);
  }

  updateProfile(profile: {}): Observable<Profile> {
    this.profile = { ...this.profile, ...profile };
    return of(this.profile);
  }

  updateAvatar(avatarUrl: string): Observable<Profile> {
    this.profile.avatar = avatarUrl;
    return of(this.profile);
  }

  getOrders(): Observable<Order[]> {
    return of(this.orders);
  }
}
