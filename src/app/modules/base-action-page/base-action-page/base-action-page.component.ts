import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonLoaderService } from 'src/app/Standalone/common-loader/common-loader.service';
import { EncryptionService } from 'src/app/shared/services/encryption.service';
import { SharedServiceService } from 'src/app/shared/services/sharedservice.service';
import { SessionStorageService } from 'src/app/shared/services/storage.service';
import { MatDialog } from '@angular/material/dialog';
import { IDynamicDialogConfig, PopupTemplateComponent } from '../../shared-module/popup-template/popup-template.component';

@Component({
  selector: 'app-base-action-page',
  templateUrl: './base-action-page.component.html',
  styleUrls: ['./base-action-page.component.scss']
})
export class BaseActionPageComponent implements OnInit {
  currentUser: any;
  userId: any;
  BasePageType: string;
  /*
      *** HostListener declaration ***
  */
  @HostListener('document:click', ['$event']) onDocumentClick(event) {
    if(this.TabList && this.TabList.length){
      this.TabList.map(tab => {
        tab.showInfo = false;
      });
    }
  }
  /*
      *** Variable declaration ***
  */
  // TabList: string[];
  PageTitle: string;
  tabIndex: number = 0;
  SelectedTabLabel: string;
  selected = new FormControl(0);
  EstablishCasePageInput: string = 'Establish Case';
  RecordSplitPageInput: string = 'Record Split';
  dataEntryPageInput: string = '';
  CaseDetails;
  caseId;
  showCaseDetails: boolean = false;
  HeaderLabel: string;
  HeaderValue: string;
  taskData;
  PageFieldTypeEstablishCase: string = 'editable';
  PageFieldTypeRecordList: string = 'editable';
  TabList: { TabName: string; showInfo: boolean; AssignedTo: string; AssignedToShortName: string; TaskID: string; TaskName: string; DueDate: string; Status: string; FieldType: string; }[];

  constructor(
    private sessionStorage: SessionStorageService,
    private encryptDecrypt: EncryptionService,
    private sharedService: SharedServiceService,
    private router: Router,
    private loaderService: CommonLoaderService,
    public dialog: MatDialog
    ) {}
  
