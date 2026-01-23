import { Component } from '@angular/core';
import { ModalComponent } from './modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { JsonService } from 'src/app/shared/service/service.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalCSS, ModalHTML, ModalTS } from './modalCode';

@Component({
  selector: 'app-nd-modal',
  templateUrl: './nd-modal.component.html',
  styleUrls: ['./nd-modal.component.scss'],
})
export class NdModalComponent {
  htmlModalCode = ModalHTML ;
  cssModalCode = ModalCSS;
  tsModalCode = ModalTS;
  stepData: any;
  activeStep: any;
  formGroup!: FormGroup;
  constructor(
    private dialog: MatDialog,
    private http: JsonService,
    private formBuilder: FormBuilder
  ) {
    this.initForm();
  }

  initForm() {
    this.formGroup = this.formBuilder.group({
      width: ['600px'],
      height: ['auto'],
      minWidth: ['200px'],
      maxWidth: ['90vw'],
      minHeight: ['150px'],
      maxHeight: ['90vh'],
      disableClose: [false],
      panelClass: ['nd-custom-class'],
      hasBackdrop: [true],
      backdropClass: [''],
      position: this.formBuilder.group({
        top: [''],
        bottom: [''],
        left: [''],
        right: [''],
      }),
    });
  }

  openModal() {
    this.http.ngModalPopup().subscribe({
      next: (res: any) => {
        console.log(res);
        const obj = {
          header: 'Angular Material modal',
          bindValue: res,
          type: 'medium',
        };
        this.openModalMaterial(obj);
      },
      error: (_err: any) => {
        console.log(_err);
      },
    });
  }
  openModalMaterial(setData: any) {
  const config = this.formGroup.value;
    const dialogRef = this.dialog.open(ModalComponent, {
    width: config.width,
    height: config.height,
    minWidth: config.minWidth,
    maxWidth: config.maxWidth,
    minHeight: config.minHeight,
    maxHeight: config.maxHeight,
    disableClose: config.disableClose,
    panelClass: config.panelClass,
    hasBackdrop: config.hasBackdrop,
    backdropClass: config.backdropClass,
    position: config.position,
    data: setData
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.modalResult = result;
    });
  }
modalResult : string =''
  openDynamicModal() {
    this.http.ngModalPopup().subscribe({
      next: (res: any) => {
        console.log(res);
        const setData = {
          header: 'Angular Dynamic Material modal',
          type: 'dynamic',
        };

        this.openModalMaterialDynamic(setData);
      },
      error: (_err: any) => {
        console.log(_err);
      },
    });
  }
  openModalMaterialDynamic(setData: any) {
    const config = this.formGroup.value;
    const dialogRef = this.dialog.open(ModalComponent, {
    width: config.width,
    height: config.height,
    minWidth: config.minWidth,
    maxWidth: config.maxWidth,
    minHeight: config.minHeight,
    maxHeight: config.maxHeight,
    disableClose: config.disableClose,
    panelClass: config.panelClass,
    hasBackdrop: config.hasBackdrop,
    backdropClass: config.backdropClass,
    position: config.position,
    data: setData,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
         this.modalResult = result;
    });
  }

  copyToClipboard(text: string) {
    if (!text) {
      console.warn('Failed to copy text');
      return;
    }
    navigator.clipboard.writeText(text);
  }
}
