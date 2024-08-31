import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/login/login.service';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { PanelService } from '../panel.service';
import { OrderItem } from '../models/order-item.model';
import { RouterLink } from '@angular/router';


@Component({
  standalone: true,
  selector: 'app-order',
  templateUrl: './order.component.html',
  imports: [CommonModule, LoadingSpinnerComponent, RouterLink],
})
export class OrderComponent implements OnInit {

  orderSubscription: any;
  ServiceSubscription: any;
  musicSubscription: any;
  fetchFlagsSubscription: any;

  constructor(private loginService: LoginService, private router: Router, private appComponent: AppComponent, private panelService: PanelService) { }

  orders: OrderItem[] = [];
  isProcessing: boolean = false;
  onCheckSubscription: any;

  ngOnInit(): void {

    console.log('orders: ', this.orders);

    this.isProcessing = true;
    this.onCheckSubscription = this.loginService.checkSession().subscribe(responseData => {
      if (responseData && responseData.message && responseData.message.toString() === 'ACTIVE_SESSION') {
        // this.isProcessing = false;
        this.orderSubscription = this.panelService.fetchOrders().subscribe(orders => {
          this.orders = orders;
          // console.log(this.orders);
          this.isProcessing = false;
        });
      }
    }, () => {
      this.router.navigate(['/login'], { queryParams: { action: 'session_expired' } });
      this.appComponent.changeLoginState();
      this.isProcessing = false;
    });
  }

  onOrderDetails(orderId: Number) {
    if (this.orders) {
      this.panelService.assignOrderItem(this.orders.filter(order => order.id === orderId));
      this.router.navigate(['/user/panel/order-view']);
    } else {
      this.router.navigate(['/user/panel/order-view']);
    }
  }
}
