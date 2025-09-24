import {Product} from './product';

export interface OrderItem {
  count: number;
  name: string;
  GUID: string;
  price: number;
  // product: Product;
  file: string | undefined;
  total: number; //стоимость всех штук одного товара
}
