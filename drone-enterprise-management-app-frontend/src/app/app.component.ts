import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from './login/login.service';
import { Subscription, take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from './shared/toast/toast.service';
import * as Aos from 'aos';
import { User } from './user/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [ToastService],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private loginService: LoginService,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService
  ) { }

  userSubscription: Subscription;
  queryParamsSubscriber: Subscription;

  title = 'drone-enterprise-management-app';

  queryParams: any = {};

  ngOnInit(): void {
    Aos.init();
    this.userSubscription = this.loginService.user.subscribe({
      next: (user: User | null) => {

        if (user !== null) {
          this.loginService.isAuthenticated.next(true);
        } else {
          this.loginService.isAuthenticated.next(false);
        }
      }
    });

    this.queryParamsSubscriber = this.activatedRoute.queryParams.subscribe(
      (params) => {
        this.queryParams = params;

        if (
          this.queryParams['result'] &&
          this.queryParams['result'] === 'success'
        ) {
          this.toastService.generateToast(
            'success',
            'Logowanie',
            'Zalogowano pomyślnie'
          );
        }
      }
    );

    this.loginService.autoLogin();

  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
    this.queryParamsSubscriber?.unsubscribe();
  }
}
