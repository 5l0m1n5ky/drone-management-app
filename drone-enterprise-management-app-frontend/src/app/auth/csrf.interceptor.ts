import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';
import { CsrfService } from './csrf.service';
import { CookieOptions, CookieService } from 'ngx-cookie-service';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  csrfToken: string | null | undefined;

  constructor(private csrfService: CsrfService, private cookieService: CookieService) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.method !== 'GET') {
      if (!this.cookieService.check("XSRF-TOKEN")) {
        return from(this.csrfService.fetchCsrfToken()).pipe(
          switchMap(() => {
            const csrfToken = this.csrfService.getCsrfToken();
            const clonedRequest = req.clone({
              headers: req.headers.set(
                'X-XSRF-TOKEN',
                csrfToken ? csrfToken : ''
              ),
              withCredentials: true
            });
            return next.handle(clonedRequest);
          })
        );
      } else {
        const csrfToken = this.cookieService.get("XSRF-TOKEN");
        const clonedRequest = req.clone({
          headers: req.headers.set(
            'X-XSRF-TOKEN',
            csrfToken ? csrfToken : ''
          ),
          withCredentials: true
        });
        return next.handle(clonedRequest);
      }
    } else {
      return next.handle(req);
    }
  }
}
