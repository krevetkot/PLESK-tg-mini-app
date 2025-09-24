import {OrderItem} from './order-item';

export interface Order {
  id: number;
  status_id?: number;
  ordered?: string;
  items: OrderItem[];
  total?: number;
  comment?: string;
  shippingDate: Date | undefined;
}
