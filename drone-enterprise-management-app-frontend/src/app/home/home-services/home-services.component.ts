import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink, AsyncPipe],
  selector: 'app-home-services',
  templateUrl: './home-services.component.html',
  styleUrls: []
})
export class HomeServicesComponent {


}


