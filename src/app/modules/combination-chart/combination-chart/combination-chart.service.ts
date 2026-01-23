import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CombinationChartService {
  public chartareaclicked = new BehaviorSubject(undefined);
  public chartActionEvent = new BehaviorSubject(undefined);
  public chartValue = new BehaviorSubject(undefined);

  constructor() { }

  // Methods for interacting with local storage
  public getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  public setItem(key: string, item: any): void {
    localStorage.setItem(key, JSON.stringify(item));
  }

  public getObj(key: string, safe = true): any {
    try {
      const item = this.getItem(key);
      return JSON.parse(item!);
    } catch (e) {
      if (!safe) {
        throw (e);
      }
    }
  }

  public setObj(key: string, item: any): void {
    localStorage.setItem(key, JSON.stringify(item));
  }

  public removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  public clear(): void {
    localStorage.clear();
  }
}
