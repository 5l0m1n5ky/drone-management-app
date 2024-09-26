import { Component, ElementRef, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { NavbarComponent } from 'src/app/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { IntersectionObserverDirective } from '../intersection-observer.directive';
import { TimelineModule } from 'primeng/timeline';
import { RouterLink } from '@angular/router';
import { HomePortfolioComponent } from 'src/app/home/home-portfolio/home-portfolio.component';

interface StepsData {
  icon: string,
  title: string,
  description: string
  items: string
}

@Component({
  standalone: true,
  imports: [NavbarComponent, CommonModule, IntersectionObserverDirective, TimelineModule, RouterLink, HomePortfolioComponent],
  selector: 'app-foto-video-service',
  templateUrl: './foto-video-service.component.html',
  styleUrls: []
})

export class FotoVideoServiceComponent {

  @ViewChild(IntersectionObserverDirective) intersectionObserverDirective: IntersectionObserverDirective;

  services: string[] = [
    "Spotu reklamowego",
    "Prezentacji nieruchomości",
    "Relacji z eventu",
    "I wielu innych..."
  ];

  steps: StepsData[] = [
    {
      icon: "./assets/icons/send-icon.svg",
      title: "Złożenie zamówienia",
      description: "Złożenie zamówienia na zlecenie rozpoczyna się od wypełnienia formularza zamówienia. Informacja o zleceniu wraz z aktualnym statusem realizacji pojawi się w panelu użytkownika.",
      items: "start"
    },
    {
      icon: "./assets/icons/reply-icon.svg",
      title: "Odpowiedź zwrotna",
      description: "Twoje zamówienie zostanie przeanalizowane pod kątem - przykładowo, stref lotu bezzałogowcami we wskazanej przez Ciebie lokalizacji. Otrzymasz powiadomienie o informacji zwrotnej.",
      items: "end"
    },
    {
      icon: "./assets/icons/payment-icon.svg",
      title: "Płatność",
      description: "Ostatnim etapem w składaniu zamówienia jest dokonanie płatności. Rozpoczęcie realizacji zlecenia następuje po transakcji środków.",
      items: "start"
    },
    {
      icon: "./assets/icons/progress-icon.svg",
      title: "Realizacja zlecenia",
      description: "Najważniejsza część zlecenia - realizacja zamówienia w oparciu o uzgodnione warunki. Ponownie otrzymasz powiadomienie o procesie realizacji.",
      items: "end"
    },
    {
      icon: "./assets/icons/done-icon.svg",
      title: "Informacja o wykonaniu zlecenia",
      description: "Realizacja dobiega końca - otrzymujesz powiadomienie o zakończeniu realizacji zlecenia wraz z dostępem do zamówionych zasobów",
      items: "start"
    },
  ]

  currentService: string = this.services[0];
  subscription: Subscription;

  onServicesInView(): void {
    this.subscription = interval(1250).subscribe({
      next: (val) => {
        if ((val + 1) < this.services.length) {
          this.currentService = this.services[val + 1];
        }
        else {
          this.subscription.unsubscribe();
        }
      }
    });
  }

  onShowProcess(): void {
    document.getElementById("order-steps")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  }

}





