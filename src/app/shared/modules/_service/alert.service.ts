import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private subject = new Subject<any>();
  private position = new Subject<any>();
  private keepAfterNavigationChange = false;

  constructor(private router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
          if (this.keepAfterNavigationChange) {
              // only keep for a single location change
             
              this.keepAfterNavigationChange = false;
          } else {
              // clear alert
              this.subject.next({});
          }
      }
    });
  }

  success(message: string, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: 'success', text: message});
    setTimeout(() => this.clear(), 5000);
  }

  error(message: string, keepAfterNavigationChange = false) {

      this.keepAfterNavigationChange = keepAfterNavigationChange;
      this.subject.next({ type: 'error', text: message });
      setTimeout(() => this.clear(), 5000);

  }
  info(message: string, keepAfterNavigationChange = false) {
    this.clear()
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: 'Info', text: message });
    this.position.next({ position: 'bottom' })
    setTimeout(() => this.clear(), 10000);
}

warn(message: string, keepAfterNavigationChange = false) {
  this.clear();
  this.keepAfterNavigationChange = keepAfterNavigationChange;
  this.subject.next({ type: 'Warning', text: message });
  this.position.next({ position: 'bottom' })
  setTimeout(() => this.clear(), 8000);
}

successNew(message: string, keepAfterNavigationChange = false) {
  this.keepAfterNavigationChange = keepAfterNavigationChange;
  this.subject.next({ type: 'success', text: message});
  setTimeout(() =>this.clear() , 10000);
}
  clear() {
    this.subject.next('');
}

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
  getPosition(): Observable<any> {
    return this.position.asObservable();
  }


}
