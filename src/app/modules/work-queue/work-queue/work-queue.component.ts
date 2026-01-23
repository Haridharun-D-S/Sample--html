import { Component,  OnInit, HostListener, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { EncryptionService } from 'src/app/shared/services/encryption.service';
import { SharedServiceService } from 'src/app/shared/services/sharedservice.service';
import { SessionStorageService } from 'src/app/shared/services/storage.service';
import {  FormControl} from '@angular/forms';
import { environment } from 'src/environments/environments';
import { EcareGridSettings } from 'src/app/shared/modal/ecareGridSetting';
import {MatDialog} from '@angular/material/dialog';
import { IDynamicDialogConfig, PopupCustomComponent } from '../../shared-module/popup-custom/popup-custom.component'
import { ChartServiceService } from "src/app/shared/services/chart_service";
import { Router } from '@angular/router';
import { CommonLoaderService } from 'src/app/Standalone/common-loader/common-loader.service';
import { PopupSuccessComponent } from '../../shared-module/popup-success/popup-success.component';
import { ClientSideGridComponent } from 'src/app/Standalone/client-side-grid/client-side-grid.component';
import { PopupTemplateComponent } from '../../shared-module/popup-template/popup-template.component';
import { HttpClient } from '@angular/common/http';
declare let $: any;

@Component({
  selector: 'app-work-queue',
  templateUrl: './work-queue.component.html',
  styleUrls: ['./work-queue.component.scss']
})
export class WorkQueueComponent implements OnInit {
 workQueueHeaderName;
 workQueueGridData = {GridData : [], columnProperties : [] };
 workQueueGridColumnList = [];
  tabs = [];
  selected = new FormControl(0);
  currentUser;
  token :string;
  roleName: string;
  orgName: string;
  userId: string;
  roleid: string;
  orgId: string;
  userName: string;
 // workQueueGridList = [];
  errorMessage: string;
  WorkQueueGroupIdToLoad : string;
  isLoading : boolean = true;
  gridWidget : EcareGridSettings;
  caseSelected: boolean = false;
  selectedChartStatus;
  savedScrollX: number = 0;
  savedScrollY: number = 0;
  userData;
  WorkQueueCategoryFilteredItems;
  sharedmodel;
  caseSingleSelected: boolean = false;
  CaseWorkQueue: string = '';
  ownerData: any;
  @ViewChild('alertErrorBtn') alertErrorBtn!: ElementRef;

   //Filters
   toggle;
   @Input() filters: any;
   @Output() FiltersClear = new EventEmitter<void>();
   @ViewChild(ClientSideGridComponent) ClientSideGridComponent: ClientSideGridComponent;
   @Output() gridFilter = new EventEmitter<any>();
   @Output() reloadDashBoard = new EventEmitter<boolean>();
  isTabDisabled: boolean = true;
  TaskWorkQueue: boolean = false;
  CaseTaskWorkQueue: boolean = false;
  WorkQueueType: string;
  disableBtnStatus: any[];
  WorkQueue_Name: any;
  chartInput;
  previousIndex: any;
  selectedFileDetails: any;
  filterTabEnabled: boolean;
  uploadedFileName: any;
  selectedBatchDetails: any;
  selectedChartName: any;
  selectedFilteredData: any;
  selectedObjectId: any;
  selectedBatchId: any;
  selectedColumnName: any;
  selectedBatchNumber: any;
  reprocessFailure: any;
  selectedIndex: number;
  selectedFileDetail: any;
  disableOkBtn: boolean;
  auditStarted: boolean;
  abortBatchStared: boolean;
  archiveBatchStared: boolean;
  constructor(
    private sessionStorage: SessionStorageService,
    private sharedService: SharedServiceService,
    private encryptDecrypt: EncryptionService,
    public dialog: MatDialog,
    private ChartSharedService : ChartServiceService,
    public router: Router,
    private http: HttpClient,
    private loaderService: CommonLoaderService
    ) {this.ChartSharedService.chartareaclicked.next(undefined);
    }

    @HostListener('window:scroll', ['$event'])
    onScrollEvent($event) {
      // Update scroll position
      this.getScrollPosition(window.pageXOffset, window.pageYOffset);
    }
    
    getScrollPosition(x, y) {
      // Store scroll position
      if(y != 0) {
        this.savedScrollX = x;
        this.savedScrollY = y;
      }     
    }

    scrollIntoViewWorkqueueContent() {
      const field = document.getElementById('workqueueListContent');
      if (field) {
        field.scrollIntoView({ behavior: 'smooth',block: 'start'});
        setTimeout(() => {
          window.scrollBy(0, -60);
        }, 700);
      }
    }

    ngOnChanges() {
      // Use this.filters to make API calls
      if (this.filters) {
        // console.log(this.filters);
        this.isTabDisabled = false;
        this.loadMyFilteredCaseTab();
      }
    }

    
  ngOnInit(): void {
    this.sessionStorage.setItem('workqueueLoaded', 'N');
    this.sessionStorage.setItem("isSelectAllSelected", false);
    this.workQueueHeaderName = "Workqueue Case"
    this.currentUser = this.sessionStorage.getObj('currentUser');
      this.token = this.currentUser.Token;
      this.roleName = this.currentUser.RoleName;
      this.orgName = this.currentUser.OrganizationName;
      this.userId = this.encryptDecrypt.decrypt('DecryptRevoKey11', this.currentUser.UserId)
      this.roleid = this.encryptDecrypt.decrypt('DecryptRevoKey11', this.currentUser.RoleId)
      this.orgId = this.encryptDecrypt.decrypt('DecryptRevoKey11', this.currentUser.OrgId)
  
       this.userName = this.currentUser.Name
       this.chartInput = {
        measureId : '',
        factId : '',
        timeId : '',
        dimension : []
      }
       this.ChartSharedService.chartareaclicked.subscribe(val => {
         console.log(val);
         if(this.router.url === '/dashboard' || this.router.url === '/filelistdashboard'){
          if (val?.name?.point?.state !== undefined && val?.name?.point?.state != "deselect") {
            this.isTabDisabled = false;
            this.selectedObjectId = val.data.ObjectId;
            this.selectedChartName = val.data.title;
            if(this.selectedChartName == 'Batch Processing Status') {
              this.sessionStorage.setItem('WorkQueueType', 'By Batch');
              this.sharedService.workqueueTypeChange.next('By Batch');
            } else {
              this.sessionStorage.setItem('WorkQueueType', 'By Files');
              this.sharedService.workqueueTypeChange.next('By Files');
            }
            this.selectedFilteredData = val.data.type == 'Stacked Column' ? val.pointdata.breadCrumbText[val.pointdata.breadCrumbText.length - 1] :  val.pointdata.pointDataName[0];
              // this.selectedChartStatus = val.name;
              this.chartInput = {
                measureId : val.data.ObjectId,
                factId : val.pointdata.factId ? val.pointdata.factId : val.data.data.FactId,
                timeId : val.data.TimeId,
                dimension : val.pointdata.dimensionStackedValues,
                selectedFilteredData: this.selectedFilteredData,
                selectedChartName: this.selectedChartName
              }
              console.log(this.chartInput);
              this.sessionStorage.setObj('selectedFilteredChartData', this.chartInput);
              this.loadMyFilteredCaseTab();     
          } else if(val?.name?.point?.state == "deselect" || val?.name?.point?.state == "") {
            this.isTabDisabled = true;
          }
         }
      });
      if(this.router.url === '/task-list-page'){
        this.CaseTaskWorkQueue = true;
        this.toggle = true;
        let currentPageDetails = this.sessionStorage.getObj('Selected_WrokQueue_Page');
          if(currentPageDetails){
            this.WorkQueueType = currentPageDetails.Category;
            this.WorkQueue_Name = currentPageDetails.TabName;
            this.TaskWorkQueue = currentPageDetails.Type == 'Task' ? true : false;
            this.CaseWorkQueue = currentPageDetails.Context;
          }
      } else if(this.router.url === '/case-list-page') {
        this.CaseTaskWorkQueue = true;
        this.toggle = false;
        let currentPageDetails = this.sessionStorage.getObj('Selected_WrokQueue_Page');
          if(currentPageDetails){
            this.WorkQueueType = currentPageDetails.Category;
            this.WorkQueue_Name = currentPageDetails.TabName;
            this.TaskWorkQueue = currentPageDetails.Type == 'Task' ? true : false;
            this.CaseWorkQueue = currentPageDetails.Context;
          }
      } else if(this.router.url === '/filelistdashboard') {
        this.WorkQueueType = 'By Files';
        let selectedFilterDetails = this.sessionStorage.getObj('Selected_Filters_Column');
        if(selectedFilterDetails) {
          this.selectedBatchNumber = selectedFilterDetails.batchNumber;
          this.selectedColumnName = selectedFilterDetails.columnName;
          this.chartInput = {
            measureId : '',
            factId : '',
            timeId : '',
            dimension : []
          }
          this.isTabDisabled = false;
          this.filterTabEnabled = true;
          // setTimeout(() => {
            this.loadMyFilteredCaseTab();    
          // }, 1000);
        } else {
          this.isTabDisabled = true;
          this.filterTabEnabled = false;
        }
      } else if(this.router.url === '/dashboard') {
        this.WorkQueueType = 'By Batch';
      } else{
        this.CaseTaskWorkQueue = false;
        let WrokQueue_From = this.sessionStorage.getItem('WrokQueue_From');
      if(WrokQueue_From == 'login'){
        this.WorkQueueType = 'By Batch';
        this.previousIndex = 0;
      }
      }
      // console.log(this.toggle);
      this.sessionStorage.setItem('WrokQueue_Page_Loading', 'Y');
      this.sessionStorage.setItem('WorkQueueType', this.WorkQueueType);
      
      // let WrokQueue_From = this.sessionStorage.getItem('WrokQueue_From');
      // if(WrokQueue_From == 'login'){
      //   this.WorkQueueType = 'By Doc Status';
      //   this.previousIndex = 0;
      // }
      this.previousIndex = 0;
      // this.workqueueTabApiTrigger();
      // this.sharedService.appMenuChange.subscribe(val => {
      //   if(val) {
      //     if(val == 'Batch List') {
      //       this.WorkQueueType = 'By Batch';
      //       this.workqueueTabApiTrigger();
      //     } else if(val == 'File List'){
      //       this.WorkQueueType = 'By Files';
      //       this.workqueueTabApiTrigger();
      //     }
      //   } 
      // })
      this.workqueueTabApiTrigger();
  }
  onTabChange(event, index) {
    this.sessionStorage.setItem("isSelectAllSelected", false);
    this.isLoading = true;
    // console.log(index)
    // console.log(this.tabs.length);
    if(this.tabs.length - 1 === index) {
      this.isTabDisabled = false;
    } else {
      this.filterTabEnabled = false;
      this.sessionStorage.removeItem('Selected_Filters_Column');
      this.filters = {}
      this.isTabDisabled = true;
      this.FiltersClear.emit(this.filters);
       this.tabs.forEach((x,i)=> {
        if(i == index){
            this.WorkQueueGroupIdToLoad  = x.WorkQueue_Id
            this.WorkQueue_Name = x.WorkQueue_Name;
        }
      }); 
      this.tabs.forEach((x,i)=> {
        if(x.WorkQueue_Name == 'Filtered Files' || x.WorkQueue_Name == 'Filtered Tasks'){
            x['Workqueue Data Count'] = '--'
        }
      }); 
      if(this.previousIndex != index){
        let currentPageDetails = {
          savedScrollX: this.savedScrollX,
          savedScrollY: this.savedScrollY
        }
        this.sessionStorage.setObj('Selected_WrokQueue_Dimensions', currentPageDetails);
        // this.reloadDashBoard.emit(true);
      }
      this.previousIndex = index
      this.workqueueTabApiTriggerForTabChange();

    }
  }

   /**
     * 
     * @param event
     * Toggle task
     */

   toggleTaskList(event: any) {
      // if(this.router.url !='/dashboard' ) {
          if(event.target.checked) {
            this.toggle = true;
            this.router.navigate(['/task-list-page']);
            this.workqueueTabApiTrigger2();
          } else {
            this.toggle = false;
            this.router.navigate(['/case-list-page']);
            this.workqueueTabApiTrigger2();
          }
        
      // }
  }

  FilterData(data) {
    // console.log(data);
    console.log(this.filters);
    if(!this.filters.hasOwnProperty('globalSearchFilter')) {
      this.gridFilter.emit(data)
    }
    
  }

  filterModelData(data) {
    if(data) {
      this.filters = data;
    }
  }

  workQueuesTabLoad(tabData){
    let selectedWorkQueueName = this.sessionStorage.getItem('SelectedWorkQueueName');
    this.selectedIndex = 0;
    if(tabData.WorkQueue_Category == 'By Batch') {   
        this.selected.setValue(1);
    } else {
      if(selectedWorkQueueName) {
        if(selectedWorkQueueName == 'Filtered Files') {
          let selectedWorkQueueName = this.sessionStorage.getObj('selectedFilteredChartData');
          this.selectedFilteredData = selectedWorkQueueName.selectedFilteredData;
          this.selectedChartName = selectedWorkQueueName.selectedChartName;
          this.chartInput = selectedWorkQueueName;
          this.tabs = tabData.QueList;
          this.filters = [];
          this.isTabDisabled = false;
          this.loadMyFilteredCaseTab(); 
        } else {
          this.WorkQueueCategoryFilteredItems.forEach(item => {
            item.QueList.forEach((element, i) => {
                    if(element.WorkQueue_Name === selectedWorkQueueName){                   
                      this.selectedIndex = i;
                    }
             });
           });
           this.selected.setValue(this.selectedIndex);
        }
    
      } else {
        this.selected.setValue(2);
      }  
    }
  }
  refreshWorkqueue(){
    this.gridApiTrigger();
  }
  refresh() {
    this.filters = {}
    this.sessionStorage.setItem('WrokQueue_From','BtnAction');
    this.isTabDisabled = true;
    let currentPageDetails = {
      savedScrollX: this.savedScrollX,
      savedScrollY: this.savedScrollY
    }
    this.sessionStorage.setObj('Selected_WrokQueue_Dimensions', currentPageDetails);
    this.reloadDashBoard.emit(true);
      this.workqueueTabApiTrigger();
  }

  workqueueTabApiTrigger(){
    this.loaderService.showLoader();
    this.isLoading = true;
    let reqObj = {
    //   "userId": this.userId,
    //   "roleId": this.roleid,
      "token": this.token,
      "WorkQueueGroupId": 1,
      "workQueueContext": this.CaseWorkQueue,
      "globalSearchFilter": this.filters?.globalSearchFilter,
      "filters": this.filters?.filters,
      "measureFilters": null,
      "linkFilterJson": null
    //   "orgId": this.orgId
    }
    if(!this.isTabDisabled && !this.CaseTaskWorkQueue){
      reqObj.measureFilters = {
        "measureId": this.chartInput.measureId,
        "timeId": this.chartInput.timeId,
        "factId": this.chartInput.factId,
        "xDimensionValue": this.chartInput.dimension ? this.chartInput.dimension.StackedDimensionValues1 : '',
        "yDimensionValue": this.chartInput.dimension ? this.chartInput.dimension.StackedDimensionValues2 : ''
      }
      if(reqObj.measureFilters.measureId == '') {
        reqObj.measureFilters = null
      }
    }
    if(this.filterTabEnabled) {
      let selectedFilterDetails = this.sessionStorage.getObj('Selected_Filters_Column');
      if(reqObj.measureFilters == null) {
        reqObj.linkFilterJson = {
          "columnName": selectedFilterDetails?.columnName,
          "batchId": selectedFilterDetails.batchId
        }
      }
    }
    this.sharedService.getUserQueue(reqObj).subscribe({
    next:  (response) => {
      this.userData = response;
      //console.log(response,'wokrque tablist')
        // this.loaderService.hideLoader();
        // this.sessionStorage.setItem('workqueueLoaded', 'Y');
        // let loaderStatus = this.sessionStorage.getItem('dashboardLoaded');
        // if(loaderStatus == 'Y'){
        //   this.loaderService.hideLoader();
        // }
        let WrokQueue_From = this.sessionStorage.getItem('WrokQueue_From');
        if(WrokQueue_From == 'login'){
          // this.WorkQueueType = 'By Doc Status';
          // this.WorkQueue_Name = this.WorkQueueType == 'By Files' ? 'All Files' : 'All Batches'
        }
        else{
          // this.WorkQueueType = 'By Files';
          // this.WorkQueue_Name = this.WorkQueueType == 'By Files' ? 'All Files' : 'All Batches'
          // let currentPageDetails = this.sessionStorage.getObj('Selected_WrokQueue_Page');
          // if(currentPageDetails){
          //   this.WorkQueueType = currentPageDetails.Category;
          //   this.WorkQueue_Name = currentPageDetails.TabName;
          //   this.TaskWorkQueue = currentPageDetails.Type == 'Task' ? true : false;
          //   this.CaseWorkQueue = currentPageDetails.Context;
          // }
        }
      this.WorkQueueCategoryFilteredItems = response.filter(item => item.WorkQueue_Category === this.WorkQueueType);
      if (this.WorkQueueCategoryFilteredItems.length > 0) {
        this.WorkQueueCategoryFilteredItems.forEach(item => {
          item.QueList.forEach((element, i) => {
            if(element.WorkQueue_Name === this.WorkQueue_Name){
              item.WorkQueueDefaultId = element.WorkQueue_Id;
              item.WorkQueueDefaultIndex = i;
            }
          });
          if(this.toggle === undefined){
            if (item.WorkQueue_Level === 'Case' && !this.TaskWorkQueue && !this.filterTabEnabled) {
                if(!this.isTabDisabled) {
                  if(this.WorkQueueType == 'By Batch') {
                    item.WorkQueueDefaultIndex = 5;
                    this.WorkQueueGroupIdToLoad = "5";
                  } else if(this.WorkQueueType == 'By Files') {
                    item.WorkQueueDefaultIndex = 13;
                    this.WorkQueueGroupIdToLoad = "13";
                  }
                } else {
                  this.workQueuesTabLoad(item);
                  this.WorkQueueGroupIdToLoad = item.WorkQueueDefaultId;
                  this.WorkQueue_Name = item.WorkQueue_Name;
                }
              
              this.tabs = item.QueList;
              if(!this.isTabDisabled && this.WorkQueueType == 'By Files' ) {
                this.selected.setValue(this.tabs.length - 1);
              }
              // this.tabs.push(obj);
            } else if (item.WorkQueue_Level === 'Case' && !this.TaskWorkQueue && this.filterTabEnabled) { 
              if(!this.isTabDisabled) {
                item.WorkQueueDefaultIndex = 13;
              }
              this.tabs = item.QueList;
              this.selected.setValue(this.tabs.length - 1);
              this.WorkQueueGroupIdToLoad = item.QueList[item.QueList.length - 1].WorkQueue_Id;
              this.WorkQueue_Name = item.QueList[item.QueList.length - 1].WorkQueue_Name;
              this.previousIndex = this.tabs.length - 1;
            }
            else if(item.WorkQueue_Level === 'Task' && this.TaskWorkQueue){
              if(!this.isTabDisabled) {
                item.WorkQueueDefaultIndex = 5;
              } else {
                this.workQueuesTabLoad(item);
                this.WorkQueueGroupIdToLoad = item.WorkQueueDefaultId;
                this.WorkQueue_Name = item.WorkQueue_Name;
              }
              
              this.tabs = item.QueList;
            }
          }else if(this.toggle === false) {
            if (item.WorkQueue_Level === 'Case') {
              if(this.filters) {
                item.WorkQueueDefaultIndex = 5;
              } else {
                this.workQueuesTabLoad(item);
                this.WorkQueueGroupIdToLoad = item.WorkQueueDefaultId;
                this.WorkQueue_Name = item.WorkQueue_Name;
              }
              this.tabs = item.QueList;
           }
          } else if(this.toggle === true) {
            if(item.WorkQueue_Level === 'Task'){
              if(this.filters) {
                item.WorkQueueDefaultIndex = 5;
              } else {
                this.workQueuesTabLoad(item);
                this.WorkQueueGroupIdToLoad = item.WorkQueueDefaultId;
                this.WorkQueue_Name = item.WorkQueue_Name;
              }
              this.tabs = item.QueList;
             
             }
          }
         
        })
      }
      // else{
      //   this.loaderService.hideLoader();
      // }
    },
    error:  (error) => {
      },
      complete:()=>{
        //complete      
        this.gridApiTrigger();
      }})
}
workqueueTabApiTrigger2(){
  this.loaderService.showLoader();
  this.isLoading = true;
  let reqObj = {
  //   "userId": this.userId,
  //   "roleId": this.roleid,
    "token": this.token,
    "WorkQueueGroupId": 1,
    "workQueueContext": this.CaseWorkQueue,
    "globalSearchFilter": this.filters?.globalSearchFilter,
    "filters": this.filters?.filters,
  //   "orgId": this.orgId,
      "measureFilters": null,
      "linkFilterJson": null
      //   "orgId": this.orgId
  }
  if(!this.isTabDisabled && !this.CaseTaskWorkQueue){
    reqObj.measureFilters = {
      "measureId": this.chartInput.measureId,
      "timeId": this.chartInput.timeId,
      "factId": this.chartInput.factId,
      "xDimensionValue": this.chartInput.dimension ? this.chartInput.dimension.StackedDimensionValues1 : '',
      "yDimensionValue": this.chartInput.dimension ? this.chartInput.dimension.StackedDimensionValues2 : ''
    }
    if(reqObj.measureFilters.measureId == '') {
      reqObj.measureFilters = null
    }
  }
  if(this.filterTabEnabled) {
    let selectedFilterDetails = this.sessionStorage.getObj('Selected_Filters_Column');
    if(reqObj.measureFilters == null) {
    reqObj.linkFilterJson = {
      "columnName": selectedFilterDetails.columnName,
      "batchId": selectedFilterDetails.batchId
    }
  }
  }
  this.sharedService.getUserQueue(reqObj).subscribe({
  next:  (response) => {
    this.userData = response;
    //console.log(response,'wokrque tablist')
        // this.loaderService.hideLoader();
    // this.sessionStorage.setItem('workqueueLoaded', 'Y');
    // let loaderStatus = this.sessionStorage.getItem('dashboardLoaded');
    // if(loaderStatus == 'Y'){
    //   this.loaderService.hideLoader();
    // }
    this.WorkQueueCategoryFilteredItems = response.filter(item => item.WorkQueue_Category === this.WorkQueueType);
    if (this.WorkQueueCategoryFilteredItems.length > 0) {
      this.WorkQueueCategoryFilteredItems.forEach(item => {
        item.QueList.forEach((element, i) => {
          if(element.WorkQueue_Name === this.WorkQueue_Name){
            item.WorkQueueDefaultId = element.WorkQueue_Id;
            item.WorkQueueDefaultIndex = i;
          }
        });
        if(this.toggle === undefined){
          if (item.WorkQueue_Level === 'Case' && !this.TaskWorkQueue) {
              if(this.filters) {
                item.WorkQueueDefaultIndex = 5;
              } else {
                this.workQueuesTabLoad(item);
                this.WorkQueueGroupIdToLoad = item.WorkQueueDefaultId;
                this.WorkQueue_Name = item.WorkQueue_Name;
              }
            
            this.tabs = item.QueList;
            // this.tabs.push(obj);
          }
          else if(item.WorkQueue_Level === 'Task' && this.TaskWorkQueue){
            if(this.filters) {
              item.WorkQueueDefaultIndex = 5;
            } else {
              this.workQueuesTabLoad(item);
              this.WorkQueueGroupIdToLoad = item.WorkQueueDefaultId;
              this.WorkQueue_Name = item.WorkQueue_Name;
            }
            
            this.tabs = item.QueList;
          }
        }else if(this.toggle === false) {
          // console.log(item.WorkQueueDefaultIndex,this.WorkQueueGroupIdToLoad,this.WorkQueue_Name)
          if (item.WorkQueue_Level === 'Case') {
            if(this.filters) {
              item.WorkQueueDefaultIndex = 5;
            } else {
              this.workQueuesTabLoad(item);
              this.WorkQueueGroupIdToLoad = item.WorkQueueDefaultId;
              this.WorkQueue_Name = item.WorkQueue_Name;
            }
            this.tabs = item.QueList;
         }
        } else if(this.toggle === true) {
          // console.log(item.WorkQueueDefaultIndex,this.WorkQueueGroupIdToLoad,this.WorkQueue_Name)
          if(item.WorkQueue_Level === 'Task'){
            if(this.filters) {
              item.WorkQueueDefaultIndex = 5;
            } else {
              this.workQueuesTabLoad(item);
              this.WorkQueueGroupIdToLoad = item.WorkQueueDefaultId;
              this.WorkQueue_Name = item.WorkQueue_Name;
            }
            this.tabs = item.QueList;
           
           }
        }
      })
    }
    // else{
    //   this.loaderService.hideLoader();
    // }
  },
  error:  (error) => {
    },
    complete:()=>{
      //complete      
      this.gridApiTrigger();
    }})
}
workqueueTabApiTriggerForTabChange(){
  this.loaderService.showLoader();
  this.isLoading = true;
  let reqObj = {
  //   "userId": this.userId,
  //   "roleId": this.roleid,
    "token": this.token,
    "WorkQueueGroupId": 1,
    "workQueueContext": this.CaseWorkQueue,
    "globalSearchFilter": this.filters?.globalSearchFilter,
    "filters": this.filters?.filters,
  //   "orgId": this.orgId,
      "measureFilters": null,
      "linkFilterJson": null
      //   "orgId": this.orgId
  }
  if(!this.isTabDisabled && !this.CaseTaskWorkQueue){
    reqObj.measureFilters = {
      "measureId": this.chartInput.measureId,
      "timeId": this.chartInput.timeId,
      "factId": this.chartInput.factId,
      "xDimensionValue": this.chartInput.dimension ? this.chartInput.dimension.StackedDimensionValues1 : '',
      "yDimensionValue": this.chartInput.dimension ? this.chartInput.dimension.StackedDimensionValues2 : ''
    }
    if(reqObj.measureFilters.measureId == '') {
      reqObj.measureFilters = null
    }
  }
  if(this.filterTabEnabled) {
    let selectedFilterDetails = this.sessionStorage.getObj('Selected_Filters_Column');
    if(reqObj.measureFilters == null) {
    reqObj.linkFilterJson = {
      "columnName": selectedFilterDetails.columnName,
      "batchId": selectedFilterDetails.batchId
    }
  }
  }
  this.sharedService.getUserQueue(reqObj).subscribe({
  next:  (response) => {
    this.userData = response;
    this.WorkQueueCategoryFilteredItems = response.filter(item => item.WorkQueue_Category === this.WorkQueueType);
    if (this.WorkQueueCategoryFilteredItems.length > 0) {
      this.WorkQueueCategoryFilteredItems.forEach(item => {
        if(item.QueList && item.QueList.length == 0){
          this.sessionStorage.setItem('workqueueLoaded', 'Y');
          let loaderStatus = this.sessionStorage.getItem('dashboardLoaded');
          if(loaderStatus == 'Y'){
            this.loaderService.hideLoader();
          }
        }
        item.QueList.forEach((element, i) => {
          if(element.WorkQueue_Name === this.WorkQueue_Name){
            item.WorkQueueDefaultId = element.WorkQueue_Id;
            item.WorkQueueDefaultIndex = i;
          }
        });
        if (item.WorkQueue_Level === 'Case' && !this.TaskWorkQueue) {
          // this.workQueuesTabLoad(item.WorkQueueDefaultIndex);
          // this.WorkQueueGroupIdToLoad = item.WorkQueueDefaultId;
          // this.WorkQueue_Name = item.WorkQueue_Name;
          if(item.QueList && item.QueList.length > 0){
            item.QueList.map(list => {
              if(this.tabs && this.tabs.length > 0){
                this.tabs.map(tab => {
                  if(list.WorkQueue_Id === tab.WorkQueue_Id){
                    tab['Workqueue Data Count'] = list['Workqueue Data Count']
                  }
                })
              }
            })
          }
        }
        else if(item.WorkQueue_Level === 'Task' && this.TaskWorkQueue){
          // this.workQueuesTabLoad(item.WorkQueueDefaultIndex);
          // this.WorkQueueGroupIdToLoad = item.WorkQueueDefaultId;
          // this.WorkQueue_Name = item.WorkQueue_Name;
          if(item.QueList && item.QueList.length > 0){
            item.QueList.map(list => {
              if(this.tabs && this.tabs.length > 0){
                this.tabs.map(tab => {
                  if(list.WorkQueue_Id === tab.WorkQueue_Id){
                    tab['Workqueue Data Count'] = list['Workqueue Data Count']
                  }
                })
              }
            })
          
          }
        }
      })
    }
    else{   
      this.sessionStorage.setItem('workqueueLoaded', 'Y');
      let loaderStatus = this.sessionStorage.getItem('dashboardLoaded');
      if(loaderStatus == 'Y'){
        this.loaderService.hideLoader();
      }
    }
  },
  error:  (error) => {},
    complete:()=>{
      //complete      
      this.sessionStorage.setItem('workqueueLoaded', 'Y');
      let loaderStatus = this.sessionStorage.getItem('dashboardLoaded');
      if(loaderStatus == 'Y'){
        this.loaderService.hideLoader();
      }
      this.gridApiTrigger();
    }})
}

loadMyFilteredCaseTab() {
  if (this.tabs.length > 0) {
    // let obj = { "WorkQueue_Id": 3, "WorkQueue_Level": "Case", "WorkQueue_Name": "My Filtered Cases" }
    let obj = {}
    this.tabs.map(item => {
      if (item['WorkQueue_Name'] === 'Filtered Files' || item['WorkQueue_Name'] === 'Filtered Batches') {
        obj = item;
        this.WorkQueueGroupIdToLoad = item.WorkQueue_Id;
        this.WorkQueue_Name = item.WorkQueue_Name;
      }
    })
    this.isLoading = true;
    console.log(this.isTabDisabled);
    if(this.filters) {
      console.log('1');
      if(this.selectedObjectId == 1) {
        this.WorkQueueType = 'By Batch';
      } else {
        this.WorkQueueType = 'By Files';
      }
      // if(this.selectedObjectId == 2 || this.selectedObjectId == 7  || this.selectedObjectId == 6) {
      //   this.WorkQueueType = 'By Files';
      // } else {
      //   this.WorkQueueType = 'By Batch';
      // }
      this.selected.setValue(this.tabs.length - 1);
      this.workqueueTabApiTrigger();
      console.log(this.selected);
      // this.onTabChange('',this.tabs.length);
      
    } else if(this.filterTabEnabled) {
      this.selected.setValue(this.tabs.length - 1);
      this.workqueueTabApiTrigger();
    } else {
      this.gridApiTrigger();
    }
  }
}
  gridApiTrigger(){
    this.disableBtnStatus = [
      'Batch Intake'
    ];
      // const reqObj = {
      //   "userId": this.userId,
      //   "roleId": this.roleid,
      //   "token": this.token,
      //   "orgId": this.orgId,
      //   "WorkQueueGroupId": this.WorkQueueGroupIdToLoad
      // }  
    let excelName =  this.userName + '_' + this.WorkQueueType + '_' + ((this.CaseWorkQueue == 'SELF') ? 'MyWorkQueues' : 'AllWorkQueues') + '_' + ((this.TaskWorkQueue == true) ? 'Task' : 'Case')+ '_' + this.WorkQueue_Name;
    this.sessionStorage.setItem("excelName", excelName);
    let currentPageDetails = {
      View: 'List',
      Category: this.WorkQueueType,
      Context: this.CaseWorkQueue,
      Type: this.TaskWorkQueue == true ? 'Task' : 'Case',
      TabName: this.WorkQueue_Name
    }
    this.sessionStorage.setObj('Selected_WrokQueue_Page', currentPageDetails);
    // console.log(this.WorkQueueGroupIdToLoad, this.WorkQueue_Name);
    if(this.router.url === '/case-list-page' || this.router.url === '/task-list-page') {
      if(this.WorkQueueGroupIdToLoad === undefined && (this.WorkQueue_Name === 'All Tasks' || this.WorkQueue_Name === undefined) && !this.filters) {
        this.WorkQueueGroupIdToLoad = '8'
      }
      if(this.WorkQueueGroupIdToLoad === undefined && this.WorkQueue_Name === 'All Docs' && !this.filters) {
        this.WorkQueueGroupIdToLoad = '2'
      }
    }

      let reqObj = { 
          token:"t2k7jHs13XuW0O7MufPn0mnrJU8MTxKd5JKBSz5kEP8hTSKTrO1s8QbJWimlCLpPt1Ihp8+iOCa6WiV7pNkWTA==",
          "workQueueContext": this.CaseWorkQueue,
          "globalSearchFilter": this.filters?.globalSearchFilter,
          "filters": this.filters?.filters,
          "batchRetrievalIndicator": "Y",
          "retrievedCount": 0,
          "requiredCount": 10,
          workQueId:this.WorkQueueGroupIdToLoad ? this.WorkQueueGroupIdToLoad : this.WorkQueueType == 'By Files' ? '6' : '1',
          fromDate:null,
          toDate:null,
          status:"",
          linkFilterJson: null,
          "measureFilters": null
        }
        if(!this.isTabDisabled && !this.CaseTaskWorkQueue){
          reqObj.measureFilters = {
            "measureId": this.chartInput.measureId,
            "timeId": this.chartInput.timeId,
            "factId": this.chartInput.factId,
            "xDimensionValue": this.chartInput.dimension ? this.chartInput.dimension.StackedDimensionValues1 : '',
            "yDimensionValue": this.chartInput.dimension ? this.chartInput.dimension.StackedDimensionValues2 : ''
          }
          if(reqObj.measureFilters.measureId == '') {
            reqObj.measureFilters = null
          }
        }
        if(this.filterTabEnabled) {
          let selectedFilterDetails = this.sessionStorage.getObj('Selected_Filters_Column');
          if(reqObj.measureFilters == null) {
          reqObj.linkFilterJson = {
            "columnName": selectedFilterDetails.columnName,
            "batchId": selectedFilterDetails.batchId
          }
        }
        }

      this.gridWidget = new EcareGridSettings();
      this.gridWidget = {
        id: 'Workqueue',
        enableFilter: true,
        enableSorting: true,
        enableRowSelection: true,
        checklocaljson : false,
        apiMethod: 'post',
        apiUrl: `${environment.apiService}Cases/GetWorkQueueData`,
        apiRequest: reqObj,
        actionColumns: [],
        linkableField: '',
        rowSelection: this.WorkQueueType == 'By Batch' ? 'single' : 'multiple',
        floatingFilter: true,
        sidebar: true,
        pagination: true,
        exceloption: true,
        colWidth: 180,
        gridname: 'Workqueue Grid',
        workqueueTotalCount: this.tabs[this.previousIndex]['Workqueue Data Count'],
        firstRowSelection: false,
        noDataErrorMessage: 'No Case Records found. Please contact your administrator for more information',
        exportToExcel: false,
        workqueueGridType: this.WorkQueueType
      };
      this.loaderService.hideLoader();
      setTimeout(() => {
        this.isLoading = false;
        let WrokQueue_From = this.sessionStorage.getItem('WrokQueue_From');
        if(WrokQueue_From == 'basepage' || WrokQueue_From == 'BtnAction'){
          let currentPageDetails = this.sessionStorage.getObj('Selected_WrokQueue_Dimensions');
          if(currentPageDetails){
            this.savedScrollX = currentPageDetails.savedScrollX;
            this.savedScrollY = currentPageDetails.savedScrollY;
          }
        }
        setTimeout(() => {
          if(!this.isTabDisabled){
            // window.scrollTo(this.savedScrollX, document.body.scrollHeight - window.innerHeight);
            this.scrollIntoViewWorkqueueContent();
          }
          else{
            // window.scrollTo(this.savedScrollX, this.savedScrollY);
            const field = document.getElementById('workqueueListContent');
            if (field) {
              field.scrollIntoView({ behavior: 'smooth',block: 'start'});
              // setTimeout(() => {
              //   window.scrollBy(0, -60);
              // }, 700);
            }
          }
          // this.scrollIntoViewWorkqueueContent();
        }, 200);
      }, 200);
      // this.isLoading = false;
      // setTimeout(() => {
      //   window.scrollTo(this.savedScrollX, this.savedScrollY);
      // }, 200);
    //   this.sharedService.getWorkQueueData(reqObj).subscribe({
    //   next:  (response) => {
    //     console.log(response,'wokrque gridlist')
    //     if (response) {
    //           let data = this.getStaticData();
    //           this.workQueueGridData = data;
    //           console.log(response,'test')
    //     }
    //   },
    //   error:  (error) => {
    //        this.errorMessage = this.sharedService.handlePageError('', error);
    //     },
    //     complete:()=>{
    //       this.isLoading = false;
    //       //complete
    //     }})

  }
  handleCheckBoxEvent(event){
    // if (event['selectedRowCount'] == 1) {
    //     this.caseSelected = true;
    //     this.sessionStorage.setItem("selectedCaseDetails", JSON.stringify(event.selectedRowDetails))
    // } else {
    //     this.caseSelected = false;
    // }
    this.disableBtnStatus = [];
    // const rowdetails = event.selectedRowDetails.filter(item => item.checkboxSelected);

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

    if(event.selectedTempRowDetails.length == 1) {
      if(event.selectedTempRowDetails[0]['Processing Status'] == 'Not Started' || event.selectedTempRowDetails[0]['Processing Status'] == 'In Progress') {
        this.disableBtnStatus = ['Abort Batch', 'Explore Batch Files', 'Archive Batch']
      } else if(event.selectedTempRowDetails[0]['Processing Status'] == 'Aborted') {
        this.disableBtnStatus = ['Reprocess']
      } else {
        this.disableBtnStatus = ['Explore Batch Files', 'Generate Report', 'Archive Batch', 'Reprocess']
      }
    } else {
      this.disableBtnStatus = [];
    }
    if(event.selectedRowDetails && event.selectedRowDetails.length > 0){
      event.selectedRowDetails.map(item => {
        item.WorkQueueType = this.TaskWorkQueue == true ? 'Task' : 'Case';
      })
    }
    this.sessionStorage.removeItem('selectedCaseDetails');
    this.sessionStorage.removeItem('selectedCasesDetails');
    // this.sessionStorage.removeItem('selectedAllFileDetails');
    if (event['selectedRowCount'] == 1) {
        this.caseSelected = true;
        this.caseSingleSelected = true;
        const selectedCaseId = event.selectedData.Case_Id;
        const selectedAllCaseDetails = JSON.parse(this.sessionStorage.getItem("selectedAllFileDetails"));
        if(selectedAllCaseDetails) {
          const updatedSelectedAllCaseDetails = selectedAllCaseDetails.map(item => ({
            ...item,
            isSelect: item.Case_Id === selectedCaseId ? event.selectedData.checkboxSelected : item.isSelect
          }));
          this.sessionStorage.setItem("selectedAllFileDetails", JSON.stringify(updatedSelectedAllCaseDetails));
        }       
        this.sessionStorage.setItem("selectedCaseDetails", JSON.stringify(event.selectedRowDetails[0]));
        this.sessionStorage.setItem("selectedCasesDetails", JSON.stringify(event.selectedTempRowDetails));
    } 
    else if (event['selectedRowCount'] > 1) {
        this.caseSelected = true;
        this.caseSingleSelected = false;
        const selectedCaseId = event.selectedData.Case_Id;
        const selectedAllCaseDetails = JSON.parse(this.sessionStorage.getItem("selectedAllFileDetails"));
        if(selectedAllCaseDetails) {
        const updatedSelectedAllCaseDetails = selectedAllCaseDetails.map(item => ({
          ...item,
          isSelect: item.Case_Id === selectedCaseId ? event.selectedData.checkboxSelected : item.isSelect
        }));
        this.sessionStorage.setItem("selectedAllFileDetails", JSON.stringify(updatedSelectedAllCaseDetails));
       }
        this.sessionStorage.setItem("selectedCasesDetails", JSON.stringify(event.selectedTempRowDetails));
    }  
    else {
      this.disableBtnStatus = ['Batch Intake'];
        this.caseSelected = false;
        this.caseSingleSelected = false;
    }

    const selectedCount = event.selectedRowDetails.filter(item => item.checkboxSelected).length;


    if(this.WorkQueueType == 'By Files') {
      if(selectedCount >= 1) {
        this.disableBtnStatus = ['Explore Files','Audit Complete']
      }
      if(selectedCount == 1 && event.selectedRowDetails[0]['Business Status'] == 'Invalid') {
        this.disableBtnStatus = ['Explore Files', 'Reprocess']
      }
    }   
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
            const dialogRef = this.dialog.open(PopupCustomComponent, {
              data: {
                type : this.TaskWorkQueue == true ? 'Assign/Reassign Task' : value,
                title: 'Assign/Reassign',
                titlePosition: 'left',
                // contentPosition: 'center',
                buttonPosition: 'right',
                additionalButtons: [
                  {
                    label: 'Assign/Reassign',
                    action: this.TaskWorkQueue == true ? 'AssignOwnerTask' : 'AssignOwner'
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
                  if(this.TaskWorkQueue){
                    obj.ownerlist = obj.ownerlist.filter(obj => obj.owner_id !== '');
                    obj.ownerlist = this.removeDuplicates(obj.ownerlist, 'task_id');
                    if(obj.ownerlist.length != 0) {
                      let reqObj = obj.ownerlist;
                
                      this.sharedService.multipleTaskAssign(reqObj).subscribe({
                        next:  (response) => {
                        },
                         error:  (error) => {
                          dialogRef.close();
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
                              dialogContent: 'Selected Task(s) Assigned/Reassigned Successfully.',
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
                            this.sessionStorage.setItem('WrokQueue_From','BtnAction');
                            let currentPageDetails = {
                              savedScrollX: this.savedScrollX,
                              savedScrollY: this.savedScrollY
                            }
                            this.sessionStorage.setObj('Selected_WrokQueue_Dimensions', currentPageDetails);
                            this.sessionStorage.setItem('WrokQueue_Page_Loading', 'Y');
                            this.reloadDashBoard.emit(true);
                            this.workqueueTabApiTrigger();
                          });
                        }})
                    }  
                  }
                  else{
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
                            this.sessionStorage.setItem('WrokQueue_From','BtnAction');
                            let currentPageDetails = {
                              savedScrollX: this.savedScrollX,
                              savedScrollY: this.savedScrollY
                            }
                            this.sessionStorage.setObj('Selected_WrokQueue_Dimensions', currentPageDetails);
                            this.sessionStorage.setItem('WrokQueue_Page_Loading', 'Y');
                            this.reloadDashBoard.emit(true);
                            this.workqueueTabApiTrigger();
                          });
                        }})
                    }  
                  }
                }
            });
          }})
      
    } else if(value === 'Update SLA') {
        const dialogRef = this.dialog.open(PopupCustomComponent, {
            data: {
              type : value,
              title: value,
              titlePosition: 'left',
              contentPosition: 'left',
              buttonPosition: 'right',
              additionalButtons: [],
              acceptButtonTitle: 'Update',
              declineButtonTitle: 'Cancel' ,
              caseDetail: caseDetails
            },
            height: 'auto',
            width: '500px',
            // position: {
            //     top: `${ 24 }px`
            //   },
        });
        dialogRef.disableClose = true;
    
        dialogRef.afterClosed().subscribe(result => {
            if(result) {
              this.sessionStorage.setItem('WrokQueue_Page_Loading', 'Y');
              this.sessionStorage.setItem('WrokQueue_From','BtnAction');
                this.workqueueTabApiTrigger();
            }
        });
    } else if(value === 'Set Priority') {
      let PriorityData = [{
        id: 'No',
        value: 'No'
      },{
        id: 'Yes',
        value: 'Yes'
      }]
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
                    this.sessionStorage.setItem('WrokQueue_From','BtnAction');
                    let currentPageDetails = {
                      savedScrollX: this.savedScrollX,
                      savedScrollY: this.savedScrollY
                    }
                    this.sessionStorage.setObj('Selected_WrokQueue_Dimensions', currentPageDetails);
                    this.reloadDashBoard.emit(true);
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
            dialogContent: this.TaskWorkQueue == true ? 'The selected Task is already completed. Would you like to take a look at the Tasks in Read Only Mode?' : 'The selected Doc is already completed. Would you like to take a look at the Tasks in Read Only Mode?',
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
              this.loaderService.showLoader();
              this.sessionStorage.setItem('BasePagetype', this.TaskWorkQueue == true ? 'TaskListing' : 'CaseListing');
              let currentPageDetails = {
                savedScrollX: this.savedScrollX,
                savedScrollY: this.savedScrollY
              }
              this.sessionStorage.setObj('Selected_WrokQueue_Dimensions', currentPageDetails);
              this.router.navigate(['/base-action-page']);
              break;
            case 'decline':

              break;
          }
        });
      }
      if(caseDetail["Case Owner Id"] == this.userId && caseDetail["Status"] != 'Completed') {
        this.loaderService.showLoader();
        this.sessionStorage.setItem('BasePagetype', this.TaskWorkQueue == true ? 'TaskListing' : 'CaseListing');
        let currentPageDetails = {
          savedScrollX: this.savedScrollX,
          savedScrollY: this.savedScrollY
        }
        this.sessionStorage.setObj('Selected_WrokQueue_Dimensions', currentPageDetails);
        this.router.navigate(['/base-action-page']);
      }
      if(caseDetail["Case Owner Id"] != this.userId){
        const dialogRef = this.dialog.open(PopupTemplateComponent, {
          width: '500px',
          data: <IDynamicDialogConfig>{
            title: 'Alert',
            titleFontSize:'20',
            dialogContent: this.TaskWorkQueue == true ? 'The selected Task is not assigned to you. Would you like to take a look at the Tasks in Read Only Mode?': 'The selected Doc is not assigned to you. Would you like to take a look at the Tasks in Read Only Mode?',
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
              this.loaderService.showLoader();
              this.sessionStorage.setItem('BasePagetype', this.TaskWorkQueue == true ? 'TaskListing' : 'CaseListing');
              let currentPageDetails = {
                savedScrollX: this.savedScrollX,
                savedScrollY: this.savedScrollY
              }
              this.sessionStorage.setObj('Selected_WrokQueue_Dimensions', currentPageDetails);
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
                this.sessionStorage.setItem('WrokQueue_From','BtnAction');
                let currentPageDetails = {
                  savedScrollX: this.savedScrollX,
                  savedScrollY: this.savedScrollY
                }
                this.sessionStorage.setObj('Selected_WrokQueue_Dimensions', currentPageDetails);
                this.reloadDashBoard.emit(true);
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
    else if(caseDetails[0].Case_Id && value === 'Reprocess') {
      (<any>$('#reprocessFile')).modal('show');
    } 
    else if(!caseDetails[0].Case_Id && value === 'Reprocess') {
      (<any>$('#reprocessBatch')).modal('show');
    } 
    else if(value == 'Audit Complete') {
      (<any>$('#auditComplete')).modal('show');

    }
    else if(value == 'Explore Files') {
      setTimeout(() => {
        console.log(this.WorkQueue_Name)
        this.sessionStorage.setItem('SelectedWorkQueueName', this.WorkQueue_Name);
        this.router.navigate(['/exploredetails']);
      }, 500);
    }
    else if(value == 'Explore Batch Files') {
      let selectedBatchDetail = JSON.parse(this.sessionStorage.getItem("selectedCaseDetails"));
      let obj = {
        // columnName: 'Batch Number',
        batchId: selectedBatchDetail.Batch_ID,
        batchNumber: selectedBatchDetail['Batch Number']     
      }
      this.ChartSharedService.chartareaclicked.next(undefined);
      this.sessionStorage.setObj('Selected_Filters_Column', obj);
      if(this.router.url === '/filelistdashboard') {
        this.WorkQueueType = 'By Files';
        this.sessionStorage.setItem('WorkQueueType', this.WorkQueueType);
        let selectedFilterDetails = this.sessionStorage.getObj('Selected_Filters_Column');
        this.reloadDashBoard.emit(true);
        if(selectedFilterDetails) {
          this.selectedBatchNumber = selectedFilterDetails.batchNumber;
          this.selectedColumnName = selectedFilterDetails.columnName;
          this.chartInput = {
            measureId : '',
            factId : '',
            timeId : '',
            dimension : []
          }
          this.filters = null;
          this.isTabDisabled = false;
          this.filterTabEnabled = true;
          this.loadMyFilteredCaseTab();    
        }
      } else {
        this.WorkQueueType = 'By Files';
        this.sessionStorage.setItem('WorkQueueType', this.WorkQueueType);
        this.router.navigate(['/filelistdashboard']);
      }
    }
    else if(value == 'Abort Batch') {
      (<any>$('#abortBatch')).modal('show');
    }
    else if(value == 'Archive Batch') {
      (<any>$('#archiveBatch')).modal('show');
    }
    else if(value == 'Generate Report') {
      this.downloadBatchResult();
    }
    
  }

  downloadBatchResult() {
    this.loaderService.showLoader();
    this.selectedFileDetails = JSON.parse(this.sessionStorage.getItem("selectedCasesDetails"));
    let reqObj = {
      "batchId": this.selectedFileDetails[0].Batch_ID
  }
    this.sharedService.downloadBatch(reqObj).subscribe({
      next: (response) => {
        if(response) {
          if(response.ReportPath) {
            this.getPresignedUrl(response.ReportPath);
          }
        } else {
          this.loaderService.hideLoader();
        }

      },
      error: (error) => {
        this.loaderService.hideLoader();
      },
      complete: () => {
          
      }
    });
  }

  getPresignedUrl(url) {
    let reqObj = {
      "fileLocation": url
  }
    this.sharedService.getPresignedTiffUrl(reqObj).subscribe({
      next: (response) => {
        if(response) {
          this.downloadFile(response)
          this.loaderService.hideLoader();
        }
      },
      error: (error) => {
        this.loaderService.hideLoader();
      },
      complete: () => {
          
      }
    });
  }

  downloadFile(fileUrl) {
    this.selectedBatchDetails = JSON.parse(this.sessionStorage.getItem("selectedCaseDetails"));
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'Batch_Results_'+ this.selectedBatchDetails['Batch Number']+ '.xlsx'; // Rename as needed
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        window.URL.revokeObjectURL(url); // Clean up
      },
      error: (err) => {
        console.error('Download error:', err);
      },
    });
  }

  updateAssignee(obj) {
    obj.ownerlist = obj.ownerlist.filter(obj => obj.owner_id !== '');
    obj.ownerlist = this.removeDuplicates(obj.ownerlist, 'case_id');
    if(obj.ownerlist.length != 0) {
      let reqObj = obj.ownerlist;

      this.sharedService.multipleCaseAssign(reqObj).subscribe({
        next:  (response) => {
        },
         error:  (error) => {
        },
        complete:()=>{ 
          const dialogRef = this.dialog.open(PopupSuccessComponent, {
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
          dialogRef.disableClose = true;
      
          dialogRef.afterClosed().subscribe(result => {
            this.isLoading = true;
            this.sessionStorage.setItem('WrokQueue_From','BtnAction');
            let currentPageDetails = {
              savedScrollX: this.savedScrollX,
              savedScrollY: this.savedScrollY
            }
            this.sessionStorage.setObj('Selected_WrokQueue_Dimensions', currentPageDetails);
            this.sessionStorage.setItem('WrokQueue_Page_Loading', 'Y');
            this.reloadDashBoard.emit(true);
            this.workqueueTabApiTrigger();
          });
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
         error:  (error) => {
        },
        complete:()=>{ 
          const dialogRef = this.dialog.open(PopupSuccessComponent, {
            // panelClass: '',
            data: <IDynamicDialogConfig>{
              title: 'Success',
              titleFontSize:'20',
              type : '',
              titlePosition: 'left',
              contentPosition: 'left',
              dialogContentFontSize: '15',
              dialogContent: 'Selected Task(s) Assigned/Reassigned Successfully.',
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
            this.sessionStorage.setItem('WrokQueue_From','BtnAction');
            let currentPageDetails = {
              savedScrollX: this.savedScrollX,
              savedScrollY: this.savedScrollY
            }
            this.sessionStorage.setObj('Selected_WrokQueue_Dimensions', currentPageDetails);
            this.sessionStorage.setItem('WrokQueue_Page_Loading', 'Y');
            this.reloadDashBoard.emit(true);
            this.workqueueTabApiTrigger();
          });
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
         error:  (error) => {
        },
        complete:()=>{ 
          
          const dialogRef = this.dialog.open(PopupSuccessComponent, {
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
          dialogRef.disableClose = true;
      
          dialogRef.afterClosed().subscribe(result => {
            this.isLoading = true;
            this.sessionStorage.setItem('WrokQueue_From','BtnAction');
            let currentPageDetails = {
              savedScrollX: this.savedScrollX,
              savedScrollY: this.savedScrollY
            }
            this.sessionStorage.setObj('Selected_WrokQueue_Dimensions', currentPageDetails);
            this.reloadDashBoard.emit(true);
            this.workqueueTabApiTrigger();
          });
        }})
    }  
  }

  removeDuplicates(array: any[], key: string): any[] {
    const unique = new Map();
    return array.filter(obj => !unique.has(obj[key]) && unique.set(obj[key], 1));
  }


  WorkQueueTypeClick(option: string): void{
    this.sessionStorage.removeItem('Selected_Filters_Column');
    this.sessionStorage.removeItem('SelectedWorkQueueName');
    this.filterTabEnabled = false;
    this.WorkQueueType = option;
    this.sessionStorage.setItem('WorkQueueType', this.WorkQueueType);
    // this.sharedService.workqueueTypeChange.next(this.WorkQueueType);
    let currentPageDetails = {
      savedScrollX: this.savedScrollX,
      savedScrollY: this.savedScrollY
    }
    this.sessionStorage.setObj('Selected_WrokQueue_Dimensions', currentPageDetails);
    this.reloadDashBoard.emit(true);
    this.WorkQueueCategoryFilteredItems = this.userData.filter(item => item.WorkQueue_Category === this.WorkQueueType);
    this.WorkQueue_Name = this.WorkQueueType == 'By Batch' ? 'All Batches' : 'All Files'
    if (this.WorkQueueCategoryFilteredItems.length > 0) {
      this.WorkQueueCategoryFilteredItems.forEach(item => {
        item.QueList.forEach((element, i) => {
          if(element.WorkQueue_Name === this.WorkQueue_Name){
            item.WorkQueueDefaultId = element.WorkQueue_Id;
            item.WorkQueueDefaultIndex = i;
          }
        });
        if (item.WorkQueue_Level === 'Case' && !this.TaskWorkQueue) {
          this.workQueuesTabLoad(item);
          this.WorkQueueGroupIdToLoad = item.WorkQueueDefaultId;
          this.WorkQueue_Name = item.WorkQueue_Name;
          this.tabs = item.QueList;
          this.isLoading = true;
          this.workqueueTabApiTrigger2();
        }
        else if(item.WorkQueue_Level === 'Task' && this.TaskWorkQueue){
          this.workQueuesTabLoad(item);
          this.WorkQueueGroupIdToLoad = item.WorkQueueDefaultId;
          this.WorkQueue_Name = item.WorkQueue_Name;
          this.tabs = item.QueList;
          this.isLoading = true;
          this.workqueueTabApiTrigger2();
        }
      })
    }
  }
  WorkQueueTypeClick1(option: string): void{
    this.WorkQueueType = option;
    let currentPageDetails = {
      savedScrollX: this.savedScrollX,
      savedScrollY: this.savedScrollY
    }
    this.sessionStorage.setObj('Selected_WrokQueue_Dimensions', currentPageDetails);
    // this.reloadDashBoard.emit(true);
    this.WorkQueueCategoryFilteredItems = this.userData.filter(item => item.WorkQueue_Category === this.WorkQueueType);
    this.WorkQueue_Name = this.TaskWorkQueue == true ? 'All Tasks' : 'All Docs'
    if (this.WorkQueueCategoryFilteredItems.length > 0) {
      this.WorkQueueCategoryFilteredItems.forEach(item => {
        item.QueList.forEach((element, i) => {
          if(element.WorkQueue_Name === this.WorkQueue_Name){
            item.WorkQueueDefaultId = element.WorkQueue_Id;
            item.WorkQueueDefaultIndex = i;
          }
        });
        if (item.WorkQueue_Level === 'Case' && !this.toggle) {
          
          this.workqueueTabApiTrigger2();
        }
        else if(item.WorkQueue_Level === 'Task' && this.toggle){
          
          this.workqueueTabApiTrigger2();
        }
      })
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
            this.sessionStorage.setItem('WrokQueue_Page_Loading', 'Y');
            this.sessionStorage.setItem('WrokQueue_From','BtnAction');
              this.workqueueTabApiTrigger();
          }
      });
    }
    if(event.From === 'HyperlinkRendererComponent' && event.id == 1){
      this.loaderService.showLoader();
      this.sessionStorage.setItem('BasePagetype', 'CaseDetails');
      if(event.columnName == 'Processing File Count' || event.columnName == 'Error File Count') {
        let obj = {
          columnName: event.columnName,
          batchId: event.Data.Batch_ID,
          batchNumber: event.Data['Batch Number'],          
          columnValueCount: event.columnName == 'Processing File Count' ? event.Data['Processing File Count'] : event.Data['Error File Count']
        }
        this.sessionStorage.setObj('Selected_Filters_Column', obj);
        this.WorkQueueType = 'By Files';
        this.sessionStorage.setItem('WorkQueueType', this.WorkQueueType);
        this.router.navigate(['/filelistdashboard']);
        if(this.router.url === '/filelistdashboard') {
          this.WorkQueueType = 'By Files';
          this.sessionStorage.setItem('WorkQueueType', this.WorkQueueType);
          let selectedFilterDetails = this.sessionStorage.getObj('Selected_Filters_Column');
          if(selectedFilterDetails) {
            this.chartInput = {
              measureId : '',
              factId : '',
              timeId : '',
              dimension : []
            }
            this.filters = null;
            this.isTabDisabled = false;
            this.filterTabEnabled = true;
            this.loadMyFilteredCaseTab();    
          }
        }
      } else {
        this.router.navigate(['/base-action-page']);
      }
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
                this.sessionStorage.setItem('WrokQueue_Page_Loading', 'Y');
                this.sessionStorage.setItem('WrokQueue_From','BtnAction');
                  this.workqueueTabApiTrigger();
              }
          });
        }
      });
    }
   }
   onCaseWorkQueueChange() {
    let currentPageDetails = {
      savedScrollX: this.savedScrollX,
      savedScrollY: this.savedScrollY
    }
    this.sessionStorage.setObj('Selected_WrokQueue_Dimensions', currentPageDetails);
    this.reloadDashBoard.emit(true);
    this.workqueueTabApiTrigger2();
    // this.WorkQueueCategoryFilteredItems = this.userData.filter(item => item.WorkQueue_Category === this.WorkQueueType);
    // if (this.WorkQueueCategoryFilteredItems.length > 0) {
    //   this.WorkQueueCategoryFilteredItems.forEach(item => {
    //     item.QueList.forEach((element, i) => {
    //       if(element.WorkQueue_Name === this.WorkQueue_Name){
    //         item.WorkQueueDefaultId = element.WorkQueue_Id;
    //         item.WorkQueueDefaultIndex = i;
    //       }
    //     });
    //     if (item.WorkQueue_Level === 'Case' && !this.TaskWorkQueue) {
    //       this.workQueuesTabLoad(item.WorkQueueDefaultIndex);
    //       this.WorkQueueGroupIdToLoad = item.WorkQueueDefaultId;
    //       this.WorkQueue_Name = item.WorkQueue_Name;
    //       this.tabs = item.QueList;
    //       this.isLoading = true;
    //       this.workqueueTabApiTrigger2();
    //     }
    //     else if(item.WorkQueue_Level === 'Task' && this.TaskWorkQueue){
    //       this.workQueuesTabLoad(item.WorkQueueDefaultIndex);
    //       this.WorkQueueGroupIdToLoad = item.WorkQueueDefaultId;
    //       this.WorkQueue_Name = item.WorkQueue_Name;
    //       this.tabs = item.QueList;
    //       this.isLoading = true;
    //       this.workqueueTabApiTrigger2();
    //     }
    //   })
    // }

  }

  onCaseWorkQueueChange1() {
    this.workqueueTabApiTrigger2();
  }
  onChangeTaskWorkQueue(event): void{
    this.TaskWorkQueue = !this.TaskWorkQueue;
    let currentPageDetails = {
      savedScrollX: this.savedScrollX,
      savedScrollY: this.savedScrollY
    }
    this.sessionStorage.setObj('Selected_WrokQueue_Dimensions', currentPageDetails);
    this.reloadDashBoard.emit(true);
    this.WorkQueueCategoryFilteredItems = this.userData.filter(item => item.WorkQueue_Category === this.WorkQueueType);
    this.WorkQueue_Name = this.TaskWorkQueue == true ? 'All Tasks' : 'All Docs'
    if (this.WorkQueueCategoryFilteredItems.length > 0) {
      this.WorkQueueCategoryFilteredItems.forEach(item => {
        item.QueList.forEach((element, i) => {
          if(element.WorkQueue_Name === this.WorkQueue_Name){
            item.WorkQueueDefaultId = element.WorkQueue_Id;
            item.WorkQueueDefaultIndex = i;
          }
        });
        if (item.WorkQueue_Level === 'Case' && !this.TaskWorkQueue) {
          this.workQueuesTabLoad(item);
          this.WorkQueueGroupIdToLoad = item.WorkQueueDefaultId;
          this.WorkQueue_Name = item.WorkQueue_Name;
          this.tabs = item.QueList;
          this.isLoading = true;
          this.workqueueTabApiTrigger2();
        }
        else if(item.WorkQueue_Level === 'Task' && this.TaskWorkQueue){
          this.workQueuesTabLoad(item);
          this.WorkQueueGroupIdToLoad = item.WorkQueueDefaultId;
          this.WorkQueue_Name = item.WorkQueue_Name;
          this.tabs = item.QueList;
          this.isLoading = true;
          this.workqueueTabApiTrigger2();
        }
      })
    }
  }        


  movetoExploreDetails() {
    this.router.navigate(['/exploredetails']);
  }

  abortBatchConfirm() {
    this.abortBatchStared = true;
    this.selectedFileDetails = JSON.parse(this.sessionStorage.getItem("selectedCasesDetails"));
    let reqObj = {
      "batchId": this.selectedFileDetails[0].Batch_ID
  }
    this.sharedService.abortBatch(reqObj).subscribe({
      next: (response) => {
        this.abortBatchStared = false;
        this.isLoading = true;
        (<any>$('#abortBatch')).modal('hide');
        setTimeout(() => {
          this.disableBtnStatus = [];
          // this.isLoading = false;
          this.reloadDashBoard.emit(true);
          this.workqueueTabApiTriggerForTabChange();
        }, 200);
      },
      error: (error) => {
          this.abortBatchStared = false;
      },
      complete: () => {
          
      }
    });
  }

  archiveBatchConfirm() {
    this.archiveBatchStared = true;
    this.selectedFileDetails = JSON.parse(this.sessionStorage.getItem("selectedCasesDetails"));
    let reqObj = {
      "batchId": this.selectedFileDetails[0].Batch_ID
  }
    this.sharedService.archiveBatch(reqObj).subscribe({
      next: (response) => {
        this.archiveBatchStared = false;
        this.isLoading = true;
        (<any>$('#archiveBatch')).modal('hide');
        setTimeout(() => {
          this.disableBtnStatus = [];
          // this.isLoading = false;
          this.reloadDashBoard.emit(true);
          this.workqueueTabApiTriggerForTabChange();
        }, 200);
      },
      error: (error) => {
          this.archiveBatchStared = false;
      },
      complete: () => {
          
      }
    });
  }

  eventClear(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      inputElement.value = null;
    }
  }

  handleTestFormFileInput(fileInput) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      if(fileInput.target.files[0].type == 'image/tiff') {
        let caseDetail = JSON.parse(this.sessionStorage.getItem("selectedCaseDetails"));
        this.loaderService.showLoader();
        const reader = new FileReader();
        reader.readAsDataURL(fileInput.target.files[0]);
        const formdata = new FormData();
        formdata.append('myFile', fileInput.target.files[0]);
        formdata.append('batchId', caseDetail.Batch_ID);
        formdata.append('caseId', caseDetail.Case_Id);
        this.uploadedFileName = fileInput.target.files[0].name;   
          this.http.post<any>(`${environment.apiService}Cases/ReprocessDoc`, formdata).subscribe((value) => {
            if(value == 'File Validation Error') {
              this.uploadedFileName = '';
              this.loaderService.hideLoader();
              $('#alert-error').modal('show');
              this.errorMessage = 'Page count/File size exceeds the limit';
              setTimeout(() => {
                if(this.alertErrorBtn){
                  this.alertErrorBtn.nativeElement.focus();
                }
              }, 400);
            } else if(value == 'File already In Process. Please try after some time') {  
              this.uploadedFileName = '';   
              this.loaderService.hideLoader();
              $('#alert-error').modal('show');
              this.errorMessage = 'Previous file is in progress, please try again after sometime';
              setTimeout(() => {
                if(this.alertErrorBtn){
                  this.alertErrorBtn.nativeElement.focus();
                }
              }, 400);
            } else if(value == 'Case with same file name exist') {
              this.uploadedFileName = '';       
              this.loaderService.hideLoader();
              $('#alert-error').modal('show');
              this.errorMessage = 'A file with the same name exists already for the current date. Please rename the form and try again';
              setTimeout(() => {
                if(this.alertErrorBtn){
                  this.alertErrorBtn.nativeElement.focus();
                }
              }, 400);
            } else if (value == 'The folder for the selected file was not found in the input directory. Please check if it has been moved, renamed or deleted.') {
              this.uploadedFileName = '';       
              this.loaderService.hideLoader();
              $('#alert-error').modal('show');
              this.errorMessage = value;
              setTimeout(() => {
                if(this.alertErrorBtn){
                  this.alertErrorBtn.nativeElement.focus();
                }
              }, 400);
            } else {  
              this.loaderService.hideLoader();
              this.uploadedFileName = '';
              $('#reprocessFile').modal('hide');
              $('#reprocessSuccess').modal('show');
            }
          
          },
          error => {
            this.loaderService.hideLoader();
            this.uploadedFileName = '';   
            $('#alert-error').modal('show');
            // this.errorMessage = error.message;
            this.errorMessage = 'File upload failed, Please try again later.';
            setTimeout(() => {
              if(this.alertErrorBtn){
                this.alertErrorBtn.nativeElement.focus();
              }
            }, 400);
          });
      } else {
        $('#alert-error').modal('show');
        this.errorMessage = 'Uploaded file format is not supported, Please try with a Tiff file';
      }    
    } else {
      $('#alert-error').modal('show');
      this.errorMessage = 'Uploaded file format is not supported, Please try with a Tiff file';
    }
  }

  reprocessSuccess() {
    $('#reprocessSuccess').modal('hide');
    setTimeout(() => {
      this.reloadDashBoard.emit(true);
      this.workqueueTabApiTriggerForTabChange();
    }, 200);
  }

  selectAllEvent(event) {
    if(event) {
      this.getWorkqueueAllCases();
    } else {

    }
  }

  getWorkqueueAllCases() {
    let reqObj = {
      "workQueId": this.WorkQueueGroupIdToLoad,
      "filters": null,
      "linkFilterJson": null,
      "measureFilters": null
  }
   if(this.WorkQueueGroupIdToLoad == '13') {    
    if(this.chartInput) {
    reqObj.measureFilters = {
      "measureId": this.chartInput.measureId,
      "timeId": this.chartInput.timeId,
      "factId": this.chartInput.factId,
      "xDimensionValue": this.chartInput.dimension ? this.chartInput.dimension.StackedDimensionValues1 : '',
      "yDimensionValue": this.chartInput.dimension ? this.chartInput.dimension.StackedDimensionValues2 : ''
    }
    if(reqObj.measureFilters.measureId == '') {
      reqObj.measureFilters = null
    }
  }
  let selectedFilterDetails = this.sessionStorage.getObj('Selected_Filters_Column');
    if(selectedFilterDetails) {
      if(reqObj.measureFilters == null) {
      reqObj.linkFilterJson = {
        "columnName": selectedFilterDetails.columnName,
        "batchId": selectedFilterDetails.batchId
      }
    }
    }
   }
   if(this.filters) {
    reqObj.filters = this.filters
  }
    this.sharedService.getAllCaseDetails(reqObj).subscribe({
      next: (response) => {
        const updatedArray = response.map(item => ({
          ...item,
          isSelect: true
      }));
        this.sessionStorage.setItem("selectedAllFileDetails", JSON.stringify(updatedArray));
      },
      error: (error) => {
      },
      complete: () => {
          
      }
    });
  }

  reprocessBatchTrigger() {
    this.disableOkBtn = true;
    let caseDetails = JSON.parse(this.sessionStorage.getItem("selectedCasesDetails"));

    let reqObj = {
      "inputDirectory": caseDetails[0]['Input_Directory_Location'],
      "batchId": caseDetails[0]['Batch_ID']
    }
    this.sharedService.reprocessBatch(reqObj).subscribe({
      next: (response) => {
        if(response == 'Selected folder not found in the input folder. Please check if the folder was moved, renamed or deleted') {
          this.reprocessFailure = response;
          (<any>$('#reprocessBatch')).modal('hide');
          (<any>$('#reprocessBatchFailure')).modal('show');      
          this.disableOkBtn = false;
        } else {
          this.isLoading = true;
          (<any>$('#reprocessBatch')).modal('hide');
          this.disableOkBtn = false;
          setTimeout(() => {
            this.disableBtnStatus = [];
            // this.isLoading = false;
            this.reloadDashBoard.emit(true);
            this.workqueueTabApiTriggerForTabChange();
          }, 200);
        }
        
      },
      error: (error) => {
        this.disableOkBtn = false;
        this.reprocessFailure = 'Reprocess failed, please check again later';
        (<any>$('#reprocessBatchFailure')).modal('show');     

      },
      complete: () => {
          
      }
    });
  }

  closeBatchErrorPop() {
    (<any>$('#reprocessBatchFailure')).modal('hide');     
    setTimeout(() => {
      this.disableBtnStatus = [];
      this.reloadDashBoard.emit(true);
      this.workqueueTabApiTriggerForTabChange();
    }, 200);
  }

  completeAudit() {
    this.auditStarted = true;
    const isSelectAllSelected = this.sessionStorage.getItem("isSelectAllSelected");
    if(isSelectAllSelected == 'true') {
      this.selectedFileDetail = JSON.parse(this.sessionStorage.getItem("selectedAllFileDetails"));
      this.selectedFileDetail = this.selectedFileDetail.filter(item => item.isSelect);
    } else {
      this.selectedFileDetail = JSON.parse(this.sessionStorage.getItem("selectedCasesDetails"));
    }

    const caseIdString = this.selectedFileDetail.map(item => item.Case_Id).join(',');
    console.log(caseIdString);

    let reqObj = {
      "caseIdCSV": caseIdString
    }
    this.sharedService.BulkCompleteAuditForCases(reqObj).subscribe({
      next: (response) => {     
        this.auditStarted = false;
        (<any>$('#auditComplete')).modal('hide');   
        (<any>$('#auditCompleteSuccess')).modal('show');    
      },
      error: (error) => {
        this.auditStarted = false;
      },
      complete: () => {
          
      }
    });
  }

  closeAuditSuccessPop() {
    (<any>$('#auditCompleteSuccess')).modal('hide');  
    setTimeout(() => {
      this.disableBtnStatus = [];
      this.reloadDashBoard.emit(true);
      this.workqueueTabApiTriggerForTabChange();
    }, 200);
  }
}
