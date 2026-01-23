
import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  invokeSideMenuToggle = new EventEmitter();
  closeSideToggle = new EventEmitter();
  invokeTopMenuToggle = new EventEmitter();
  tabChange1 =new EventEmitter();
  sub: Subscription;

  constructor() { }

  onTopNavClick() {
    this.invokeSideMenuToggle.emit();
   
  }
  TopMenuNavClick() {
    this.invokeTopMenuToggle.emit();
   
  }
  tabChange(){
    this.tabChange1.emit(); 
  }
 
}