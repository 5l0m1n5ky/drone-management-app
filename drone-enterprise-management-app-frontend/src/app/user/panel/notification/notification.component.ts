import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PanelService } from '../panel.service';
import { Notification } from '../models/notification.model';
import { Subscription } from 'rxjs';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';
import { Router } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';


@Component({
  standalone: true,
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  imports: [CommonModule, LoadingSpinnerComponent, MatExpansionModule]
})

export class NotificationComponent implements OnInit, OnDestroy {

  notifications: Notification[] = [];
  notificatonSubscription: Subscription;

  isProcessing: boolean = false;
  updateSeenStatusSubscription: any;

  constructor(private panelService: PanelService, private router: Router) { }

  ngOnInit(): void {

    this.fetchNotifications();
  }

  fetchNotifications() {
    this.isProcessing = true;

    this.notificatonSubscription = this.panelService.fetchNotifications().subscribe(notifications => {
      this.notifications = notifications;

      this.isProcessing = false;

    }, errorResponse => {

      this.isProcessing = false;

      switch (errorResponse.error.message) {
        case 'Unauthenticated.':
          this.router.navigate(['/login'], { queryParams: { action: 'session_expired' } });
      }
    });
  }

  onNotificationShow(notificationId: Number, seen: Boolean) {

    if (!seen) {
      this.updateSeenStatusSubscription = this.panelService.updateNotificationSeenStatus(notificationId).subscribe(() => {
        this.notifications.filter(notification => notification.id === notificationId).map(notification => notification.seen = true);
        this.panelService.updateBadgeValue();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.notificatonSubscription) {
      this.notificatonSubscription.unsubscribe();
    }

    if (this.updateSeenStatusSubscription) {
      this.updateSeenStatusSubscription.unsubscribe();
    }

  }
}
