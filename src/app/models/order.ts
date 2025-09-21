import {OrderItem} from './order-item';

export interface Order {
  items: {GUID: string; count: number}[];
  total?: number;
  comment?: string;
  shippingDate: Date;
}
