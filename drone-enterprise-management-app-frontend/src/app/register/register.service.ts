import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, throwError } from "rxjs";

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
  constructor(private http: HttpClient) { }

  register(email: string, password: string, password_confirmation: string, newsletter: boolean) {
    return this.http.post<RegisterResponseData>('http://localhost:8000/register', {
      email: email,
      password: password,
      password_confirmation: password_confirmation,
      newsletter: newsletter
    }, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    }).pipe(catchError(errorResponse => {
      let errorMessage = 'Wystapił błąd';

      if (!errorResponse.error) {
        return throwError(errorMessage);
      }
      switch (errorResponse.error.message) {
        case "The email has already been taken.":
          errorMessage = "Użytkownik o podanym adresie e-mail już istnieje";
      }
      return throwError(errorMessage);
    }));
  }
}

