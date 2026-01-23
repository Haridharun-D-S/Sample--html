export const ModalHTML = 
`
<!-- medium -->
<section *ngIf="ndModalType =='medium'">
    <div class="nd-mat-header">
        <h2 mat-dialog-title>{{getHeaderValue}}</h2>
        <div class="col-1 p-0 text-end cls2">
            <button class="close danger nd-mat-popup-close" (click)="close()" type="button">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    </div>
    <mat-dialog-content class="mat-typography">
        <ng-container *ngFor="let item of getDataValue">
        <h3>{{item?.title ?? 'N/A'}}</h3>
        <p>{{item?.description ?? 'N/A'}}</p>
   </ng-container>
    </mat-dialog-content>
    <mat-dialog-actions [align]="'end'">
        <button mat-flat-button color="primary" (click)="onSubmit()">Submit</button>
        <button mat-stroked-button (click)="close()">Cancel</button>
    </mat-dialog-actions>
</section>

<!-- Dynamic -->
<section *ngIf="ndModalType =='dynamic'">
    <div class="nd-mat-header">
        <h2 mat-dialog-title>{{getHeaderValue}}</h2>
        <div class="col-1 p-0 text-end cls2">
            <button class="close danger nd-mat-popup-close" (click)="close()" type="button">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    </div>
    <mat-dialog-content class="mat-typography">
        <ng-container *ngFor="let item of getDataValue">
        <h3>{{item?.title ?? 'N/A'}}</h3>
        <p>{{item?.description ?? 'N/A'}}</p>
   </ng-container>
    </mat-dialog-content>
    <mat-dialog-actions [align]="'end'">
        <button mat-flat-button color="primary" (click)="onSubmit()">Submit</button>
        <button mat-stroked-button (click)="close()">Cancel</button>
    </mat-dialog-actions>
</section>`

export const ModalCSS = `
.nd-mat-popup-header{
  padding-bottom: 12px !important;
    i{
        margin-right: 10px;
        color: #005EA2;
    }
}
.nd-mat-header{
  display: flex;
  justify-content: space-between !important;
  align-items: center !important;
  height: 45px;
}

.nd-mat-popup-close{
  background-color: transparent;
  border: none;
  outline: none;

  i{
    color: #dc3545;
    font-size: 28px;
    margin-right: 12px;
  }
}
`
export const ModalTS =`
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
}`