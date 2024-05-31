import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, catchError, tap, throwError } from "rxjs";
import { User } from "../user/user.model";

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

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {

    this.http.get<{ csrfToken: string }>('').subscribe((response) => {
      this.csrfToken = response.csrfToken
    })








    return this.http.post<LoginResponseData>('http://127.0.0.1:8000/api/login', {
      email: email,
      password: password
    }).pipe(catchError(errorResponse => {
      let errorMessage = 'Error occured';

      switch (errorResponse.error.message) {
        case "CREDENTIALS_MISMATCH":
          errorMessage = "Nieprawidłowe dane logowania";
      }
      console.log(errorResponse);
      return throwError(errorMessage);
    }

      // catchError()




    ), tap(responseData => {
      const expirationDate = new Date(responseData.data.token_expiration);
      const user = new User(
        responseData.data.user.id,
        responseData.data.user.email,
        responseData.data.token,
        expirationDate
      );
      this.user.next(user)
    }));
  }

}
