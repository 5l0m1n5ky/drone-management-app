// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root'
// })
// export class CsrfService {
//   private csrfToken: string;

//   constructor(private http: HttpClient) { }

//   fetchCsrfToken() {
//     return this.http.get('http://127.0.0.1:8000/sanctum/csrf-cookie', { observe: 'response' }).toPromise()
//       .then(response => {
//         this.csrfToken = response.headers.get('X-CSRF-TOKEN');
//       });
//   }

//   getCsrfToken() {
//     return this.csrfToken;
//   }
// }
