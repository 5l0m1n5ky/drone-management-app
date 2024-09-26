import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';
import { CsrfService } from './csrf.service';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  csrfToken: string | null | undefined;

  constructor(private csrfService: CsrfService) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.method !== 'GET') {
      return from(this.csrfService.fetchCsrfToken()).pipe(
        switchMap(() => {
          const csrfToken = this.csrfService.getCsrfToken();
          const clonedRequest = req.clone({
            headers: req.headers.set(
              'X-XSRF-TOKEN',
              csrfToken ? csrfToken : ''
            ),
          });
          return next.handle(clonedRequest);
        })
      );
    } else {
      return next.handle(req);
    }
  }
}
