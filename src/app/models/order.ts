import {OrderItem} from './order-item';

export interface Order {
  id: number;
  orderNumber: number;
  date: Date;
  status: 'delivered' | 'processing' | 'shipped'; // в таблице statusId
  items: OrderItem[];
  total: number;
  comment?: string;
  shippingDate?: Date;
}
