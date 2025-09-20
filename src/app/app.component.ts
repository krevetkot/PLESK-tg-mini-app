import {Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CommonModule} from '@angular/common';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  template: '<router-outlet />',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'PLESK-tg-mini-app';

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    await this.performAuth();
  }

  async performAuth(): Promise<void> {
    try {
      await this.authService.authenticate();
    } catch (error) {
      console.error('Ошибка аутентификации:', error);
    }
  }
}
