import { Component } from '@angular/core';
import { ToastService } from './toaster/toaster.service';
import { toastHtml, toastCss, toastTS, toastService } from './toasterCode';

@Component({
  selector: 'app-nd-toaster',
  templateUrl: './nd-toaster.component.html',
  styleUrls: ['./nd-toaster.component.scss'],
})
export class NdToasterComponent {
  htmlToasterCode =toastHtml;
  cssToasterCode = toastCss;
  tsToasterCode = toastTS;
  serviceToasterCode = toastService;

  constructor(private toast: ToastService) {}

  showAlert(type: any) {
    if (type == 'success') {
      this.toast.success('Success message!');
    } else if (type == 'warning') {
      this.toast.warning('warning message!');
    } else if (type == 'info') {
      this.toast.info('info message!');
    } else {
      this.toast.error('error message!');
    }
  }
}
