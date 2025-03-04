import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from 'src/app/login/login.service';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { PanelService } from '../panel.service';
import { OrderItem } from '../models/order-item.model';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChecklistComponent } from '../checklist/checklist.component';
import { LogoutService } from 'src/app/auth/logout.service';

@Component({
  standalone: true,
  selector: 'app-order',
  templateUrl: './order.component.html',
  imports: [CommonModule, LoadingSpinnerComponent, RouterLink, ChecklistComponent],
})
export class OrderComponent implements OnInit, OnDestroy {

  orderSubscription: any;
  musicSubscription: any;
  onCheckSubscription: Subscription;
  orders: OrderItem[] = [];
  isProcessing: boolean = false;

  constructor(private loginService: LoginService, private router: Router, private logoutService: LogoutService, private panelService: PanelService) { }

  ngOnInit(): void {

    this.isProcessing = true;
    this.orderSubscription = this.panelService.fetchOrders().subscribe(orders => {
      this.orders = orders;
      this.isProcessing = false;
    }, errorMessage => {

      switch (errorMessage) {

        case "DENIED":
          this.router.navigate(['/login'], { queryParams: { action: 'session_expired' } });
          this.logoutService.changeLoginState();        
      }
      this.isProcessing = false;
    });
  }

  isAdmin() {
    return this.loginService.hasAdminPrivileges();
  }

  onOrderDetails(orderId: Number) {
    if (this.orders) {
      this.panelService.assignOrderItem(this.orders.filter(order => order.id === orderId));
      this.router.navigate(['/user/panel/order-view']);
    } else {
      this.router.navigate(['/user/panel/order-view']);
    }
  }

  ngOnDestroy(): void {
    this.orderSubscription?.unsubscribe();
    this.musicSubscription?.unsubscribe();
    this.onCheckSubscription?.unsubscribe();
  }
}
