import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './/login/login.component';
import { BannerComponent } from './banner/banner.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HomeDetailsComponent } from './home/home-details/home-details.component';
import { HomeServicesComponent } from './home/home-services/home-services.component';
import { HomePortfolioComponent } from './home/home-portfolio/home-portfolio.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BannerComponent,
    FooterComponent,
    NavbarComponent,
    HomeComponent,
    RegisterComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    HomeDetailsComponent,
    HomeServicesComponent,
    HomePortfolioComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
