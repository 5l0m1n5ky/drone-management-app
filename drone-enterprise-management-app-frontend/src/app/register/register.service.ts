import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, throwError } from "rxjs";

interface RegisterResponseData {
  status: string,
  message: string,
  data: [
    user: [
      email: string,
      updated_at: Date,
      created_at: Date,
      id: string
    ],
    token: string
  ]
}

@Injectable({ providedIn: 'root' })

export class RegisterService {
  constructor(private http: HttpClient) { }

  register(email: string, password: string, password_confirmation: string) {
    return this.http.post<RegisterResponseData>('http://localhost:8000/api/register', {
      email: email,
      password: password,
      password_confirmation: password_confirmation
    }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true
    }).pipe(catchError(errorResponse => {
      let errorMessage = 'Error occured';

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

