import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject, catchError, exhaustMap, take, tap, throwError } from "rxjs";
import { User } from "../user/user.model";
import { CookieService } from "ngx-cookie-service";
import { environment } from "src/environments/environment";

interface LoginUserData {
  id: string,
  email: string,
  privileges: string
  suspended: boolean
}

interface UserData {
  user: LoginUserData
}

interface LoginResponseData {
  data: UserData
  status: string,
  message: string,
}

interface checkSessionResponseData {
  data: string
  message: string,
}

@Injectable({ providedIn: 'root' })

export class LoginService {

  user = new BehaviorSubject<User | null>(null);

  isAuthenticated = new BehaviorSubject<boolean>(false);

  private domain: string | undefined;

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.domain = environment.ApiDomain;
  }

  hasAdminPrivileges(): boolean {
    const user = this.user.value;
    if (user?.privileges === 'admin') {
      return true;
    }
    return false;
  }

  isUserSuspended(): boolean {
    const user = this.user.value;
    if (user?.suspended) {
      return true;
    }
    return false;
  }

  login(email: string, password: string) {
    return this.http.post<LoginResponseData>(`${this.domain}/api/login`, {
      email: email,
      password: password,
    }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true
    }).pipe(catchError(this.handleError),
      tap(responseData => {
        this.handleAuthentication(responseData.data.user.id, responseData.data.user.email, responseData.data.user.privileges, responseData.data.user.suspended);
      }
      ));
  }

  getLoginState(): boolean {
    if (this.cookieService.check('user')) {
      return true;
    } else {
      return false;
    }
  }

  checkSession() {
    return this.http.get<checkSessionResponseData>(`${this.domain}/api/user/check`,
      {
        headers: new HttpHeaders({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }),
        withCredentials: true
      }
    ).pipe(catchError((error) => {
      return throwError(error);
    }),
      tap(response => {
        return response;
      }
      ));
  }

  private handleError(errorResponse: HttpErrorResponse) {
    console.log('inside handle error');
    let errorMessage = 'Wystapił błąd. Spróbuj ponownie';
    if (!errorResponse || !errorResponse.error) {
      return throwError(errorMessage);
    }
    switch (errorResponse.error.data) {
      case 'CREDENTIALS_MISMATCH':
        errorMessage = 'Nieprawidłowe dane logowania'
    };
    return throwError(errorMessage);
  }

  private handleAuthentication(id: string, email: string, privileges: string, suspended: boolean) {
    const user = new User(id, email, privileges, suspended);
    this.user.next(user);
    if (this.cookieService.check('user')) {
      this.cookieService.delete('user');
    }
    console.log('user added to cookies');
    this.cookieService.set('user', JSON.stringify({ id: user?.id, email: user?.email, privileges: user?.privileges, suspended: user?.suspended }));
  }

  autoLogin() {

    if (!this.cookieService.check('user')) {
      return;
    }

    let userCookie = this.cookieService.get('user');
    const userData: User = JSON.parse(userCookie);
    const loadedUser = new User(userData.id, userData.email, userData.privileges, userData.suspended);
    this.user.next(loadedUser);
  }
}
