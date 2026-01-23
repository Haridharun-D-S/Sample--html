import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SharedServiceService } from 'src/app/shared/services/sharedservice.service';
import { EventEmitterService } from 'src/app/shared/services/eventemitter.service';
import { Router } from '@angular/router';
import { SessionStorageService } from 'src/app/shared/services/storage.service';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { MatDialog } from '@angular/material/dialog';
import { IDynamicDialogConfig, PopupCustomComponent } from 'src/app/modules/shared-module/popup-custom/popup-custom.component';
import { AuthenticationService } from 'src/app/modules/auth/auth.service';
import { CommonLoaderService } from 'src/app/Standalone/common-loader/common-loader.service';
import { PopupErrorComponent } from 'src/app/modules/shared-module/popup-error/popup-error.component';
import { PopupSuccessComponent } from 'src/app/modules/shared-module/popup-success/popup-success.component';
declare let $: any;

@Component({
  selector: 'app-header-apps',
  templateUrl: './header-apps.component.html',
  styleUrls: ['./header-apps.component.scss']
})
export class HeaderAppsComponent implements OnInit {
  private loggedIn = new BehaviorSubject<boolean>(false);

  public sharedmodel: any;
  prgIntSection: any[];
  adminconsoleSection: any[];
  discovery: any[];
  registry: any[];
  configAdminconsole: any[];
  configPrgInt: any[];
  configMenu: any[];

  compAppname: any;
  topmenu: boolean = false;
  configIcon: boolean = false;
  @ViewChild('pageHeader') pageHeader: ElementRef;
  @ViewChild('configHeader') configHeader: ElementRef;
  isHidden: boolean = true;
  userName: any;
  showDelIcon: boolean;
  configAppshow: number;
  groupArr: any[];
  groupInsightArr: any[];
  groupConfigArr: any[];
  groupInsightArrCheck: any[];

  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  idleStateTime: any;
  loginLoader: boolean;
  showMarquee: boolean;
  showModule: boolean;
  topMenuAppName: any;
  pagename: string;
  downloadStatus: any;

  imagesForSlider = [];
  previousBtnShow: any;
  nextBtnShow: any;
  showPrevBtn: boolean;
  showNextBtn: boolean;
  cardDetails: any[];
  roleName: any;
  analyticsObj;
  analyticsObj1;
  pagesObj;
  orgPage;
  orgDashboard;
  WorkQueueType: string;

  constructor(
    private userAccess: SharedServiceService,
    private eventEmitService: EventEmitterService,
    public router: Router,
    private storage: SessionStorageService,
    private idle: Idle,
    public dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private loaderService: CommonLoaderService
  ) {
    this.userAccess.workqueueTypeChange.next(undefined);
  }


