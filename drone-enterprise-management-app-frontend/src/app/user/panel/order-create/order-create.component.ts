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
import { BehaviorSubject, combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatDialog } from '@angular/material/dialog';
import { CancelDialogComponent } from 'src/app/shared/cancel-dialog/cancel-dialog.component';

@Component({
  standalone: true,
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  imports: [MatStepperModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatSliderModule, MatDatepickerModule, MatCardModule, MatNativeDateModule, MatInputModule, GoogleMap, CommonModule, MapAdvancedMarker, GoogleMapsModule, LoadingSpinnerComponent, MatSlideToggleModule, RouterLink],
  providers: [DatePipe]
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

  options: google.maps.MapOptions = {
    mapId: "DEMO_MAP_ID",
    center: { lat: 53.122028, lng: 18.000292 },
    zoom: 15,
  };

  selected: Date | null;
  googleMapsApiKey = environment.googleMapsApiKey;

  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPositions: google.maps.LatLngLiteral[] = [];
  isLocationSelected: boolean = false;
  selectedLocation: string = "";
  orderFromOriginToDestinationDistance: number;

  minDate: Date = new Date();
  maxDate: Date = new Date();
  orderDate: String | undefined;

  areServicesFetched$ = new BehaviorSubject<boolean>(false);
  areSubservicesFetched$ = new BehaviorSubject<boolean>(false);
  isBackgroundMusicFetched$ = new BehaviorSubject<boolean>(false);

  isProcessing: boolean = false;
  fetchFlagsSubscription: Subscription;
  orderSubscription: Subscription;
  ServiceSubscription: Subscription;
  musicSubscription: Subscription;
  orderIdSubscription: Subscription;
  isEnterpriseSubsription: Subscription;
  dialogActionSubscription: Subscription;
  dialogSubscription: Subscription;


  private actionSubject = new Subject<any>();
  action$: Observable<any> = this.actionSubject.asObservable();

  currentServiceId: number;
  currentServiceName: string

  currentSubserviceId: number;
  currentSubserviceName: string
  currentSubserviceUnitAmountMin: number
  currentSubserviceUnitAmountMax: number
  currentSubserviceUnitPrice: number
  currentbgMusicId: number;
  isEnterprise: boolean = true;

  priceBrutto: number;
  priceNetto: number;

  formats: string[] = ['4:3', '3:4', '16:9', '9:16', '21:9', '1:1'];

  orderAlias: string = 'zlecenie#' + Math.floor(10000 + Math.random() * 90000);

  constructor(private orderCreateService: OrderCreateService, private route: ActivatedRoute, private datePipe: DatePipe, private dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {

    this.isProcessing = true;

    this.orderSubscription = this.orderCreateService.fetchServices().subscribe(services => {
      this.services = services;
      this.areServicesFetched$.next(true);
    });

    this.ServiceSubscription = this.orderCreateService.fetchSubervices().subscribe(subservices => {
      this.subservices = subservices;
      this.areSubservicesFetched$.next(true);
    });

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

    this.placeOrderForm = new FormGroup({
      ServiceDetailsForm: new FormGroup({
        service_id: new FormControl(null, Validators.required),
        subservice_id: new FormControl(null, Validators.required),
        amount: new FormControl(null, Validators.required),
        bgMusicId: new FormControl(null),
        format: new FormControl(null),
        report: new FormControl(null),
      }),
      OrderLocationForm: new FormGroup({
        latitude: new FormControl(null, Validators.required),
        longitude: new FormControl(null, Validators.required),
      }),
      OrderDate: new FormGroup({
        date: new FormControl(null, Validators.required),
      }),
      CustomerDataForm: new FormGroup({
        name: new FormControl(null, Validators.required),
        surname: new FormControl(null),
        nip: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]*$/)]),
        streetName: new FormControl(null, Validators.required),
        streetNumber: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]*$/)]),
        apartmentNumber: new FormControl(null, Validators.pattern(/^[0-9]*$/)),
        city: new FormControl(null, Validators.required),
        zip: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]*$/)]),
        tel: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]*$/)]),
        email: new FormControl(null, [Validators.required, Validators.email])
      }),
      OrderDetailForm: new FormGroup({
        alias: new FormControl(this.orderAlias, Validators.required),
        description: new FormControl(null),
        price: new FormControl(null, Validators.required),
      })
    });
  }

  onStepChange(event: StepperSelectionEvent) {
    if (event.selectedIndex === 4) {
      this.makeSummary();
    }
  }

  assignCurrentService(currentServiceId: number) {
    if (this.services.filter(service => service.id === currentServiceId)) {
      this.currentService = this.services.filter(service => service.id === currentServiceId);
      this.placeOrderForm.get("ServiceDetailsForm.service_id")?.patchValue(currentServiceId);
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

    switch (this.currentSubserviceName) {

      case "fotografia":
        console.log('foto ', this.currentSubserviceName);
        this.setValidatorsForPhoto();
        break;

      case "relacja z wydarzenia":
        console.log('video ', this.currentSubserviceName);
        this.setValidatorsForVideo();
        break;

      case "spot reklamowy":
        console.log('video ', this.currentSubserviceName);
        this.setValidatorsForVideo();
        break;

      case "inspekcja RGB" || "inspekcja IR" || "inspekcja RGB+IR" || "ortofotomapa" || "ortomozaika" || "model 3D":
        console.log('ins ', this.currentSubserviceName);
        this.setValidatorsForInspection()
        break;
    }
  }

  setCurrentBgMusic(bgMusic_id: any) {
    this.currentbgMusicId = parseInt(bgMusic_id);
  }

  onPlaceOrder() {
    console.log(this.placeOrderForm.value);
  }

  onCancel() {
    console.log('cancel');
    if (!this.placeOrderForm.get('ServiceDetailsForm')?.touched) {
      this.router.navigate(['/user/panel/orders'])
    } else {
      this.openDialog(30, 30, 'Anulować?', 'Wszystkie zmiany zostaną utracone', 'WRÓĆ', 'ANULUJ');
      this.dialogActionSubscription = this.action$.subscribe(action => {
        if (action === 'confirm') {
          this.router.navigate(['/user/panel/orders'])
        }
        this.dialogActionSubscription.unsubscribe();

        this.placeOrderForm.reset();
      });
    }
  }

  openDialog(widthInPercent: number, heightInPercent: number, title: string, content: string, cancellation: string, confirmation: string) {
    let dialogReference = this.dialog.open(
      CancelDialogComponent,
      {
        width: widthInPercent.toString() + '%',
        height: heightInPercent.toString() + '%',
        data: {
          title: title,
          content: content,
          cancellation: cancellation,
          confirmation: confirmation
        }
      }
    );

    this.dialogSubscription = dialogReference.afterClosed().subscribe(action => {
      this.dialogSubscription.unsubscribe();
      this.actionSubject.next(action);
    });
  }

  addMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.markerPositions = [];
      this.markerPositions.push(event.latLng.toJSON());
      // this.orderCreateService.reverseGeocoding(this.markerPositions.toString());
      const latitude = event.latLng.lat();
      const longitude = event.latLng.lng();

      this.isLocationSelected = true;

      this.placeOrderForm.get('OrderLocationForm.latitude')?.patchValue(latitude);
      this.placeOrderForm.get('OrderLocationForm.longitude')?.patchValue(longitude);

      this.calculateDistance()
    }
  }

  onDateSelect(date: Date) {
    this.orderDate = this.datePipe.transform(date, 'dd-MM-yyyy')?.toString();
    this.placeOrderForm.get('OrderDate.date')?.patchValue(this.datePipe.transform(date, 'yyyy-MM-dd')?.toString());
  }

  isEnterpriseToggle() {
    this.isEnterprise = !this.isEnterprise;
    if (this.isEnterprise) {
      this.placeOrderForm.get('CustomerDataForm.nip')?.setValidators([Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]*$/)]);
      this.placeOrderForm.get('CustomerDataForm.nip')?.updateValueAndValidity();
      this.placeOrderForm.get('CustomerDataForm.surname')?.clearValidators();
      this.placeOrderForm.get('CustomerDataForm.surname')?.updateValueAndValidity();
    } else {
      this.placeOrderForm.get('CustomerDataForm.surname')?.setValidators(Validators.required);
      this.placeOrderForm.get('CustomerDataForm.surname')?.updateValueAndValidity();
      this.placeOrderForm.get('CustomerDataForm.nip')?.clearValidators();
      this.placeOrderForm.get('CustomerDataForm.nip')?.updateValueAndValidity();
    }
  }

  setValidatorsForPhoto() {
    this.placeOrderForm.get('ServiceDetailsForm.bgMusicId')?.clearValidators();
    this.placeOrderForm.get('ServiceDetailsForm.bgMusicId')?.updateValueAndValidity();
    this.placeOrderForm.get('ServiceDetailsForm.format')?.clearValidators();
    this.placeOrderForm.get('ServiceDetailsForm.format')?.updateValueAndValidity();
    this.placeOrderForm.get('ServiceDetailsForm.report')?.clearValidators();
    this.placeOrderForm.get('ServiceDetailsForm.report')?.updateValueAndValidity();
  }

  setValidatorsForVideo() {
    this.placeOrderForm.get('ServiceDetailsForm.bgMusicId')?.setValidators(Validators.required);
    this.placeOrderForm.get('ServiceDetailsForm.bgMusicId')?.updateValueAndValidity();
    this.placeOrderForm.get('ServiceDetailsForm.format')?.setValidators(Validators.required);
    this.placeOrderForm.get('ServiceDetailsForm.format')?.updateValueAndValidity();
  }

  setValidatorsForInspection() {
    this.placeOrderForm.get('ServiceDetailsForm.bgMusicId')?.clearValidators();
    this.placeOrderForm.get('ServiceDetailsForm.bgMusicId')?.updateValueAndValidity();
    this.placeOrderForm.get('ServiceDetailsForm.format')?.clearValidators();
    this.placeOrderForm.get('ServiceDetailsForm.format')?.updateValueAndValidity();
    this.placeOrderForm.get('ServiceDetailsForm.report')?.clearValidators();
    this.placeOrderForm.get('ServiceDetailsForm.report')?.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.fetchFlagsSubscription.unsubscribe();
    this.orderSubscription.unsubscribe();
    this.ServiceSubscription.unsubscribe();
    this.musicSubscription.unsubscribe();
  }

  makeSummary() {
    const amount = Number(this.placeOrderForm.get('ServiceDetailsForm.amount')?.value);
    const priceBrutto = (this.currentSubserviceUnitPrice * amount) + (this.orderFromOriginToDestinationDistance * environment.kilometreage);
    this.priceBrutto = Number(priceBrutto.toFixed(2));
    this.priceNetto = Number((priceBrutto * 0.77).toFixed(2));

    this.placeOrderForm.get("OrderDetailForm.price")?.patchValue(this.priceBrutto);

    console.log('unit price: ', this.currentSubserviceUnitPrice);
    console.log('amount: ', amount);
    console.log('distance: ', this.orderFromOriginToDestinationDistance);
    console.log('kilometrage: ', environment.kilometreage);
  }

  calculateDistance() {

    const distanceService = new google.maps.DistanceMatrixService();

    const origin = environment.origin;
    const destination = this.markerPositions;

    distanceService.getDistanceMatrix(
      {
        origins: [origin],
        destinations: destination,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
      },
      (response, status) => {
        if (status === 'OK') {
          const results = response?.rows[0].elements[0];
          const distanceText = results?.distance.text;  // Get the distance as a string with units (future feature)
          const distanceValue = results?.distance.value; // Get the distance in meters
          const durationText = results?.duration.text;  // Get the travel duration as text (future feature)

          if (distanceValue) {
            this.orderFromOriginToDestinationDistance = distanceValue / 1000;
          }

        } else {
          console.error('Error calculating distance:', status);
        }
      }
    );

  }
}




