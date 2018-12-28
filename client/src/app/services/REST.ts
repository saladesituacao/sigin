import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { environment } from '../../environments/environment';

export class REST{

  constructor(private http: Http){
  }

  protected getURL(url, useprefix:boolean = true){
    if(useprefix)
      return `${environment.url}${environment.API_URL}${url}`;
    else
      return `${environment.url}${url}`;
  }

  protected get(path:string){
    return this.http.get(this.getURL(path), this.jwt()).map(
      (response: Response) => response.json());
  }

  protected post(path:string, objeto:any){
    return this.http.post(this.getURL(path), objeto, this.jwt()).map(
      (response: Response) => response.json());
  }

  protected put(path:string, objeto:any){
    return this.http.put(this.getURL(path), objeto, this.jwt()).map(
      (response: Response) => response.json());
  }

  protected patch(path:string, objeto:any){
    return this.http.patch(this.getURL(path), objeto, this.jwt()).map(
      (response: Response) => response.json());
  }
  
  protected delete(path:string){
    return this.http.delete(this.getURL(path), this.jwt()).map(
      (response: Response) => response.json());
  }

  protected gethttp(){
      return this.http;
  }

  protected jwt() {
      // create authorization header with jwt token
      let currentToken = localStorage.getItem('token');
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json' );

      if (currentToken) {
          headers.append('Authorization', currentToken);
      }

      return new RequestOptions({ headers: headers });
  }
}
