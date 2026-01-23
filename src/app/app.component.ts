import { Component } from '@angular/core';
import DisableDevtool from 'disable-devtool';
import { SharedServiceService } from './shared/services/sharedservice.service';
import { NavigationEnd, Router } from '@angular/router';
import { SessionStorageService } from './shared/services/storage.service';
import { MatDialog } from '@angular/material/dialog';
import { IDynamicDialogConfig, PopupErrorComponent } from './modules/shared-module/popup-error/popup-error.component';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';

export const MY_DATE_FORMATSS = {
  parse: {
    dateInput: 'MM/DD/YYYY',
  },
  display: {
    dateInput: 'MM/DD/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'MM/DD/YYYY',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATSS},
  ]
})
export class AppComponent {
  constructor(
    private userAccess: SharedServiceService,
    public router: Router,
    private storage: SessionStorageService,
    public dialog: MatDialog
  ){
    let openDialogIds = [];
    this.dialog.afterOpened.subscribe(dialogRef => {
      const dialogId = dialogRef.componentInstance?.data?.dialogId;
      if (dialogId) {
        openDialogIds.push(dialogId);
      }
    });
    this.dialog.afterAllClosed.subscribe(() => {
      openDialogIds = [];
    });
    /***************Disable Developer Tools - Uncomment****************/
    // DisableDevtool({
    //   ondevtoolopen: (type) => {
    //     if (!openDialogIds.includes('developerToolErr')){
    //       this.openErrorDialog();
    //     }
    //   }
    // });
    /***********End************/
  }
  title = 'VAERS Standalone Solution';

  ngOnInit() {
    // window.addEventListener('popstate', () => {
    //   this.clearSessionOnBack();
    // });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/login') {
          this.clearSessionOnBack();
        }
      }
    });
  }
  clearSessionOnBack() {
    this.storage.clear(); // Clear session storage
    this.router.navigate(['/login']); // Redirect to login
  }
  //error dialog
  openErrorDialog(){
    const dialogRef = this.dialog.open(PopupErrorComponent, {
      width: '450px',
      data: <IDynamicDialogConfig>{
        dialogId: 'developerToolErr',
        title: 'Error',
        titleFontSize:'20',
        dialogContent : 'Please close your developer tool',
        dialogContentFontSize: '15',
        acceptButtonTitle: 'Okay',
        titlePosition: 'left',
        contentPosition : 'left',
        buttonPosition : 'right',
        showClose : false,
        showAdditionalButtons: false,
        showAcceptButton: true,
        showDeclineButton: false
      }
    });
    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(result => {
      this.onLogout();
    });
  }
  
  // Logout Call function
  onLogout() {
    this.dialog.closeAll();
    this.userAccess.dashsearch.next('false');  
    this.router.navigate(['/login']);
    this.storage.removeItem('currentUser');
    this.storage.removeItem('caseWorkQueueId');
    this.storage.removeItem('selectedCaseDetails');
    localStorage.removeItem('ButtonClickedFromMyCases');
    localStorage.removeItem('From Page Name');
    localStorage.removeItem('objectId');
    localStorage.removeItem('domainId');
    localStorage.removeItem('scatterWidgetItem');
    localStorage.removeItem('manualSearchPageNumber');
    localStorage.removeItem('manualSearchinPdf');
    localStorage.removeItem('nowordsInPdf');
    this.storage.removeItem('unameEncrypt');
    this.storage.removeItem('selectedCasesDetails');
    this.storage.removeItem('passEncrypt')
    this.storage.removeItem('currentUserMyself')
    this.storage.removeItem('sharedModel')
    this.storage.removeItem('recordListingData')
    this.storage.removeItem('sessionCaseIds')
    this.storage.removeItem('currentUserAdmin')
    this.storage.removeItem('OtherRoles')
    this.storage.removeItem('selectedTORID')
    this.storage.removeItem('unameEncrypt')
    this.storage.removeItem('PDFViewerLoaded')
    this.storage.removeItem('gridFilter')
    this.storage.removeItem('lsLoaded')
    this.storage.removeItem('pageBunging')
    this.storage.removeItem('recordListingPageType')
    this.storage.removeItem('currentUser')
    this.storage.removeItem('BasePagetype')
    this.storage.removeItem('selectedCasesDetails')
    this.storage.removeItem('activeToken')
    this.storage.removeItem('selectedCaseDetails')
    this.storage.removeItem('excelName')
  }


}
