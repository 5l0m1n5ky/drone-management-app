import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';
import { PanelService } from '../panel.service';
import { Subscription } from 'rxjs';
import { UserData } from '../models/user-data.model';
import { ToastService } from 'src/app/shared/toast/toast.service';
import { AppComponent } from 'src/app/app.component';
import { Router } from '@angular/router';
import { LogoutService } from 'src/app/auth/logout.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './user-management.component.html',
})
export class UserManagementComponent implements OnInit, OnDestroy {

  isProcessing: boolean = false;

  users: UserData[] = [];
  usersSubscription: Subscription
  userSuspentionUpdateSubscription: any;

  constructor(private router: Router, private logoutService: LogoutService, private panelService: PanelService, private toastService: ToastService) { }

  ngOnInit(): void {
    this.getUsersData();
  }

  getUsersData() {
    this.isProcessing = true
    this.usersSubscription = this.panelService.fetchUsers().subscribe(usersData => {
      this.users = usersData;
      this.isProcessing = false;
    }, errorMessage => {
      // this.toastService.generateToast("error", "Pobieranie listy użytkowników", errorMessage);
      this.router.navigate(['/login'], { queryParams: { action: 'session_expired' } });
      this.logoutService.changeLoginState();
      this.isProcessing = false;
    });
  }

  onUserSuspensionChange(userId: number) {

    this.isProcessing = true;

    this.userSuspentionUpdateSubscription = this.panelService.updateUserSuspension(userId).subscribe(response => {

      this.toastService.generateToast("success", "Modyfikacja danych użytkownika", response.message);

      this.isProcessing = false;

      this.getUsersData();

    }, errorMessage => {

      switch (errorMessage) {

        case "Unauthenticated": {
          this.router.navigate(['/login'], { queryParams: { action: 'session_expired' } });
          this.logoutService.changeLoginState();
          break;
        }

        case "CSRF_TOKEN_MISMATCH": {
          this.router.navigate(['/login'], { queryParams: { action: 'session_expired' } });
          this.logoutService.changeLoginState();
          break;
        }

        default: {
          this.toastService.generateToast("error", "Pobieranie listy użytkowników", errorMessage);
        }
      }

      this.isProcessing = false;
    });
  }

  ngOnDestroy(): void {
    this.usersSubscription?.unsubscribe();
  }
}
