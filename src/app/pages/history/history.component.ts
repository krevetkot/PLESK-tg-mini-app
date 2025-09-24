import { Component, OnInit } from '@angular/core';

import {Profile} from '../../models/profile';
import {Order} from '../../models/order';
import {OrderService} from '../../services/order.service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  imports: [CommonModule, FormsModule],
})
export class HistoryComponent implements OnInit {
  orders: Order[] = [];
  loading: boolean = true;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
    console.log("Заказы загружены: ");
    console.log(this.orders);
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
          return 'В работе';
        case 2:
          return 'Отгружен';
        case 3:
          return 'Отменен';
        default:
          return 'Неизвестен';
      }
    } else {
      return 'Неизвестен'
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'delivered': return 'status-delivered';
      case 'processing': return 'status-processing';
      case 'shipped': return 'status-shipped';
      default: return '';
    }
  }
}
