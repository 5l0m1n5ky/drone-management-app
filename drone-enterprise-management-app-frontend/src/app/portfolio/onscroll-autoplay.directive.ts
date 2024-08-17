import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[onscrollAutoplay]'
})
export class OnscrollAutoplay implements OnInit, OnDestroy {
  private observer: IntersectionObserver;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    this.initIntersectionObserver();
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }

  private initIntersectionObserver(): void {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const video: HTMLVideoElement = this.el.nativeElement;
        if (entry.isIntersecting) {
          video.play();
        } else {
          video.pause();
        }
      });
    });

    this.observer.observe(this.el.nativeElement);
  }
}
