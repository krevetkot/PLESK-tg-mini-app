import {Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CommonModule} from '@angular/common';
import {AuthService} from './services/auth.service';
import {resolve} from '@angular/compiler-cli';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  template: '<router-outlet />',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'It\'s PLESK';

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    await this.performAuth();
  }

  async performAuth(): Promise<void> {
    try {
      await this.authService.checkAndRefreshAuth();
      console.log("auth is done");
    } catch (error) {
      console.error('Ошибка аутентификации:', error);
    }
  }
}
