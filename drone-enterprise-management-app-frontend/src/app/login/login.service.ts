import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

interface LoginResponseData {
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

export class LoginService {
  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    return this.http.post('http://127.0.0.1:8000/api/login', {
      email: email,
      password: password
    });
  }

}
