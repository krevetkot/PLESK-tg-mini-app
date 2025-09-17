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

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Ошибка загрузки товаров:', error);
        this.loading = false;
      }
    });
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
      return;
    }

    const term = this.searchTerm.toLowerCase().trim();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(term)
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredProducts = this.products;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isSticky = window.scrollY > 50;
  }

  navigateToItemPage(id: string): void {
    const address = '/item/' + id
    this.router.navigate([address]).then(r => console.error(id));
  }
}
