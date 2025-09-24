import {OrderItem} from './order-item';

export interface Order {
  id?: number;
  status_id?: number;
  ordered?: string;
  items?: {GUID: string; count: number}[];
  total?: number;
  comment?: string;
  shippingDate: Date | undefined;
}