  ngOnInit(): void {
    this.sessionStorage.setItem('lsLoaded', 'N');
    this.CaseDetails = JSON.parse(this.sessionStorage.getItem('selectedCaseDetails'));
    this.BasePageType = this.sessionStorage.getItem('BasePagetype');
    this.currentUser = this.sessionStorage.getObj('currentUser')
    this.userId = this.encryptDecrypt.decrypt('DecryptRevoKey11', this.currentUser.UserId);
    this.caseId = this.CaseDetails['Case_ID'];
    if(this.BasePageType == 'CaseDetails' || this.BasePageType == 'CaseDetailsInsights'){
      this.PageTitle = "Batch Details" //"Case Details";
      // this.getTabDetails('Initial');
    }
    else if(this.BasePageType == 'TaskListing' || this.BasePageType == 'TaskListing'){
      this.PageTitle = "Manage Listing";
      this.getTabDetails('Initial');
      // this.updateStatus();
    }
    else{
      this.PageTitle = "Manage Listing";
      this.updateStatus();
    }
    // this.getTabDetails();
    this.sharedService.manageListingHeaderData$.subscribe(data => {
      if (data !== null && data !== undefined && data !== "" && data.Label !== null && data.Label !== undefined && data.Label !== "") {
        this.HeaderLabel = data.Label;
        this.HeaderValue =  data.Value;
        this.CaseDetails['Case ID'] = data.Value;
        this.sessionStorage.setItem("selectedCaseDetails", JSON.stringify(this.CaseDetails))
      };
    });
  };
  /*
      *** Tab Click ***
  */
 getTabDetails(from: string): void{
  // this.TabList = [];
  let reqObj = {
    "caseid": this.caseId,
  }
  this.sharedService.getTaskDetails(reqObj).subscribe({
    next: (val: any) => {
      this.taskData = val;
        this.TabList = [];
        if(this.BasePageType == 'CaseDetails' || this.BasePageType == 'CaseDetailsInsights'){
          let tempObj: { TabName: string; showInfo: boolean; AssignedTo: string; AssignedToShortName: string; TaskID: string; TaskName: string; DueDate: string; Status: string; FieldType: string; } = {
            TabName: 'Case Details',
            showInfo: false,
            AssignedTo: '',
            TaskID: '',
            TaskName: '',
            AssignedToShortName: '',
            DueDate: '',
            Status: '',
            // FieldType: data["Task Owner Id"] == this.userId ? 'editable' : 'readonly',
            FieldType: 'readonly'
          }
          this.TabList.push(tempObj);
        }
        if(val !== null && val !== undefined && val !== "" && val.GridData !== undefined && val.GridData.length){
          val.GridData.forEach(data => {
              let tempObj: { TabName: string; showInfo: boolean; AssignedTo: string; AssignedToShortName: string; TaskID: string; TaskName: string; DueDate: string; Status: string; FieldType: string; } = {
                TabName: data["Task Template Name"],
                showInfo: false,
                AssignedTo: data["Task Owner"],
                TaskID: data["Task ID"],
                TaskName: data["Task Name"],
                AssignedToShortName: data["Task Owner Short Name"],
                DueDate: data["Due Date"] === null || data["Due Date"] === undefined ? '--' : data["Due Date"],
                Status: data["Task Status"],
                FieldType: data["Task Status"] === 'In Progress' ? 'editable' : 'readonly'
              }
              if(data["Task Owner Id"] !== null && data["Task Owner Id"] !== undefined){
                tempObj.FieldType = (data["Task Owner Id"] == this.userId && data["Task Status"] === 'In Progress') ? 'editable' : 'readonly'
              }
              if(data["Task Status"] == 'Not Started' && this.BasePageType == 'TaskListing' && data["Task Owner Id"] == this.userId && data["Task Template Name"] == 'Establish Case'){
                this.updateStatusV3();
              }
            this.TabList.push(tempObj);
          });
        };
      // });
    },
    error: (error) => {},
    complete: () => {
      if(from === 'Complete'){
        for (let i = 0; i < this.TabList.length; i++) {
          let data = this.TabList[i];
          if (data.TabName === this.SelectedTabLabel) {
            let index = i + 1;
            if(index <= this.TabList.length){
              let tempData = this.TabList[index];
              this.SelectedTabLabel = tempData.TabName;
              this.selected.setValue(index);
            }
            break;
          }
        }
      }
      else{
        if(this.BasePageType == 'CaseDetails' || this.BasePageType == 'CaseDetailsInsights'){
          this.SelectedTabLabel = 'Case Details';
          this.selected.setValue(0);
        }
        else{
          for (let i = 0; i < this.TabList.length; i++) {
            let data = this.TabList[i];
            if (data.TabName === this.CaseDetails['Current Task']) {
              this.SelectedTabLabel = data.TabName;
              this.selected.setValue(i);
              break;
            }
          }
        }
      }
      this.SelectedTabLabel = this.TabList[0].TabName;
      if(this.CaseDetails['Case ID'] !== null && this.CaseDetails['Case ID'] !== '' && this.CaseDetails['Case ID'] !== undefined){
        this.HeaderLabel = 'Case Id';
        this.HeaderValue =  this.CaseDetails['Case ID'];
      }
      else{
        this.HeaderLabel = 'Doc Id';
        this.HeaderValue = this.CaseDetails['Doc ID'];
      }
    }
  });
 }
  /*
      *** Tab Click ***
  */
  tabClick(event): void {
    this.sessionStorage.setItem('lsLoaded', 'N');
    this.loaderService.showLoader();
    this.SelectedTabLabel = this.TabList[event.index].TabName;
    
    if(this.SelectedTabLabel == 'Case Details'){
      this.PageTitle = "Batch Details" //"Case Details";
    }
    else{
      this.PageTitle = "Manage Listing";
    }

    // this.selected.setValue(event.index);
    this.TabList.map(tab => {
      tab.showInfo = false;
    });
    this.tabIndex =  event.index;
    if(this.BasePageType == 'CaseDetails' || this.BasePageType == 'CaseDetailsInsights'){
      if(this.SelectedTabLabel == 'Establish Case'){
        this.updateStatusV2();
      }
    }
    window.scrollTo(0, 0);
  }
  /*
      *** Back ***
  */
  Back(): void{
    // const dialogRef = this.dialog.open(PopupTemplateComponent, {
    //   width: '500px',
    //   data: <IDynamicDialogConfig>{
    //     title: 'Alert',
    //     titleFontSize:'20',
    //     dialogContent: 'You are about to leave this page. Any unsaved changes will be lost.',
    //     dialogContentFontSize: '15',
    //     acceptButtonTitle: 'Okay',
    //     declineButtonTitle: 'Cancel',
    //     titlePosition: 'left',
    //     contentPosition : 'left',
    //     buttonPosition : 'right',
    //     showClose : false,
    //     showDeclineButton: true
    //   }
    // });
    // dialogRef.disableClose = true;

    // dialogRef.componentInstance.buttonClicked.subscribe(action => {
    //   switch (action) {
    //     case 'accept':
    //       this.sharedService.setManageListingHeaderData(null);
    //       this.loaderService.showLoader();
    //       this.sessionStorage.setItem('WrokQueue_From','basepage');
    //       if(this.BasePageType == 'CaseDetailsInsights' || this.BasePageType == 'CaseListingInsights'){
    //         this.router.navigate(['/insights']);
    //       }
    //       else{
    //         this.router.navigate(['/dashboard']);
    //       }
    //       break;
    //     case 'decline':

    //       break;
    //   }
    // });
    this.router.navigate(['/dashboard']);
  }
  
