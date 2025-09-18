import {Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CommonModule} from '@angular/common';
import {TelegramWebappService} from '@zakarliuka/ng-telegram-webapp';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  template: '<router-outlet />',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'PLESK-tg-mini-app';

  private readonly telegramService = inject(TelegramWebappService)

  ngOnInit() {
    console.log(this.telegramService.initData);
    // Получаем данные initData
    const initData = this.telegramService.initData;

    // Передаем initData на сервер
    fetch(`${environment.apiUrl}user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({initData})
    }).then(response => response.text()).then(data => {
      console.log("Ответ от сервера:", data);
    });
  }
}
