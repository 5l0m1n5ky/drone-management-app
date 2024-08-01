import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ServicesComponent } from './services/services.component';
import { AccountVerificationComponent } from './account-verification/account-verification.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { FotoVideoServiceComponent } from './services/foto-video-service/foto-video-service.component';
import { PvInspectionServiceComponent } from './services/pv-inspection-service/pv-inspection-service.component';
import { ElectricDistributionServiceComponent } from './services/electric-distribution-service/electric-distribution-service.component';
import { WindmillServiceComponent } from './services/windmill-service/windmill-service.component';
import { PhotogrammetryServiceComponent } from './services/photogrammetry-service/photogrammetry-service.component';
import { PreviewMobileComponent } from './portfolio/preview-mobile/preview-mobile.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'account-verification/:user_id', component: AccountVerificationComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'portfolio/mobile/:post_id', component: PreviewMobileComponent },
  { path: 'foto-video', component: FotoVideoServiceComponent },
  { path: 'pv-inspection', component: PvInspectionServiceComponent },
  { path: 'electric-distribution-inspection', component: ElectricDistributionServiceComponent },
  { path: 'windmill-inspection', component: WindmillServiceComponent },
  { path: 'photogrammetry-service', component: PhotogrammetryServiceComponent },
  // { path: '*', component: ServicesComponent }, TODO ANY LINK
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
