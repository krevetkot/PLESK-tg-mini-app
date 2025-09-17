import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {CartService} from '../../services/cart.service';
import {OrderItem} from '../../models/order-item';

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

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.orderItems = items;
      this.isEmpty = items.length === 0;
      this.totalAmount = this.cartService.getTotalAmount();
    });
  }

  increaseQuantity(item: OrderItem): void {
    this.cartService.updateQuantity(item.product.id, item.quantity + 1);
  }

  decreaseQuantity(item: OrderItem): void {
    this.cartService.updateQuantity(item.product.id, item.quantity - 1);
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  updateQuantity(item: OrderItem, event: Event): void {
    const input = event.target as HTMLInputElement;
    const quantity = parseInt(input.value, 10);

    if (!isNaN(quantity) && quantity >= 0) {
      this.cartService.updateQuantity(item.product.id, quantity);
    }
  }

  continueShopping(): void {
    this.router.navigate(['']).then(r => console.error("Can't navigate to shopping page"));
  }

  checkout(): void {
    if (this.orderItems.length > 0) {
      // Здесь будет логика оформления заказа
      console.log('Оформление заказа:', {
        items: this.orderItems,
        total: this.totalAmount,
        shippingDate: this.shippingDate
      });

      // Очистка корзины после оформления
      this.cartService.clearCart();
      alert('Заказ успешно оформлен!');
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
