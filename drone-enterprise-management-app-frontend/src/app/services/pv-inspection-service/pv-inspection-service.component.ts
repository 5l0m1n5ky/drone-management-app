import { Component } from '@angular/core';
import { NavbarComponent } from 'src/app/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { TimelineModule } from 'primeng/timeline';
import { RouterLink } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';
// import { CarouselModule, CarouselResponsiveOptions } from 'primeng/carousel';


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
  selector: 'app-pv-inspection-service',
  templateUrl: './pv-inspection-service.component.html',
  imports: [NavbarComponent, NavbarComponent, CommonModule, TimelineModule, RouterLink, CarouselModule]
})
export class PvInspectionServiceComponent {

  // responsiveOptions: CarouselResponsiveOptions[] | undefined;

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
      title: "Ocena kompletności instalacji",
      description: "Na podstawie udostępnionej dokumentacji oraz projektu instalacji dokonywana jest ocena kompletności instalacji",
      image: "https://www.edenmagnet.com.au/images/transform/v1/crop/frm/M2AAifkzixXndsEJvXhnH5/05ae3a6b-bafd-4b86-bf8f-72430f12d287.jpg/r0_96_935_624_w1200_h678_fmax.jpg"
    },
    {
      title: "Uszkodzenia mechaniczne modułów",
      description: "Analiza obecności uszkodzeń mechanicznych spowodowanych przez m.in. warunki atmosferyczne",
      image: "https://hovall.com/wp-content/uploads/2018/09/Solar-Repair.jpg"
    },
    {
      title: "Zabrudzenia paneli",
      description: "To nic odkrywczego, że zabrudzony panel to nieefektywny panel. Analizie podlega stan zabrudzenia paneli",
      image: "https://aurorasolar.com/wp-content/uploads/2022/05/Dirty_Solar_Panel-PV_System_Losses-soiling.jpg"
    },
    {
      title: "Delaminacja paneli",
      description: "Inspekcja dotyczy również obserwacji pod kątem odklejenia się folii enkapsulacyjnej od szkła hartowanego lub od ogniw",
      image: "https://www.pveurope.eu/sites/default/files/styles/teaser_image_full__s/public/aurora/2024/02/340123.png?itok=zt8zTLV1"
    },
    {
      title: "Efekt PID",
      description: "Inspekcja pod kątem straty mocy, szybszej degradacji ogniw oraz ryzyka porażenia spowodowane przez degradację indukowaną potencjałem",
      image: "https://i0.wp.com/thedronelifenj.com/wp-content/uploads/2024/04/DJI_20240206132554_0007_T.jpg?fit=640%2C360&ssl=1"
    },
    {
      title: "Efektywność sekcji paneli",
      description: "Inspekcja nastawiona na wykrycie anomalii związanych z nieprawidłową pracą paneli pogrupowanych w pojedynczy string",
      image: "https://bluelinkdrones.ca/wp-content/uploads/2020/12/DJI_20201208143507_0008_THRM.jpg"
    },
    {
      title: "Uszkodzenia modułów - wykrywanie hotspot'ów",
      description: "Jedna z najistotniejszych części inspekcji, nastawiona na wykrycie uszkodzonych modułów, które są najczęstszą przyczyną pożarów instalacji",
      image: "https://www.maysunsolar.com/wp-content/uploads/2023/07/%E5%8D%9A%E6%96%87%E9%85%8D%E5%9B%BE-%E5%B0%81%E9%9D%A2-2-1024x576.jpg"
    },
    {
      title: "Efektywność przy zacienieniu",
      description: "Inspekcja analizująca efektywność pracy układów przeciwdziałających zjawisku zacienienia modułów",
      image: "https://abjdrones.com/wp-content/uploads/2018/04/Thermal-Solar-Panel-Inspection-Services_3.jpg"
    },
    {
      title: "Uszkodzenia modułów - odwrotna polaryzacja",
      description: "Analiza pochodna do badania efektywności przy zacienieniu, nastawiona jest na anomalie związane z odwrotną polaryzacją oraz znacznymi stratami mocy",
      image: "https://i0.wp.com/thedronelifenj.com/wp-content/uploads/2021/08/DJI_0253_R.jpg?fit=640%2C400&ssl=1"
    },
    {
      title: "Inspekcja innych parametrów",
      description: "wedle indywidualnych potrzeb",
      image: "https://eurosol.eu/wp-content/uploads/2023/07/DJI_0355-1024x538.jpg"
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
