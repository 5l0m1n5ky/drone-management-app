import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { MatMenuModule } from '@angular/material/menu';
import { PortfolioService } from './portfolio.service';
import { Post } from './portfolio.model';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { FormControl, FormGroup } from '@angular/forms'
import { NavigationExtras, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { StepperModule } from 'primeng/stepper';
import { Button } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { every } from 'rxjs';





@Component({
  standalone: true,
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  imports: [
    NavbarComponent,
    FooterComponent,
    CommonModule,
    MatMenuModule,
    LoadingSpinnerComponent,
    ReactiveFormsModule,
    StepperModule,
    Button,
    FileUploadModule,
  ],
  providers: [
    PortfolioService
  ]
})
export class PortfolioComponent implements OnInit {

  loadedPosts: Post[] = [];
  isLoading: boolean = false;
  currentPost: Post;
  currentIndex: number = 0;
  swipeLeftDisabled: boolean = false;
  swipeRightDisabled: boolean = false;
  screenWidth: number;
  isMobile: boolean;
  isEditMode: boolean = false;
  isCreateMode: boolean = false;
  createPostForm: FormGroup;

  constructor(private portfolioService: PortfolioService, private router: Router) { }

  ngOnInit() {
    this.updateScreenSize();
    this.isLoading = true;
    this.portfolioService.fetchPosts().subscribe(posts => {
      this.loadedPosts = posts;
      this.isLoading = false;
    });


    this.createPostForm = new FormGroup({
      'postFile': new FormControl(null),
      'location': new FormControl(null),
      'description': new FormControl(null),
      'visibility': new FormControl(true),
      'reactionsVisibility': new FormControl(true),
    });

  }

  updateScreenSize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth >= 1400) {
      this.isMobile = false;
    } else {
      this.isMobile = true;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateScreenSize();
  }

  onShow: boolean = false;

  onGalleryItemShow(id: number): void {
    this.onShow = true;
    if (!this.isMobile) {
      let currentPost = this.loadedPosts.find(post => post.id === id);
      if (currentPost) {
        this.currentPost = currentPost;
      }

      let currentIndex = this.loadedPosts.findIndex(post => post.id === id);
      if (currentIndex != undefined) {
        this.currentIndex = currentIndex;
      }
      this.checkSwipeRight();
      this.checkSwipeLeft();
    } else {

      const loadedPostPayload = this.loadedPosts;

      this.router.navigate(['portfolio/mobile', id], { queryParams: { loadedPostPayload: JSON.stringify(loadedPostPayload) } });
    }
  }

  onEdit() {

  }

  onUpload(file: any) {
    return
  }

  onCreate() {
    this.isCreateMode = true;
  }

  onCancelCreateMode() {
    this.isCreateMode = false;
  }

  onGalleryItemClose(): void {
    this.onShow = false;
  }

  checkSwipeRight() {
    if (this.currentIndex === this.loadedPosts.length - 1) {
      this.swipeRightDisabled = true;
    } else if (this.swipeRightDisabled) {
      this.swipeRightDisabled = false;
    }
  }

  checkSwipeLeft() {
    if (this.currentIndex === 0) {
      this.swipeLeftDisabled = true;
    } else if (this.swipeLeftDisabled) {
      this.swipeLeftDisabled = false;
    }
  }

  onSwipeLeft() {
    let currentIndex = this.currentIndex
    if (currentIndex > 0) {
      currentIndex--;
      this.currentIndex = currentIndex;
      this.currentPost = this.loadedPosts[currentIndex];
    }
    this.checkSwipeLeft();
    this.checkSwipeRight();
  }

  onSwipeRight() {
    let currentIndex = this.currentIndex
    let posts = this.loadedPosts;
    if (currentIndex < posts.length) {
      currentIndex++;
      this.currentIndex = currentIndex;
      this.currentPost = posts[currentIndex];
    }
    this.checkSwipeRight();
    this.checkSwipeLeft();
  }

}
