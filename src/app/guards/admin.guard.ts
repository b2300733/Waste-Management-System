import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const userId = localStorage.getItem('userId');
    if (userId) {
      return this.authService.getUser(userId).pipe(
        map((user) => {
          if (user.isAdmin) {
            return true; // Allow access if admin
          } else {
            this.router.navigate(['/dashboard']); // Redirect to dashboard
            return false; // Prevent access to the admin page
          }
        }),
        catchError(() => {
          this.router.navigate(['/login']); // Redirect to login on error
          return of(false); // Prevent access to the admin page
        })
      );
    }

    // Redirect to login if userId is not found
    this.router.navigate(['/login']);
    return of(false); // Prevent access to the admin page
  }
}
