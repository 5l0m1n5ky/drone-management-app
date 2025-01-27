import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PanelService } from '../user/panel/panel.service';
import { Notification } from '../user/panel/models/notification.model';
import { Subscription } from 'rxjs';
import { LoginService } from '../login/login.service';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [CommonModule, RouterLink, RouterLinkActive]
})
export class SidebarComponent implements OnInit, OnDestroy {

  notificationSubsciption: Subscription;
  badgeSubscription: Subscription;
  isMobile: boolean = false;
  notifications: Notification[] = [];
  unseenNotifications: Notification[] = [];
  badgeValue: Number = 0;
  isAdmin: boolean = false;

  constructor(private panelService: PanelService, private loginService: LoginService) { }

  @ViewChild('sidebar') sidebar: ElementRef;

  ngOnInit(): void {
    this.onResize();
    this.fetchNotifications();
    this.badgeSubscription = this.panelService.badgeValue$.subscribe(action => {

      if (action) {
        this.fetchNotifications();
      }
    });

    this.isAdmin = this.loginService.hasAdminPrivileges();
  }

  isSidebarHovered: boolean = false;

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 1024) {
      this.isMobile = false;
    } else {
      this.isMobile = true;
    }
  }

  fetchNotifications() {
    this.notificationSubsciption = this.panelService.fetchNotifications().subscribe(notifications => {
      this.notifications = notifications;
      this.checkBadgeValue();
    });
  }

  checkBadgeValue() {
    this.unseenNotifications = [...this.notifications.filter(notification => notification.seen === false)];
    this.badgeValue = this.unseenNotifications.length;
  }

  ngOnDestroy(): void {
    this.notificationSubsciption?.unsubscribe();
    this.badgeSubscription?.unsubscribe();
  }
}


