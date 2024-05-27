import { HttpClient } from "@angular/common/http";
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
    return this.http.post<RegisterResponseData>('http://127.0.0.1:8000/api/register', {
      email: email,
      password: password,
      password_confirmation: password_confirmation
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

// "status": "Succesful Request",
// "message": null,
// "data": {
//     "user": {
//         "email": "test@test.pl",
//         "updated_at": "2024-05-20T13:01:18.000000Z",
//         "created_at": "2024-05-20T13:01:18.000000Z",
//         "id": 9
//     },
//     "token": "3|8Kp48kM2GYkmJ1r7IM5MM2emhzTgI2386kijGKLib5de15d2"
