import {Component, Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs';

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
  currentPath: string = '/';

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentPath = event.urlAfterRedirects || event.url;
      });
  }

  isActive(path: string): boolean {
    if (path === '/') {
      return this.currentPath === '/' || this.currentPath === '';
    }
    return this.currentPath === path;
  }

  navigateTo(path: string): void {
    this.router.navigate([path]).then(r => console.log(r));
  }
}
