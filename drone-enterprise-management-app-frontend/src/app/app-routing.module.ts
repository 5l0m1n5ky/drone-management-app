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
import { SidebarComponent } from './sidebar/sidebar.component';
import { PanelComponent } from './user/panel/panel.component';
import { OrderComponent } from './user/panel/order/order.component';
import { OrderCreateComponent } from './user/panel/order-create/order-create.component';
import { NotificationComponent } from './user/panel/notification/notification.component';
import { AccountComponent } from './user/panel/account/account.component';
import { ChooseServiceComponent } from './services/choose-service/choose-service.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'choose-service', component: ChooseServiceComponent },
  { path: 'account-verification/:user_id', component: AccountVerificationComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'portfolio/mobile/:post_id', component: PreviewMobileComponent },
  { path: 'foto-video', component: FotoVideoServiceComponent },
  { path: 'pv-inspection', component: PvInspectionServiceComponent },
  { path: 'electric-distribution-inspection', component: ElectricDistributionServiceComponent },
  { path: 'windmill-inspection', component: WindmillServiceComponent },
  { path: 'photogrammetry-service', component: PhotogrammetryServiceComponent },
  {
    path: 'user/panel',
    component: PanelComponent,
    children: [
      { path: 'orders', component: OrderComponent },
      { path: 'create-order/:service_id', component: OrderCreateComponent },
      { path: 'notifications', component: NotificationComponent },
      { path: 'account', component: AccountComponent },
    ]
  },
  // { path: '*', component: ServicesComponent }, TODO ANY LINK
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
