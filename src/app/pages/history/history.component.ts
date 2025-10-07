import { Component, OnInit } from '@angular/core';

import {Order} from '../../models/order';
import {OrderService} from '../../services/order.service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {environment} from '../../../environments/environment';

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

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
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
}
