import { Injectable } from '@angular/core';

const KEYS = {
  TOKEN:     'authToken',
  USER_NAME: 'userName',
} as const;

@Injectable({ providedIn: 'root' })
export class StorageService {
  getToken(): string | null {
    return localStorage.getItem(KEYS.TOKEN);
  }

  setToken(token: string): void {
    localStorage.setItem(KEYS.TOKEN, token);
  }

  getUserName(): string | null {
    return localStorage.getItem(KEYS.USER_NAME);
  }

  setUserName(name: string): void {
    localStorage.setItem(KEYS.USER_NAME, name);
  }

  hasToken(): boolean {
    const token = this.getToken();
    return token !== null && token.trim() !== '';
  }

  clearAll(): void {
    localStorage.removeItem(KEYS.TOKEN);
    localStorage.removeItem(KEYS.USER_NAME);
  }
}
