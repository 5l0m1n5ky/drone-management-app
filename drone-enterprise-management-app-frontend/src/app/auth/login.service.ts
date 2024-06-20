import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, catchError, tap, throwError } from "rxjs";
import { User } from "../user/user.model";
import { CookieService } from "ngx-cookie-service";

interface LoginUserData {
  id: string,
  email: string,
  email_verified_at: Date,
}

interface LoginData {
  user: LoginUserData
  token: string,
  token_expiration: Date
}

interface LoginResponseData {
  status: string,
  message: string,
  data: LoginData
}

@Injectable({ providedIn: 'root' })

export class LoginService {

  user = new Subject<User>()

  private csrfToken: string | null = null;

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  login(email: string, password: string) {

    console.log('inside login service function');

    return this.http.post<LoginResponseData>('http://localhost:8000/login', {
    // return this.http.post<LoginResponseData>('http://localhost:8000/api/login', {
      email: email,
      password: password,
    }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true
    });
  }





  // try {
  //   await this.http.get<{ csrfToken: string }>('http://127.0.0.1:8000/sanctum/csrf-cookie', {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Access-Control-Allow-Credentials': 'true',
  //     })
  //   });
  // }
  // catch (error) {
  //   console.log('csrf fetching error');
  // }

  // this.csrfToken = this.cookieService.get('XSRF-TOKEN');

  // console.log('XSRF-TOKEN: ', this.csrfToken)

  // return this.http.post<LoginResponseData>('http://127.0.0.1:8000/api/login', {
  //   email: email,
  //   password: password,
  // }, {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Credentials': 'true',
  //     'X-XSRF-TOKEN': 'csrf_token_placeholder'
  //   })
  // }).pipe(catchError(errorResponse => {
  //   let errorMessage = 'Error occured';

  //   switch (errorResponse.error.message) {
  //     case "CREDENTIALS_MISMATCH":
  //       errorMessage = "Nieprawidłowe dane logowania";
  //   }
  //   console.log(errorResponse);
  //   return throwError(errorMessage);
  // }
  // )
  //   , tap(responseData => {
  // const expirationDate = new Date(responseData.data.token_expiration);
  // const user = new User(
  //   responseData.data.user.id,
  //   responseData.data.user.email,
  //   responseData.data.token,
  //   expirationDate
  // );
  // this.user.next(user)
  //     console.log(responseData);
  //   })
  // );
  // }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = errorResponse.error;
    return throwError(errorMessage);
  }

}