  /*
      *** Dynamic Entry Page Close & Complete EventEmitter ***
  */
  DynamicEntryPageCloseCompleteEventEmitter(event: string): void {
    if(event === 'Close'){
      this.loaderService.showLoader();
      this.sharedService.setManageListingHeaderData(null);
      this.sessionStorage.setItem('WrokQueue_From','basepage');
      if(this.BasePageType == 'CaseDetailsInsights' || this.BasePageType == 'CaseListingInsights'){
        this.router.navigate(['/insights']);
      }
      else{
        this.router.navigate(['/dashboard']);
      }
    }
    else if (event === 'Unavailable') {
      for (let i = 0; i < this.TabList.length; i++) {
        let data = this.TabList[i];
        if (data.Status === 'In Progress') {
          this.SelectedTabLabel = data.TabName;
          this.selected.setValue(i);
          break;
        }
      }
    }
    else{
      if(this.taskData !== null && this.taskData !== undefined && this.taskData !== "" && this.taskData.GridData !== undefined && this.taskData.GridData.length){
        this.loaderService.showLoader();
        this.taskData.GridData.forEach(data => {
          if (data["Task Template Name"] == this.SelectedTabLabel) {
            this.loaderService.showLoader();
            if(data["Task Status"] == 'In Progress'){
              this.loaderService.showLoader();
              let reqObj = {
                "Caseid": this.caseId,
                "CaseStatus": "In Progress",
                "CaseBusinessStatus": ""
              }
              if(this.SelectedTabLabel === 'Establish Case'){
                reqObj.CaseBusinessStatus = "Establish Case Completed";
              }
              if(this.SelectedTabLabel === 'Record Split'){
                reqObj.CaseBusinessStatus = "Record Split Completed";
              }
              if(this.SelectedTabLabel === 'Record Listing'){
                reqObj.CaseBusinessStatus = "Review Listing Completed";
              }
              if(this.SelectedTabLabel === 'Summary Output'){
                reqObj.CaseStatus = "Completed";
                reqObj.CaseBusinessStatus = "Completed";
              }
              this.sharedService.UpdateCaseBulkStatus(reqObj).subscribe({
                next: (val: any) => {
                },
                error: (error: any) => {
                },
                complete: () => {
                  if(this.SelectedTabLabel === 'Establish Case'){
                    this.CaseDetails = JSON.parse(this.sessionStorage.getItem('selectedCaseDetails'));
                    this.CaseDetails['Current Task'] = 'Record Split';
                    this.sessionStorage.setItem('selectedCaseDetails', JSON.stringify(this.CaseDetails))
                  }
                  if(this.SelectedTabLabel === 'Record Split'){
                    this.CaseDetails = JSON.parse(this.sessionStorage.getItem('selectedCaseDetails'));
                    this.CaseDetails['Current Task'] = 'Record Listing';
                    this.sessionStorage.setItem('selectedCaseDetails', JSON.stringify(this.CaseDetails))
                  }
                  if(this.SelectedTabLabel === 'Record Listing'){
                    this.CaseDetails = JSON.parse(this.sessionStorage.getItem('selectedCaseDetails'));
                    this.CaseDetails['Current Task'] = 'Summary Output';
                    this.sessionStorage.setItem('selectedCaseDetails', JSON.stringify(this.CaseDetails))
                  }
                  if(this.SelectedTabLabel === 'Summary Output'){
                    this.CaseDetails = JSON.parse(this.sessionStorage.getItem('selectedCaseDetails'));
                    this.CaseDetails['Current Task'] = 'Summary Output';
                    this.sessionStorage.setItem('selectedCaseDetails', JSON.stringify(this.CaseDetails))
                  }
                  
                  if(this.SelectedTabLabel === 'Summary Output'){
                    // this.getTabDetails('Published');
                    this.sharedService.setManageListingHeaderData(null);
                    this.sessionStorage.setItem('WrokQueue_From','basepage');
                    if(this.BasePageType == 'CaseDetailsInsights' || this.BasePageType == 'CaseListingInsights'){
                      this.router.navigate(['/insights']);
                    }
                    else{
                      this.router.navigate(['/dashboard']);
                    }
                  }
                  // else{
                    this.getTabDetails('Complete');
                  // }
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
        });
      }
      else{
        this.loaderService.hideLoader();
      }
    }
  }
  /*
      *** Update Status If Status Not Started***
  */
  updateStatus(){
    if(this.CaseDetails["Status"] == 'Not Started' && this.CaseDetails["Case Owner Id"] == this.userId){
      let reqObj = {
        "Caseid": this.caseId,
        "CaseStatus": "In Progress",
        "CaseBusinessStatus": "Establish Case In Progress"
      }
      this.sharedService.UpdateCaseBulkStatus(reqObj).subscribe({
        next: (val: any) => {
        },
        error: (error: any) => {
        },
        complete: () => {
          this.CaseDetails['Status'] = "In Progress";
          this.sessionStorage.setItem("selectedCaseDetails", JSON.stringify(this.CaseDetails))
            this.getTabDetails('Initial');
        }
      });
    }
    else{
      this.getTabDetails('Initial');
    }
  }
  updateStatusV3(){
    if(this.CaseDetails["Status"] == 'Not Started'){
      let reqObj = {
        "Caseid": this.caseId,
        "CaseStatus": "In Progress",
        "CaseBusinessStatus": "Establish Case In Progress"
      }
      this.sharedService.UpdateCaseBulkStatus(reqObj).subscribe({
        next: (val: any) => {
        },
        error: (error: any) => {
        },
        complete: () => {
          this.CaseDetails['Status'] = "In Progress";
          this.sessionStorage.setItem("selectedCaseDetails", JSON.stringify(this.CaseDetails))
          this.getTabDetails('Initial');
        }
      });
    }
  }
  updateStatusV2(){
    if(this.CaseDetails["Status"] == 'Not Started' && this.CaseDetails["Case Owner Id"] == this.userId){
      let reqObj = {
        "Caseid": this.caseId,
        "CaseStatus": "In Progress",
        "CaseBusinessStatus": "Establish Case In Progress"
      }
      this.sharedService.UpdateCaseBulkStatus(reqObj).subscribe({
        next: (val: any) => {
        },
        error: (error: any) => {
        },
        complete: () => {
          this.CaseDetails['Status'] = "In Progress";
          this.sessionStorage.setItem("selectedCaseDetails", JSON.stringify(this.CaseDetails))
        }
      });
    }
  }
  /*
      *** tab Info Click Event Handler ***
  */
  tabInfoClickEventHandler(i: number): void{
    this.TabList.map((tab, index) => {
      if(i === index){
        tab.showInfo = !tab.showInfo;
      }
      else{
        tab.showInfo = false;
      }
    });
  }
}
