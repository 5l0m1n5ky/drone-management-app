import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [NavbarComponent, RouterLink],
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: []
})
export class ServicesComponent {

}
