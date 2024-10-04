import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RxjsOperatorServiceService {

  constructor(private http:HttpClient) { }
    
  getPostById(id: number) {
    return this.http.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
  }

}

