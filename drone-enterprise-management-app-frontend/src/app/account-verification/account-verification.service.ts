import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

interface RequestData {
  user_id: string;
  token: string;
}

interface Data {
  request: RequestData;
}

interface AccountVerificationResponseData {
  status: string;
  message: string;
  data: Data;
}

interface ResponseData {
  message: string;
  data: Data;
}

@Injectable({
  providedIn: 'root',
})
export class AccountVerificationService {

  private domain: string | undefined;

  constructor(private http: HttpClient) {
    this.domain = environment.ApiDomain
  }

  verify(userId: number, code: string) {
    return this.http
      .post<AccountVerificationResponseData>(
        `${this.domain}/api/verify-account`,
        {},
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
          params: new HttpParams().set('user_id', userId).set('token', code),
          withCredentials: true,
        }
      )
      .pipe(
        catchError((errorResponse) => {
          return throwError(errorResponse.error.message);
        })
      );
  }

  tokenResend(userId: number) {
    return this.http
      .post<ResponseData>(
        `${this.domain}/api/regenerate-token`,
        {
          user_id: userId,
        },
        {
          headers: new HttpHeaders({
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }),
          withCredentials: true,
        }
      )
      .pipe(
        catchError((errorResponse) => {
          return throwError(errorResponse.error.message);
        })
      );
  }
}
