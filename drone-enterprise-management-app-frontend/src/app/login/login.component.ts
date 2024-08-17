import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { LoginService } from './login.service';
import { CookieService } from 'ngx-cookie-service';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { ToastService } from '../shared/toast/toast.service';


@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    LoadingSpinnerComponent,
    FormsModule,
    CommonModule,
    ToastModule
  ],
  providers: [ToastService]
})
export class LoginComponent implements OnInit {

  queryParams: any = {};

  constructor(private loginService: LoginService, private cookieService: CookieService, private router: Router, private activatedRoute: ActivatedRoute, private toastService: ToastService) { }

  queryParamsSubscriber: Subscription;

  ngOnInit(): void {
    this.queryParamsSubscriber = this.activatedRoute.queryParams.subscribe(params => {
      this.queryParams = params;

      if (this.queryParams['action'] && this.queryParams['action'] === 'logout') {
        this.toastService.generateToast('success', 'Wylogowywanie', 'Wylogowano pomyślnie');
      }

      if (this.queryParams['action'] && this.queryParams['action'] === 'session_expired') {
        this.toastService.generateToast('warn', 'Wymagane zalogowanie', 'Twoja sesja wygasła');
      }
    });
  }

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
        this.router.navigate(['/'], { queryParams: { result: 'success' } });
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
