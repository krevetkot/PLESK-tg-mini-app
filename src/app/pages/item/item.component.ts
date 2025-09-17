import { Component } from '@angular/core';
import {Product} from '../product';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
