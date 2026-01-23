
import { Component, EventEmitter, Inject,  Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface IDynamicDialogConfig {
  title?: string;
  titleFontSize ?: string;
  showClose?: boolean;
  acceptButtonTitle?: string;
  declineButtonTitle?: string;
  dialogContentFontSize ?: string;
  dialogContent?: string;
  acceptButtonColor?:string;
  deleteButtonColor?:string;
  additionalButtons?: {
    label: string;
    action: string;
    color?: string;
  }[];
  titlePosition?: 'right' | 'left' | 'center'; 
  contentPosition?: 'right' | 'left' | 'center'; 
  buttonPosition?: 'right' | 'left' | 'center'; 
  showAdditionalButtons?: boolean;
  showAcceptButton?: boolean;
  showDeclineButton?: boolean;
  allocationDetails?;
  teamMemberDetails?;
  DelegateAdmin?;
}

@Component({
  selector: 'app-popup-template',
  templateUrl: './popup-template.component.html',
  styleUrls: ['./popup-template.component.scss'],
})
export class PopupTemplateComponent {
  @Output() buttonClicked = new EventEmitter<string>();

  constructor(
    public dialogRef: MatDialogRef<PopupTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDynamicDialogConfig
  ) {
    
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
      default:
        return 'title-container-center';
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
        console.log('Later button clicked');
        this.dialogRef.close(true);
        break;
      case 'save':
        // Handle "Save" action
        console.log('Save button clicked');
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
    this.buttonClicked.emit('decline');
    this.dialogRef.close('decline');
  }
  onClose(): void {
    this.dialogRef.close();
  }
}
