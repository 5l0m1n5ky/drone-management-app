import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from 'src/app/navbar/navbar.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-choose-service',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink],
  templateUrl: './choose-service.component.html',
})
export class ChooseServiceComponent { }
