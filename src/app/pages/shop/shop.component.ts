import {Component, HostListener} from '@angular/core';
import {Product} from '../product';
import {ProductService} from '../product.service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = true;
  searchTerm: string = '';
  isSticky: boolean = false;

  categories: string[] = [];
  selectedCategory: string = 'Все';
  selectedSort: string = 'name';

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
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
        product.category === category
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

  getStockClass(stock: number): string {
    if (stock === 0) return 'out-of-stock';
    if (stock < 10) return 'low-stock';
    return 'in-stock';
  }

  getStockText(stock: number): string {
    if (stock === 0) return 'Нет в наличии';
    if (stock < 10) return `Осталось мало: ${stock} шт.`;
    return `В наличии: ${stock} шт.`;
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
      product.category.toLowerCase().includes(term)
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
    this.isSticky = window.scrollY > 50;
  }

  navigateToItemPage(id: string): void {
    this.router.navigate(['/item', id]);
  }
}
