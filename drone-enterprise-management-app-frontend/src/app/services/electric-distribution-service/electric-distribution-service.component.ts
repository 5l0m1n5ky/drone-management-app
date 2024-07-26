import { Component } from '@angular/core';
import { NavbarComponent } from 'src/app/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { TimelineModule } from 'primeng/timeline';
import { RouterLink } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';

interface StepsData {
  icon: string,
  title: string,
  description: string
  items: string
}

interface InspectionFeaturesData {
  title: string,
  description: string
  image: string;
}

@Component({
  standalone: true,
  selector: 'app-electric-distribution-service',
  templateUrl: './electric-distribution-service.component.html',
  imports: [NavbarComponent, NavbarComponent, CommonModule, TimelineModule, RouterLink, CarouselModule]
})
export class ElectricDistributionServiceComponent {

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
  ];

  inspectionFeatures: InspectionFeaturesData[] = [
    {
      title: "Ocena stanu izolatorów",
      description: "Dokonywana jest ocena stanu technicznego izolatorów na podstawie wyglądu oraz pomiarów termowizyjnych",
      image: "https://img.freepik.com/premium-zdjecie/izolatory-linie-energetyczne_672709-666.jpg"
    },
    {
      title: "Ocena stanu mocowań",
      description: "Dokonywana jest ocena stanu technicznego mocowań przewodów pod kątem obecności korozji",
      image: "https://thumbs.dreamstime.com/b/szczeg%C3%B3%C5%82y-mocowania-przewod%C3%B3w-wysokiego-napi%C4%99cia-izolatorami-z-p%C5%82yt-porcelanowych-po%C5%82%C4%85czenie-drutu-lufowego-i-metalowego-236071976.jpg"
    },
    {
      title: "Inspekcja innych parametrów",
      description: "wedle indywidualnych potrzeb",
      image: "https://www.sdu.dk/-/media/images/nyheder_sduk/nyheder2021/opengraphimage/drone-tjekker-hoejspaendingsledninger-1200x630.jpg"
    },
  ]

  onShowProcess(): void {
    document.getElementById("order-steps")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  }

}
