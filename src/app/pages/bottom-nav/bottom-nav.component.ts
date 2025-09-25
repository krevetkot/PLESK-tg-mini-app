import {Component, Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.css',
})
@Injectable({
  providedIn: 'root'
})
export class BottomNavComponent {

  constructor(private router: Router) {}

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  navigateTo(path: string): void {
    this.router.navigate([path]).then(r => console.log(r));
  }
}
