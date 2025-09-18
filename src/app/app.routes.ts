import { Routes } from '@angular/router';
import {ShopComponent} from './pages/shop/shop.component';
import {ItemComponent} from './pages/item/item.component';
// import {ProfileComponent} from './pages/profile/profile.component';
import {CartComponent} from './pages/cart/cart.component';

export const routes: Routes = [
  {path: '', component: ShopComponent, pathMatch: 'full'},
  {path: 'item/:id', component: ItemComponent},
  // {path: 'profile', component: ProfileComponent},
  {path: 'cart', component: CartComponent}
];
