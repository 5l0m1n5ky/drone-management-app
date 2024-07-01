import { Component, OnInit, computed, signal } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { RegisterService } from './register.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: []
})
export class RegisterComponent {

  loginForm: any;
  isLoading: boolean = false;
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  termsAccepted: boolean = false;
  passwordMismatch: boolean = false;
  registerError: string = '';
  user_id: number;

  constructor(private registerService: RegisterService, private router: Router) { }

  changeVisibilityofPassword() {
    this.passwordVisible = !this.passwordVisible;
  }

  changeVisibilityofPasswordConfirmation() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  onRegisterFormSubmit(registerForm: NgForm) {

    if (!registerForm.valid) {
      return;
    }

    if (registerForm.value.password !== registerForm.value.password_confirmation) {
      this.passwordMismatch = true;
      return;
    }

    const email = registerForm.value.email;
    const password = registerForm.value.password;
    const password_confirmation = registerForm.value.password_confirmation;

    this.isLoading = true;

    this.registerService.register(email, password, password_confirmation).subscribe(responseData => {
      console.log(responseData);
      this.isLoading = false;
      this.user_id = +responseData.data!.user.id;
      console.log('user id:', this.user_id);
      this.router.navigate(['account-verification', this.user_id]);
    },
      errorMessage => {
        this.registerError = errorMessage;
        this.isLoading = false;
      }
    );

    console.log(registerForm.value)
    registerForm.reset();
  }

}


