import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import {Product} from '../../models/product';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})
export class ItemComponent implements OnInit {
  public product: Product = {
    id: 'sku-6',
    name: 'Apple Watch Series 9',
    price: 399.99,
    category: 'Электроника',
    stock: 30,
    number_in_box: 6,
    imageUrl: '1.bmp',
    description: 'Умные часы с продвинутыми функциями',
    origin_country: 'США'
  };

  addedQuantity: number = 0;
  leftButtonType: 'add' | 'quantity' = 'add';
  rightButtonType: 'add' | 'quantity' = 'add';

  constructor(private cartService: CartService) {}

  // Добавить товар в корзину
  addToCart(quantity: number): void {
    if (this.product.stock === 0) return;

    this.cartService.addToCart(this.product, quantity);

    // Обновляем локальное состояние
    this.addedQuantity = this.cartService.getItemQuantity(this.product.id);

    // Меняем соответствующую кнопку
    if (quantity === 1) {
      this.leftButtonType = 'quantity';
    } else if (quantity === this.product.number_in_box) {
      this.rightButtonType = 'quantity';
    }

    console.log('Добавлено в корзину:', quantity, 'шт. Текущее количество:', this.addedQuantity);
  }

  // Увеличить количество
  increaseQuantity(): void {
    if (this.addedQuantity < this.product.stock) {
      this.cartService.updateQuantity(this.product.id, this.addedQuantity + 1);
      this.addedQuantity = this.cartService.getItemQuantity(this.product.id);
    }
  }

  // Уменьшить количество
  decreaseQuantity(): void {
    if (this.addedQuantity > 1) {
      this.cartService.updateQuantity(this.product.id, this.addedQuantity - 1);
      this.addedQuantity = this.cartService.getItemQuantity(this.product.id);
    } else if (this.addedQuantity === 1) {
      this.cartService.removeFromCart(this.product.id);
      this.addedQuantity = 0;
      this.leftButtonType = 'add';
      this.rightButtonType = 'add';
    }
  }

  // При загрузке компонента
  ngOnInit(): void {
    // Проверяем, есть ли товар в корзине
    this.addedQuantity = this.cartService.getItemQuantity(this.product.id);

    if (this.addedQuantity > 0) {
      this.leftButtonType = 'quantity';
      this.rightButtonType = 'quantity';
    }

    // Подписываемся на изменения корзины
    this.cartService.cart$.subscribe(items => {
      const item = items.find(item => item.product.id === this.product.id);
      this.addedQuantity = item ? item.quantity : 0;

      if (this.addedQuantity === 0) {
        this.leftButtonType = 'add';
        this.rightButtonType = 'add';
      }
    });
  }
}
