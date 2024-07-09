import { ViewportScroller } from '@angular/common';
import { Component, ViewChild } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: []
})
export class BannerComponent {

  onBeginButton() {
    document.getElementById("homeDetails")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  }

  constructor(private scroller: ViewportScroller) { }


}






