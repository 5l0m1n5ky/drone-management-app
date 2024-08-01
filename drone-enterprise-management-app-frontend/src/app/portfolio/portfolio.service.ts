import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Post } from './portfolio.model';

@Injectable()
export class PortfolioService {

  constructor(private http: HttpClient) { }

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

}