  isLoggedIn() {
    return this.loggedIn.asObservable();
  }
  ngOnInit() {
    this.isHidden = true;
  
    this.userAccess.getUserAccess().subscribe({
      next :(ress:any) => {
          this.sharedmodel = ress;     
        if (this.sharedmodel.Configurator.length > 0) {
          this.showModule = true;
          document.addEventListener('click', this.offClickHandler.bind(this));
        } else {
          this.showModule = false;
        }
        this.prgIntSection = [];
        this.adminconsoleSection = [];
        this.discovery = [];
        this.registry = [];
        this.configAdminconsole = [];
        this.configPrgInt = [];
        this.configMenu = [];
  
        this.groupInsightArr = this.sharedmodel.appsPages.reduce((r, { appGroupName }) => {
          if (!r.some((o) => o.appGroupName == appGroupName)) {
            r.push({
              appGroupName,
              groupItem: this.sharedmodel.appsPages.filter((v) => v.appGroupName == appGroupName),
            });
          }
          return r;
        }, []);
  
        for (let i = 0; i < this.groupInsightArr.length; i++) {
          if (i === 0) this.groupInsightArr[i].class = 'row menu-one';
          //three
          else if (i === 1) this.groupInsightArr[i].class = 'row menu-two';
          //three
          else if (i === 2) this.groupInsightArr[i].class = 'row menu-three';
          //three
          else if (i === 3) this.groupInsightArr[i].class = 'row menu-four'; //three
        }
  
        this.groupConfigArr = this.sharedmodel.Configurator.reduce(
          (r, { appGroupName, IsPrimary }) => {
            if (!r.some((o) => o.appGroupName == appGroupName && o.IsPrimary == IsPrimary)) {
              r.push({
                appGroupName,
                IsPrimary,
                groupItem: this.sharedmodel.Configurator.filter(
                  (v) => v.appGroupName == appGroupName
                ),
              });
            }
            return r;
          },
          []
        );
  
        this.groupConfigArr = this.groupConfigArr.filter((item) => item.IsPrimary === 'true');
  
        this.groupConfigArr.forEach((item) => {
          for (let j = 0; j < item.groupItem.length; j++) {
            if (item.groupItem[j].IsPrimary !== 'true') {
              item.groupItem.splice(j, 1);
            } 
          }
        });
        for (let i = 0; i < this.groupConfigArr.length; i++) {
          if (i === 0) this.groupConfigArr[i].class = 'row menu-one';
          //three
          else if (i === 1) this.groupConfigArr[i].class = 'row menu-two';
          //three
          else if (i === 2) this.groupConfigArr[i].class = 'row menu-three';
          //three
          else if (i === 3) this.groupConfigArr[i].class = 'row menu-four';
        }
      },
      error:(err) =>{
         // error
      },
      complete :()=>{
         // completed
      }
    });

    const currentUser = this.storage.getObj('currentUser');

    this.userName = currentUser.Name;
    this.roleName = currentUser.RoleName;
    this.eventEmitService.sub = this.eventEmitService.invokeTopMenuToggle.subscribe(() => {
      this.closeTopMenu();
    });

    if (this.router.url === '/dashboard') {
        this.pagename = 'Batch Dashboard'; 
      } else if(this.router.url === '/filelistdashboard'){
        this.pagename = 'File Dashboard';
      } else if(this.router.url === '/process-batch'){
        this.pagename = 'Process New Batch';
      } else if(this.router.url === '/case-list-page' || this.router.url === '/task-list-page') {
        this.pagename = 'Cases'
      } else if(this.router.url === '/reports') {
        if(this.roleName == 'Admin'){
          this.pagename = 'Reports'
        }
      } else if(this.router.url === '/insights') {
        if(this.roleName == 'Admin'){
          this.pagename = 'Insights'
        }
      }

    this.WorkQueueType = this.storage.getItem('WorkQueueType');

   if(this.WorkQueueType == 'By Files' && this.router.url === '/dashboard') {
    this.pagename = 'File Dashboard';
   } else if(this.WorkQueueType == 'By Batch' && this.router.url === '/filelistdashboard') {
    this.pagename = 'Batch Dashboard';
   }

    this.userAccess.excelDownloadStatus.subscribe(val => {
      this.downloadStatus = val;
    })

    this.userAccess.workqueueTypeChange.subscribe(val => {
      if(val) {
        this.WorkQueueType = this.storage.getItem('WorkQueueType');
        if(this.WorkQueueType == 'By Files' && this.router.url === '/dashboard') {
          this.pagename = 'File Dashboard';
         } else if(this.WorkQueueType == 'By Batch' && this.router.url === '/dashboard') {
          this.pagename = 'Batch Dashboard';
         } else if(this.WorkQueueType == 'By Batch' && this.router.url === '/filelistdashboard') {
          this.pagename = 'Batch Dashboard';
         }
        // if(this.router.url === '/filelistdashboard') {
        //   if(val == 'By Batch') {
        //     this.pagename = 'Batch List'; 
        //   } else {
        //     this.pagename = 'File List';
        //   }
        // } else {
        //   if(val == 'By Files') {
        //     this.pagename = 'File List'; 
        //   } else {
        //     this.pagename = 'Batch List';
        //   }
        // }
      }
    })

    this.userAccess.sessionTimeoutNotification.subscribe(err => {
      if (err) {
        (<any>$('#idleWarning')).modal('show');
      }
    })
  }

