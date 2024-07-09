import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { BannerComponent } from '../banner/banner.component';
import { HomeDetailsComponent } from './home-details/home-details.component';
import { HomeServicesComponent } from './home-services/home-services.component';
import { HomePortfolioComponent } from './home-portfolio/home-portfolio.component';
import { FooterComponent } from '../footer/footer.component';


@Component({
  standalone: true,
  imports: [
    NavbarComponent,
    BannerComponent,
    HomeDetailsComponent,
    HomeServicesComponent,
    HomePortfolioComponent,
    FooterComponent,
  ],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: []
})
export class HomeComponent {

}
