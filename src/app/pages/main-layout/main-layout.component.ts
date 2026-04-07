import {Component, OnInit} from '@angular/core';
import {BottomNavComponent} from '../bottom-nav/bottom-nav.component';
import {RouterOutlet} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, BottomNavComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit{
  private authSubscription!: Subscription;
  isAuthenticated: boolean = false;
  userName: null | string = null;
  constructor(public authService: AuthService) {
  }

  ngOnInit(){
    this.authSubscription = this.authService.authStatus$.subscribe(
      authenticated => {
        this.isAuthenticated = authenticated;
      }
    );

    this.authService.userName$.subscribe(name => {
      this.userName = name;
    });
  }

  logout(){
    this.authService.logout().then(r => console.log("the account was logged out", r));
  }
}
