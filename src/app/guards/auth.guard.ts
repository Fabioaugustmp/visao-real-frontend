import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const requiredRoles = route.data['roles'] as string[];

    return this.authService.isLoggedIn().pipe(
      map(isLoggedIn => {
        if (!isLoggedIn) {
          // Not logged in, redirect to login page
          return this.router.createUrlTree(['/login']);
        }

        if (requiredRoles && requiredRoles.length > 0) {
          // Logged in, check roles
          const hasRequiredRole = this.authService.hasRole(requiredRoles);
          if (!hasRequiredRole) {
            // Logged in but no required role, redirect to dashboard
            console.warn('User does not have the required roles:', requiredRoles);
            return this.router.createUrlTree(['/']); // Redirect to dashboard
          }
        }
        // Logged in and has required roles (or no roles required)
        return true;
      })
    );
  }
}
