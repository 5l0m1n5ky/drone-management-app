import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject, catchError, exhaustMap, take, tap, throwError } from "rxjs";
import { User } from "../user/user.model";
import { CookieService } from "ngx-cookie-service";
import { ToastModule } from 'primeng/toast';

interface LoginUserData {
  id: string,
  email: string,
  privileges: string
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

  // user = new Subject<User>();
  user = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private cookieService: CookieService) {
  }



  // user = new BehaviorSubject<User>({ id: '', email: '', privileges: '' });

  // getUserData(): Observable<User> {
  //   return this.user.asObservable();
  // }

  hasAdminPrivileges(): boolean {
    const user = this.user.value;
    if (user?.privileges === 'admin') {
      return true;
    }
    return false;
  }

  // hasAdminPrivileges(): User | null {
  //   return this.user.value;
  // }



  login(email: string, password: string) {
    return this.http.post<LoginResponseData>('http://localhost:8000/login', {
      email: email,
      password: password,
    }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true
    }).pipe(catchError(this.handleError),
      tap(responseData => {
        this.handleAuthentication(responseData.data.user.id, responseData.data.user.email, responseData.data.user.privileges);
      }
      ));
  }

  checkSession() {
    return this.http.post<checkSessionResponseData>('http://localhost:8000/user/check', null,
      {
        headers: new HttpHeaders({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }),
        withCredentials: true
      }
    ).pipe(catchError(this.handleError),
      tap(response => {
        return response;
      }
      ));
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'Wystapił błąd. Spróbuj ponownie';
    if (!errorResponse || !errorResponse.error) {
      return throwError(errorMessage);
    }
    switch (errorResponse.error.message) {
      case 'CREDENTIALS_MISMATCH':
        errorMessage = 'Nieprawidłowe dane logowania'
    };
    return throwError(errorMessage);
  }

  private handleAuthentication(id: string, email: string, privileges: string) {
    const user = new User(id, email, privileges);
    this.user.next(user);
    this.cookieService.set('user', JSON.stringify({ id: user?.id, email: user?.email, privileges: user?.privileges }));
  }

  autoLogin() {
    const userData: User = JSON.parse(this.cookieService.get('user'));

    if (!userData) {
      return;
    }

    const loadedUser = new User(userData.id, userData.email, userData.privileges);
    console.log(this.user.value);
    this.user.next(loadedUser);
    console.log('just set user from cookie');
    console.log(this.user.value);
  }
}
