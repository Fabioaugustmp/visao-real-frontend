import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest } from '../models/auth/login-request.model';
import { LoginResponse } from '../models/auth/login-response.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'jwt_token';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {
    this.loggedIn.subscribe(status => console.log('AuthService - LoggedIn status:', status));
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/api/auth/login`, credentials).pipe(
      tap(response => {
        console.log('AuthService - API Response:', response); // Add this line
        if (response && response.accessToken) {
          this.setToken(response.accessToken);
          this.loggedIn.next(true);
          console.log('AuthService - Token set, loggedIn status updated to true.');
        }
      })
    );
  }

  logout(): void {
    this.removeToken();
    this.loggedIn.next(false);
    console.log('AuthService - Token removed, loggedIn status updated to false.');
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  public isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  private hasToken(): boolean {
    const has = !!this.getToken();
    console.log('AuthService - Initial hasToken check:', has);
    return has;
  }
}
