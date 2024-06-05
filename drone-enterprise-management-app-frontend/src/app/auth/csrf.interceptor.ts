import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

// @Injectable({
//   providedIn: 'root'
// })

@Injectable()

export class CsrfInterceptor implements HttpInterceptor {

  // private csrfToken: string | undefined;

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<string>> {
    if (request.method === 'POST') {
      try {
        this.getCsrfToken();
        let csrfCookie = this.cookieService.get('XSRF-TOKEN');
        const modifiedRequest = request.clone({
          setHeaders: {
            'X-XSRF-TOKEN': csrfCookie,
          },
        });
        return next.handle(modifiedRequest);
      } catch (error) {
        console.log('interceptor error:', error);
        return next.handle(request);
      }
    }
    return next.handle(request);
  }



  getCsrfToken() {
    return this.http.get('http://localhost:8000/sanctum/csrf-cookie', {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
      }),
      withCredentials: true,
    }).subscribe(responseData => {
      console.log('CSRF fetching token with response: ', responseData);
    }, errorResponse => {
      console.log('CSRF fetching token error:', errorResponse);
    });
  }
}























// private csrfToken: string | null = null;

// private csrfToken: string;


// constructor(private http: HttpClient) { }

// async fetchCsrfToken() {
//   try {
//     await this.http.get<{ csrfToken: string }>('http://127.0.0.1:8000/sanctum/csrf-cookie', {
//       headers: new HttpHeaders({
//         'Content-Type': 'application/json',
//         'Access-Control-Allow-Credentials': 'true',
//       })
//     });
//   }
//   catch (error) {
//     console.log('csrf fetching error');
//   }
// }

