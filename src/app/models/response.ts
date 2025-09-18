import {Product} from './product';

export interface Response {
  status: string;
  items: Product[];
  photos?: { [key: string]: { [key: string]: string } };
  token: string;
}
