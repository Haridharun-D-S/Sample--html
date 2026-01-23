import { Component, OnInit } from '@angular/core';
import {  ToastService } from './toaster.service';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss']
})
export class ToasterComponent {
  constructor(public toastService: ToastService) {}

  removeToast(index: number) {
    this.toastService.removeToast(index);
  }
}