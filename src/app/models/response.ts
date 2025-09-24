import {Product} from './product';

export interface Response {
  status: string;
  items: Product[];
  photos?: { [photoId: string]: string };
  token: string;
}
