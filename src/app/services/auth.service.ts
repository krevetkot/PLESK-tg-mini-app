import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TelegramWebappService } from '@zakarliuka/ng-telegram-webapp';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly AUTH_COOKIE_NAME = 'tg_app_authenticated';
  private readonly COOKIE_MAX_AGE = 2 * 60 * 60; // 2 часа

  private authPromise: Promise<boolean> | null = null;
  private authStatus = new BehaviorSubject<boolean>(this.isAuthenticated());

  private readonly telegramService = inject(TelegramWebappService);

  authStatus$: Observable<boolean> = this.authStatus.asObservable();

  private getCookie(name: string): string | null {
    if (typeof document === 'undefined') {
      return null;
    }

    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  private setCookie(name: string, value: string, maxAgeSeconds: number): void {
    if (typeof document === 'undefined') {
      return;
    }
    document.cookie = `${name}=${value}; max-age=${maxAgeSeconds}; path=/; samesite=none; secure`;
  }

  deleteCookie(name: string): void {
    if (typeof document === 'undefined') {
      return;
    }
    document.cookie = `${name}=; max-age=0; path=/`;
  }

  isAuthenticated(): boolean {
    const authCookie = this.getCookie(this.AUTH_COOKIE_NAME);
    console.log('Auth cookie:', authCookie);
    return authCookie === 'true';
  }

  async authenticate(forceRefresh: boolean = false): Promise<boolean> {
    if (this.authPromise && !forceRefresh) {
      return this.authPromise;
    }

    if (forceRefresh) {
      this.deleteCookie(this.AUTH_COOKIE_NAME);
    }

    this.authPromise = new Promise<boolean>(async (resolve, reject) => {
      try {
        console.log("Starting authentication");
        const result = await this.tryAuthenticate();
        resolve(result);
      } catch (firstError) {
        console.log("First authentication failed, retrying...", firstError);

        try {
          const result = await this.tryAuthenticate();
          resolve(result);
        } catch (secondError) {
          console.error("Second authentication also failed:", secondError);
          this.setCookie(this.AUTH_COOKIE_NAME, 'false', 60);
          this.authStatus.next(false);
          reject(secondError);
        }
      } finally {
        this.authPromise = null;
      }
    });

    return this.authPromise;
  }

  private tryAuthenticate(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const initData = this.telegramService.initData;

      fetch(`${environment.apiUrl}user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ initData })
      })
        .then(response => response.json())
        .then(data => {
          console.log("Server response:", data);

          if (data.status === "success") {
            this.setCookie(this.AUTH_COOKIE_NAME, 'true', this.COOKIE_MAX_AGE);
            this.authStatus.next(true);
            resolve(true);
          } else {
            reject(new Error(`Authentication failed: ${data.message || 'Unknown error'}`));
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // Метод для проверки и обновления аутентификации если нужно
  async checkAndRefreshAuth(): Promise<boolean> {
    // проверяем, аутентифицированы ли мы и не истек ли куки
    if (!this.isAuthenticated()) {
      console.log('Authentication expired, refreshing...');
      try {
        return await this.authenticate(true);
      } catch (error) {
        console.error('Failed to refresh authentication:', error);
        return false;
      }
    }
    return true;
  }

  // Метод для принудительного обновления аутентификации
  refreshAuthentication(): Promise<boolean> {
    return this.authenticate(true);
  }
}
