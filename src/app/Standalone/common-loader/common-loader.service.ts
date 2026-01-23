import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class CommonLoaderService {
  
  private isLoading = new BehaviorSubject<boolean>(false);

  constructor() { }

  showLoader(): void {
    this.isLoading.next(true);
  }

  hideLoader(): void {
    this.isLoading.next(false);
  }

  getLoaderState(): BehaviorSubject<boolean> {
    return this.isLoading;
  }
}
