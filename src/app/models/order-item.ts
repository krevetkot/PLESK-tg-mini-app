export interface OrderItem {
  count: number;
  name: string;
  GUID: string;
  price: number;
  file: string | undefined;
  total: number; //стоимость всех штук одного товара
}
