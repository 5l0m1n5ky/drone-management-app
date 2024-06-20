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

  // private csrfToken: string | undefined;

  constructor(private csrfService: CsrfService, private cookieService: CookieService) { }


  //   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //     if (req.method === 'POST') {
  //       // Fetch CSRF token before handling the request
  //       return from(this.csrfService.fetchCsrfToken()).pipe(
  //         switchMap(() => {
  //           // const csrfCookie = this.cookieService.get('XSRF-TOKEN');
  //           // console.log('csrf cookie: ', csrfCookie);

  //           if (csrfCookie === null) {
  //             this.csrfToken = this.csrfService.getCsrfToken();
  //             console.log('cookie is null');
  //           } else {
  //             console.log('cookie is not null');
  //             this.csrfToken = csrfCookie;
  //           }

  //           const clonedRequest = req.clone({
  //             headers: req.headers.set('X-XSRF-TOKEN', this.csrfToken ? this.csrfToken : '')
  //           });
  //           return next.handle(clonedRequest);
  //         })
  //       );
  //     } else {
  //       return next.handle(req);
  //     }
  //   }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method === 'POST') {
      // Fetch CSRF token before handling the request
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

