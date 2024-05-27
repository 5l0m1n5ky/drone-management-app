import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RegisterService } from './register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: []
})
export class RegisterComponent {

  constructor(private registerService: RegisterService) { }

  loginForm: any;
  isLoading: boolean = false;
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  termsAccepted: boolean = false;
  passwordMismatch: boolean = false;
  registerError: string = '';

  changeVisibilityofPassword() {
    this.passwordVisible = !this.passwordVisible;
  }

  changeVisibilityofPasswordConfirmation() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  onRegisterFormSubmit(form: NgForm) {

    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;
    const password_confirmation = form.value.password_confirmation;

    this.isLoading = true;

    this.registerService.register(email, password, password_confirmation).subscribe(responseData => {
      console.log(responseData);
      this.isLoading = false;
    },
      // errorResponse => {
      // switch (errorResponse.error.message) {
      //   case "The email has already been taken.":
      //     this.registerError = "Użytkownik o podanym adresie e-mail już istnieje";
      // }

      // },
      errorMessage => {
        this.registerError = errorMessage;
        this.isLoading = false;
      }
    );

    console.log(form.value)
    form.reset();
  }

}


