export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  number_in_box: number;
  imageUrl: string;
  description?: string;
  origin_country: string;
}
