import {Product} from './product';

export interface OrderItem {
  quantity: number;
  product: Product;
  total: number; //стоимость всех штук одного товара
}
