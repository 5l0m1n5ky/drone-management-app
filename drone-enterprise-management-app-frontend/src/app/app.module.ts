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
import { FormsModule } from '@angular/forms';
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


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    LoadingSpinnerComponent,
    AccountVerificationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HomeComponent,
    NavbarComponent,
    BannerComponent,
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
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: CsrfInterceptor,
    multi: true
  },
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
