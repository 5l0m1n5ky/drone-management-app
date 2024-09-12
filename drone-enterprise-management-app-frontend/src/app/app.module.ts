import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './/login/login.component';
import { BannerComponent } from './banner/banner.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule, HttpXsrfTokenExtractor } from '@angular/common/http';
import { HomeDetailsComponent } from './home/home-details/home-details.component';
import { HomeServicesComponent } from './home/home-services/home-services.component';
import { HomePortfolioComponent } from './home/home-portfolio/home-portfolio.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { ServicesComponent } from './services/services.component';
import { CsrfInterceptor } from './auth/csrf.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { AccountVerificationComponent } from './account-verification/account-verification.component';
import { CodeInputModule } from 'angular-code-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { FotoVideoServiceComponent } from './services/foto-video-service/foto-video-service.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { PvInspectionServiceComponent } from './services/pv-inspection-service/pv-inspection-service.component';
import { ElectricDistributionServiceComponent } from './services/electric-distribution-service/electric-distribution-service.component';
import { WindmillServiceComponent } from './services/windmill-service/windmill-service.component';
import { PhotogrammetryServiceComponent } from './services/photogrammetry-service/photogrammetry-service.component';
import { PreviewMobileComponent } from './portfolio/preview-mobile/preview-mobile.component';
import { CancelDialogComponent } from './shared/cancel-dialog/cancel-dialog.component';
import { ToastService } from './shared/toast/toast.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { OnscrollAutoplay } from './portfolio/onscroll-autoplay.directive';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PanelComponent } from './user/panel/panel.component';
import { OrderComponent } from './user/panel/order/order.component';
import { NotificationComponent } from './user/panel/notification/notification.component';
import { AccountComponent } from './user/panel/account/account.component';
import { OrderCreateComponent } from './user/panel/order-create/order-create.component';
import { IndexComponent } from './index/index.component';
import { OrderViewComponent } from './user/panel/order-view/order-view.component';


@NgModule({
  declarations: [
    AppComponent,
    AccountVerificationComponent,
  ],
  imports: [
    RegisterComponent,
    IndexComponent,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HomeComponent,
    NavbarComponent,
    BannerComponent,
    LoginComponent,
    HttpClientModule,
    HomeDetailsComponent,
    HomeServicesComponent,
    HomePortfolioComponent,
    ServicesComponent,
    FooterComponent,
    CodeInputModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatMenuModule,
    FotoVideoServiceComponent,
    PortfolioComponent,
    PvInspectionServiceComponent,
    ElectricDistributionServiceComponent,
    WindmillServiceComponent,
    PhotogrammetryServiceComponent,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    PreviewMobileComponent,
    CancelDialogComponent,
    ToastModule,
    OnscrollAutoplay,
    SidebarComponent,
    PanelComponent,
    OrderComponent,
    OrderCreateComponent,
    AccountComponent,
    NotificationComponent,
    OrderViewComponent,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: CsrfInterceptor,
    multi: true
  },
    CookieService,
    ToastService,
    MessageService
  ],
  exports: [
    // MatDialogModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
