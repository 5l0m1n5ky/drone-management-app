import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: []
})
export class LoginComponent {

  constructor(private loginService: LoginService) { }

  loginForm: any;
  PasswordVisible: boolean = false;
  isLoginError: boolean = false;
  loginError: string = "";
  isLoading: boolean = false;



  changeVisibilityofPassword() {
    this.PasswordVisible = !this.PasswordVisible;
  }

  async onLoginFormSubmit(form: NgForm) {

    if (!form.valid) {
      return;
    }

    this.isLoading = true;


    const email = form.value.email;
    const password = form.value.password;

    // return this.http.get('http://127.0.0.1:8000/sanctum/csrf-cookie', { observe: 'response' }).toPromise()
    //   .then(response => {
    //     this.csrfToken = response.headers.get('X-CSRF-TOKEN');
    //   });


    this.loginService.login(email, password).subscribe(responseData => {
      console.log(responseData);
      this.isLoading = false;
    },
      errorMessage => {
        this.isLoginError = true;
        this.loginError = errorMessage;
        this.isLoading = false;
      }
    );

    console.log(form.value)
    form.reset();
  }

}
