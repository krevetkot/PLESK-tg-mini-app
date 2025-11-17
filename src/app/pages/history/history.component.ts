import { Component, OnInit } from '@angular/core';

import {Order} from '../../models/order';
import {OrderService} from '../../services/order.service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {environment} from '../../../environments/environment';
import {CartService} from '../../services/cart.service';
import {ProductService} from '../../services/product.service';
import {forkJoin} from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  imports: [CommonModule, FormsModule],
})
export class HistoryComponent implements OnInit {
  expandedOrders: Set<number> = new Set();
  orders: Order[] = [];
  loading: boolean = true;
  repeatingOrder!: number | null;

  constructor(private orderService: OrderService,
              private cartService: CartService,
              private productService: ProductService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders.slice().reverse();
      },
      error: (error) => {
        console.error('Ошибка загрузки заказов:', error);
        this.loading = false;
      }
    });
  }

  getStatusText(status: number | undefined): string {
    if (status) {
      switch (status) {
        case 1:
          return 'В обработке';
        case 2:
          return 'Отменен';
        case 3:
          return 'Оформлен';
        case 4:
          return 'В пути';
        case 5:
          return 'Доставлен';
        default:
          return 'Неизвестен';
      }
    } else {
      return 'Неизвестен'
    }
  }

  toggleOrderDetails(orderId: number) {
    if (this.expandedOrders.has(orderId)) {
      this.expandedOrders.delete(orderId);
    } else {
      this.expandedOrders.add(orderId);
      this.loadOrderDetails(orderId);
    }
  }

  isOrderExpanded(orderId: number): boolean {
    return this.expandedOrders.has(orderId);
  }

  loadOrderDetails(orderId: number) {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      this.orderService.getOrderDetails(orderId).subscribe({
        next: (response) => {
          order.items = response;
        },
        error: (error) => {
          console.error('Ошибка загрузки деталей заказа:', error);
        }
      });
    }
  }

  // Расчет общей суммы заказа
  calculateOrderTotal(items: any[]): number {
    return items.reduce((total, item) => total + (parseFloat(item.price) * item.count), 0);
  }

  // Метод для повторения заказа с актуальными ценами
  async repeatOrder(order: Order) {
    this.repeatingOrder = order.id;

    try {
      // Получаем актуальные данные о всех товарах
      const products = await this.getActualProducts(order.items);

      // Добавляем товары в корзину
      this.addItemsToCart(products);

      console.log(`Заказ №${order.id} успешно добавлен в корзину`);

    } catch (error) {
      console.error('Ошибка при повторении заказа:', error);
      alert('Произошла ошибка при добавлении товаров в корзину');
    }
  }

  // Получаем актуальные данные о товарах
  private getActualProducts(orderItems: any[]): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const productRequests = orderItems.map(item =>
        this.productService.getProduct(item.GUID)
      );

      forkJoin(productRequests).subscribe({
        next: (products) => {
          // Объединяем актуальные данные с количеством из заказа
          const updatedItems = products.map((product, index) => ({
            product: product,
            quantity: orderItems[index].count,
            originalItem: orderItems[index]
          }));
          resolve(updatedItems);
        },
        error: (error) => {
          console.error('Ошибка получения актуальных данных о товарах:', error);
        }
      });
    });
  }

  private addItemsToCart(items: any[]): void {
    let addedCount = 0;
    let skippedCount = 0;

    items.forEach(item => {
      if (item.product && item.product.GUID) {
        this.cartService.addToCart(item.product, item.quantity);
        addedCount++;
      } else {
        console.warn('Не удалось добавить товар в корзину: отсутствуют данные', item);
        skippedCount++;
      }
    });

    // Показываем уведомление о результате
    if (addedCount > 0) {
      if (skippedCount > 0) {
        alert(`Добавлено ${addedCount} товаров в корзину. ${skippedCount} товаров не добавлено.`);
      } else {
        alert(`Все товары (${addedCount}) добавлены в корзину с актуальными ценами!`);
      }
    } else {
      alert('Не удалось добавить товары в корзину');
    }
  }
}
