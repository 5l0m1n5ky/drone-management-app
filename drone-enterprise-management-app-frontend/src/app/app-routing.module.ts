import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ServicesComponent } from './services/services.component';
import { AccountVerificationComponent } from './account-verification/account-verification.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { FotoVideoServiceComponent } from './services/foto-video-service/foto-video-service.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'account-verification/:user_id', component: AccountVerificationComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'foto-video', component: FotoVideoServiceComponent },
  // { path: '*', component: ServicesComponent }, TODO ANY LINK
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
