import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    if (token) {
      let newRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      // Restrict Ticket visibility for Medicos (who are not Admins)
      if (request.url.includes('/tickets') && request.method === 'GET') {
        const isMedico = this.authService.hasRole(['ROLE_MEDICO']);
        const isAdmin = this.authService.hasRole(['ROLE_ADMINISTRADOR']);

        if (isMedico && !isAdmin) {
          const medicoId = this.authService.getUserId();
          if (medicoId) {
            console.log(`AuthInterceptor - Restricting tickets for Medico ID: ${medicoId}`);
            newRequest = newRequest.clone({
              params: newRequest.params.set('medicoId', medicoId)
            });
          } else {
            console.warn('AuthInterceptor - User has ROLE_MEDICO but no medicoId found in token.');
          }
        }
      }

      return next.handle(newRequest);
    }

    return next.handle(request);
  }
}