  // for session timeout
  reset() {
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.idle.watch();
    (<any>$('#idleWarning')).modal('hide');
    // this.idleState = 'Started.';
  }


  // * ClickHandler for Page Header Click
  offClickHandler(event: any) {
    if (!this.pageHeader.nativeElement.contains(event.target)) {
      this.topmenu = false;
    }
    if (!this.configHeader.nativeElement.contains(event.target)) {
      this.configIcon = false;
    }
  }

  closeTopMenu() {
    this.topmenu = false;
  }
  configurator() {
    this.configIcon = !this.configIcon;
  }
  topmenuIcon() {
    this.topmenu = !this.topmenu;
  }
  toggleSideMenu(_event: MouseEvent) {
    this.eventEmitService.onTopNavClick();
  }

  // Logout Call function
  onLogout() {
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
    this.storage.removeItem('WorkQueueType')    
    this.storage.removeItem('selectedAllFileDetails')   
    this.storage.removeItem('auditNaviagtion')   
    this.storage.removeItem('SelectedWorkQueueName') 
  }
  // Top Menu click Events
  appId: any;
  appName(app) {
    this.appId = app.AppId;
    console.log(app)
    if (app.IsSearchable === 'true') {
        this.userAccess.dashsearch.next('true');
    } else{
      this.userAccess.dashsearch.next('false');
    }
    // this.storage.setItem('appName',app.appName);
   
    if(app.Url == '/mycases') {
      this.storage.setItem('WrokQueue_From','login');
      this.router.navigate(['case-list-page']);
    } 
    else if(app.Url == '/insights' || app.Url == '/reports'){
      if(this.roleName == 'Admin'){
        this.storage.setItem('WrokQueue_From','login');
        this.router.navigate([app.Url]);
      }
    }
    else if(app.appName == 'Batch Dashboard') {
      this.storage.removeItem('Selected_Filters_Column');
      this.storage.removeItem('SelectedWorkQueueName') 
      this.pagename = 'Batch Dashboard'; 
      this.router.navigate(['/dashboard']);
      this.storage.setItem('WorkQueueType', 'By Batch');
      // setTimeout(() => {
      //   if(this.router.url === "/dashboard") {
      //     this.userAccess.appMenuChange.next(app.appName);
      //   }
      // }, 200);  
      // const tempValue = 'By Batch';
      // this.userAccess.workqueueTypeChange.next(tempValue);
    }
    else if(app.appName == 'File Dashboard') {
      this.storage.removeItem('Selected_Filters_Column');
      this.storage.removeItem('SelectedWorkQueueName') 
      this.pagename = 'File Dashboard';
      this.router.navigate(['/filelistdashboard']);
      this.storage.setItem('WorkQueueType', 'By Files');
      // setTimeout(() => {
      //   if(this.router.url === "/filelistdashboard") {
      //     this.userAccess.appMenuChange.next(app.appName);
      //   }
      // }, 200);   
      // const tempValue = 'By Files';
      // this.userAccess.workqueueTypeChange.next(tempValue);
    }
    else if(app.appName == 'Process New Batch') {
      this.storage.removeItem('Selected_Filters_Column');
      this.pagename = 'Process New Batch';
      this.router.navigate(['/process-batch']);
    }
    else {
      this.storage.setItem('WrokQueue_From','login');
      this.router.navigate([app.Url]);
    }
    if(this.roleName == 'Admin'){
      this.userAccess.dashboardid.next(1);
    }
    else{
      this.userAccess.dashboardid.next(2);
    }

    if (this.router.url === app.Url) {
      this.topmenu = false;
    }

    this.userAccess.sessionTimeoutNotification.next(undefined)
  }

  previousSlide() {
  }

  nextSlide() {
  }

  skipGuide() {
    this.imagesForSlider = [];
  }

