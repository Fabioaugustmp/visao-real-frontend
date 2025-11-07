import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastConfig {
  color: string;
  title: string;
  message: string;
  autohide?: boolean;
  delay?: number;
  fade?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private toastSubject = new Subject<ToastConfig>();
  toastEvents = this.toastSubject.asObservable();

  constructor() { }

  showSuccess(message: string, title: string = 'Success'): void {
    this.toastSubject.next({ color: 'success', title, message, autohide: true, delay: 5000, fade: true });
  }

  showError(message: string, title: string = 'Error'): void {
    this.toastSubject.next({ color: 'danger', title, message, autohide: true, delay: 5000, fade: true });
  }

  showWarning(message: string, title: string = 'Warning'): void {
    this.toastSubject.next({ color: 'warning', title, message, autohide: true, delay: 5000, fade: true });
  }

  showInfo(message: string, title: string = 'Info'): void {
    this.toastSubject.next({ color: 'info', title, message, autohide: true, delay: 5000, fade: true });
  }
}