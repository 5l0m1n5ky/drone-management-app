import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap, throwError } from 'rxjs';
import { Post } from './portfolio.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

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

  private domain: string | undefined;

  constructor(private http: HttpClient, private router: Router) {
    this.domain = environment.ApiDomain;
  }

  fetchPosts() {
    return this.http.get<{ [post: string]: Post }>(`${this.domain}/api/posts`).pipe(map(responseData => {
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

    return this.http.post<PostHandleResponseData>(`${this.domain}/api/posts`,
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
    const endpointUrl = `${this.domain}/api/posts/update/${id.toString()}`
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

    //POST method works with usage of Angular FormData body unlike to PUT or PATCH
    return this.http.post<PostHandleResponseData>(endpointUrl,
      formData,
      {
        withCredentials: true
      }
    ).pipe(catchError(this.handleError),
      tap(response => {
        return response.message;
      }
      ));
  }

  deletePost(id: number) {
    const endpointUrl = `${this.domain}/api/posts/${id.toString()}`;
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
