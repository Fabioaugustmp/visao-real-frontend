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

  private recentToasts = new Set<string>();

  constructor() { }

  private isDuplicate(message: string): boolean {
    if (this.recentToasts.has(message)) {
      return true;
    }
    this.recentToasts.add(message);
    setTimeout(() => this.recentToasts.delete(message), 3000); // 3 seconds deduplication window
    return false;
  }

  showSuccess(message: string, title: string = 'Success'): void {
    if (this.isDuplicate(message)) return;
    this.toastSubject.next({ color: 'success', title, message, autohide: true, delay: 5000, fade: true });
  }

  showError(message: string, title: string = 'Error'): void {
    if (this.isDuplicate(message)) return;
    this.toastSubject.next({ color: 'danger', title, message, autohide: true, delay: 5000, fade: true });
  }

  showWarning(message: string, title: string = 'Warning'): void {
    if (this.isDuplicate(message)) return;
    this.toastSubject.next({ color: 'warning', title, message, autohide: true, delay: 5000, fade: true });
  }

  showInfo(message: string, title: string = 'Info'): void {
    if (this.isDuplicate(message)) return;
    this.toastSubject.next({ color: 'info', title, message, autohide: true, delay: 5000, fade: true });
  }
}