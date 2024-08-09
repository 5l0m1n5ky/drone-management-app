import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap, throwError } from 'rxjs';
import { Post } from './portfolio.model';
import { Router } from '@angular/router';
import { ToastService } from '../shared/toast/toast.service';
import { PostFormData } from './form-data-interface';

interface PostHandleResponseData {
  data: PostData,
  message: string
}

interface PostData {
  post_id: number
}

interface PostErrorResponse {
  errors: string[],
  message: string
}

@Injectable()
export class PortfolioService {

  constructor(private http: HttpClient, private router: Router) { }

  fetchPosts() {
    return this.http.get<{ [post: string]: Post }>('http://localhost:8000/api/posts').pipe(map(responseData => {
      const postsArray: Post[] = [];
      for (const post in responseData) {
        if (responseData.hasOwnProperty(post)) {
          postsArray.push({ ...responseData[post] });
        }
      }
      return postsArray;
    })
    );
  }

  // uploadPost(postBody: any) {
  uploadPost(file: File, location: string, description: string, visibility: string) {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('visibility', visibility);
    // var body = { content: formData };

    return this.http.post<PostHandleResponseData>('http://localhost:8000/posts/create',
      // file: file,
      // location: location,
      // description: description,
      // visibility: visibility
      formData,
      {
        // headers: new HttpHeaders({
        //   // 'Content-Type': 'multi-part/form-data',
        //   'Accept': 'application/json',
        //   // 'enctype': 'multipart/form-data',
        // }),
        withCredentials: true,
        reportProgress: true
      }
    ).pipe(catchError(this.handleError),
      tap(response => {
        if (response.message === 'PUBLISHED') {
          this.router.navigate(['/portfolio']);
          // this.toast.generateToast('success', 'Publikacja Posta', 'Post został opublikowany');
        } else {
          // this.toast.generateToast('warn', 'Publikacja Posta', 'Wystąpił problem z publikacją posta');
        }
      }
      ));
  }

  private handleError(errorResponse: PostErrorResponse) {
    let errorMessage = 'Wystapił błąd w publikacji posta';

    // this.toast.generateToast('error', 'Publikacja Posta', 'Wystąpił problem z publikacją posta');

    // if (!errorResponse || !errorResponse.errors) {
    //   return throwError(errorMessage);
    // }

    errorMessage = errorResponse.message;

    return throwError(errorMessage);
  }

}
