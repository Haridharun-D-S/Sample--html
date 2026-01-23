import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GridService {

  constructor(private http: HttpClient) { }

  execute(type:string, requestUrl:string, params?:any) {
    if(type.toLowerCase() === 'get') {
      return this.http.get(requestUrl)
    } else {
      return this.http.post(requestUrl, params)
    }
  }
}
