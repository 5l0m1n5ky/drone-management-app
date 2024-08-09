import { Component, OnInit } from '@angular/core';
import * as Aos from 'aos';
import { LoginService } from './login/login.service';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  constructor(private loginService: LoginService, private cookieService: CookieService) { }

  private userSubscription: Subscription

  isAuthenticated: boolean = false;

  title = 'drone-enterprise-management-app';


  ngOnInit(): void {
    Aos.init();
    this.userSubscription = this.loginService.getUserData().subscribe(user => {
      this.isAuthenticated = !!user;
      this.cookieService.set('user', JSON.stringify({ id: user.id, email: user.email, privileges: user.privileges }));
    });
  }

  getLoginState(): boolean {
    return this.isAuthenticated;
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

}
