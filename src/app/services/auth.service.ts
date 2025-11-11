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
  private currentUserRoles = new BehaviorSubject<string[]>(this.getRolesFromToken());

  constructor(private http: HttpClient) {
    this.loggedIn.subscribe(status => console.log('AuthService - LoggedIn status:', status));
    this.currentUserRoles.subscribe(roles => console.log('AuthService - Current User Roles:', roles));
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/api/auth/login`, credentials).pipe(
      tap(response => {
        console.log('AuthService - API Response:', response);
        if (response && response.accessToken) {
          this.setToken(response.accessToken);
          this.loggedIn.next(true);
          const roles = this.decodeToken(response.accessToken).roles || [];
          this.currentUserRoles.next(roles);
          console.log('AuthService - Token set, loggedIn status updated to true, roles updated.');
        }
      })
    );
  }

  logout(): void {
    this.removeToken();
    this.loggedIn.next(false);
    this.currentUserRoles.next([]);
    console.log('AuthService - Token removed, loggedIn status updated to false, roles cleared.');
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

  public getUserRoles(): Observable<string[]> {
    return this.currentUserRoles.asObservable();
  }

  public hasRole(requiredRoles: string[]): boolean {
    const userRoles = this.currentUserRoles.getValue();
    if (!userRoles || userRoles.length === 0) {
      return false;
    }
    return requiredRoles.some(role => userRoles.includes(role));
  }

  private hasToken(): boolean {
    const has = !!this.getToken();
    console.log('AuthService - Initial hasToken check:', has);
    return has;
  }

  private getRolesFromToken(): string[] {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.decodeToken(token);
      return decodedToken.roles || [];
    }
    return [];
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error decoding token:', e);
      return {};
    }
  }

  public getUserName(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.decodeToken(token);
      return decodedToken.name || null;
    }
    return null;
  }
}
