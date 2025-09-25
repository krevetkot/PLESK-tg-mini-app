import { Component } from '@angular/core';
import {BottomNavComponent} from '../bottom-nav/bottom-nav.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, BottomNavComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

}
