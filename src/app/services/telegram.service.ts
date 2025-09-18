import {environment} from '../../environments/environment';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TelegramService {
  private tg = (window as any).Telegram?.WebApp;

  get initData(): string {
    return this.tg?.initData || '';
  }

  get user(): any {
    return this.tg?.user || null;
  }

  sendInitData(): Promise<string> {
    return fetch(`${environment.apiUrl}user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        initData: this.initData,
        user: this.user
      })
    }).then(res => res.text());
  }
}
