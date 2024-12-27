import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userNameSubject = new BehaviorSubject<string | null>(null); 
  private apiUrl = 'http://localhost:57355/api'; 
  private inactivityTimer: any; 
  private inactivityTimeout = 30 * 60 * 1000; 

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email, password };
  
    return this.http.post(`${this.apiUrl}/login`, body, { headers }).pipe(
      map((response: any) => {
        if (response.Token && response.User) {
          const userName = response.User.nombre;
          localStorage.setItem('authToken', response.Token); 
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
    return !!localStorage.getItem('authToken'); 
  }

  resetInactivityTimer(): void {
    clearTimeout(this.inactivityTimer);
    this.inactivityTimer = setTimeout(() => {
      alert('Sesión expirada por inactividad.');
      this.logout();
    }, this.inactivityTimeout);
  }
}
