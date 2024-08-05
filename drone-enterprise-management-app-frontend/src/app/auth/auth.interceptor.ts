import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { handler } from "@tailwindcss/aspect-ratio";
import { LoginService } from "../login/login.service";
import { CookieService } from "ngx-cookie-service";

@Injectable()

export class AuthInterceptor implements HttpInterceptor {

  constructor(private loginService: LoginService, private cookieService: CookieService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loginService.getUserData().subscribe(user => {
      const modifiedReq = req.clone({
        params: new HttpParams().set('laravel_session', this.cookieService.get('laravel_session'))
      });
      return next.handle(modifiedReq);
    });
    return next.handle(req);
  }
}
