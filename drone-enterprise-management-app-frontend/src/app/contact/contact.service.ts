import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, tap, throwError } from "rxjs";

interface ResponseData {
  data: string,
  message: string
}

@Injectable({ providedIn: 'root' })

export class ContactService {

  constructor(private http: HttpClient) { }

  sendMessage(email: string, subject: string, content: string) {
    return this.http.post<ResponseData>('http://localhost:8000/contact',
      {
        email: email,
        subject: subject,
        content: content
      },
      {
        withCredentials: true,
        reportProgress: true
      }
    ).pipe(catchError(this.handleError),
      tap(response => {
        return response.message;
      }
      ));
  }

  private handleError(errorResponse: HttpErrorResponse) {

    let errorMessage = 'Wystapił błąd';
    if (errorResponse.error.data) {
      errorMessage = errorResponse.error.data;
    } else {
      errorMessage = errorResponse.error.message;
    }

    return throwError(errorMessage);
  }

}
