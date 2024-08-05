import { Component, OnInit } from '@angular/core';
import * as Aos from 'aos';
import { LoginService } from './login/login.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  constructor(private loginService: LoginService) { }

  private userSubscription: Subscription

  isAuthenticated: boolean = false;

  title = 'drone-enterprise-management-app';


  ngOnInit(): void {
    Aos.init();
    console.log('app component init');
    this.userSubscription = this.loginService.getUserData().subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  getLoginState(): boolean {
    return this.isAuthenticated;
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

}
