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

  constructor(private notificationService: NotificationService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Erros ocorreram! Contate o Administrador do Sistema.';
        if (error.error instanceof ErrorEvent) {
          // Client-side errors
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side errors
          if (error.status === 0) {
            errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet ou tente novamente mais tarde.';
          } else if (error.status === 409 && error.error && typeof error.error === 'object' && 'message' in error.error) {
            errorMessage = error.error.message;
          } else {
            errorMessage = `Código de Erro: ${error.status}\nMensagem: ${error.message}`;
            if (error.error && error.error.message) {
              errorMessage = `Código de Erro: ${error.status}\nMensagem: ${error.error.message}`;
            }
          }
        }
        this.notificationService.showError(errorMessage, 'Erro de API');
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
