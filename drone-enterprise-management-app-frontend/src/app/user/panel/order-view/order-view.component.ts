import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { OrderItem } from '../models/order-item.model';
import { PanelComponent } from '../panel.component';
import { Subscription } from 'rxjs';
import { PanelService } from '../panel.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LoginService } from 'src/app/login/login.service';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { BottomPanelComponent } from './bottom-panel/bottom-panel.component';
import { State } from '../models/state.model';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';
import { ToastService } from 'src/app/shared/toast/toast.service';
import { ChecklistComponent } from '../checklist/checklist.component';
import { Checklist } from '../models/checklist.model';
import { ReportGeneratorComponent } from '../report-generator/report-generator.component';
import { NgForm } from '@angular/forms';
import { NgxFileSaverService } from '@clemox/ngx-file-saver';
import * as Leaflet from 'leaflet';
import { SidebarComponent } from 'src/app/sidebar/sidebar.component';
import { AppComponent } from 'src/app/app.component';
import { LogoutService } from 'src/app/auth/logout.service';

@Component({
  selector: 'app-order-view',
  standalone: true,
  imports: [CommonModule, RouterLink, MatBottomSheetModule, LoadingSpinnerComponent, ChecklistComponent, ReportGeneratorComponent],
  providers: [SidebarComponent],
  templateUrl: './order-view.component.html'
})
export class OrderViewComponent implements OnInit, AfterViewInit, OnDestroy {

  order: OrderItem[] | null;
  orderItem: OrderItem;
  states: State[] = [];
  isProcessing: boolean = false;
  isAdmin: boolean = false;
  latitude: number = environment.origin.lat;
  longitude: number = environment.origin.lng;
  mapInit: boolean = false;
  statesSubscription: Subscription;
  updateStateSubscription: Subscription;
  DownloadingReportSubscription: Subscription;

  checklist: Checklist[] = [];
  checklistView: boolean = false;
  checklistSubscription: Subscription;
  checklistUpdateSubscription: Subscription;
  isReportReady: boolean = true;
  reportCreateMode: boolean = false;
  isInspection: boolean = false;

  marker: Leaflet.Marker;
  markerMobile: Leaflet.Marker;
  map: Leaflet.Map;
  mapMobile: Leaflet.Map;

  constructor(private logoutService: LogoutService, private panelComponent: PanelComponent, private panelService: PanelService, private router: Router, private location: Location, private loginService: LoginService, private bottomSheet: MatBottomSheet, public toastService: ToastService, private fileSaver: NgxFileSaverService, private sidebarComponent: SidebarComponent) { }

  ngOnInit(): void {

    this.isAdmin = this.loginService.hasAdminPrivileges()

    this.order = this.panelComponent.getOrder();

    this.order?.forEach(order => {
      this.orderItem = order;
    });

    if (!this.order) {
      this.location.back();
    }

    this.isReportReady = this.orderItem.isReportReady;

    if (this.orderItem.service !== 'foto/video') {
      this.isInspection = true;
    }
  }

  ngAfterViewInit(): void {

    this.mapConfig();

    const customIcon = Leaflet.icon({
      iconUrl: 'assets/icons/map-marker.png',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    this.marker = Leaflet.marker([
      parseFloat(this.orderItem.latitude.toString()),
      parseFloat(this.orderItem.longitude.toString())
    ],
      { icon: customIcon }
    ).addTo(this.map);
    
    this.markerMobile = Leaflet.marker([
      parseFloat(this.orderItem.latitude.toString()),
      parseFloat(this.orderItem.longitude.toString())
    ],
      { icon: customIcon }
    ).addTo(this.mapMobile);
    
  }

  mapConfig() {
    this.map = Leaflet.map('map', {
      center: Leaflet.latLng(parseFloat(this.orderItem.latitude.toString()), parseFloat(this.orderItem.longitude.toString())),
      zoom: 19,
    });

    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 1,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    this.mapMobile = Leaflet.map('map-mobile', {
      center: Leaflet.latLng(parseFloat(this.orderItem.latitude.toString()), parseFloat(this.orderItem.longitude.toString())),
      zoom: 19,
    });

    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 1,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.mapMobile);
  }

  openBottomSheet() {
    this.isProcessing = true;
    this.statesSubscription = this.panelService.fetchStates().subscribe(states => {
      this.states = states;

      const dataToPass = { data: { states: this.states, orderId: this.orderItem.id } }

      const bottomPanelRef = this.bottomSheet.open(BottomPanelComponent, {
        data: dataToPass
      });
      this.isProcessing = false;

      bottomPanelRef.afterDismissed().subscribe((result) => {
        if (result) {

          this.isProcessing = true;

          this.updateStateSubscription = this.panelService.updateOrderState(result.orderId, result.stateId, result.comment).subscribe(response => {
            this.sidebarComponent.checkBadgeValue();
            this.toastService.generateToast('success', 'Modyfikacja statusu', response.message);
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

  openCheclist() {
    this.isProcessing = true;
    if (this.order) {
      this.checklistSubscription = this.panelService.fetchChecklist(this.order[0].id).subscribe(response => {
        this.checklist = response;
        this.checklistView = true;
        this.isProcessing = false;
      }, errorMessage => {
        this.toastService.generateToast('error', 'Wystąpił błąd podczas wczytywania Checklisty', errorMessage);
        this.isProcessing = false;
      });
    } else {
      this.toastService.generateToast('error', 'Wystąpił błąd podczas wczytywania Checklisty', 'Informacje o zamówieniu są niedostępne');
      this.isProcessing = false;
    }
  }

  closeCheclist() {
    this.checklistView = false;
  }

  enableReportCreateMode() {
    this.reportCreateMode = true;
  }

  onChecklistUpdate(checklist: NgForm) {

    this.isProcessing = true;
    this.closeCheclist();

    if (this.order) {
      this.checklistUpdateSubscription = this.panelService.updateChecklist(checklist, this.order[0].id).subscribe(response => {
        this.toastService.generateToast('success', 'Aktualizacja checklisty', response.message);
        this.isProcessing = false;
      }, errorMessage => {

        switch (errorMessage) {

          case "Unauthenticated": {
            this.router.navigate(['/login'], { queryParams: { action: 'session_expired' } });
            this.logoutService.changeLoginState();
            break;
          }

          default: {
            this.toastService.generateToast('error', 'Aktualizacja checklisty', errorMessage);
          }
        }

        this.isProcessing = false;

      });
    }
  }

  onDownloadReport() {

    if (this.order) {
      this.isProcessing = true;

      this.checklistUpdateSubscription = this.panelService.downloadInspectionReport(this.order[0].id).subscribe((response: Blob) => {
        this.fileSaver.saveBlob(response, 'Raport z inspekcji');
        this.toastService.generateToast('success', 'Pobieranie raportu', 'Raport pobrany pomyślnie');
        this.isProcessing = false;
      }, errorMessage => {
        this.toastService.generateToast('error', 'Pobieranie raportu', errorMessage);
        this.isProcessing = false;
      });

    }
  }

  ngOnDestroy(): void {
    this.statesSubscription?.unsubscribe();
    this.updateStateSubscription?.unsubscribe();
    this.checklistSubscription?.unsubscribe();
    this.checklistUpdateSubscription?.unsubscribe();
    this.DownloadingReportSubscription?.unsubscribe();
  }
}
