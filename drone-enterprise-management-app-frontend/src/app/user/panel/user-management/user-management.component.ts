import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';
import { PanelService } from '../panel.service';
import { Subscription } from 'rxjs';
import { UserData } from '../models/user-data.model';
import { ToastService } from 'src/app/shared/toast/toast.service';

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

  constructor(private panelService: PanelService, private toastService: ToastService) { }

  ngOnInit(): void {
    this.getUsersData();
  }

  getUsersData() {
    this.isProcessing = true
    this.usersSubscription = this.panelService.fetchUsers().subscribe(usersData => {
      this.users = usersData;
      this.isProcessing = false;
    }, errorMessage => {
      this.toastService.generateToast("error", "Pobieranie listy użytkowników", errorMessage);
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

      this.toastService.generateToast("error", "Pobieranie listy użytkowników", errorMessage);
      this.isProcessing = false;
    })
  }

  ngOnDestroy(): void {
    this.usersSubscription?.unsubscribe();
  }
}
