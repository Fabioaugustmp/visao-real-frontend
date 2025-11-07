import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private notificationService: NotificationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Erros ocorreram! Contate o Administrador do Sistema.';
        if (error.error instanceof ErrorEvent) {
          // Client-side errors
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side errors
          if (error.status) {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            if (error.error && error.error.message) {
              errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.message}`;
            } else if (error.status === 0) {
              errorMessage = 'Could not connect to the server. Please check your internet connection or try again later.';
            }
          }
        }
        this.notificationService.showError(errorMessage, 'Erro de API');
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
