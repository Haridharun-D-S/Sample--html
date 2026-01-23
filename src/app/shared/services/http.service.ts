import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { map } from 'rxjs/operators';
@Injectable()
export class HttpService {
    public headers = new HttpHeaders().set('Accept', 'application/json').set('Content-Type', 'application/json');

    constructor(private http: HttpClient) {
    }

    private get_formatted_url(url: string): string {
        return environment.apiService + url;
    }

    public get(url: string, params = {}): Observable<any> {
        return this.request('GET', this.get_formatted_url(url), {}, params);
    }

    public post(url: string, body = {}, params = {}): Observable<any> {

        return this.request('POST', this.get_formatted_url(url), body, params);
    }
    public put(url: string, body = {}, params = {}): Observable<any> {
        return this.request('PUT', this.get_formatted_url(url), body, params);
    }

    public patch(url: string, body = {}, params = {}): Observable<any> {
        return this.request('PATCH', this.get_formatted_url(url), body, params);
    }

    public delete(url: string, body = {}, params = {}): Observable<any> {
        return this.request('DELETE', this.get_formatted_url(url), body, params);
    }

    public request(method: string, url, body = {}, params = {}) {
        return this.http.request(method, url, {
            body: body,
            headers: this.headers,
            params: this.buildParams(params)
        }).pipe(map(response => {
            return response;
          }))
         // .catch(this.handleError);
    }

    public buildParams(paramsObj): HttpParams {
        let params = new HttpParams();
        Object.keys(paramsObj).forEach((key) => {
            params = params.set(key, paramsObj[key]);
        });
        return params;
    }

    public resetHeaders(): void {
        this.headers = new HttpHeaders().set('Accept', 'application/json').set('Content-Type', 'application/json');
    }

    public setHeader(key: string, value: string): void {
        this.headers = this.headers.set(key, value);
    }

    public deleteHeader(key: string): void {
        this.headers = this.headers.delete(key);
    }
}
