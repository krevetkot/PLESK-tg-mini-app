export interface Product {
  GUID: string;
  name: string;
  categoryName: string;
  categoryGUID?: string;
  price: number;
  description?: string;
  imageUrl?: string[]; // фото товаров в карусели на странице товара
  file?: string; // главное фото, отображается на главной странице
}
