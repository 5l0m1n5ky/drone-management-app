import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RegisterService } from './register.service';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ToastModule } from 'primeng/toast';
import { ToastService } from '../shared/toast/toast.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule, CommonModule, LoadingSpinnerComponent, FormsModule, MatSlideToggleModule, ToastModule],
  selector: 'app-register',
  templateUrl: './register.component.html',
})

export class RegisterComponent implements OnDestroy {

  loginForm: any;
  isProcessing: boolean = false;
  hide: boolean = true;
  confirmPasswordVisible: boolean = false;
  passwordMismatch: boolean = false;
  user_id: number;
  areTermsAccepted: boolean = false;
  termsToggleMessage: boolean = false;
  registerSubscription: Subscription;
  email: string;
  password: string;
  passwordConfirmation: string;
  terms: boolean;
  newsletter: boolean;

  constructor(private registerService: RegisterService, private router: Router, private toastService: ToastService) { }

  termsAccepted() {
    if (this.areTermsAccepted) {
      this.termsToggleMessage = false;
    }
    else {
      this.termsToggleMessage = true;
    }
  }

  onRegisterFormSubmit(registerForm: NgForm) {

    this.termsAccepted();

    if (!registerForm.valid) {
      return;
    }

    this.email = registerForm.value.email;
    this.password = registerForm.value.password;
    this.passwordConfirmation = registerForm.value.password_confirmation;
    this.terms = registerForm.value.terms;
    this.newsletter = registerForm.value.newsletter;

    if (this.newsletter === null) {
      this.newsletter = false;
    }

    // if (registerForm.value.password !== registerForm.value.password_confirmation) {
    //   this.passwordMismatch = true;
    //   this.toastService.generateToast('error', 'Błąd rejestracji', 'Niezgodność haseł')
    //   return;
    // }

    this.isProcessing = true;

    this.registerSubscription = this.registerService.register(this.email, this.password, this.passwordConfirmation, this.terms, this.newsletter).subscribe(responseData => {
      this.isProcessing = false;
      this.user_id = +responseData.data!.user.id;
      this.router.navigate(['account-verification', this.user_id]);
      registerForm.reset();

    },
      errorMessage => {
        this.isProcessing = false;
        registerForm.reset();
        this.toastService.generateToast('error', 'Błąd rejestracji', errorMessage)
      }
    );
  }

  ngOnDestroy(): void {
    this.registerSubscription?.unsubscribe();
  }
}


