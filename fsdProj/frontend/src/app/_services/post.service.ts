import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
@Injectable()
export class PostService{
    options;
    domain:'http://localhost:3500';
    constructor(private authService:AuthenticationService,
        private http: Http){}

    createAuthenticationHeaders() {
        this.authService.loadToken(); // Get token so it can be attached to headers
        // Headers configuration options
        this.options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json', // Format set to JSON
                'authorization': this.authService.authToken // Attach token
              })
        });
    }
    
    newPost(post) {
        this.createAuthenticationHeaders(); // Create headers
        return this.http.post(this.domain + 'posts/newPost',post, this.options).pipe(map(res => res.json()));
      }

      getAllPosts() {
        this.createAuthenticationHeaders(); // Create headers
        return this.http.get(this.domain + 'posts/allPosts', this.options).pipe(map(res => res.json()));
      }

      editPost(post) {
        this.createAuthenticationHeaders(); // Create headers
        return this.http.put(this.domain + 'posts/updatePost/', post, this.options).pipe(map(res => res.json()));
      }

      deletePost(id) {
        this.createAuthenticationHeaders(); // Create headers
        return this.http.delete(this.domain + 'posts/deletePost/' + id, this.options).pipe(map(res => res.json()));
      }
     
}