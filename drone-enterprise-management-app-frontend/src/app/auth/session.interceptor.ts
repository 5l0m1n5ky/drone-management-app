import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, catchError, from, switchMap, tap, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';
import { LogoutService } from './logout.service';
import { environment } from "src/environments/environment";

@Injectable()
export class SessionInterceptor implements HttpInterceptor {

    private domain: string | undefined;

    constructor(private router: Router, private loginService: LoginService, private cookieService: CookieService, private logoutService: LogoutService) {
        this.domain = environment.ApiDomain;
    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (req.url === `${this.domain}/api/user/check`) {
            return next.handle(req);
        }

        if (this.cookieService.get('user')) {
            return from(this.loginService.checkSession()).pipe(
                switchMap(() => {
                    return next.handle(req);
                }),
                catchError((error) => {

                    console.error(error.error.message);

                    if (error.error.message === "Unauthenticated." || error.error.code === 401) {
                        console.warn('Session expired');
                        this.router.navigate(['/login'], { queryParams: { action: 'session_expired' } });
                        this.logoutService.changeLoginState();
                    }

                    return throwError(() => error.error.message);
                })
            );
        } else {
            console.warn('brak user cookie');
            return next.handle(req);
        }
    }

}

