import {OrderItem} from './order-item';

export interface Order {
  id: number;
  orderNumber: number;
  date: Date;
  status: 'delivered' | 'processing' | 'shipped';
  items: OrderItem[];
  total: number;
}
