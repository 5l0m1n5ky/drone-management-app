import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { MatMenuModule } from '@angular/material/menu';
import { PortfolioService } from './portfolio.service';
import { Post } from './portfolio.model';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms'
import { NavigationExtras, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { StepperModule } from 'primeng/stepper';
import { Button } from 'primeng/button';
import { FileSendEvent, FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { every, Observable, Subject, Subscription } from 'rxjs';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CancelDialogComponent } from '../shared/cancel-dialog/cancel-dialog.component';



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
    MatStepperModule,
    MatSlideToggleModule,
    MatDialogModule
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
  isCreateMode: boolean = true;

  postFileForm: FormGroup;
  postLocationForm: FormGroup;
  postDescriptionForm: FormGroup;
  postVisibilityForm: FormGroup;

  @ViewChild('fileInput') fileInput: HTMLElement;
  fileName: string = '';
  fileSize: string;
  fileSrc: string | undefined;

  visibilityToggled: boolean = false;

  dialogSubscription = new Subscription;
  dialogActionSubscription = new Subscription;

  private actionSubject = new Subject<any>();
  action$: Observable<any> = this.actionSubject.asObservable();


  constructor(private portfolioService: PortfolioService, private router: Router, private dialog: MatDialog) { }

  ngOnInit() {
    this.updateScreenSize();
    this.isLoading = true;
    this.portfolioService.fetchPosts().subscribe(posts => {
      this.loadedPosts = posts;
      this.isLoading = false;
    });

    this.postFileForm = new FormGroup({
      file: new FormControl(null, Validators.required)
    });

    this.postLocationForm = new FormGroup({
      location: new FormControl(null, Validators.required)
    });

    this.postDescriptionForm = new FormGroup({
      description: new FormControl(null, Validators.required)
    });

    this.postVisibilityForm = new FormGroup({
      visibility: new FormControl(true)
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target?.files[0];
    if (file) {
      this.fileName = file.name;
      if ((file.size / 1024) < 1000) {
        this.fileSize = Number(file.size / 1024).toFixed(2).toString() + ' KB';
      } else {
        this.fileSize = Number(file.size / (1024 * 1024)).toFixed(2).toString() + ' MB';
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.fileSrc = reader.result?.toString();
      };
      reader.readAsDataURL(file);
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
    const formData = {
      ...this.postFileForm.value,
      ...this.postLocationForm.value,
      ...this.postDescriptionForm.value,
      ...this.postVisibilityForm.value,
    }
  }

  onCancelCreateMode() {
    if (!this.postFileForm.value.file) {
      this.isCreateMode = false;
    } else {
      this.openDialog();
      this.dialogActionSubscription = this.action$.subscribe(action => {
        if (action === 'confirm') {
          this.postFileForm.reset();
          this.postLocationForm.reset();
          this.postDescriptionForm.reset();
          this.postVisibilityForm.reset();
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
