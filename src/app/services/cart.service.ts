import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {OrderItem} from '../models/order-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private orderItems: OrderItem[] = [];
  private cartSubject = new BehaviorSubject<OrderItem[]>([]);

  cart$ = this.cartSubject.asObservable();

  constructor() {
    // this.loadCartFromStorage();
  }

  addToCart(item: OrderItem): void {
    const existingItem = this.orderItems.find(i => i.product.id === item.product.id);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.orderItems.push({ ...item });
    }

    this.saveCart();
  }

  updateQuantity(productId: string, quantity: number): void {
    const item = this.orderItems.find(i => i.product.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.saveCart();
      }
    }
  }

  removeFromCart(productId: string): void {
    this.orderItems = this.orderItems.filter(item => item.product.id !== productId);
    this.saveCart();
  }

  clearCart(): void {
    this.orderItems = [];
    this.saveCart();
  }

  getTotalAmount(): number {
    return this.orderItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  getTotalItems(): number {
    return this.orderItems.reduce((total, item) => total + item.quantity, 0);
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.orderItems));
    this.cartSubject.next([...this.orderItems]);
  }

  // private loadCartFromStorage(): void {
  //   const savedCart = localStorage.getItem('cart');
  //   if (savedCart) {
  //     this.orderItems = JSON.parse(savedCart);
  //     this.cartSubject.next([...this.orderItems]);
  //   }
  // }
}
