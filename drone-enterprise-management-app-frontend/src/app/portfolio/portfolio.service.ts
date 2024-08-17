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

interface PostManagementResponse {
  data: string,
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

  uploadPost(file: File | null, cover: File | null, location: string, description: string, visibility: string) {
    const formData: FormData = new FormData();
    if (file) {
      formData.append('file', file, file.name);
    }
    if (cover) {
      formData.append('cover', cover, cover.name);
    }
    formData.append('description', description);
    formData.append('location', location);
    formData.append('visibility', visibility);

    return this.http.post<PostHandleResponseData>('http://localhost:8000/posts/create',
      formData,
      {
        withCredentials: true,
        reportProgress: true
      }
    ).pipe(catchError(this.handleError),
      tap(response => {
        // this.router.navigate(['/portfolio']);
        return response.message;
      }
      ));
  }

  private handleError(errorResponse: HttpErrorResponse) {

    let errorMessage = 'Wystapił błąd';
    if (errorResponse.error.data) {
      errorMessage = errorResponse.error.data;
    } else {
      errorMessage = errorResponse.error.message;
    }

    return throwError(errorMessage);
  }


  updatePost(id: number, file: File | null, cover: File | null, location: string, description: string, visibility: string) {
    const endpointUrl = 'http://localhost:8000/posts/update/' + id.toString()
    const formData: FormData = new FormData();

    if (file) {
      formData.append('file', file, file.name);
    }
    if (cover) {
      formData.append('file', cover, cover.name);
    }
    formData.append('description', description);
    formData.append('location', location);
    formData.append('visibility', visibility);

    //POST method works with usage of Angular FormData body unlike to PUT or PATCH
    return this.http.post<PostHandleResponseData>(endpointUrl,
      formData,
      {
        withCredentials: true,
        reportProgress: true
      }
    ).pipe(catchError(this.handleError),
      tap(response => {
        return response.message;
      }
      ));
  }

  deletePost(id: number) {
    const endpointUrl = 'http://localhost:8000/posts/delete/' + id.toString();
    return this.http.delete<PostManagementResponse>(endpointUrl,
      {
        withCredentials: true,
        reportProgress: true
      }
    ).pipe(catchError(this.handleError),
      tap(response => {
        return response.message;
      }
      ));
  }
}
