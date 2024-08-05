import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../app.component';
import { LogoutService } from '../auth/logout.service';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  providers: [LogoutService]
})
export class NavbarComponent implements OnInit {

  public isAuthenticated: boolean = false;

  constructor(private appComponent: AppComponent, private logoutService: LogoutService) { }

  ngOnInit(): void {
    this.isAuthenticated = this.appComponent.getLoginState();
  }

  menuToggled: boolean = false;

  onMenuToggled(): void {
    this.menuToggled = !this.menuToggled;
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 1024) {
      this.menuToggled = false;
    }
  }

  onLogout() {
    console.log('on logout');
    this.logoutService.logout();
  }
}
