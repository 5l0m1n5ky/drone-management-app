import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { MatMenuModule } from '@angular/material/menu';
import { PortfolioService } from './portfolio.service';
import { Post } from './portfolio.model';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { StepperModule } from 'primeng/stepper';
import { Button } from 'primeng/button';
import { Observable, Subject, Subscription } from 'rxjs';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CancelDialogComponent } from '../shared/cancel-dialog/cancel-dialog.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ToastService } from '../shared/toast/toast.service';


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
    MatStepperModule,
    MatSlideToggleModule,
    MatDialogModule,
    ToastModule,
  ],
  providers: [
    PortfolioService,
    MessageService,
    ToastService,
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

  createPostForm: FormGroup

  isUploading: boolean = false;

  @ViewChild('fileInput') fileInput: HTMLElement;
  fileName: string = '';
  fileSize: string;
  fileSrc: string | undefined;

  visibilityToggled: boolean = false;

  dialogSubscription = new Subscription;
  dialogActionSubscription = new Subscription;

  private actionSubject = new Subject<any>();
  action$: Observable<any> = this.actionSubject.asObservable();

  file: File;

  constructor(private portfolioService: PortfolioService, private router: Router, private dialog: MatDialog, private toastService: ToastService) { }

  ngOnInit() {
    this.updateScreenSize();
    this.isLoading = true;
    this.portfolioService.fetchPosts().subscribe(posts => {
      this.loadedPosts = posts;
      this.isLoading = false;
    });

    this.createPostForm = new FormGroup({
      postFileForm: new FormGroup({
        file: new FormControl(null, Validators.required)
      }),
      postLocationForm: new FormGroup({
        location: new FormControl(null, Validators.required)
      }),
      postDescriptionForm: new FormGroup({
        description: new FormControl(null, Validators.required)
      }),
      postVisibilityForm: new FormGroup({
        visibility: new FormControl(true)
      }),
    });
  }

  onFileSelected(event: any) {
    this.file = event.target?.files[0];
    if (this.file) {
      this.fileName = this.file.name;
      if ((this.file.size / 1024) < 1000) {
        this.fileSize = Number(this.file.size / 1024).toFixed(2).toString() + ' KB';
      } else {
        this.fileSize = Number(this.file.size / (1024 * 1024)).toFixed(2).toString() + ' MB';
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.fileSrc = reader.result?.toString();
      };
      reader.readAsDataURL(this.file);
    }
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

  onCreate() {
    this.isCreateMode = true;
  }

  onPostCreate() {

    if (this.createPostForm.valid) {
      console.log(this.createPostForm.value);
    }

    this.isUploading = true;
    this.portfolioService.uploadPost(

      // this.createPostForm.get('postFileForm.file')?.value,
      this.file,
      this.createPostForm.get('postLocationForm.location')?.value,
      this.createPostForm.get('postDescriptionForm.description')?.value,
      this.createPostForm.get('postVisibilityForm.visibility')?.value,
      // this.createPostForm
    ).subscribe(responseData => {
      this.isUploading = false;
      this.toastService.generateToast('success', 'Publikacja Posta', responseData.toString());
      console.log(responseData);
      this.createPostForm.reset();
    }, errorMessage => {
      this.toastService.generateToast('error', 'Publikacja Posta', errorMessage);
      this.isUploading = false;
      console.log(errorMessage);
    });

  }

  onCancelCreateMode() {
    if (!this.createPostForm.value) {
      this.isCreateMode = false;
    } else {
      this.openDialog();
      this.dialogActionSubscription = this.action$.subscribe(action => {
        if (action === 'confirm') {
          this.createPostForm.reset();
          this.isCreateMode = false;
        }
        this.dialogActionSubscription.unsubscribe();
      });
    }
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

  onToggleChange() {
    this.visibilityToggled = !this.visibilityToggled;
  }

  openDialog() {
    let dialogReference = this.dialog.open(
      CancelDialogComponent,
      {
        width: '30%',
        height: '30%',
        data: {
          title: 'Anulować?',
          content: 'Wszystkie zmiany zostaną utracone',
          cancellation: 'WRÓĆ',
          confirmation: 'ANULUJ'
        }
      }
    );

    this.dialogSubscription = dialogReference.afterClosed().subscribe(action => {
      this.dialogSubscription.unsubscribe();
      this.actionSubject.next(action);
    });
  }

}
