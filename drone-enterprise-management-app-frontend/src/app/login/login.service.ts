import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject, catchError, tap, throwError } from "rxjs";
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

@Injectable({ providedIn: 'root' })

export class LoginService {

  user = new Subject<User>();
  // user = new BehaviorSubject<User>({} as User);

  getUserData(): Observable<User> {
    return this.user.asObservable();
  }
  constructor(private http: HttpClient, private cookieService: CookieService) { }

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
  }

}
