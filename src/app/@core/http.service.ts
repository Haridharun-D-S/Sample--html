import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AlertService } from '../shared/modules/_service/alert.service';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  public headers = new HttpHeaders()
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');

  constructor(private http: HttpClient, private alertService: AlertService) {}

  // private get_formatted_url(url: string): string {
  //   return environment.apiService + url;
  // }

  // private get_formatted_url_digi(url: string): string {
  //   return environment.digiService + url;
  // }

  // public get(url: string, params: any = {}): Observable<any> {
  //   return this.request('GET', this.get_formatted_url(url), {}, params);
  // }

  // public post(url: string, body: any = {}, params: any = {}): Observable<any> {
  //   return this.request('POST', this.get_formatted_url(url), body, params);
  // }

  // public postDigi(url: string, body: any = {}, params: any = {}): Observable<any> {
  //   return this.request('POST', this.get_formatted_url_digi(url), body, params);
  // }

  // public put(url: string, body: any = {}, params: any = {}): Observable<any> {
  //   return this.request('PUT', this.get_formatted_url(url), body, params);
  // }

  // public patch(url: string, body: any = {}, params: any = {}): Observable<any> {
  //   return this.request('PATCH', this.get_formatted_url(url), body, params);
  // }

  // public delete(url: string, body: any = {}, params: any = {}): Observable<any> {
  //   return this.request('DELETE', this.get_formatted_url(url), body, params);
  // }

  // public request(method: string, url: string, body: any = {}, params: any = {}): Observable<any> {
  //   return this.http.request(method, url, {
  //     body: body,
  //     headers: this.headers,
  //     params: this.buildParams(params),
  //   }).pipe(
  //     map((response: any) => response),
  //     catchError(this.handleError.bind(this))
  //   );
  // }

  // public buildParams(paramsObj: any): HttpParams {
  //   let params = new HttpParams();
  //   Object.keys(paramsObj).forEach((key) => {
  //     params = params.set(key, paramsObj[key]);
  //   });
  //   return params;
  // }

  // public resetHeaders(): void {
  //   this.headers = new HttpHeaders()
  //     .set('Accept', 'application/json')
  //     .set('Content-Type', 'application/json');
  // }

  // public setHeader(key: string, value: string): void {
  //   this.headers = this.headers.set(key, value);
  // }

  // public deleteHeader(key: string): void {
  //   this.headers = this.headers.delete(key);
  // }

  // private handleError(error: any) {
  //   const errorMsg = error?.error?.message || 'Unknown error';
  //   this.alertService.error(errorMsg);
  //   return throwError(() => error);
  // }
}

