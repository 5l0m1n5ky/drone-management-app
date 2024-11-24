import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../app.component';
import { LogoutService } from '../auth/logout.service';
import { ToastService } from '../shared/toast/toast.service';
import { MessageService } from 'primeng/api';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [
    RouterLink,
    CommonModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './navbar.component.html',
  providers: [
    LogoutService,
    ToastService,
    MessageService
  ]
})
export class NavbarComponent implements OnInit, OnDestroy {

  public isAuthenticated: boolean = false;
  isProcessing: boolean = false;
  logoutSubscription: Subscription;

  constructor(private appComponent: AppComponent, private logoutService: LogoutService, private router: Router) { }

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
    this.isProcessing = true;
    this.logoutSubscription = this.logoutService.logoutHandle().subscribe(response => {
      if (response.data.toString() === 'Wylogowano pomyślnie') {
        this.router.navigate(['/login'], { queryParams: { action: 'logout' } });
      }
      this.isProcessing = false;
    }, () => {
      this.router.navigate(['/login']);
      this.isProcessing = false;
    });
  }

  ngOnDestroy(): void {
    this.logoutSubscription?.unsubscribe();
  }
}
