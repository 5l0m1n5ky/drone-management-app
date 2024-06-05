import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginService } from '../auth/login.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: []
})
export class LoginComponent {

  constructor(private loginService: LoginService, private cookieService: CookieService) { }

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



    this.loginService.login(email, password).subscribe(
      responseData => {
        console.log(responseData);
        this.isLoading = false;
      },
      errorMessage => {
        this.isLoginError = true;
        this.loginError = errorMessage.error.message;
        this.isLoading = false;
      }
    );

    // let cookie = this.cookieService.get('XSRF-TOKEN');
    // console.log('cookie 2: ', cookie);




    this.isLoading = false;


    console.log(form.value)
    form.reset();
  }

}
