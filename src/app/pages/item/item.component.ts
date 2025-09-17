import { Component } from '@angular/core';
import {Product} from '../product';

@Component({
  selector: 'app-item',
  imports: [],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})
export class ItemComponent {
  public product: Product = {
    id: 'sku-6',
    name: 'Apple Watch Series 9',
    price: 399.99,
    category: 'Электроника',
    stock: 30,
    number_in_box: 1,
    imageUrl: '1.bmp',
    description: 'Умные часы с продвинутыми функциями',
    origin_country: 'Russian'
  };
}
