import { Component, EventEmitter, Inject,  OnInit,  Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SharedServiceService } from 'src/app/shared/services/sharedservice.service';
import { FormGroup,FormBuilder, Validators, FormControl} from '@angular/forms';
import { DatePipe } from '@angular/common';
import moment from 'moment';
import { DateConvertPipe } from 'src/app/shared/pipe/date-convert-pipe';
import { EcareGridSettings } from 'src/app/shared/modal/ecareGridSetting';
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { SessionStorageService } from 'src/app/shared/services/storage.service';
import { EncryptionService } from 'src/app/shared/services/encryption.service';
import { Router } from '@angular/router';
import { CommonLoaderService } from 'src/app/Standalone/common-loader/common-loader.service';
import { ChartServiceService } from 'src/app/shared/services/chart_service';
import { PopupCustomComponent } from '../../shared-module/popup-custom/popup-custom.component';
import { environment } from 'src/environments/environments';
import { PopupSuccessComponent } from '../../shared-module/popup-success/popup-success.component';
import { PopupTemplateComponent } from '../../shared-module/popup-template/popup-template.component';

const moment1 = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/DD/YYYY',
  },
  display: {
    dateInput: 'MM/DD/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'MM/DD/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
MY_FORMATS.display.dateInput = 'MM/DD/YYYY';
export interface IDynamicDialogConfig {
  title?: string;
  titleFontSize ?: string;
  showClose?: boolean;
  acceptButtonTitle?: string;
  declineButtonTitle?: string;
  dialogContentFontSize ?: string;
  dialogContent?: string;
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
  fileDetails?: string;
  showAcceptButton?: boolean;
  showDeclineButton?: boolean;
  allocationDetails?;
  teamMemberDetails?;
  DelegateAdmin?;
  gridWidget?: EcareGridSettings;
  btnList?;
}


@Component({
  selector: 'app-workqueue-popup',
  templateUrl: './workqueue-popup.component.html',
  styleUrls: ['./workqueue-popup.component.scss']
})
export class WorkqueuePopupComponent implements OnInit {
  dashboardData: any[];
  showDashBoard: boolean;
  pageType: string = 'insights';
  chartInput: { measureId: string; factId: string; timeId: string; dimension: any; };
  isTabDisabled: boolean;
  WorkQueueCategoryFilteredItems: any;
  WorkQueueGroupIdToLoad: any;
  tabs: any;
  currentUser: any;
  token: any;
  roleName: any;
  orgName: any;
  userId: any;
  roleid: any;
  orgId: any;
  userName: any;
  btnList: any[];
  popupOpened: boolean;
  @Output() buttonClicked = new EventEmitter<string>();
  dataEntryPageInput: string = 'popup';
  Data;
  loading = false;
  isLoading: boolean = true;
  gridWidget: EcareGridSettings;
  WorkqueueButtonList: any;
  disableBtnStatus: any[];
  ownerData: any;
  constructor(
    public dialogRef: MatDialogRef<WorkqueuePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDynamicDialogConfig,
    public service : SharedServiceService,
    private formbuilder: FormBuilder,
    private datePipe: DatePipe,
    private sessionStorage: SessionStorageService,
    private sharedService: SharedServiceService,
    private encryptDecrypt: EncryptionService,
    public dialog: MatDialog,
    private ChartSharedService : ChartServiceService,
    public router: Router,
    private loaderService: CommonLoaderService
  ) {}
  ngOnInit(): void {
    this.disableBtnStatus = [];
    this.currentUser = this.sessionStorage.getObj('currentUser');
    this.token = this.currentUser.Token;
    this.roleName = this.currentUser.RoleName;
    this.orgName = this.currentUser.OrganizationName;
    this.userId = this.encryptDecrypt.decrypt('DecryptRevoKey11', this.currentUser.UserId)
    this.roleid = this.encryptDecrypt.decrypt('DecryptRevoKey11', this.currentUser.RoleId)
    this.orgId = this.encryptDecrypt.decrypt('DecryptRevoKey11', this.currentUser.OrgId)
    this.userName = this.currentUser.Name
    //console.log(this.data);
    if(this.data) {
      this.Data = this.data;
      this.loading = true;
      if(this.Data.type === 'insightsGrid') {
        this.chartInput = this.sessionStorage.getObj("insightsChartData");
        this.isLoading = true;
        this.loadInsightsGrid();
      }

    }
  }

  getTitleContainerClass(): string {
    switch (this.Data.titlePosition) {
      case 'right':
        return 'title-container-right';
      case 'left':
        return 'title-container-left';
      default:
        return 'title-container-center';
    }
  }
  getContentContainerClass(): string {
    switch (this.Data.contentPosition) {
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
    switch (this.Data.buttonPosition) {
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
      case 'AssignOwner':
        // Handle "Save" action
        //console.log('Save button clicked');
        break;
      // Add cases for other button actions if needed
      case 'SetPriority':
        // Handle "Save" action
        //console.log('Save button clicked')
        break;
      // Add cases for other button actions if needed
      default:
        // Handle default action
        this.buttonClicked.emit(action);
        this.dialogRef.close(true);
        break;
    }
  }
  onAcceptClick(): void {
  }

  onDeclineClick(): void {
    this.buttonClicked.emit('decline');
    this.dialogRef.close();
  }
  onClose(): void {
    this.dialogRef.close();
  }

  loadInsightsGrid(){
    this.WorkqueueButtonList = this.data.btnList;
    this.gridWidget = this.data.gridWidget;
    setTimeout(() => {
      this.isLoading = false;
    }, 200);
  }

  handleCheckBoxEvent(event){
    this.disableBtnStatus = [];
    let mergedObject = event.selectedRowDetails.reduce((result, current) => {
      Object.entries(current).forEach(([key, value]) => {
          if (!result.hasOwnProperty(key) || value === "N") {
            result[key] = value;
          }
        });
        return result;
      }, {});
    if(mergedObject){
      let keysArray = Object.keys(mergedObject)
      .filter(key => {
        if (key === 'Process Flag') {
          return mergedObject[key] === 'Y' && event['selectedRowCount'] === 1;
        }
        return mergedObject[key] === 'Y';
      })
      .map(key => key.replace(' Flag', ''));
        this.disableBtnStatus = keysArray;
    }
    if(event.selectedRowDetails && event.selectedRowDetails.length > 0){
      event.selectedRowDetails.map(item => {
        item.WorkQueueType = 'InsightsWorkqueue';
      })
    }
    this.sessionStorage.removeItem('selectedCaseDetails');
    this.sessionStorage.removeItem('selectedCasesDetails');
    if (event['selectedRowCount'] == 1) {
        this.sessionStorage.setItem("selectedCaseDetails", JSON.stringify(event.selectedRowDetails[0]));
        this.sessionStorage.setItem("selectedCasesDetails", JSON.stringify(event.selectedRowDetails));
    } 
    else if (event['selectedRowCount'] > 1) {
        this.sessionStorage.setItem("selectedCasesDetails", JSON.stringify(event.selectedRowDetails));
    } 
    else {
      this.disableBtnStatus = [];
    }
  }
  gridClickEvent(event){
    console.log('event', event);
    if(event.From === 'StatusRendererComponent'){
      let caseDetails = JSON.parse(this.sessionStorage.getItem("selectedCaseDetails"));
      const dialogRef = this.dialog.open(PopupCustomComponent, {
        panelClass: 'view-doc-full-view',
        data: <IDynamicDialogConfig>{
          title: 'ViewDoc',
          titleFontSize:'20',
          type : 'ViewDoc',
          titlePosition: 'left',
          // contentPosition: 'center',
          additionalButtons: [],
          acceptButtonTitle: '',
          declineButtonTitle: '' ,
          caseDetail: caseDetails,
          fileDetails: ''
          },
          height: '100vh',
          width: '100vw',
          // position: {
          //     top: `${ 24 }px`
          //   },
      });
      dialogRef.disableClose = true;
  
      dialogRef.afterClosed().subscribe(result => {
          if(result) {
              this.workqueueTabApiTrigger();
          }
      });
    }
    if(event.From === 'HyperlinkRendererComponent' && event.id == 1){
      this.dialogRef.close();
      this.loaderService.showLoader();
      this.sessionStorage.setItem('BasePagetype', 'CaseDetailsInsights');
      this.router.navigate(['/base-action-page']);
    }
    if(event.From === 'HyperlinkRendererComponent' && event.id == 2){
      this.loaderService.showLoader();
      console.log('2', event);
      let caseDetails = JSON.parse(this.sessionStorage.getItem("selectedCaseDetails"));
      const req = {
        "CaseId": caseDetails['Case_ID']
      }
      let auditDetails: string = '';
      console.log('req', req);
      this.sharedService.GetCaseAuditTrailDetails(req).subscribe({
        next: (val) => {
          auditDetails = val;
        },
        error: (_error) => {
        },
        complete:()=>{
          this.loaderService.hideLoader();
          const dialogRef = this.dialog.open(PopupCustomComponent, {
            panelClass: 'case-audit-modal',
            data: <IDynamicDialogConfig>{
              title: 'Document Audit Trail',
              titleFontSize:'20',
              type : 'Case Audit',
              titlePosition: 'left',
              // contentPosition: 'center',
              additionalButtons: [],
              acceptButtonTitle: '',
              declineButtonTitle: '' ,
              caseDetail: caseDetails,
              fileDetails: auditDetails,
              showClose: true
              },
              height: 'auto',
              width: '900px',
              // position: {
              //     top: `${ 24 }px`
              //   },
          });
          dialogRef.disableClose = true;
      
          dialogRef.afterClosed().subscribe(result => {
              if(result) {
                  this.workqueueTabApiTrigger();
              }
          });
        }
      });
    }
   }
   workqueueTabApiTrigger(){
    this.loaderService.showLoader();
     this.isLoading = true;
     let reqObj = {
       "token": this.token,
       "WorkQueueGroupId": 1,
       "workQueueContext": "",
       "measureFilters": {
         "measureId": this.chartInput.measureId,
         "timeId": this.chartInput.timeId,
         "factId": this.chartInput.factId,
         "xDimensionValue": this.chartInput.dimension ? this.chartInput.dimension.StackedDimensionValues1 : '',
         "yDimensionValue": this.chartInput.dimension ? this.chartInput.dimension.StackedDimensionValues2 : ''
       }
     }
     this.sharedService.getUserQueue(reqObj).subscribe({
     next:  (response) => {
       this.WorkQueueCategoryFilteredItems = response.filter(item => item.WorkQueue_Category === 'By Doc Status');
       if (this.WorkQueueCategoryFilteredItems.length > 0) {
         this.WorkQueueCategoryFilteredItems.forEach(item => {
           item.QueList.forEach((element, i) => {
             if(element.WorkQueue_Name === 'Filtered Docs'){
               item.WorkQueueDefaultId = element.WorkQueue_Id;
               this.btnList = element["Workqueue Button List"];
             }
           });
           if (item.WorkQueue_Level === 'Case') {
             this.WorkQueueGroupIdToLoad = item.WorkQueueDefaultId;
             this.tabs = item.QueList;
           }
         })
       }
     },
     error:  (error) => {},
     complete:()=>{
       this.gridApiTrigger();
     }})
   }
   gridApiTrigger(){
     this.disableBtnStatus = [];
     let excelName =  this.userName + '_' + 'By Doc Status_AllWorkQueues_Case_All Docs';
     this.sessionStorage.setItem("excelName", excelName);
       let reqObj = { 
           token:"t2k7jHs13XuW0O7MufPn0mnrJU8MTxKd5JKBSz5kEP8hTSKTrO1s8QbJWimlCLpPt1Ihp8+iOCa6WiV7pNkWTA==",
           "workQueueContext": '',
           workQueId:this.WorkQueueGroupIdToLoad,
           fromDate:null,
           toDate:null,
           status:"",
           "measureFilters": {
             "measureId": this.chartInput.measureId,
             "timeId": this.chartInput.timeId,
             "factId": this.chartInput.factId,
             "xDimensionValue": this.chartInput.dimension ? this.chartInput.dimension.StackedDimensionValues1 : '',
             "yDimensionValue": this.chartInput.dimension ? this.chartInput.dimension.StackedDimensionValues2 : ''
           }
         }
       this.gridWidget = new EcareGridSettings();
       this.gridWidget = {
         id: 'WorkqueueInsights',
         enableFilter: true,
         enableSorting: true,
         enableRowSelection: true,
         checklocaljson : false,
         apiMethod: 'post',
         apiUrl: `${environment.apiService}Cases/GetWorkQueueData`,
         apiRequest: reqObj,
         actionColumns: [],
         linkableField: '',
         rowSelection: 'multiple',
         floatingFilter: true,
         sidebar: true,
         pagination: true,
         exceloption: true,
         colWidth: 180,
         gridname: 'Workqueue Grid',
         firstRowSelection: false,
         noDataErrorMessage: 'No Case Records found. Please contact your administrator for more information',
         exportToExcel: false,
       };
       setTimeout(() => {
        this.loaderService.hideLoader();
        this.isLoading = false;
        }, 200);
   }

   WorkqueueAction(value) {
     let caseDetails = JSON.parse(this.sessionStorage.getItem("selectedCasesDetails"));
     if(value === 'Assign/Reassign') {
         let reqObj = {
           "lookupCode": "Case Owner"
         }
         this.sharedService.getWorkQueueFilterLookupValues(reqObj).subscribe({
           next:  (response) => {
             this.ownerData = response;         
             this.ownerData.map(item=>{
               item.id = item.lookupCode,
               item.value = item.lookupName
             })
           },
            error:  (error) => {
           },
           complete:()=>{ 
            this.loaderService.hideLoader();
             const dialogRef = this.dialog.open(PopupCustomComponent, {
               data: {
                 type : value,
                 title: 'Assign/Reassign',
                 titlePosition: 'left',
                 // contentPosition: 'center',
                 buttonPosition: 'right',
                 additionalButtons: [
                   {
                     label: 'Assign/Reassign',
                     action: 'AssignOwner'
                   }
                 ],
                 acceptButtonTitle: 'Assign',
                 declineButtonTitle: 'Cancel',
                 showDeclineButton: true,
                 showClose: true,
                 caseDetail: caseDetails,
                 ownerDetails: this.ownerData 
               },
               height: 'auto',
               width: '1100px',
               // position: {
               //     top: `${ 24 }px`
               //   },
             });
             dialogRef.disableClose = true;
             
            dialogRef.componentInstance.customButtonClicked.subscribe(obj => {
              if(obj) {
                  obj.ownerlist = obj.ownerlist.filter(obj => obj.owner_id !== '');
                  obj.ownerlist = this.removeDuplicates(obj.ownerlist, 'case_id');
                  if(obj.ownerlist.length != 0) {
                    let reqObj = obj.ownerlist;
              
                    this.sharedService.multipleCaseAssign(reqObj).subscribe({
                      next:  (response) => {
                      },
                       error:  (error) => {
                        dialogRef.close();
                      },
                      complete:()=>{ 
                        this.loaderService.hideLoader();
                        dialogRef.close();
                        const dialogRef3 = this.dialog.open(PopupSuccessComponent, {
                          // panelClass: '',
                          data: <IDynamicDialogConfig>{
                            title: 'Success',
                            titleFontSize:'20',
                            type : '',
                            titlePosition: 'left',
                            contentPosition: 'left',
                            dialogContentFontSize: '15',
                            dialogContent: 'Selected Doc(s) Assigned/Reassigned successfully.',
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
                            // position: {
                            //     top: `${ 24 }px`
                            //   },
                        });
                        dialogRef3.disableClose = true;
                    
                        dialogRef3.afterClosed().subscribe(result => {
                          this.isLoading = true;
                          this.loaderService.showLoader();
                          this.workqueueTabApiTrigger();
                        });
                      }})
                  }  
                // }
              }
            });
           }})
       
     } else if(value === 'Set Priority') {
       let PriorityData = [{
         id: 'No',
         value: 'No'
       },{
         id: 'Yes',
         value: 'Yes'
       }]
       this.loaderService.hideLoader();
       const dialogRef = this.dialog.open(PopupCustomComponent, {
         data: {
           type : value,
           title: value,
           titlePosition: 'left',
           // contentPosition: 'center',
           buttonPosition: 'right',
           additionalButtons: [
             {
               label: 'Set Priority',
               action: 'SetPriority'
             }
           ],
           acceptButtonTitle: 'Assign',
           declineButtonTitle: 'Cancel',
           showDeclineButton: true,
           caseDetail: caseDetails,
           ownerDetails: PriorityData ,
           showClose: true
         },
         height: 'auto',
         width: '1100px',
         // position: {
         //     top: `${ 24 }px`
         //   },
       });
       dialogRef.disableClose = true;
       
      dialogRef.componentInstance.customButtonClicked.subscribe(obj => {
        if(obj) {
          obj.ownerlist = obj.ownerlist.filter(obj => obj.priority !== '');
          obj.ownerlist = this.removeDuplicates(obj.ownerlist, 'case_id');
          if(obj.ownerlist.length != 0) {
            let reqObj = obj.ownerlist;
            this.sharedService.updateBulkCasePriority(reqObj).subscribe({
              next:  (response) => {
              },
               error:  (error) => {
              },
              complete:()=>{ 
                this.loaderService.hideLoader();
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
                    dialogContent: 'Priority set for the selected Doc(s) successfully.',
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
                    // position: {
                    //     top: `${ 24 }px`
                    //   },
                });
                dialogRef2.disableClose = true;
            
                dialogRef2.afterClosed().subscribe(result => {
                  this.isLoading = true;
                  this.loaderService.showLoader();
                  this.workqueueTabApiTrigger();
                });
              }})
          }  
        }
    });
   } else if (value === 'Manage Listing' || value === 'Process') {
       // this.setTaskDetails();
      
      let caseDetail = JSON.parse(this.sessionStorage.getItem("selectedCaseDetails"));
      if(caseDetail["Case Owner Id"] == this.userId && caseDetail["Status"] == 'Completed'){
        const dialogRef = this.dialog.open(PopupTemplateComponent, {
          width: '500px',
          data: <IDynamicDialogConfig>{
            title: 'Alert',
            titleFontSize:'20',
            dialogContent: 'The selected Doc is already completed. Would you like to take a look at the Tasks in Read Only Mode?',
            dialogContentFontSize: '15',
            acceptButtonTitle: 'Okay',
            declineButtonTitle: 'Cancel',
            titlePosition: 'left',
            contentPosition : 'left',
            buttonPosition : 'right',
            showClose : false,
            showDeclineButton: true
          }
        });
        dialogRef.disableClose = true;
    
        dialogRef.componentInstance.buttonClicked.subscribe(action => {
          switch (action) {
            case 'accept':
              this.dialogRef.close();
              this.loaderService.showLoader();
              this.sessionStorage.setItem('BasePagetype', 'CaseListingInsights');
              this.router.navigate(['/base-action-page']);
              break;
            case 'decline':

              break;
          }
        });
      }
      if(caseDetail["Case Owner Id"] == this.userId && caseDetail["Status"] != 'Completed'){
        this.dialogRef.close();
        this.loaderService.showLoader();
        this.sessionStorage.setItem('BasePagetype', 'CaseListingInsights');
        this.router.navigate(['/base-action-page']);
      }
      if(caseDetail["Case Owner Id"] != this.userId){
        const dialogRef = this.dialog.open(PopupTemplateComponent, {
          width: '500px',
          data: <IDynamicDialogConfig>{
            title: 'Alert',
            titleFontSize:'20',
            dialogContent: 'The selected Doc is not assigned to you. Would you like to take a look at the Tasks in Read Only Mode?',
            dialogContentFontSize: '15',
            acceptButtonTitle: 'Okay',
            declineButtonTitle: 'Cancel',
            titlePosition: 'left',
            contentPosition : 'left',
            buttonPosition : 'right',
            showClose : false,
            showDeclineButton: true
          }
        });
        dialogRef.disableClose = true;
    
        dialogRef.componentInstance.buttonClicked.subscribe(action => {
          switch (action) {
            case 'accept':
              this.dialogRef.close();
              this.loaderService.showLoader();
              this.sessionStorage.setItem('BasePagetype', 'CaseListingInsights');
              this.router.navigate(['/base-action-page']);
              break;
            case 'decline':

              break;
          }
        });
      }
     }
     else if(value === 'Delete Doc'){
       this.loaderService.showLoader();
       let casesDetails = JSON.parse(this.sessionStorage.getItem("selectedCasesDetails"));
       if(casesDetails && casesDetails.length > 0){
         let CaseIdCsvList: string[] = casesDetails.map(obj => obj['Case_ID']);
         if(CaseIdCsvList && CaseIdCsvList.length > 0){
           let CaseIdCsv: string = CaseIdCsvList.join(',');
           const req = {
             "CaseIdCsv": CaseIdCsv
           }
           this.sharedService.DeleteCases(req).subscribe({
             next: (_val) => {},
             error: (_error) => {},
             complete:()=>{
               this.loaderService.hideLoader();
               const dialogRef = this.dialog.open(PopupSuccessComponent, {
                 // panelClass: '',
                 data: <IDynamicDialogConfig>{
                   title: 'Success',
                   titleFontSize:'20',
                   type : '',
                   titlePosition: 'left',
                   contentPosition: 'left',
                   dialogContentFontSize: '15',
                   dialogContent: 'Selected Doc(s) deleted successfully.',
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
                   // position: {
                   //     top: `${ 24 }px`
                   //   },
               });
               dialogRef.disableClose = true;
           
               dialogRef.afterClosed().subscribe(result => {
                 this.isLoading = true;
                 this.workqueueTabApiTrigger();
               });
             }
           });
         }
         else{
           this.loaderService.hideLoader();
         }
       }
       else{
         this.loaderService.hideLoader();
       }
     }
     
     
   }
 
 
   updateAssignee(obj) {
     obj.ownerlist = obj.ownerlist.filter(obj => obj.owner_id !== '');
     obj.ownerlist = this.removeDuplicates(obj.ownerlist, 'case_id');
     if(obj.ownerlist.length != 0) {
       let reqObj = obj.ownerlist;
 
       this.sharedService.multipleCaseAssign(reqObj).subscribe({
         next:  (response) => {
         },
          error:  (error) => {},
         complete:()=>{
             this.workqueueTabApiTrigger();
         }})
     }  
   }
   updateTaskAssignee(obj) {
     obj.ownerlist = obj.ownerlist.filter(obj => obj.owner_id !== '');
     obj.ownerlist = this.removeDuplicates(obj.ownerlist, 'case_id');
     if(obj.ownerlist.length != 0) {
       let reqObj = obj.ownerlist;
 
       this.sharedService.multipleTaskAssign(reqObj).subscribe({
         next:  (response) => {
         },
          error:  (error) => {},
         complete:()=>{ 
             this.workqueueTabApiTrigger();
         }})
     }  
   }
 
   updatePriority(obj) {
     obj.ownerlist = obj.ownerlist.filter(obj => obj.priority !== '');
     obj.ownerlist = this.removeDuplicates(obj.ownerlist, 'case_id');
     if(obj.ownerlist.length != 0) {
       let reqObj = obj.ownerlist;
       this.sharedService.updateBulkCasePriority(reqObj).subscribe({
         next:  (response) => {
         },
          error:  (error) => {},
         complete:()=>{ 
             this.workqueueTabApiTrigger();
         }})
     }  
   }
 
   removeDuplicates(array: any[], key: string): any[] {
     const unique = new Map();
     return array.filter(obj => !unique.has(obj[key]) && unique.set(obj[key], 1));
   }

}

