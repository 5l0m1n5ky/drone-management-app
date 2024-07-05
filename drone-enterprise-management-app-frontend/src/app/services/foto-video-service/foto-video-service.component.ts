import { Component, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from 'src/app/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { Subscribable, Subscriber, Subscription, interval } from 'rxjs';


@Component({
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  selector: 'app-foto-video-service',
  templateUrl: './foto-video-service.component.html',
  styleUrls: []
})
export class FotoVideoServiceComponent implements OnInit {

  services: string[] = [
    "Spotu reklamowego",
    "Filmu prezentuającego nieruchomość",
    "Relacji z eventu",
    "I wielu innych..."
  ]

  currentService: string = "";
  subscription: Subscription

  ngOnInit(): void {
    this.subscription = interval(1500).subscribe({
      next: (val) => {
        if (val < this.services.length) {
          this.currentService = this.services[val];
        } else {
          this.subscription.unsubscribe();
        }
      }
    })
  }


}
