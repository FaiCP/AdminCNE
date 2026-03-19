import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { StorageService } from '../storage/storage.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router  = inject(Router);
  const storage = inject(StorageService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      switch (err.status) {
        case 401:
          storage.clearAll();
          router.navigate(['/login']);
          break;
        case 403:
          router.navigate(['/login']);
          break;
        case 500:
        case 502:
        case 503:
          console.error(`[CNE] Error del servidor (${err.status}):`, err.message);
          break;
      }
      return throwError(() => err);
    })
  );
};
