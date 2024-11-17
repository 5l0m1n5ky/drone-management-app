import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Post } from '../portfolio.model';
import { ActivatedRoute, Router, RouterEvent, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Observable, Subject, Subscription } from 'rxjs';
import { OnscrollAutoplay } from '../onscroll-autoplay.directive';
import { LoginService } from 'src/app/login/login.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PortfolioService } from '../portfolio.service';
import { MatDialog } from '@angular/material/dialog';
import { AppComponent } from 'src/app/app.component';
import { ToastService } from 'src/app/shared/toast/toast.service';
import { CancelDialogComponent } from 'src/app/shared/cancel-dialog/cancel-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';

@Component({
  standalone: true,
  selector: 'app-preview-mobile',
  templateUrl: './preview-mobile.component.html',
  imports: [
    CommonModule,
    RouterLink,
    OnscrollAutoplay,
    MatStepperModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatMenuModule,
    LoadingSpinnerComponent
  ],
  providers: [PortfolioService]
})
export class PreviewMobileComponent implements OnInit, AfterViewInit, OnDestroy {

  loadedPosts: Post[] = [];
  postToEdit: Post;
  postIdToPreview: number;
  isAdminMode: boolean = false;
  isEditMode: boolean = false;
  isUploading: boolean = false;
  editPostForm: FormGroup;
  visibilityToggled: boolean = false;
  isLoading: boolean = false;
  currentPost: Post;
  screenWidth: number;
  createPostForm: FormGroup
  dialogSubscription = new Subscription;
  dialogActionSubscription = new Subscription;
  onCreateSubscription: Subscription;
  onEditSubscription: Subscription;
  onFetchSubscription: Subscription;
  onDeleteSubscription: Subscription;
  onCheckSubscription: Subscription;
  postsSubsription: Subscription;
  file: File | null = null;
  cover: File | null;

  @ViewChild('fileInput') fileInput: HTMLElement;
  fileName: string = '';
  fileSize: string;
  fileSrc: string | undefined;

  @ViewChild('coverInput') coverInput: HTMLElement;
  coverName: string = '';
  coverSize: string;
  coverSrc: string | undefined;

  private actionSubject = new Subject<any>();
  action$: Observable<any> = this.actionSubject.asObservable();

  constructor(private route: ActivatedRoute, private router: Router, private location: Location, private loginService: LoginService, private portfolioService: PortfolioService, private dialog: MatDialog, private toastService: ToastService, private appComponent: AppComponent) { }

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
          inline: "nearest",
        });
      }
    }
  }

  isAdmin() {
    return this.loginService.hasAdminPrivileges();
  }

  onToggleChange() {
    this.visibilityToggled = !this.visibilityToggled;
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

  onEditMode(postId: number) {
    this.isLoading = true;
    this.onCheckSubscription = this.loginService.checkSession().subscribe(responseData => {
      if (responseData && responseData.message && responseData.message.toString() === 'ACTIVE_SESSION') {

        this.postToEdit = this.loadedPosts.filter(post => post.id === postId)[0];
        console.log(this.postToEdit);

        this.editPostForm = new FormGroup({
          postLocationForm: new FormGroup({
            location: new FormControl(this.postToEdit.location, Validators.required)
          }),
          postDescriptionForm: new FormGroup({
            description: new FormControl(this.postToEdit.description, Validators.required)
          }),
          postVisibilityForm: new FormGroup({
            visibility: new FormControl(this.postToEdit.visibility)
          }),
        });
        this.isEditMode = true;
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
      this.postToEdit.id,
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
      this.isLoading = true;
      this.location.back();
    }, errorMessage => {
      this.toastService.generateToast('error', 'Edycja Posta', errorMessage.toString());
      this.isUploading = false;
      this.isEditMode = false;
      this.editPostForm.reset();
      this.file = null;
      this.cover = null;
    });
  }

  onCancelEditMode() {
    if (!this.editPostForm.touched && this.file === null) {
      this.isEditMode = false;
    } else {
      this.openDialog(90, 30, 'Anulować?', 'Wszystkie zmiany zostaną utracone', 'WRÓĆ', 'ANULUJ');
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
      this.cover = null;
    }
  }

  onDelete(postId: number) {
    this.openDialog(90, 30, 'Usunąć post?', 'Post zostanie trwale usunięty z portfolio', 'WRÓĆ', 'USUŃ');
    this.dialogActionSubscription = this.action$.subscribe(action => {
      if (action === 'confirm') {
        this.isUploading = true;
        this.onDeleteSubscription = this.portfolioService.deletePost(postId).subscribe(responseData => {
          this.isUploading = false;
          this.toastService.generateToast('success', 'Usuwanie Posta', responseData.data.toString());
          this.onFetchSubscription = this.portfolioService.fetchPosts().subscribe(posts => {
            this.loadedPosts = posts;
            this.isLoading = false;
          });
        }, errorMessage => {
          this.toastService.generateToast('error', 'Usuwanie Posta', errorMessage);
          this.isUploading = false;
        });
      }
      this.dialogActionSubscription.unsubscribe();
      this.location.back();
    });
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

  ngOnDestroy(): void {
    this.onCreateSubscription?.unsubscribe();
    this.onEditSubscription?.unsubscribe();
    this.onFetchSubscription?.unsubscribe();
    this.onDeleteSubscription?.unsubscribe();
    this.onCheckSubscription?.unsubscribe();
    this.postsSubsription?.unsubscribe()
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
