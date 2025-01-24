import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { environment } from "src/environments/environment";

interface User {
  id: string,
  email: string
}

interface UserData {
  user: User
}

interface RegisterResponseData {
  status?: string,
  message: string,
  data?: UserData
}

@Injectable({ providedIn: 'root' })

export class RegisterService {

  private domain: string | undefined;

  constructor(private http: HttpClient) {
    this.domain = environment.ApiDomain;
  }

  register(email: string, password: string, passwordConfirmation: string, terms: boolean, newsletter: boolean) {
    return this.http.post<RegisterResponseData>(`${this.domain}/register`, {
      email: email,
      password: password,
      password_confirmation: passwordConfirmation,
      terms: terms,
      newsletter: newsletter
    }, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    }).pipe(catchError(errorResponse => {
      let errorMessage = 'Wystapił błąd. Spróbuj ponownie';
      switch (errorResponse.error.message) {
        case 'Unable to process data':
          errorMessage = 'Podane dane nie mogą być przetworzone. Spróbuj ponownie'
      };
      return throwError(errorMessage);
    }));
  }
}

