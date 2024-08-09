import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, lastValueFrom, switchMap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { CsrfService } from './csrf.service';

// @Injectable({
//   providedIn: 'root'
// })

@Injectable()

export class CsrfInterceptor implements HttpInterceptor {

  csrfToken: string | null | undefined;

  constructor(private csrfService: CsrfService, private cookieService: CookieService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method === 'POST') {
      return from(this.csrfService.fetchCsrfToken()).pipe(
        switchMap(() => {
          const csrfToken = this.csrfService.getCsrfToken();
          const clonedRequest = req.clone({
            headers: req.headers.set('X-XSRF-TOKEN', csrfToken ? csrfToken : '')
          });
          return next.handle(clonedRequest);
        })
      );
    } else {
      return next.handle(req);
    }
  }
}

