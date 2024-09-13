import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { OrderItem } from '../models/order-item.model';
import { PanelComponent } from '../panel.component';
import { Subscription } from 'rxjs';
import { PanelService } from '../panel.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { environment } from 'src/environments/environment';
import { GoogleMapsModule } from '@angular/google-maps';
import { GoogleMap } from '@angular/google-maps';
import { MapAdvancedMarker } from '@angular/google-maps';
import { LoginService } from 'src/app/login/login.service';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { BottomPanelComponent } from './bottom-panel/bottom-panel.component';
import { State } from '../models/state.model';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';
import { ToastService } from 'src/app/shared/toast/toast.service';

@Component({
  selector: 'app-order-view',
  standalone: true,
  imports: [CommonModule, RouterLink, GoogleMapsModule, GoogleMap, MapAdvancedMarker, MatBottomSheetModule, LoadingSpinnerComponent],
  templateUrl: './order-view.component.html'
})
export class OrderViewComponent implements OnInit {

  order: OrderItem[] | null;
  orderItem: OrderItem;
  states: State[] = [];
  isProcessing: boolean = false;
  isAdmin: boolean = false;
  latitude: number = 53.122028;
  longitude: number = 18.000292;
  center: google.maps.LatLngLiteral;

  options: google.maps.MapOptions = {
    mapId: "DEMO_MAP_ID",
    zoom: 17,
    maxZoom: 20,
    minZoom: 5,
  };
  googleMapsApiKey = environment.googleMapsApiKey;

  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPositions: google.maps.LatLngLiteral[] = [];
  mapInit: boolean = false;
  statesSubscription: Subscription;
  updateStateSubscription: Subscription;

  constructor(private panelComponent: PanelComponent, private panelService: PanelService, private router: Router, private location: Location, private loginService: LoginService, private bottomSheet: MatBottomSheet, private toastService: ToastService) { }

  ngOnInit(): void {

    this.isAdmin = this.loginService.hasAdminPrivileges()

    this.order = this.panelComponent.getOrder();

    this.order?.forEach(order => {
      this.orderItem = order;
    });

    if (!this.order) {
      this.location.back();
    }

    const latitude = parseFloat(this.orderItem.latitude.toString());
    const longitude = parseFloat(this.orderItem.longitude.toString());

    this.markerPositions.push({ lat: latitude, lng: longitude });

    this.center = { lat: latitude, lng: longitude };
  }

  openBottomSheet() {
    this.isProcessing = true;
    this.statesSubscription = this.panelService.fetchStates().subscribe(states => {
      this.states = states;

      console.log('states: ', states);

      const dataToPass = { data: { states: this.states, orderId: this.orderItem.id } }

      const bottomPanelRef = this.bottomSheet.open(BottomPanelComponent, {
        data: dataToPass
      });
      this.isProcessing = false;

      bottomPanelRef.afterDismissed().subscribe((result) => {
        if (result) {
          console.log(result);

          this.isProcessing = true;

          this.updateStateSubscription = this.panelService.updateOrderState(result.orderId, result.stateId, result.comment).subscribe(response => {
            console.log(response);
            this.toastService.generateToast('success', 'Modyfikacja statusu', response.data.toString());
            this.isProcessing = false;
            this.router.navigate(['/user/panel/orders']);
          }, errorMessage => {
            this.toastService.generateToast('error', 'Modyfikacja statusu', errorMessage);
            this.isProcessing = false;
          });
        }
      });
    });
  }

}
