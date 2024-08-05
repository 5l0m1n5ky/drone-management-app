import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CsrfService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  private csrfToken: string = this.cookieService.get('XSRF-TOKEN');

  async fetchCsrfToken(): Promise<void> {
    // if (!this.csrfToken) {
      try {
        // Make the request to get the CSRF token
        console.log('inside fetch csrf method');
        await this.http.get('http://localhost:8000/sanctum/csrf-cookie', {
          headers: new HttpHeaders({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            // 'Access-Control-Allow-Credentials': 'true',
          }),
          withCredentials: true,
        }).toPromise();
        // Fetch the CSRF token from the cookie
        this.csrfToken = this.cookieService.get('XSRF-TOKEN');
      } catch (error) {
        console.error('Failed to fetch CSRF token', error);
      }
    // }
  }

  getCsrfToken(): string | null {
    return this.csrfToken;
  }
}
