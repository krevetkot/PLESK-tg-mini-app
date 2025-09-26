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
    console.log(localStorage.getItem(this.AUTH_KEY));
    if (localStorage.getItem(this.AUTH_KEY) === 'false' || localStorage.getItem(this.AUTH_KEY) === null){
      return false;
    } else {
      return true;
    }
  }

  authenticate(): Promise<boolean> {
    // Если уже аутентифицированы, сразу возвращаем успех
    if (this.isAuthenticated()) {
      console.log("leave");
      return Promise.resolve(true);
    }

    // Создаем новый промис для аутентификации
    this.authPromise = new Promise<boolean>((resolve, reject) => {
      // Получаем данные initData
      console.log("fetch");
      const initData = this.telegramService.initData;

      // Передаем initData на сервер
      fetch(`${environment.apiUrl}user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({initData})
      }).then(response => response.json()).then(data => {
        console.log("Ответ от сервера:"+ data.text);
        if (data.status === "success"){
          localStorage.setItem(this.AUTH_KEY, 'true');
          this.authStatus.next(true);
          resolve(true);
        } else {
          localStorage.setItem(this.AUTH_KEY, 'false');
          this.authStatus.next(false);
          reject(false);
        }
      }).catch(error => {
        console.log("Ответ от сервера:"+ error);
        console.error('Ошибка аутентификации:', error);
        reject(error);
      });
    });

    return this.authPromise;
  }
}
