import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StorageService } from '../core/storage/storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);

  private readonly _userName = signal<string | null>(this.storage.getUserName());
  private readonly _isAuthenticated = signal<boolean>(this.storage.hasToken());

  /** Signal de solo lectura — úsalo en templates con authService.userName() */
  readonly userName = this._userName.asReadonly();
  /** Signal de solo lectura — úsalo en templates con authService.isAuthenticatedSignal() */
  readonly isAuthenticatedSignal = this._isAuthenticated.asReadonly();

  private inactivityTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly inactivityTimeout = 30 * 60 * 1000;

  private readonly loginUrl = `${environment.apiUrl}/login`;

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<any>(this.loginUrl, { email, password }, { headers })
      .pipe(
        map(response => {
          // El backend puede devolver { token, user } directamente
          // o envuelto en { datos: { token, user }, mensajes: [] }
          const payload = response.datos ?? response.data ?? response;

          const token = payload.token    ?? payload.Token    ?? payload.access_token
                     ?? response.token  ?? response.Token   ?? response.access_token;

          const user  = payload.user    ?? payload.usuario  ?? payload.User
                     ?? response.user   ?? response.usuario ?? response.User;

          const name  = payload.nombre ?? payload.name
                     ?? user?.nombre  ?? user?.name ?? user?.userName ?? '';

          console.log('[AuthService] login response:', response, '→ token:', !!token);

          if (token) {
            this.storage.setToken(token);
            this.storage.setUserName(name);
            this._userName.set(name);
            this._isAuthenticated.set(true);
            this.resetInactivityTimer();
          }
          return response;
        })
      );
  }

  logout(): void {
    this.storage.clearAll();
    this._userName.set(null);
    this._isAuthenticated.set(false);
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }

  isAuthenticated(): boolean {
    return this._isAuthenticated();
  }

  resetInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
    this.inactivityTimer = setTimeout(() => {
      this.logout();
    }, this.inactivityTimeout);
  }
}
