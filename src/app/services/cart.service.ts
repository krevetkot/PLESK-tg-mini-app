import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {OrderItem} from '../models/order-item';
import {Product} from '../models/product';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private orderItems: OrderItem[] = [];
  private cartSubject = new BehaviorSubject<OrderItem[]>([]);

  cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  // Добавить товар в корзину
  addToCart(product: Product, quantity: number): void {
    const existingItem = this.orderItems.find(item => item.product.GUID === product.GUID);

    if (existingItem) {
      // Увеличиваем количество, но не больше максимума
      const newQuantity = existingItem.quantity + quantity;
      existingItem.quantity = newQuantity;
      existingItem.total = existingItem.quantity * existingItem.product.price;
    } else {
      // Добавляем новый товар
      const newItem: OrderItem = {
        quantity: quantity,
        product: product,
        total: quantity * product.price
      };
      this.orderItems.push(newItem);
    }

    this.saveCart();
    console.log('Товар добавлен в корзину:', product.name, 'Количество:', quantity);
  }

  // Обновить количество товара
  updateQuantity(productId: string, quantity: number): void {
    const item = this.orderItems.find(item => item.product.GUID === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        item.total = item.quantity * item.product.price;
        this.saveCart();
      }
    }
  }

  // Удалить товар из корзины
  removeFromCart(productId: string): void {
    this.orderItems = this.orderItems.filter(item => item.product.GUID !== productId);
    this.saveCart();
  }

  // Очистить корзину
  clearCart(): void {
    this.orderItems = [];
    this.saveCart();
  }

  // Получить общую сумму
  getTotalAmount(): number {
    return this.orderItems.reduce((total, item) => total + item.total, 0);
  }

  // Получить общее количество товаров
  getTotalItems(): number {
    return this.orderItems.reduce((total, item) => total + item.quantity, 0);
  }

  // Получить все товары в корзине
  getCartItems(): OrderItem[] {
    return [...this.orderItems];
  }

  // Проверить, есть ли товар в корзине
  hasItem(productId: string): boolean {
    return this.orderItems.some(item => item.product.GUID === productId);
  }

  // Получить количество конкретного товара
  getItemQuantity(productId: string): number {
    const item = this.orderItems.find(item => item.product.GUID === productId);
    return item ? item.quantity : 0;
  }

  // Получить OrderItem по productId
  getOrderItem(productId: string): OrderItem | undefined {
    return this.orderItems.find(item => item.product.GUID === productId);
  }

  // Сохранить корзину в localStorage
  private saveCart(): void {
    try {
      localStorage.setItem('cart', JSON.stringify(this.orderItems));
      this.cartSubject.next([...this.orderItems]);
      console.log('Корзина сохранена:', this.orderItems);
    } catch (error) {
      console.error('Ошибка сохранения корзины:', error);
    }
  }

  // Загрузить корзину из localStorage
  private loadCartFromStorage(): void {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.orderItems = JSON.parse(savedCart);
        this.cartSubject.next([...this.orderItems]);
        console.log('Корзина загружена:', this.orderItems);
      }
    } catch (error) {
      console.error('Ошибка загрузки корзины:', error);
      this.orderItems = [];
    }
  }
}
