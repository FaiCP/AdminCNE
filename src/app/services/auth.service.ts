import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userNameSubject = new BehaviorSubject<string | null>(localStorage.getItem('userName'));
  private apiUrl =  environment.apiUrl
  private inactivityTimer: any; 
  private inactivityTimeout = 30 * 60 * 1000; 

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email, password };
  
    return this.http.post(`${this.apiUrl}/login`, body, { headers }).pipe(
  map((response: any) => {
    if (response.token && response.user) {
      const userName = response.user.nombre;
      localStorage.setItem('authToken', response.token); 
      localStorage.setItem('userName', userName); 
      
      this.userNameSubject.next(userName);
      this.resetInactivityTimer();
    }
    return response; 
  })
);

  }

  getUserName(): Observable<string | null> {
    return this.userNameSubject.asObservable(); 
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    this.userNameSubject.next(null);
    
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return token !== null && token.trim() !== '';
  }

  resetInactivityTimer(): void {
    clearTimeout(this.inactivityTimer);
    this.inactivityTimer = setTimeout(() => {
      alert('Sesión expirada por inactividad.');
      this.logout();
    }, this.inactivityTimeout);
  }
}
