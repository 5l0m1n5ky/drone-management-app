import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [CommonModule, RouterLink, RouterLinkActive]
})
export class SidebarComponent implements OnInit {

  constructor() { }

  isMobile: boolean = false;
  // isNotificationLink: boolean = false;
  // isServicesLink: boolean = true;
  // isUserAccountLink: boolean = false;

  @ViewChild('sidebar') sidebar: ElementRef;

  ngOnInit(): void {
    this.onResize()
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

  // onNotificationLink() {
  //   this.isNotificationLink = true;
  //   this.isServicesLink = false;
  //   this.isUserAccountLink = false;
  // }

  // onServicesLink() {
  //   this.isServicesLink = true;
  //   this.isNotificationLink = false;
  //   this.isUserAccountLink = false;
  // }

  // onUserAccountLink() {
  //   this.isUserAccountLink = true;
  //   this.isNotificationLink = false;
  //   this.isServicesLink = false;
  // }

}


