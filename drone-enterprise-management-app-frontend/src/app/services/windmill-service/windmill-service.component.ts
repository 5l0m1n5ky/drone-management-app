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
  selector: 'app-windmill-service',
  templateUrl: './windmill-service.component.html',
  imports: [NavbarComponent, NavbarComponent, CommonModule, TimelineModule, RouterLink, CarouselModule]
})
export class WindmillServiceComponent {

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
      title: "Ocena stanu łopat",
      description: "Dokonywana jest ocena stanu technicznego łopat wirnika pod kątem pęknieć, delaminacji czy degradacji atmosferycznej lub korozji",
      image: "https://d1nnym53tfaeic.cloudfront.net/_fit960X840/BladeInsight-10_2023-03-12-151249_jwfl.jpg"
    },
    {
      title: "Ocena stanu konstrukcji",
      description: "Dokonywana jest ocena stanu technicznego konstrukcji nośnej",
      image: "https://www.windpowerengineering.com/wp-content/uploads/2019/02/3DX-HD-Sulzer-Schmid-drone-in-action.jpg"
    },
    {
      title: "Inspekcja innych parametrów",
      description: "wedle indywidualnych potrzeb",
      image: "https://www.iwrpressedienst.de/bild/deutsche-windtechnik/d5cfd_Drohneninspektion_Enercon_DW.jpg"
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
