import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { OrderCreateService } from './order-create.service';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';
import { BehaviorSubject, combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatDialog } from '@angular/material/dialog';
import { CancelDialogComponent } from 'src/app/shared/cancel-dialog/cancel-dialog.component';
import { ToastService } from 'src/app/shared/toast/toast.service';
import { LoginService } from 'src/app/login/login.service';
import { AppComponent } from 'src/app/app.component';
import { PanelService } from '../panel.service';
import { OrderData } from '../models/order-data.model';
import { Service } from '../models/service.model';
import { Subservice } from '../models/subservice.model';
import { State } from '../models/state.model';
import { BgMusic } from '../models/bg-music.model';
import * as Leaflet from 'leaflet';

@Component({
  standalone: true,
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  imports: [MatStepperModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatSliderModule, MatDatepickerModule, MatCardModule, MatNativeDateModule, MatInputModule, CommonModule, LoadingSpinnerComponent, MatSlideToggleModule, RouterLink],
  providers: [DatePipe],

})
export class OrderCreateComponent implements OnInit, AfterViewInit, OnDestroy {

  placeOrderForm: FormGroup
  order: OrderData;

  services: Service[] = [];
  currentService: Service[] = [];
  currentSubservices: Subservice[] = [];
  selectedSubservice: Subservice[] = [];
  subservices: Subservice[] = [];
  states: State[] = [];
  bgMusic: BgMusic[] = [];

  selected: Date | null;

  isLocationSelected: boolean = false;
  selectedLocation: string = "";
  orderFromOriginToDestinationDistance: number;

  minDate: Date = new Date();
  maxDate: Date = new Date();
  orderDate: String | undefined;

  areServicesFetched$ = new BehaviorSubject<boolean>(false);
  areSubservicesFetched$ = new BehaviorSubject<boolean>(false);
  isBackgroundMusicFetched$ = new BehaviorSubject<boolean>(false);
  areOrderDatesFetched$ = new BehaviorSubject<boolean>(false);

  isProcessing: boolean = false;
  fetchFlagsSubscription: Subscription;
  orderSubscription: Subscription;
  ServiceSubscription: Subscription;
  musicSubscription: Subscription;
  orderDatesSubscription: Subscription;
  orderIdSubscription: Subscription;
  isEnterpriseSubsription: Subscription;
  dialogActionSubscription: Subscription;
  dialogSubscription: Subscription;

  private actionSubject = new Subject<any>();
  action$: Observable<any> = this.actionSubject.asObservable();

  currentServiceId: number;
  currentServiceName: String

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
  onPlaceOrderSubscription: any;
  onCheckSubscription: Subscription;

  fetchedDates: String[];
  disabledOrderDates: Date[] = [];
  isFilterProcessed: boolean = false;

  marker: Leaflet.Marker;
  map: Leaflet.Map;
  center: Leaflet.LatLngExpression = [53.122028, 18.000292];
  originLatLng = new Leaflet.LatLng(environment.origin.lat, environment.origin.lng);

  orderDatesFilter = (date: Date): boolean => {
    const dateToFilter = (date || new Date());

    return !this.disabledOrderDates.some(disabledOrderDate =>
      disabledOrderDate.getDate() === dateToFilter.getDate() &&
      disabledOrderDate.getMonth() === dateToFilter.getMonth() &&
      disabledOrderDate.getFullYear() === dateToFilter.getFullYear()
    );
  }
  isMobile: boolean;


  constructor(private orderCreateService: OrderCreateService, private route: ActivatedRoute, private datePipe: DatePipe, private dialog: MatDialog, private router: Router, private toastService: ToastService, private loginService: LoginService, private appComponent: AppComponent, private panelService: PanelService) { }

