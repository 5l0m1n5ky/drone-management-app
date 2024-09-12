import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { LoginService } from './login.service';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { ToastService } from '../shared/toast/toast.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    LoadingSpinnerComponent,
    FormsModule,
    CommonModule,
    ToastModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
})
export class LoginComponent implements OnInit {

  queryParams: any = {};
  hide = true;
  loginForm: any;
  PasswordVisible: boolean = false;
  isLoginError: boolean = false;
  loginError: string;
  isLoading: boolean = false;
  queryParamsSubscriber: Subscription;
  isProcessing = false;

  constructor(private loginService: LoginService, private router: Router, private activatedRoute: ActivatedRoute, private toastService: ToastService) { }

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

  onLoginFormSubmit(form: NgForm) {

    if (!form.valid) {
      return;
    }

    this.isProcessing = true;
    const email = form.value.email;
    const password = form.value.password;

    this.loginService.login(email, password).subscribe(
      responseData => {
        this.isProcessing = false;
        this.router.navigate(['/'], { queryParams: { result: 'success' } });
        form.reset();
      },
      errorMessage => {
        this.isLoginError = true;
        this.loginError = errorMessage;
        this.isProcessing = false;
        form.reset();
      }
    );
  }

}
