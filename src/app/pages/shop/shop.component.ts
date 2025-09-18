import {Component, HostListener, OnInit} from '@angular/core';
import {Product} from '../../models/product';
import {ProductService} from '../../services/product.service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import {TelegramService} from '../../services/telegram.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent implements OnInit{
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = true;
  searchTerm: string = '';
  isSticky: boolean = false;

  categories: string[] = [];
  selectedCategory: string = 'Все';
  selectedSort: string = 'name';

  constructor(private productService: ProductService,
              private router: Router,
              private telegramService: TelegramService) {}

  ngOnInit(): void {
    console.log("ShopComponent ngOnInit вызван");

    // window.Telegram.WebApp.ready();
    //
    // // Получаем данные пользователя
    // const initData = window.Telegram.WebApp.initData;
    // const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;
    //
    // console.log(initData);
    // Ждем, пока initDataReady в index.html завершится
    // (window as any).initDataReady
    //   .then((data: string) => {
    //     console.log('initData отправлено, ответ сервера:', data);
    //     this.loadProducts();
    //   })
    //   // .catch(err => {
    //   //   console.error('Ошибка при initData:', err);
    //   //   this.loadProducts();
    //   // });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.sortProducts(); // Сортировка по умолчанию
        this.loading = false;
      },
      error: (error) => {
        console.error('Ошибка загрузки товаров:', error);
        this.loading = false;
      }
    });

    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Ошибка загрузки товаров:', error);
        this.loading = false;
      }
    });
  }

  // Фильтрация по категориям
  filterByCategory(category: string): void {
    this.selectedCategory = category;

    if (category === 'Все') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.categoryName === category
      );
    }

    this.sortProducts(); // Применяем текущую сортировку
  }

  // Сортировка товаров
  sortProducts(): void {
    switch (this.selectedSort) {
      case 'name':
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-asc':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
    }
  }

  searchProducts(): void {
    if (!this.searchTerm.trim()) {
      this.filteredProducts = this.products;
      this.filterByCategory(this.selectedCategory); // Возвращаем фильтр по категории
      return;
    }

    const term = this.searchTerm.toLowerCase().trim();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.categoryName.toLowerCase().includes(term)
    );

    this.sortProducts(); // Применяем сортировку к результатам поиска
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredProducts = this.products;
    this.filterByCategory(this.selectedCategory); // Возвращаем фильтр по категории
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isSticky = window.scrollY > 50; // вот тут дергается
  }

  navigateToItemPage(id: string): void {
    this.router.navigate(['/item', id]).then(r => console.log("Can't go the the item card"));
  }
}
