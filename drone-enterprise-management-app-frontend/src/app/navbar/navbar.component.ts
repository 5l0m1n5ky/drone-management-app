import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: []
})
export class NavbarComponent {

  menuToggled: boolean = false;

  onMenuToggled(): void {
    this.menuToggled = !this.menuToggled;
  }

}
