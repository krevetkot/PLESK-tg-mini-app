import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderItem } from '../../models/order-item';

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
    this.cartService.updateQuantity(item.product.id, item.quantity + 1);
  }

  decreaseQuantity(item: OrderItem): void {
    this.cartService.updateQuantity(item.product.id, item.quantity - 1);
  }

  updateQuantity(item: OrderItem, event: Event): void {
    const input = event.target as HTMLInputElement;
    const quantity = parseInt(input.value, 10);

    if (!isNaN(quantity) && quantity >= 0) {
      this.cartService.updateQuantity(item.product.id, quantity);
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
    } else if (!this.isShippingDateValid()) {
      alert('Пожалуйста, укажите дату отгрузки.');
    } else {
        console.log('Оформление заказа:', {
          items: this.orderItems,
          total: this.totalAmount,
          shippingDate: this.shippingDate
        });

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
