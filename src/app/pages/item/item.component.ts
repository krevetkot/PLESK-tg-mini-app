import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import {Product} from '../../models/product';
import {ProductService} from '../../services/product.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})
export class ItemComponent implements OnInit {
  public product: Product;
  // Массив изображений для карусели
  productImages: string[];

  currentImageIndex: number = 0;
  currentImage: string = this.productImages[0];

  addedQuantity: number = 0;
  buttonType: 'add' | 'quantity' = 'add';

  constructor(private cartService: CartService,
              private productService: ProductService,
              private route: ActivatedRoute,) {}

  ngOnInit(): void {
    const guid = this.route.snapshot.paramMap.get('guid');
    if (guid) {
      this.loadProduct(guid);
    }



    // Проверяем, есть ли товар в корзине
    this.addedQuantity = this.cartService.getItemQuantity(this.product.GUID);

    if (this.addedQuantity > 0) {
      this.buttonType = 'quantity';
    }

    // Подписываемся на изменения корзины
    this.cartService.cart$.subscribe(items => {
      const item = items.find(item => item.product.GUID === this.product.GUID);
      this.addedQuantity = item ? item.quantity : 0;

      if (this.addedQuantity === 0) {
        this.buttonType = 'add';
      }
    });
  }

  loadProduct(guid: string): void {
    this.productService.getProduct(guid)
  }

  // Методы для карусели
  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.productImages.length;
    this.currentImage = this.productImages[this.currentImageIndex];
  }
  prevImage(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.productImages.length) % this.productImages.length;
    this.currentImage = this.productImages[this.currentImageIndex];
  }
  goToImage(index: number): void {
    this.currentImageIndex = index;
    this.currentImage = this.productImages[index];
  }

  // Добавить товар в корзину
  addToCart(quantity: number): void {
    this.cartService.addToCart(this.product, quantity);

    // Обновляем локальное состояние
    this.addedQuantity = this.cartService.getItemQuantity(this.product.GUID);

    // Меняем соответствующую кнопку
    if (quantity === 1) {
      this.buttonType = 'quantity';
    }

    console.log('Добавлено в корзину:', quantity, 'шт. Текущее количество:', this.addedQuantity);
  }

  // Увеличить количество
  increaseQuantity(): void {
    this.cartService.updateQuantity(this.product.GUID, this.addedQuantity + 1);
    this.addedQuantity = this.cartService.getItemQuantity(this.product.GUID);
  }

  // Уменьшить количество
  decreaseQuantity(): void {
    if (this.addedQuantity > 1) {
      this.cartService.updateQuantity(this.product.GUID, this.addedQuantity - 1);
      this.addedQuantity = this.cartService.getItemQuantity(this.product.GUID);
    } else if (this.addedQuantity === 1) {
      this.cartService.removeFromCart(this.product.GUID);
      this.addedQuantity = 0;
      this.buttonType = 'add';
    }
  }

}
