import { Injectable } from '@angular/core';
import {
  HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';

/** Central error handling: 401 -> logout+login, and toast the server message. */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    private router: Router,
    private snack: MatSnackBar
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401 && this.auth.isLoggedIn) {
          this.auth.logout();
          this.router.navigate(['/auth/login']);
        }
        const msg =
          err.error?.message || err.message || 'Something went wrong';
        this.snack.open(msg, 'Dismiss', { duration: 4000 });
        return throwError(() => err);
      })
    );
  }
}
