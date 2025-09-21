import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})
export class ItemComponent implements OnInit, OnDestroy {
  public product: Product | null = null; // Инициализируем null
  productImages: string[] = []; // Инициализируем пустым массивом
  currentImageIndex: number = 0;
  currentImage: string = '';

  addedQuantity: number = 0;
  buttonType: 'add' | 'quantity' = 'add';
  loading: boolean = true;

  private cartSubscription: Subscription | undefined;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const guid = this.route.snapshot.paramMap.get('id');
    if (guid) {
      this.loadProduct(guid);
    }
  }

  loadProduct(guid: string): void {
    this.loading = true;

    this.productService.getProduct(guid).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;

        // Инициализируем карусель после загрузки продукта
        this.initializeCarousel();

        // Проверяем корзину только после загрузки продукта
        this.checkCartState();
      },
      error: (error) => {
        console.error('Ошибка загрузки:', error.message);
        this.loading = false;
      }
    });
  }

  private initializeCarousel(): void {
    if (this.product && this.product.imageUrl) {
      this.productImages = this.product.imageUrl;
      this.currentImage = this.productImages[0] || 'foo.jpg';
    }
  }

  // swipe логика
  private touchStartX = 0;
  private touchEndX = 0;
  private minSwipeDistance = 50; // минимальное расстояние для считывания свайпа

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchMove(event: TouchEvent) {
    this.touchEndX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent) {
    const distance = this.touchStartX - this.touchEndX;

    // Свайп влево (next)
    if (distance > this.minSwipeDistance) {
      this.nextImage();
    }
    // Свайп вправо (prev)
    else if (distance < -this.minSwipeDistance) {
      this.prevImage();
    }

    // Сброс значений
    this.touchStartX = 0;
    this.touchEndX = 0;
  }

  // Методы для карусели
  nextImage(): void {
    if (this.productImages.length > 1) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.productImages.length;
      this.currentImage = this.productImages[this.currentImageIndex];
    }
  }

  prevImage(): void {
    if (this.productImages.length > 1) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.productImages.length) % this.productImages.length;
      this.currentImage = this.productImages[this.currentImageIndex];
    }
  }

  goToImage(index: number): void {
    if (index >= 0 && index < this.productImages.length) {
      this.currentImageIndex = index;
      this.currentImage = this.productImages[index];
    }
  }

  private checkCartState(): void {
    if (this.product) {
      this.addedQuantity = this.cartService.getItemQuantity(this.product.GUID);
      this.buttonType = this.addedQuantity > 0 ? 'quantity' : 'add';
    }

    // Подписываемся на изменения корзины
    this.cartSubscription = this.cartService.cart$.subscribe(items => {
      if (this.product) {
        const item = items.find(item => item.product.GUID === this.product!.GUID);
        this.addedQuantity = item ? item.count : 0;
        this.buttonType = this.addedQuantity > 0 ? 'quantity' : 'add';
      }
    });
  }

  // Добавить товар в корзину
  addToCart(quantity: number): void {
    if (this.product) {
      this.cartService.addToCart(this.product, quantity);
      this.addedQuantity = this.cartService.getItemQuantity(this.product.GUID);
      this.buttonType = 'quantity';
    }
  }

  // Увеличить количество
  increaseQuantity(): void {
    if (this.product) {
      this.cartService.updateQuantity(this.product.GUID, this.addedQuantity + 1);
    }
  }

  // Уменьшить количество
  decreaseQuantity(): void {
    if (this.product) {
      if (this.addedQuantity > 1) {
        this.cartService.updateQuantity(this.product.GUID, this.addedQuantity - 1);
      } else if (this.addedQuantity === 1) {
        this.cartService.removeFromCart(this.product.GUID);
        this.buttonType = 'add';
      }
    }
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}
