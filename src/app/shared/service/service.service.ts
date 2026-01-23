import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JsonService {

  constructor(readonly http: HttpClient) { }

  wigetConfig() {
    return this.http.get('/assets/json/widget-config.json');
  }
  datepickerConfig() {
    return this.http.get('/assets/json/datepicker-config.json');
  }
  loaderConfig() {
    return this.http.get('/assets/json/loader-config.json');
  }
   headerConfig() {
    return this.http.get('/assets/json/header-config.json');
  }
   ngModalPopup() {
    return this.http.get('/assets/json/modal-config.json');
  }
}
