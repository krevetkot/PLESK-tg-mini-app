import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderItem } from '../../models/order-item';
import {Order} from '../../models/order';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  orderItems: OrderItem[] = [];
  totalAmount: number = 0;
  shippingDate: string = '';
  isEmpty: boolean = true;
  orderComment: string = '';

  private order!: Order;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();

    // Подписываемся на изменения корзины
    this.cartService.cart$.subscribe(() => {
      this.loadCart();
    });
  }

  // Загрузить данные корзины
  private loadCart(): void {
    this.orderItems = this.cartService.getCartItems();
    this.totalAmount = this.cartService.getTotalAmount();
    this.isEmpty = this.orderItems.length === 0;

    console.log('Корзина загружена:', this.orderItems);
  }

  increaseQuantity(item: OrderItem): void {
    this.cartService.updateQuantity(item.GUID, item.count + 1);
  }

  decreaseQuantity(item: OrderItem): void {
    this.cartService.updateQuantity(item.GUID, item.count - 1);
  }

  updateQuantity(item: OrderItem, event: Event): void {
    const input = event.target as HTMLInputElement;
    const quantity = parseInt(input.value, 10);

    if (!isNaN(quantity) && quantity >= 0) {
      this.cartService.updateQuantity(item.GUID, quantity);
    }
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  continueShopping(): void {
    this.router.navigate(['']).then(r => console.log("Can't open the shop."));
  }

  isShippingDateValid(): boolean {
    return !!this.shippingDate && this.shippingDate.trim() !== '';
  }

  checkout(): void {
    if (this.orderItems.length == 0) {
      alert('Корзина пуста.');
      return;
    }

    if (!this.isShippingDateValid()) {
      alert('Пожалуйста, укажите дату отгрузки.');
    } else {
      const orderData = {
        items: this.orderItems.map(item => ({
          GUID: item.GUID,
          count: item.count
        })),
        comment: this.orderComment,
        shippingDate: new Date(this.shippingDate)
      };

      console.log("total: " + this.totalAmount );

      fetch(`${environment.apiUrl}post-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      }).catch(error => {
        console.error('Ошибка аутентификации:', error);
      });

        this.cartService.clearCart();
        alert('Спасибо за заказ! Наш менеджер свяжется с Вами в ближайшее время.');
      }
  }

  getShippingMinDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  getShippingMaxDate(): string {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  }
}
