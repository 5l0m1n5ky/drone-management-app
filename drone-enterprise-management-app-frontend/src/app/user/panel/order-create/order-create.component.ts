import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgModel, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { environment } from 'src/environments/environment';
import { GoogleMap, MapAdvancedMarker } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from "@angular/google-maps";
import { OrderCreateService } from './order-create.service';
import { Service } from './service.model';
import { Subservice } from './subservice.model';
import { State } from './state.model';
import { BackgroundMusic } from './background-music.model';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { ActivatedRoute, Route } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  imports: [MatStepperModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatSliderModule, MatDatepickerModule, MatCardModule, MatNativeDateModule, MatInputModule, GoogleMap, CommonModule, MapAdvancedMarker, GoogleMapsModule, LoadingSpinnerComponent, MatSlideToggleModule, RouterLink],
})
export class OrderCreateComponent implements OnInit, OnDestroy {

  placeOrderForm: FormGroup

  services: Service[] = [];
  currentService: Service[] = [];
  currentSubservices: Subservice[] = [];
  selectedSubservice: Subservice[] = [];
  subservices: Subservice[] = [];
  states: State[] = [];
  bgMusic: BackgroundMusic[] = [];

  minDate: Date = new Date();
  maxDate: Date = new Date();

  areServicesFetched$ = new BehaviorSubject<boolean>(false);
  areSubservicesFetched$ = new BehaviorSubject<boolean>(false);
  // areStatesFetched$ = new BehaviorSubject<boolean>(false);
  isBackgroundMusicFetched$ = new BehaviorSubject<boolean>(false);

  isProcessing: boolean = false;
  fetchFlagsSubscription: any;
  orderSubscription: any;
  ServiceSubscription: any;
  musicSubscription: any;
  orderIdSubsription: any;

  currentServiceId: number;
  currentServiceName: string

  currentSubserviceId: number;
  currentSubserviceName: string
  currentSubserviceUnitAmountMin: number
  currentSubserviceUnitAmountMax: number
  currentSubserviceUnitPrice: number
  currentbgMusicId: number;
  isEnterprise: boolean = true;

  formats: string[] = ['4:3', '3:4', '16:9', '9:16', '21:9', '1:1'];

  orderAlias: string = 'zlecenie#' + Math.floor(10000 + Math.random() * 90000);

  constructor(private orderCreateService: OrderCreateService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.placeOrderForm = new FormGroup({
      postLocationForm: new FormGroup({
        location: new FormControl(null, Validators.required)
      }),
    });

    this.isProcessing = true;

    this.orderSubscription = this.orderCreateService.fetchServices().subscribe(services => {
      this.services = services;
      this.areServicesFetched$.next(true);
    });

    this.ServiceSubscription = this.orderCreateService.fetchSubervices().subscribe(subservices => {
      this.subservices = subservices;
      this.areSubservicesFetched$.next(true);
    });

    // this.orderCreateService.fetchStates().subscribe(states => {
    //   this.states = states;
    //   console.log(this.states);
    // });

    this.musicSubscription = this.orderCreateService.fetchBackgroundMusicTypes().subscribe(bgMusic => {
      this.bgMusic = bgMusic;
      this.isBackgroundMusicFetched$.next(true);
    });

    this.fetchFlagsSubscription = combineLatest([this.areServicesFetched$, this.areSubservicesFetched$, this.isBackgroundMusicFetched$]).subscribe(
      ([areServicesFetched, areSubservicesFetched, isBackgroundMusicFetched,]) => {
        if (areServicesFetched && areSubservicesFetched && isBackgroundMusicFetched) {
          this.isProcessing = false;
          this.assignCurrentService(this.currentServiceId);
          this.assignCurrentSubervice(this.currentServiceId);
        }
      }
    );

    const serviceIdFromUrl: string | null = this.route.snapshot.paramMap.get('service_id');

    if (serviceIdFromUrl) {
      this.currentServiceId = +serviceIdFromUrl;
    }
  }

  assignCurrentService(currentServiceId: number) {
    if (this.services.filter(service => service.id === currentServiceId)) {
      this.currentService = this.services.filter(service => service.id === currentServiceId);
      this.currentServiceName = this.currentService[0].service_type;
    }
  }

  assignCurrentSubervice(currentServiceId: number) {
    if (this.subservices.filter(subservice => subservice.service_id === currentServiceId)) {
      this.currentSubservices = this.subservices.filter(subservice => subservice.service_id === currentServiceId);
    }
  }

  setCurrentSubservice(subservice_id: any) {
    this.currentSubserviceId = parseInt(subservice_id);
    this.selectedSubservice = this.currentSubservices.filter(subservice => subservice.id === this.currentSubserviceId);
    this.currentSubserviceName = this.selectedSubservice[0].subservice;
    this.currentSubserviceUnitAmountMin = this.selectedSubservice[0].unit_amount_min;
    this.currentSubserviceUnitAmountMax = this.selectedSubservice[0].unit_amount_max;
    this.currentSubserviceUnitPrice = this.selectedSubservice[0].unit_price;
    console.log(this.currentSubserviceName);
  }

  setCurrentBgMusic(bgMusic_id: any) {
    this.currentbgMusicId = parseInt(bgMusic_id);
  }

  onPlaceOrder() {

  }

  options: google.maps.MapOptions = {
    mapId: "DEMO_MAP_ID",
    center: { lat: 53.122028, lng: 18.000292 },
    zoom: 15,
  };

  amount: number = 0;
  selected: Date | null;
  googleMapsApiKey = environment.googleMapsApiKey;

  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPositions: google.maps.LatLngLiteral[] = [];
  selectedLocation: string = "";

  addMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.markerPositions = [];
      this.markerPositions.push(event.latLng.toJSON());

      console.log(this.markerPositions);

      this.orderCreateService.reverseGeocoding(this.markerPositions.toString());
    }
  }

  ngOnDestroy(): void {
    // this.fetchFlagsSubscription.unsubscribe();
    // this.orderSubscription.unsubscribe();
    // this.ServiceSubscription.unsubscribe();
    // this.musicSubscription.unsubscribe();
    // this.orderIdSubsription.unsubscribe();
  }
}