  /*
      *** Tab Click ***
  */
  settingsClickEventHandler(){
    let currentUser = this.storage.getObj('currentUser');
    if(currentUser.RoleName == 'Admin'){
      let allocationDetails: { autoAllocationStatus: string; temporaryAdminDetails: { team_member_user_id: string; start_date: string; expiry_date: string; enable_flag: string; }[]; };
      let teamMemberDetails = [];
      this.userAccess.GetCaseAllocationAndTempAdminDetails().subscribe({
        next: (val) => {
          allocationDetails = val;
        },
        error: (_error) => {},
        complete:()=>{
          this.userAccess.GetTeamMemberDetails().subscribe({
            next: (val) => {
              teamMemberDetails = val;
            },
            error: (_error) => {},
            complete:()=>{
              const dialogRef = this.dialog.open(PopupCustomComponent, {
                panelClass: '',
                data: <IDynamicDialogConfig>{
                  title: 'Settings',
                  titleFontSize:'20',
                  type : 'Settings',
                  titlePosition: 'left',
                  caseDetail: '',
                  fileDetails: '',
                  showClose: true,
                  showAcceptButton: true,
                  showDeclineButton: true,
                  buttonPosition: 'right', 
                  acceptButtonTitle: 'Okay',
                  declineButtonTitle: 'Cancel',
                  allocationDetails: allocationDetails,
                  teamMemberDetails: teamMemberDetails,
                  DelegateAdmin: allocationDetails.temporaryAdminDetails.length > 0 ? true : false,
                  },
                  height: 'auto',
                  width: '900px',
              });
              dialogRef.disableClose = true;
              dialogRef.componentInstance.customButtonClicked.subscribe(action => {
                let resp: string = '';
                this.userAccess.SaveCaseAllocationAndTempAdminDetails(action).subscribe({
                  next: (val) => {
                    resp = val;
                  },
                  error: (_error) => {},
                  complete:()=>{
                    this.loaderService.hideLoader();
                    if(resp == 'Saved Successfully!!!'){
                      dialogRef.close();
                        const dialogRef2 = this.dialog.open(PopupSuccessComponent, {
                          // panelClass: '',
                          data: <IDynamicDialogConfig>{
                            title: 'Success',
                            titleFontSize:'20',
                            type : '',
                            titlePosition: 'left',
                            contentPosition: 'left',
                            dialogContentFontSize: '15',
                            dialogContent: 'Settings updated successfully.',
                            additionalButtons: [],
                            showAcceptButton: true,
                            acceptButtonTitle: 'Okay',
                            buttonPosition: 'right',
                            declineButtonTitle: '' ,
                            caseDetail: '',
                            fileDetails: '',
                            showClose: false
                            },
                            height: 'auto',
                            width: '450px',
                        });
                        dialogRef2.disableClose = true;
                      }
                      else{
                        const dialogRef2 = this.dialog.open(PopupErrorComponent, {
                          width: '450px',
                          data: <IDynamicDialogConfig>{
                          title: 'Error',
                          titleFontSize:'20',
                          dialogContent : resp,
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
                      dialogRef2.disableClose = true;
                    }
                  }
                });
              });
            }
          });
        }
      });
    }
  }
  logoffEventHandler(){
    let otherRoles = this.storage.getItem('OtherRoles');
    if(otherRoles == 'Y'){
      const dialogRef = this.dialog.open(PopupCustomComponent, {
        panelClass: '',
        data: <IDynamicDialogConfig>{
          title: 'Log Off',
          titleFontSize:'20',
          type : 'LogOff',
          titlePosition: 'left',
          caseDetail: '',
          fileDetails: '',
          showClose: false,
          showAcceptButton: false,
          showDeclineButton: true,
          declineButtonTitle: 'Cancel',
          buttonPosition: 'right', 
          additionalButtons: [
            {
              label: 'Yes, Log Off',
              action: 'LogOff'
            },
            {
              label: 'Switch Role',
              action: 'SwitchRole'
            }
            ],
          showAdditionalButtons: true,
          },
          height: 'auto',
          width: '500px',
      });
      dialogRef.disableClose = true;
      dialogRef.componentInstance.buttonClicked.subscribe(action => {
        switch (action) {
            case 'LogOff':
              this.onLogout();
              break;
            case 'SwitchRole':
              this.openCustomDialog();
              break;
        }
      });
    }
    else{
      const dialogRef = this.dialog.open(PopupCustomComponent, {
        panelClass: '',
        data: <IDynamicDialogConfig>{
          title: 'Log Off',
          titleFontSize:'20',
          type : 'LogOff',
          titlePosition: 'left',
          caseDetail: '',
          fileDetails: '',
          showClose: false,
          showAcceptButton: false,
          showDeclineButton: true,
          declineButtonTitle: 'Cancel',
          buttonPosition: 'right', 
          additionalButtons: [
            {
              label: 'Yes, Log Off',
              action: 'LogOff'
            }
            ],
          showAdditionalButtons: true,
          },
          height: 'auto',
          width: '500px',
      });
      dialogRef.disableClose = true;
      dialogRef.componentInstance.buttonClicked.subscribe(action => {
        switch (action) {
            case 'LogOff':
              this.onLogout();
              break;
        }
      });
    }
  }
  openCustomDialog() {
   let assignedRoles = this.storage.getObj('currentUserAdmin');
   this.userAccess.GetAssignedRolesForUser().subscribe({
     next: (val) => {
       assignedRoles = val;
     },
     error: (_error) => {},
     complete:()=>{
       let currentUser = this.storage.getObj('currentUserMyself');
       if (currentUser && assignedRoles && assignedRoles.length > 0) {
         const stringsArray: string[] = assignedRoles.map(obj => obj.userName);
         const dialogRef = this.dialog.open(PopupCustomComponent, {
           data: <IDynamicDialogConfig>{
             title: 'Select Role',
             type: 'SelectRole',
             titleFontSize: '20',
             showClose: true,
             additionalButtons: [
               {
                 label: 'As Admin (' + stringsArray[0] + ')',
                 action: 'Admin'
               },
               {
                 label: 'As Myself (' + currentUser.Name + ')',
                 action: 'Myself'
               }
             ],
             titlePosition: 'left',
             contentPosition: 'left',
             buttonPosition: 'right',
             showAdditionalButtons: true,
             showAcceptButton: false,
             showDeclineButton: false
           },
           height: 'auto',
           width: '500px'
         });
         dialogRef.disableClose = true;
 
         dialogRef.componentInstance.buttonClicked.subscribe(action => {
           switch (action) {
               case 'Admin':
                 const userNameArray: string[] = assignedRoles.map(obj => obj.userName);
                 const roleNameArray: string[] = assignedRoles.map(obj => obj.roleName);
                 const roleIdArray: string[] = assignedRoles.map(obj => obj.roleId);
                //  currentUser.Name = userNameArray[0];
                 currentUser.RoleId = roleIdArray[0];
                 currentUser.RoleName = roleNameArray[0];
                 this.proceedLogin(currentUser);
                 break;
               case 'Myself':
                 this.proceedLogin(currentUser);
                 break;
           }
         });
       }
     }
   });
  }
  proceedLogin(response){
    this.userAccess.activeToken.next(response.Token)
    const sessionCaseIds:any = [];
    this.storage.setObj('currentUser', response);
    this.storage.setObj('sessionCaseIds', sessionCaseIds);
    this.userAccess.getUserAccess().subscribe(
      {
        next : (ress:any) => {
          this.sharedmodel = ress;
          this.storage.setObj('sharedModel', JSON.stringify(this.sharedmodel));
          // this.router.navigate([res.appsPages[0].Url]);
          this.router.navigate(['/login'], { skipLocationChange: true }).then(() => {
          this.storage.setItem('WrokQueue_From','login');
          this.router.navigate(['/dashboard']);
        });
        },
        error : (err) =>{
        },
        complete :()=>{
        }
      }            
    )
    this.authenticationService.userInactive.next(undefined)
    this.userAccess.sessionTimeoutNotification.next(undefined)
  }
  SaveCaseAllocationAndTempAdminDetails(result){
    this.userAccess.SaveCaseAllocationAndTempAdminDetails(result).subscribe({
      next: (val) => {},
      error: (_error) => {},
      complete:()=>{}
    });
  }

}
