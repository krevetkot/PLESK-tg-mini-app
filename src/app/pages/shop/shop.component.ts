import {Component, OnInit} from '@angular/core';
import {Product} from '../../models/product';
import {ProductService} from '../../services/product.service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = true;
  searchTerm: string = '';
  isSticky: boolean = true;
  private authSubscription!: Subscription;
  isAuthenticated = false;

  categories: string[] = [];
  selectedCategory: string = 'Все';
  selectedSort: string = 'name';

  constructor(private productService: ProductService,
              private router: Router,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    // подписываемся на состояние аутентификации
    this.authSubscription = this.authService.authStatus$.subscribe(
      authenticated => {
        this.isAuthenticated = authenticated;
        if (authenticated) {
          this.loadProducts();
          this.loadCategories();
        } else {
          this.loading = false;
        }
      }
    );

    // Если уже аутентифицированы, загружаем товары сразу
    if (this.authService.isAuthenticated()) {
      this.isAuthenticated = true;
      this.loadProducts();
      this.loadCategories();
    }
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

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categoryNames) => {
        this.categories = ['Все'].concat(categoryNames);
      },
      error: (error) => {
        console.error('Ошибка:', error);
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
      this.filterByCategory(this.selectedCategory);
      return;
    }

    const term = this.searchTerm.toLowerCase().trim();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.categoryName.toLowerCase().includes(term)
    );

    this.sortProducts();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredProducts = this.products;
    this.filterByCategory(this.selectedCategory);
  }

  navigateToItemPage(id: string): void {
    this.router.navigate(['/item', id]).catch(r => console.error(r.message));
  }
}
