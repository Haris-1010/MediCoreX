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
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private notification: NotificationService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = error.error.message;
        } else {
          // Server-side error
          switch (error.status) {
            case 0:
              errorMessage = 'Unable to connect to server. Please check your internet connection.';
              break;
            case 400:
              errorMessage = error.error?.message || 'Bad request';
              if (error.error?.errors?.length) {
                errorMessage = error.error.errors.join(', ');
              }
              break;
            case 401:
              // Handled by auth interceptor
              return throwError(() => error);
            case 403:
              errorMessage = error.error?.message || error.error?.error || 'You do not have permission to perform this action';
              break;
            case 404:
              errorMessage = error.error?.message || 'Resource not found';
              break;
            case 409:
              errorMessage = error.error?.message || 'Conflict occurred';
              break;
            case 422:
              errorMessage = error.error?.message || 'Validation failed';
              if (error.error?.errors?.length) {
                errorMessage = error.error.errors.join(', ');
              }
              break;
            case 429:
              errorMessage = 'Too many requests. Please wait and try again.';
              break;
            case 500:
              errorMessage = 'Internal server error. Please try again later.';
              break;
            case 502:
            case 503:
            case 504:
              errorMessage = 'Service temporarily unavailable. Please try again later.';
              break;
            default:
              errorMessage = error.error?.message || `Error: ${error.status}`;
          }
        }

        // Don't show notification for 401 errors (handled by auth interceptor)
        if (error.status !== 401) {
          this.notification.error(errorMessage);
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
