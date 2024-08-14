import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
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
  editPostForm: FormGroup

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

  file: File | null;

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

  onEditMode() {
    this.isEditMode = true;

    this.editPostForm = new FormGroup({
      postFileForm: new FormGroup({
        file: new FormControl(null)
      }),
      postLocationForm: new FormGroup({
        location: new FormControl(this.currentPost.location, Validators.required)
      }),
      postDescriptionForm: new FormGroup({
        description: new FormControl(this.currentPost.description, Validators.required)
      }),
      postVisibilityForm: new FormGroup({
        visibility: new FormControl(this.currentPost.visibility)
      }),
    });
  }

  onEdit() {
    this.isUploading = true;
    console.log(this.editPostForm);
    this.portfolioService.updatePost(
      this.currentPost.id,
      this.file,
      this.editPostForm.get('postLocationForm.location')?.value,
      this.editPostForm.get('postDescriptionForm.description')?.value,
      this.editPostForm.get('postVisibilityForm.visibility')?.value,
    ).subscribe(responseData => {
      this.isUploading = false;
      this.toastService.generateToast('success', 'Edycja Posta', responseData.message.toString());
      this.editPostForm.reset();
      this.isEditMode = false;
      this.onShow = false;

      this.portfolioService.fetchPosts().subscribe(posts => {
        this.loadedPosts = posts;
        this.isLoading = false;
      });
    }, errorMessage => {
      this.toastService.generateToast('error', 'Edycja Posta', errorMessage.toString());
      this.isUploading = false;
    });
  }

  onDelete() {
    this.openDialog(30, 30, 'Usunąć post?', 'Post zostanie trwale usunięty z portfolio', 'WRÓĆ', 'USUŃ');
    this.dialogActionSubscription = this.action$.subscribe(action => {
      if (action === 'confirm') {

        this.isUploading = true;

        this.portfolioService.deletePost(this.currentPost.id).subscribe(responseData => {
          this.isUploading = false;
          this.onShow = false;
          this.toastService.generateToast('success', 'Usuwanie Posta', responseData.data.toString());

          this.portfolioService.fetchPosts().subscribe(posts => {
            this.loadedPosts = posts;
            this.isLoading = false;
          });
        }, errorMessage => {
          this.toastService.generateToast('error', 'Usuwanie Posta', errorMessage);
          this.onShow = false;
          this.isUploading = false;
        });
      }
      this.dialogActionSubscription.unsubscribe();
    });

  }

  onCreate() {
    this.isCreateMode = true;
  }

  onPostCreate() {

    this.isUploading = true;
    this.portfolioService.uploadPost(

      this.file,
      this.createPostForm.get('postLocationForm.location')?.value,
      this.createPostForm.get('postDescriptionForm.description')?.value,
      this.createPostForm.get('postVisibilityForm.visibility')?.value,
    ).subscribe(responseData => {
      this.isUploading = false;
      this.toastService.generateToast('success', 'Publikacja Posta', responseData.message.toString());
      console.log(responseData);
      this.file = {} as File;
      this.createPostForm.reset();

      this.portfolioService.fetchPosts().subscribe(posts => {
        this.loadedPosts = posts;
        this.isLoading = false;
        this.isCreateMode = false
      });

    }, errorMessage => {
      this.toastService.generateToast('error', 'Publikacja Posta', errorMessage.data);
      this.isUploading = false;
      this.isCreateMode = false

    });

  }

  onCancelCreateMode() {

    if (!this.createPostForm.touched) {
      this.isCreateMode = false;
    } else {
      this.openDialog(30, 30, 'Anulować?', 'Wszystkie zmiany zostaną utracone', 'WRÓĆ', 'ANULUJ');
      this.dialogActionSubscription = this.action$.subscribe(action => {
        if (action === 'confirm') {
          this.createPostForm.reset();
          this.isCreateMode = false;
        }
        this.dialogActionSubscription.unsubscribe();
      });

      this.fileName = '';
      this.fileSize = '';
      this.fileSrc = undefined;
    }
  }

  onCancelEditMode() {

    if (!this.editPostForm.touched) {
      this.isEditMode = false;
      console.log('didnt touched');
    } else {
      console.log('touched');
      this.openDialog(30, 30, 'Anulować?', 'Wszystkie zmiany zostaną utracone', 'WRÓĆ', 'ANULUJ');
      this.dialogActionSubscription = this.action$.subscribe(action => {
        if (action === 'confirm') {
          this.editPostForm.reset();
          this.isEditMode = false;
        }
        this.dialogActionSubscription.unsubscribe();
      });

      this.fileName = '';
      this.fileSize = '';
      this.fileSrc = undefined;
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

  openDialog(widthInPercent: number, heightInPercent: number, title: string, content: string, cancellation: string, confirmation: string) {
    let dialogReference = this.dialog.open(
      CancelDialogComponent,
      {
        width: widthInPercent.toString() + '%',
        height: heightInPercent.toString() + '%',
        data: {
          title: title,
          content: content,
          cancellation: cancellation,
          confirmation: confirmation
        }
      }
    );

    this.dialogSubscription = dialogReference.afterClosed().subscribe(action => {
      this.dialogSubscription.unsubscribe();
      this.actionSubject.next(action);
    });
  }

}
