import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { LoginService } from './login.service';
import { CookieService } from 'ngx-cookie-service';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    LoadingSpinnerComponent,
    FormsModule,
    CommonModule,
  ]
})
export class LoginComponent {

  constructor(private loginService: LoginService, private cookieService: CookieService, private router: Router) { }

  loginForm: any;
  PasswordVisible: boolean = false;
  isLoginError: boolean = false;
  loginError: string;
  isLoading: boolean = false;

  changeVisibilityofPassword() {
    this.PasswordVisible = !this.PasswordVisible;
  }

  onLoginFormSubmit(form: NgForm) {

    if (!form.valid) {
      return;
    }

    this.isLoading = true;
    const email = form.value.email;
    const password = form.value.password;

    this.loginService.login(email, password).subscribe(
      responseData => {
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      errorMessage => {
        this.isLoginError = true;
        this.loginError = errorMessage;
        this.isLoading = false;
      }
    );

    this.isLoading = false;

    form.reset();
  }

}
