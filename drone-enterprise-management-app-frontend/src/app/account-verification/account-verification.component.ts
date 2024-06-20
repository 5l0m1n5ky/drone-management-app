import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AccountVerificationService } from './account-verification.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

interface AccountVerificationResponseData {
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

@Component({
  selector: 'app-verification-email',
  templateUrl: './account-verification.component.html',
  styleUrls: ['./account-verification.component.css']
})
export class AccountVerificationComponent implements OnInit {

  isVerification: boolean = true;
  verifyButtonDisable: boolean = true;
  isVeryfing: boolean = false;
  isTokenMismatch: boolean = false;
  isVerificationSuccess: boolean = false;
  isVerificationFail: boolean = false;
  isResendLoading: boolean = false;
  isResendDone: boolean = false;
  verificationToken!: string;
  user_id: number;
  private subscription: Subscription = new Subscription;


  constructor(private accountVerificationService: AccountVerificationService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe((params: Params) => {
      this.user_id = +params['user_id'];
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onCodeChanged(code: string) {
    console.log('code changed: ', code);

    if (this.isTokenMismatch) {
      this.isTokenMismatch = false;
    }
  }

  onCodeCompleted(code: string) {
    console.log('code completed: ', code);

    this.verifyButtonDisable = false;
    this.verificationToken = code;
  }

  onVerify() {

    this.isVeryfing = true;

    this.accountVerificationService.verify(this.user_id, this.verificationToken).subscribe(responseData => {
      if (responseData.message === "ACCOUNT_VERIFIED" || responseData.message === "VERIFICATION_TOKEN_MISMATCH") {
        this.isVeryfing = false;
        this.isVerification = false;
        this.isVerificationSuccess = true;
      }
    },
      errorMessage => {
        this.isVeryfing = false;

        switch (errorMessage) {
          case "VERIFICATION_TOKEN_MISMATCH":
            this.isTokenMismatch = true;
            break;

          case "VERIFICATION_ERROR":
            this.isVerificationFail = true;
            this.isVerification = false;
            break;

          default:
            this.isVerificationFail = true;
            this.isVerification = false;
            break;
        }
      }
    );
  }

  onTokenResend() {
  }

  redirectToLogin() {
    this.router.navigate(['login']);
  }

  redirectToRegister() {
    this.router.navigate(['register']);
  }

}

