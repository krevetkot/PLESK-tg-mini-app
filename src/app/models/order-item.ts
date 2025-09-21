import {Product} from './product';

export interface OrderItem {
  count: number;
  product: Product;
  total: number; //стоимость всех штук одного товара
}
