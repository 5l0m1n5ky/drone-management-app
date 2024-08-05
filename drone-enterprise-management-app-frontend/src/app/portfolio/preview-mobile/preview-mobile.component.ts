import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../portfolio.model';
import { ActivatedRoute, Router, RouterEvent, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-preview-mobile',
  templateUrl: './preview-mobile.component.html',
  imports: [
    CommonModule,
    RouterLink
  ]
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
}