  ngOnInit(): void {

    this.onResize();

    this.isProcessing = true;

    this.onCheckSubscription = this.loginService.checkSession().subscribe(responseData => {
      if (responseData && responseData.message && responseData.message.toString() === 'ACTIVE_SESSION') {
        this.isProcessing = false;
      }
    }, () => {
      this.router.navigate(['/login'], { queryParams: { action: 'session_expired' } });
      this.appComponent.changeLoginState();
      this.isProcessing = false;
    });


    this.orderSubscription = this.panelService.fetchServices().subscribe(services => {
      this.services = services;
      this.areServicesFetched$.next(true);
    });

    this.ServiceSubscription = this.panelService.fetchSubervices().subscribe(subservices => {
      this.subservices = subservices;
      this.areSubservicesFetched$.next(true);
    });

    this.musicSubscription = this.panelService.fetchBackgroundMusicTypes().subscribe(bgMusic => {
      this.bgMusic = bgMusic;
      this.isBackgroundMusicFetched$.next(true);
    });

    this.orderDatesSubscription = this.orderCreateService.fetchOrderDates().subscribe(dates => {
      this.fetchedDates = dates.map(date => date.date);

      this.fetchedDates.forEach(date => {
        this.disabledOrderDates.push(new Date(date.toString()))
      });

      this.isFilterProcessed = true;
      this.areOrderDatesFetched$.next(true);
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
        report: new FormControl(false),
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

  ngAfterViewInit(): void {
    this.mapConfig();

    const customIcon = Leaflet.icon({
      iconUrl: 'assets/icons/map-marker.png',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    this.map.on('click', (event: Leaflet.LeafletMouseEvent) => {
      const lat = event.latlng.lat;
      const lng = event.latlng.lng;
      const marker = Leaflet.marker([lat, lng],)

      if (this.marker != undefined) {
        this.map.removeLayer(this.marker);
      }

      this.marker = Leaflet.marker([lat, lng], { icon: customIcon })
        .addTo(this.map)
        .bindPopup(`Zlecenie o współrzędnych:<br>Latitude: ${lat}<br>Longitude: ${lng}`, {
          offset: Leaflet.point(0, -40)
        })
        .openPopup();

      this.isLocationSelected = true;

      this.placeOrderForm.get('OrderLocationForm.latitude')?.patchValue(lat);
      this.placeOrderForm.get('OrderLocationForm.longitude')?.patchValue(lng);

      const distance = Number((this.originLatLng.distanceTo(Leaflet.latLng(lat, lng)) / 1000).toFixed(1));

      this.orderFromOriginToDestinationDistance = distance;

    });
  }

  mapConfig() {
    this.map = Leaflet.map('map', {
      center: this.center,
      zoom: 19,
    });

    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 1,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth <= 1024) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
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
        this.setValidatorsForPhoto();
        break;

      case "relacja z wydarzenia":
        this.setValidatorsForVideo();
        break;

      case "spot reklamowy":
        this.setValidatorsForVideo();
        break;

      // case "inspekcja RGB" || "inspekcja IR" || "inspekcja RGB+IR" || "ortofotomapa" || "ortomozaika" || "model 3D":
      default:
        this.setValidatorsForInspection()
        break;
    }
  }

  setCurrentBgMusic(bgMusic_id: any) {
    this.currentbgMusicId = parseInt(bgMusic_id);
  }

  onPlaceOrder() {
    this.isProcessing = true;

    this.order = {
      'service_id': this.placeOrderForm.get('ServiceDetailsForm.service_id')?.value,
      'subservice_id': this.placeOrderForm.get('ServiceDetailsForm.subservice_id')?.value,
      'amount': this.placeOrderForm.get('ServiceDetailsForm.amount')?.value,
      'bgMusicId': this.placeOrderForm.get('ServiceDetailsForm.bgMusicId')?.value,
      'format': this.placeOrderForm.get('ServiceDetailsForm.format')?.value,
      'report': this.placeOrderForm.get('ServiceDetailsForm.report')?.value,
      'latitude': this.placeOrderForm.get('OrderLocationForm.latitude')?.value,
      'longitude': this.placeOrderForm.get('OrderLocationForm.longitude')?.value,
      'date': this.placeOrderForm.get('OrderDate.date')?.value,
      'name': this.placeOrderForm.get('CustomerDataForm.name')?.value,
      'surname': this.placeOrderForm.get('CustomerDataForm.surname')?.value,
      'streetName': this.placeOrderForm.get('CustomerDataForm.streetName')?.value,
      'streetNumber': this.placeOrderForm.get('CustomerDataForm.streetNumber')?.value,
      'apartmentNumber': this.placeOrderForm.get('CustomerDataForm.apartmentNumber')?.value,
      'city': this.placeOrderForm.get('CustomerDataForm.city')?.value,
      'zip': this.placeOrderForm.get('CustomerDataForm.zip')?.value,
      'nip': this.placeOrderForm.get('CustomerDataForm.nip')?.value,
      'email': this.placeOrderForm.get('CustomerDataForm.email')?.value,
      'tel': this.placeOrderForm.get('CustomerDataForm.tel')?.value,
      'alias': this.placeOrderForm.get('OrderDetailForm.alias')?.value,
      'description': this.placeOrderForm.get('OrderDetailForm.description')?.value,
      'price': this.placeOrderForm.get('OrderDetailForm.price')?.value,
    };

    this.onPlaceOrderSubscription = this.orderCreateService.placeOrder(
      this.order
    ).subscribe(responseData => {
      this.isProcessing = false;
      this.router.navigate(['/user/panel/orders'])
      this.toastService.generateToast('success', 'Składanie zamówienia', responseData.message.toString());
    }, errorMessage => {
      this.toastService.generateToast('error', 'Składanie zamówienia', errorMessage);
      this.isProcessing = false;
    });
    this.placeOrderForm.reset();
  }

  onCancel() {
    if (!this.placeOrderForm.get('ServiceDetailsForm')?.touched) {
      this.router.navigate(['/user/panel/orders'])
    } else {
      this.openDialog(30, 30, 'Anulować?', 'Wszystkie zmiany zostaną utracone', 'WRÓĆ', 'ANULUJ');
      this.dialogActionSubscription = this.action$.subscribe(action => {
        if (action === 'confirm') {
          this.placeOrderForm.reset();
          this.router.navigate(['/user/panel/orders']);
        }
        this.dialogActionSubscription.unsubscribe();

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


  onDateSelect(date: Date | null) {
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
  }

  calculateDistance() {


  }
}




