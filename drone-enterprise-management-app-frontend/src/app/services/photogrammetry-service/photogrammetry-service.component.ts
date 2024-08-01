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
  selector: 'app-photogrammetry-service',
  templateUrl: './photogrammetry-service.component.html',
  imports: [NavbarComponent, NavbarComponent, CommonModule, TimelineModule, RouterLink, CarouselModule]
})
export class PhotogrammetryServiceComponent {

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
      title: "Ortofotomapa",
      description: "Tworzenie mapy fotogrametrycznej powstałej w wyniku nalotu nad wyszczególnionym terenem",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Ortofoto_Citt%C3%A0_Alta%2C_Rocca.jpg/640px-Ortofoto_Citt%C3%A0_Alta%2C_Rocca.jpg"
    },
    {
      title: "Ortomozaika",
      description: "Tworzenie trójwymiarowej mapy fotogrametrycznej",
      image: "https://www.researchgate.net/publication/333521581/figure/fig2/AS:764798904061954@1559353676660/Orthomosaic-of-the-September-7-2017-imagery-where-each-of-the-30-ground-control-points.jpg"
    },
    {
      title: "Modele 3D",
      description: "Tworzenie modelu trójwymiarowego wybranego obiektu",
      image: "https://media.sketchfab.com/models/25f78a4e738346ba9497c4f0d81dfe77/thumbnails/7adc4429b5bb4b9099cb730c9a98e3d4/01b8829cd1a34450b69577ca5557d2ee.jpeg"
    },
    {
      title: "Pomiary",
      description: "Określenie powierzchni lub objętności obiektu",
      image: "https://images.ctfassets.net/go54bjdzbrgi/2nAhhtuDJqUA42g46me4w8/326bf99481979787249a6c32b838ca2f/between-walls.jpg"
    },
    {
      title: "Inne pomiary",
      description: "Wedle indywidalnych wymagań",
      image: "https://static1.squarespace.com/static/6141a9bd81d4225239c39cf3/616905bd82ef983a80c90169/6284c4cd97fc912b087e0952/1676347538593/DSC01355-1+%281%29.jpg?format=1500w"
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
