import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { Button } from 'primeng/button';
import { exhaustMap, Observable, Subject, Subscription, take } from 'rxjs';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CancelDialogComponent } from '../shared/cancel-dialog/cancel-dialog.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ToastService } from '../shared/toast/toast.service';
import { LoginService } from '../login/login.service';
import { AppComponent } from '../app.component';
import { User } from '../user/user.model';

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
    // LoginService,
    AppComponent
  ]
})

export class PortfolioComponent implements OnInit, OnDestroy {

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

  @ViewChild('coverInput') coverInput: HTMLElement;
  coverName: string = '';
  coverSize: string;
  coverSrc: string | undefined;

  visibilityToggled: boolean = false;

  dialogSubscription = new Subscription;
  dialogActionSubscription = new Subscription;

  private actionSubject = new Subject<any>();
  action$: Observable<any> = this.actionSubject.asObservable();

  file: File | null;
  cover: File | null;

  onCreateSubscription: Subscription;
  onEditSubscription: Subscription;
  onFetchSubscription: Subscription;
  onDeleteSubscription: Subscription;
  onCheckSubscription: Subscription;


  constructor(private portfolioService: PortfolioService, private router: Router, private dialog: MatDialog, private toastService: ToastService, private loginService: LoginService, private appComponent: AppComponent) { }

  ngOnInit() {
    this.updateScreenSize();
    this.isLoading = true;
    this.onFetchSubscription = this.portfolioService.fetchPosts().subscribe(posts => {
      this.loadedPosts = posts;
      this.isLoading = false;
    });

    this.createPostForm = new FormGroup({
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

  onCoverSelected(event: any) {
    this.cover = event.target?.files[0];
    if (this.cover) {
      this.coverName = this.cover.name;
      if ((this.cover.size / 1024) < 1000) {
        this.coverSize = Number(this.cover.size / 1024).toFixed(2).toString() + ' KB';
      } else {
        this.coverSize = Number(this.cover.size / (1024 * 1024)).toFixed(2).toString() + ' MB';
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.coverSrc = reader.result?.toString();
      };
      reader.readAsDataURL(this.cover);
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
    this.isLoading = true;
    this.onCheckSubscription = this.loginService.checkSession().subscribe(responseData => {
      if (responseData && responseData.message && responseData.message.toString() === 'ACTIVE_SESSION') {
        this.isEditMode = true;
        this.editPostForm = new FormGroup({
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
        this.isLoading = false;
      }
    }, errorMessage => {
      this.router.navigate(['/login'], { queryParams: { action: 'session_expired' } });
      this.appComponent.changeLoginState();
      this.isLoading = false;
    });
  }

  onEdit() {
    this.isUploading = true;
    console.log(this.editPostForm);
    this.onEditSubscription = this.portfolioService.updatePost(
      this.currentPost.id,
      this.file,
      this.cover,
      this.editPostForm.get('postLocationForm.location')?.value,
      this.editPostForm.get('postDescriptionForm.description')?.value,
      this.editPostForm.get('postVisibilityForm.visibility')?.value,
    ).subscribe(responseData => {
      this.isUploading = false;
      this.toastService.generateToast('success', 'Edycja Posta', responseData.message.toString());
      this.editPostForm.reset();
      this.file = null;
      this.cover = null;
      this.isEditMode = false;
      this.onShow = false;

      this.isLoading = true;
      this.onFetchSubscription = this.portfolioService.fetchPosts().subscribe(posts => {
        this.loadedPosts = posts;
        this.isLoading = false;
      });
    }, errorMessage => {
      this.toastService.generateToast('error', 'Edycja Posta', errorMessage.toString());
      this.isUploading = false;
      this.isEditMode = false;
      this.editPostForm.reset();
      this.file = null;
      this.cover = null;
    });
  }

  onDelete() {
    this.openDialog(30, 30, 'Usunąć post?', 'Post zostanie trwale usunięty z portfolio', 'WRÓĆ', 'USUŃ');
    this.dialogActionSubscription = this.action$.subscribe(action => {
      if (action === 'confirm') {

        this.isUploading = true;

        this.onFetchSubscription = this.onDeleteSubscription = this.portfolioService.deletePost(this.currentPost.id).subscribe(responseData => {
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
    this.isLoading = true;
    this.onCheckSubscription = this.loginService.checkSession().subscribe(responseData => {
      console.log('session state: ', responseData);
      if (responseData && responseData.message && responseData.message.toString() === 'ACTIVE_SESSION') {
        this.isCreateMode = true;
        this.isLoading = false;
      }
    }, errorMessage => {
      this.router.navigate(['/login'], { queryParams: { action: 'session_expired' } });
      this.appComponent.changeLoginState();
      this.isLoading = false;
    });
  }

  onPostCreate() {
    this.isUploading = true;
    this.onCreateSubscription = this.portfolioService.uploadPost(
      this.file,
      this.cover,
      this.createPostForm.get('postLocationForm.location')?.value,
      this.createPostForm.get('postDescriptionForm.description')?.value,
      this.createPostForm.get('postVisibilityForm.visibility')?.value,
    ).subscribe(responseData => {
      this.isUploading = false;
      this.toastService.generateToast('success', 'Publikacja Posta', responseData.message.toString());
      console.log(responseData);
      this.file = null;
      this.file = null;
      this.createPostForm.reset();

      this.onFetchSubscription = this.portfolioService.fetchPosts().subscribe(posts => {
        this.loadedPosts = posts;
        this.isLoading = false;
        this.isCreateMode = false
      });

    }, errorMessage => {
      this.toastService.generateToast('error', 'Publikacja Posta', errorMessage.data);
      this.isUploading = false;
      this.isCreateMode = false
      this.file = null;
      this.file = null;
    });
  }

  onCancelCreateMode() {

    if (!this.file) {
      this.isCreateMode = false;
    } else {
      this.openDialog(30, 30, 'Anulować?', 'Wszystkie zmiany zostaną utracone', 'WRÓĆ', 'ANULUJ');
      this.dialogActionSubscription = this.action$.subscribe(action => {
        if (action === 'confirm') {
          this.createPostForm.reset();
          this.isCreateMode = false;
        }
        this.dialogActionSubscription.unsubscribe();

        this.fileName = '';
        this.fileSize = '';
        this.fileSrc = undefined;
        this.file = null;

        this.coverName = '';
        this.coverSize = '';
        this.coverSrc = undefined;
        this.cover = null;
      });
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
      this.file = null;
      this.file = null;
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

  public getFileExtension(url: string): string | null {

    const matches = url.match(/\.([a-zA-Z0-9]+)(?:[\?#]|$)/);
    return matches ? matches[1].toLowerCase() : null;
  }

  public isImage(url: string): boolean {

    const imageExtensions = ['jpg', 'jpeg', 'png'];
    const extension = this.getFileExtension(url);
    return extension ? imageExtensions.includes(extension) : false;
  }

  // checkAdminPrivileges() {
  //   if (this.loginService.hasAdminPrivileges()) {
  //     return true;
  //   }
  //   return false;
  // }

  isAdmin() {
    return this.loginService.hasAdminPrivileges();
  }

  ngOnDestroy(): void {
    this.onCreateSubscription?.unsubscribe();
    this.onEditSubscription?.unsubscribe();
    this.onFetchSubscription?.unsubscribe();
  }
}
