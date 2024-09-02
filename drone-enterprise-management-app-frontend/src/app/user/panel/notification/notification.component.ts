import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PanelService } from '../panel.service';
import { Notification } from '../models/notification.model';
import { Subscription } from 'rxjs';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  imports: [CommonModule, LoadingSpinnerComponent]
})

export class NotificationComponent implements OnInit, OnDestroy {

  notifications: Notification[] = [];
  notificatonSubscription: Subscription;

  isProcessing: boolean = false;

  constructor(private panelService: PanelService, private router: Router) { }

  ngOnInit(): void {

    this.isProcessing = true;
    this.notificatonSubscription = this.panelService.fetchNotifications().subscribe(notifications => {
      this.notifications = notifications;
      this.isProcessing = false;
    });
  }

  onNotificationShow(notificationId: Number) {
    this.router.navigate(['/user/panel/notification-view']);

    this.panelService.updateNotificationSeenStatus(notificationId);
  }

  ngOnDestroy(): void {
    if (this.notificatonSubscription) {
      this.notificatonSubscription.unsubscribe();
    }
  }
}
