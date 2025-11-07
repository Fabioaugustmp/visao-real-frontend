import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { delay, filter, map, tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common'; // Import CommonModule

import { ColorModeService, ToasterComponent, ToastComponent, ToastBodyComponent, ToastHeaderComponent, ButtonCloseDirective } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { NotificationService, ToastConfig } from './services/notification.service';

@Component({
    selector: 'app-root',
    template: `
      <c-toaster #toaster placement="top-end">
        <c-toast *ngFor="let toast of toasts" [autohide]="toast.autohide ?? true" [delay]="toast.delay" [fade]="toast.fade ?? true" [color]="toast.color" [visible]="true" (visibleChange)="onToastVisibleChange(toast, $event)">
          <c-toast-header>
            <strong class="me-auto">{{ toast.title }}</strong>
            <button cButtonClose></button>
          </c-toast-header>
          <c-toast-body>{{ toast.message }}</c-toast-body>
        </c-toast>
      </c-toaster>
      <router-outlet />
    `,
    standalone: true,
    imports: [
      RouterOutlet,
      CommonModule, // Add CommonModule here
      ToasterComponent,
      ToastComponent,
      ToastHeaderComponent,
      ToastBodyComponent,
      ButtonCloseDirective // Import ButtonCloseDirective
    ]
})
export class AppComponent implements OnInit {
  title = 'CoreUI Angular Admin Template';
  toasts: ToastConfig[] = []; // Array to hold toast configurations

  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly #activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #titleService = inject(Title);
  readonly #notificationService = inject(NotificationService); // Inject NotificationService

  readonly #colorModeService = inject(ColorModeService);
  readonly #iconSetService = inject(IconSetService);

  constructor() {
    this.#titleService.setTitle(this.title);
    // iconSet singleton
    this.#iconSetService.icons = { ...iconSubset };
    this.#colorModeService.localStorageItemName.set('coreui-free-angular-admin-template-theme-default');
    this.#colorModeService.eventName.set('ColorSchemeChange');
  }

  ngOnInit(): void {
    this.#router.events.pipe(
        takeUntilDestroyed(this.#destroyRef)
      ).subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });

    this.#activatedRoute.queryParams
      .pipe(
        delay(1),
        map(params => <string>params['theme']?.match(/^[A-Za-z0-9\s]+/)?.[0]),
        filter(theme => ['dark', 'light', 'auto'].includes(theme)),
        tap(theme => {
          this.#colorModeService.colorMode.set(theme);
        }),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe();

    // Subscribe to toast events from NotificationService
    this.#notificationService.toastEvents
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((config: ToastConfig) => {
        this.addToast(config);
      });
  }

  addToast(config: ToastConfig) {
    this.toasts.push(config);
  }

  onToastVisibleChange(toast: ToastConfig, visible: boolean) {
    if (!visible) {
      this.removeToast(toast);
    }
  }

  removeToast(toastToRemove: ToastConfig) {
    this.toasts = this.toasts.filter(toast => toast !== toastToRemove);
  }
}