import { Directive, Input, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Directive({
  selector: '[appCopy]'
})
export class CopyDirective {

  @Input('appCopy') copyText!: string;

  constructor(private snackBar: MatSnackBar) {}

  @HostListener('click')
  onClick() {
    if (!this.copyText) {
      this.snackBar.open('Nothing to copy!',  '',{
        duration: 2500,
        panelClass: 'snack-error',
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
      return;
    }

    navigator.clipboard.writeText(this.copyText)
      .then(() =>
        this.snackBar.open('Copied!', '', {
          duration: 2500,
          panelClass: 'snack-success',
          verticalPosition: 'top',
          horizontalPosition: 'right'
        })
      )
      .catch(() =>
        this.snackBar.open('Copy Failed!', '', {
          duration: 2500,
          panelClass: 'snack-error',
          verticalPosition: 'top',
          horizontalPosition: 'right'
        })
      );
  }
}
