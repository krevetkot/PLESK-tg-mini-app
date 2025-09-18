export interface Product {
  GUID: string;
  name: string;
  categoryName: string;
  categoryGUID: string;
  price: number;
  description?: string;
  imageUrl?: string[];
  file?: string;
}
