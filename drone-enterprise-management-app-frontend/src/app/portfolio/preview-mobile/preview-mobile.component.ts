import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../portfolio.model';
import { ActivatedRoute, Router, RouterEvent, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { OnscrollAutoplay } from '../onscroll-autoplay.directive';

@Component({
  standalone: true,
  selector: 'app-preview-mobile',
  templateUrl: './preview-mobile.component.html',
  imports: [
    CommonModule,
    RouterLink,
    OnscrollAutoplay
  ],
})
export class PreviewMobileComponent implements OnInit, AfterViewInit, OnDestroy {

  loadedPosts: Post[] = [];
  postIdToPreview: number;
  private postsSubsription: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private location: Location) { }

  ngOnInit(): void {
    this.postsSubsription = this.route.queryParams.subscribe(params => {
      if (params['loadedPostPayload']) {
        this.loadedPosts = JSON.parse(params['loadedPostPayload']);
      } else {
        this.location.back();
      }
    });
  }

  ngAfterViewInit(): void {
    const postId: string | null = this.route.snapshot.paramMap.get('post_id');

    if (postId) {
      this.postIdToPreview = +postId;

      const postToPreview = document.getElementById('item_' + this.postIdToPreview);

      if (postToPreview) {
        postToPreview.scrollIntoView({
          behavior: "instant",
          block: "start",
          inline: "nearest"
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.postsSubsription.unsubscribe()
  }

  public getFileExtension(url: string): string | null {

    const matches = url.match(/\.([a-zA-Z0-9]+)(?:[\?#]|$)/);
    return matches ? matches[1].toLowerCase() : null;
  }

  public isImage(url: string): boolean {

    const imageExtensions = ['jpg', 'jpeg', 'png'];
    const extension = this.getFileExtension(url);
    return extension ? imageExtensions.includes(extension) : false;
  }
}
