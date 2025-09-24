// auth.service.ts
import {inject, Injectable} from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { tap } from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {TelegramWebappService} from '@zakarliuka/ng-telegram-webapp';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly AUTH_KEY = 'tg_app_authenticated';
  private authPromise: Promise<boolean> | null = null;
  private authStatus = new BehaviorSubject<boolean>(this.isAuthenticated());

  private readonly telegramService = inject(TelegramWebappService)

  // Публичный Observable для отслеживания статуса
  authStatus$ = this.authStatus.asObservable();

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.AUTH_KEY);
  }

  authenticate(): Promise<boolean> {
    // Если промис уже создан, возвращаем его
    if (this.authPromise) {
      return this.authPromise;
    }

    // Если уже аутентифицированы, сразу возвращаем успех
    if (this.isAuthenticated()) {
      return Promise.resolve(true);
    }

    // Создаем новый промис для аутентификации
    this.authPromise = new Promise<boolean>((resolve, reject) => {
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
        localStorage.setItem(this.AUTH_KEY, 'true');
        this.authStatus.next(true);
        resolve(true);
      }).catch(error => {
        console.error('Ошибка аутентификации:', error);
        reject(error);
      });
    });

    return this.authPromise;
  }
}
