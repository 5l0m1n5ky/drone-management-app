import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from 'src/app/sidebar/sidebar.component';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { OrderItem } from './models/order-item.model';
import { PanelService } from './panel.service';

@Component({
  standalone: true,
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  imports: [
    RouterOutlet,
    SidebarComponent,
    ToastModule
  ]
})
export class PanelComponent implements OnInit, OnDestroy {

  constructor(private panelService: PanelService) { }

  orderSubscription: Subscription;
  isReportReadySubscription: Subscription;

  order: OrderItem[] | null;


  ngOnInit(): void {
    
    this.orderSubscription = this.panelService.orderToShowObservable$.subscribe(order => {
      this.order = order
    });
  }

  getOrder(): OrderItem[] | null {
    return this.order
  }

  ngOnDestroy(): void {
    this.orderSubscription?.unsubscribe();
    this.isReportReadySubscription?.unsubscribe();
  }
}
