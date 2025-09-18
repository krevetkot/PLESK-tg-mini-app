import { Injectable } from '@angular/core';
import { Profile} from '../models/profile';
import { Observable, of } from 'rxjs';
import {Order} from '../models/order';

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

  private orders: Order[] = [];

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
