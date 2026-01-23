import { Component, EventEmitter, Inject,  Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SessionStorageService } from 'src/app/shared/services/storage.service';

export interface IDataEntryDynamicDialogConfig {
  title?: string;
  titleFontSize ?: string;
  showClose?: boolean;
  acceptButtonTitle?: string;
  declineButtonTitle?: string;
  dialogContentFontSize ?: string;
  dialogContent: string;
  showActionButtons: boolean;
  acceptButtonColor ?:string;
  deleteButtonColor ?:string;
  additionalButtons?: {
    label: string;
    action: string;
    color?: string;
  }[];
  titlePosition?: 'right' | 'left' | 'center'; 
  contentPosition?: 'right' | 'left' | 'center' | 'None'; 
  buttonPosition?: 'right' | 'left' | 'center';
  selectorName?: string;
  selectorInput?: [];
  dataEntryPageInput?: string;
  RecordSplitPageInput?: string;
  PageFieldType?: string;
  TabName?: string;
}

@Component({
  selector: 'app-data-entry-popup-view',
  templateUrl: './data-entry-popup-view.component.html',
  styleUrls: ['./data-entry-popup-view.component.scss']
})
export class DataEntryPopupViewComponent {
  @Output() buttonClicked = new EventEmitter<string>();
  HeaderValue: string = '';

  constructor(
    public dialogRef: MatDialogRef<DataEntryPopupViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDataEntryDynamicDialogConfig,
    private sessionStorage: SessionStorageService,
  ) {
    let CaseDetails = JSON.parse(this.sessionStorage.getItem('selectedCaseDetails'));
    this.HeaderValue =  CaseDetails['Case ID'] ? CaseDetails['Case ID']: '';
  }
  getTitleContainerClass(): string {
    switch (this.data.titlePosition) {
      case 'right':
        return 'title-container-right';
      case 'left':
        return 'title-container-left';
      default:
        return 'title-container-center';
    }
  }
  getContentContainerClass(): string {
    switch (this.data.contentPosition) {
      case 'right':
        return 'title-container-right';
      case 'left':
        return 'title-container-left';
      case 'center':
        return 'title-container-center';
      default:
        return '';
    }
  }
  getButtonContainerClass(): string {
    switch (this.data.buttonPosition) {
      case 'right':
        return 'title-container-right';
      case 'left':
        return 'title-container-left';
      default:
        return 'title-container-center';
    }
  }
  onAdditionalButtonClick(action: string): void {
    // Handle the button action based on the provided action string
    switch (action) {
      case 'later':
        // Handle "Later" action
        this.buttonClicked.emit('later');
        //console.log('Later button clicked');
        this.dialogRef.close(true);
        break;
      case 'save':
        // Handle "Save" action
        //console.log('Save button clicked');
        this.buttonClicked.emit('save');
        this.dialogRef.close(true);
        break;
      // Add cases for other button actions if needed
      default:
        // Handle default action
        break;
    }
  }
  onAcceptClick(): void {
    this.buttonClicked.emit('accept');
    this.dialogRef.close('accept');
  }
  onDeclineClick(): void {
    this.buttonClicked.emit('accept');
    this.dialogRef.close('decline');
  }
  onClose(): void {
    this.buttonClicked.emit('decline');
    this.dialogRef.close('decline');
  }
  
  /*
      *** Dynamic Entry Page Close & Complete EventEmitter ***
  */
      DynamicEntryPageCloseCompleteEventEmitter(event: string): void {
        if(event === 'Close'){
          this.buttonClicked.emit('save');
          this.dialogRef.close(true);
        }
        else{
          this.buttonClicked.emit('save');
          this.dialogRef.close(true);
        }
      }

}



