import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PanelService } from '../user/panel/panel.service';
import { Notification } from '../user/panel/models/notification.model';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [CommonModule, RouterLink, RouterLinkActive]
})
export class SidebarComponent implements OnInit {

  notificationSubsciption: any;
  isMobile: boolean = false;
  notifications: Notification[] = [];
  unseenNotifications: Notification[] = [];
  badgeValue: Number = 0;

  constructor(private panelService: PanelService) { }

  @ViewChild('sidebar') sidebar: ElementRef;

  ngOnInit(): void {
    this.onResize();

    this.notificationSubsciption = this.panelService.fetchNotifications().subscribe(notifications => {
      console.log(notifications);
      this.notifications = notifications;

      this.checkBadgeValue();

    });

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

  checkBadgeValue() {

    this.unseenNotifications = [...this.notifications.filter(notification => notification.seen === false)];

    this.badgeValue = this.unseenNotifications.length;
  }
}


