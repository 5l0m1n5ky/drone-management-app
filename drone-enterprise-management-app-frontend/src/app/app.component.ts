import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as Aos from 'aos';
import { LoginService } from './login/login.service';
import { exhaustMap, Subscription, take } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from './shared/toast/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [ToastService]
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(private loginService: LoginService, private cookieService: CookieService, private activatedRoute: ActivatedRoute, private toastService: ToastService) { }

  userSubscription: Subscription
  queryParamsSubscriber: Subscription

  isAuthenticated: boolean = false;

  title = 'drone-enterprise-management-app';

  queryParams: any = {};

  ngOnInit(): void {
    Aos.init();
    // this.userSubscription = this.loginService.getUserData().subscribe(user => {
    this.loginService.user.pipe(take(1)).subscribe(user => {
      this.isAuthenticated = !!user;
      // this.cookieService.set('user', JSON.stringify({ id: user?.id, email: user?.email, privileges: user?.privileges }));
    });

    this.queryParamsSubscriber = this.activatedRoute.queryParams.subscribe(params => {
      this.queryParams = params;

      if (this.queryParams['result'] && this.queryParams['result'] === 'success') {
        this.toastService.generateToast('success', 'Logowanie', 'Zalogowano pomyślnie');
      }
    });

    this.loginService.autoLogin();
  }

  getLoginState(): boolean {

    if (this.cookieService.get('user') || this.isAuthenticated) {
      return true;
    } else {
      return false;
    }

  }

  changeLoginState() {
    this.isAuthenticated = false;
    if (this.getLoginState()) {
      this.cookieService.delete('user');
    }
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
    this.queryParamsSubscriber?.unsubscribe();
  }

}
