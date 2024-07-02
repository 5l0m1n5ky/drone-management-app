import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { KnobModule } from 'primeng/knob';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { CarouselModule, CarouselResponsiveOptions } from 'primeng/carousel';


interface ServiceData {
  title?: string,
  title_top?: string,
  title_bottom?: string,
  image?: string,
  image_2?: string,
  discover: boolean
  title_top_size?: string,
  title_bottom_size?: string
}

@Component({
  standalone: true,
  imports: [RouterLink, AsyncPipe, FormsModule, RatingModule, KnobModule, ToastModule, ButtonModule, CarouselModule],
  selector: 'app-home-services',
  templateUrl: './home-services.component.html',
  styleUrls: []
})
export class HomeServicesComponent {

  service: ServiceData[] = [
    {
      title_top: "FOTO",
      title_bottom: "/VIDEO",
      title_top_size: "30px",
      title_bottom_size: "40px",
      image: "./assets/drone_services.png",
      image_2: "./assets/camera_with_gimbal_services.png",
      discover: false
    },
    {
      title_top: "INSPEKCJE",
      title_bottom: "PV",
      title_top_size: "30px",
      title_bottom_size: "40px",
      image: "./assets/drone_pv_services.png",
      discover: false
    },
    {
      title_top: "POMIARY",
      title_bottom: "FOTOGRAMETRYCZNE",
      title_top_size: "30px",
      title_bottom_size: "20px",
      image: "./assets/fotogrammetry-services.png",
      discover: false
    },
    {
      title: "Zobacz więcej",
      discover: true
    }

  ];

  responsiveOptions: CarouselResponsiveOptions[] | undefined;
}


