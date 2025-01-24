import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoginService } from "../login/login.service";
import { Router } from "@angular/router";
import { catchError, tap, throwError } from "rxjs";
import { CookieService } from "ngx-cookie-service";
import { environment } from "src/environments/environment";

interface LogoutResponse {
  data: string,
  message: string,
  code: string,
}

@Injectable()

export class LogoutService {

  private domain: string | undefined;

  constructor(private http: HttpClient, private loginService: LoginService, private router: Router, private cookieService: CookieService) {
    this.domain = environment.ApiDomain;
  }

  logoutHandle() {
    return this.http.post<LogoutResponse>(`${this.domain}/logout`, null, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }),
      withCredentials: true
    }).pipe(catchError(this.handleError),
      tap(response => {
        this.loginService.user.next({ id: '', email: '', privileges: '' });
        this.cookieService.deleteAll();
        if (response) {
          return response;
        }
        return 'Wylogowano pomyślnie'
      }
      ));
  }

  private handleError() {
    let errorMessage = 'Wystapił błąd. Spróbuj ponownie';
    return throwError(errorMessage);
  }
}

