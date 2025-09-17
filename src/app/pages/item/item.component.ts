import { Component } from '@angular/core';
import {Product} from '../../models/product';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {OrderItem} from '../../models/order-item';
import {CartService} from '../../services/cart.service';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})
export class ItemComponent {
  public product: Product = {
    id: 'sku-6',
    name: 'Apple Watch Series 9',
    price: 399.99,
    category: 'Электроника',
    stock: 30,
    number_in_box: 5,
    imageUrl: '1.bmp',
    description: 'Умные часы с продвинутыми функциями',
    origin_country: 'Russian'
  };
  addedQuantity: number = 0;

  constructor(private cartService: CartService) {}

  addToCart(quantity: number): void {
    if (this.product.stock === 0) return;

    const newQuantity = Math.min(quantity, this.product.stock);
    this.addedQuantity = newQuantity;

    // Добавляем в корзину
    const orderItem: OrderItem = {
      product: this.product,
      quantity: newQuantity,
      total: 1
    };

    this.cartService.addToCart(orderItem);
  }

  increaseQuantity(): void {
    if (this.addedQuantity < this.product.stock) {
      this.addedQuantity++;
      this.updateCartQuantity();
    }
  }

  decreaseQuantity(): void {
    if (this.addedQuantity > 1) {
      this.addedQuantity--;
      this.updateCartQuantity();
    } else if (this.addedQuantity === 1) {
      // Если уменьшаем до 0, убираем из корзины
      this.cartService.removeFromCart(this.product.id);
      this.addedQuantity = 0;
    }
  }

  private updateCartQuantity(): void {
    this.cartService.updateQuantity(this.product.id, this.addedQuantity);
  }

  // При загрузке компонента проверяем, есть ли товар уже в корзине
  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      const existingItem = items.find(item => item.product.id === this.product.id);
      this.addedQuantity = existingItem ? existingItem.quantity : 0;
    });
  }
}
