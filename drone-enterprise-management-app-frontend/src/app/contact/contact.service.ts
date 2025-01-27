import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, tap, throwError } from "rxjs";
import { environment } from "src/environments/environment";

interface ResponseData {
  data: string,
  message: string
}

@Injectable({ providedIn: 'root' })

export class ContactService {

  private domain: string | undefined;

  constructor(private http: HttpClient) {
    this.domain = environment.ApiDomain;
  }

  sendMessage(email: string, subject: string, content: string) {
    return this.http.post<ResponseData>(`${this.domain}/api/contact`,
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
