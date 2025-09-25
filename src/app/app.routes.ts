import { Routes } from '@angular/router';
import {ShopComponent} from './pages/shop/shop.component';
import {ItemComponent} from './pages/item/item.component';
// import {ProfileComponent} from './pages/profile/profile.component';
import {CartComponent} from './pages/cart/cart.component';
import {HistoryComponent} from './pages/history/history.component';
import {MainLayoutComponent} from './pages/main-layout/main-layout.component';

export const routes: Routes = [

  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'shop', component: ShopComponent },
      {path: 'item/:id', component: ItemComponent},
      { path: 'history', component: HistoryComponent },
      { path: 'cart', component: CartComponent },
      { path: '', redirectTo: 'shop', pathMatch: 'full' }
    ]
  }
];
