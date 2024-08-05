import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoginService } from "../login/login.service";
import { User } from "../user/user.model";
import { Router } from "@angular/router";
import { catchError, tap, throwError } from "rxjs";

interface LogoutResponse {
  data: string,
  message: string,
  code: string,
}

@Injectable()

export class LogoutService {

  constructor(private http: HttpClient, private loginService: LoginService, private router: Router) { }

  logoutHandle() {
    this.http.post<LogoutResponse>('http://localhost:8000/logout', {
    }, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }),
      withCredentials: true
    }).subscribe(response => {
      console.log(response);
    })
  }

  logout() {
    this.loginService.user.next({} as User);
    this.logoutHandle();
  }

}

