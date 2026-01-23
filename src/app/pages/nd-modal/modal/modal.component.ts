import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit{
  getDataValue: any;
  getHeaderValue: string = '';
  ndModalType: string = '';
  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {
    console.log(this.data);
  }
  ngOnInit(): void {
     this.ndModalType = this.data?.['type'];
     this.getDataValue = this.data?.['bindValue'];
     this.getHeaderValue = this.data?.['header'];
  }



  onSubmit() {
    this.dialogRef.close('Confirm Clicked!');
  }

  close(){
     this.dialogRef.close('Close/Cancel Clicked!');
  }
}
