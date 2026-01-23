import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonLoaderService } from 'src/app/Standalone/common-loader/common-loader.service';
import { EcareGridSettings } from 'src/app/shared/modal/ecareGridSetting';
import { ChartServiceService } from 'src/app/shared/services/chart_service';
import { EncryptionService } from 'src/app/shared/services/encryption.service';
import { SharedServiceService } from 'src/app/shared/services/sharedservice.service';
import { SessionStorageService } from 'src/app/shared/services/storage.service';
import { environment } from 'src/environments/environments';
import { WorkqueuePopupComponent } from '../../workqueue-popup/workqueue-popup/workqueue-popup.component';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss']
})
export class InsightsComponent implements OnInit {
  dashboardData: any[];
  showDashBoard: boolean;
  pageType: string = 'insights';
  chartInput: { measureId: string; factId: string; timeId: string; dimension: any; };
  isTabDisabled: boolean;
  isLoading: boolean;
  WorkQueueCategoryFilteredItems: any;
  disableBtnStatus: any[];
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
  gridWidget: EcareGridSettings;
  btnList: any[];
  popupOpened: boolean;

  constructor(
    private pagesService: SharedServiceService,
    private sessionStorage: SessionStorageService,
    public dialog: MatDialog,
    private ChartSharedService : ChartServiceService,
    private loaderService: CommonLoaderService,
    private sharedService: SharedServiceService,
    private encryptDecrypt: EncryptionService,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.loaderService.showLoader();
    this.currentUser = this.sessionStorage.getObj('currentUser');
    this.token = this.currentUser.Token;
    this.roleName = this.currentUser.RoleName;
    this.orgName = this.currentUser.OrganizationName;
    this.userId = this.encryptDecrypt.decrypt('DecryptRevoKey11', this.currentUser.UserId)
    this.roleid = this.encryptDecrypt.decrypt('DecryptRevoKey11', this.currentUser.RoleId)
    this.orgId = this.encryptDecrypt.decrypt('DecryptRevoKey11', this.currentUser.OrgId)
    this.userName = this.currentUser.Name
      this.loadWidgetData();
      this.pageType = 'insights';
      this.chartInput = {
        measureId : '',
        factId : '',
        timeId : '',
        dimension : []
      }
      this.ChartSharedService.chartareaclicked.next(null);
      this.ChartSharedService.chartareaclicked.subscribe(val => {
        if(this.router.url === '/insights'){
          console.log(val);
          if (val?.name?.point?.state !== undefined && val?.name?.point?.state != "deselect") {
            this.loaderService.showLoader();
            this.isTabDisabled = false;
            this.chartInput = {
              measureId : val.data.ObjectId,
              factId : val.pointdata.factId ? val.pointdata.factId : val.data.data.FactId,
              timeId : val.data.TimeId,
              dimension : val.pointdata.dimensionStackedValues
            }
            console.log(this.chartInput);
            this.workqueueTabApiTrigger();
          } else if(val?.name?.point?.state == "deselect" || val?.name?.point?.state == "") {
            this.isTabDisabled = true;
          }
        }
      });
  }
  loadWidgetData() {
    this.pagesService.getloadWidgetData('3').subscribe({
      next: (res) => {
        this.dashboardData = []
        for (let i = 0; i < res.length; i++) {
            this.dashboardData.push(res[i]);
        }
        this.dashboardData.map(item => {
          item.possibleareachartactive = false;
          item.possiblebarchartactive = true;
        });
      },
      error: (error) => {},
      complete:()=>{
        this.loaderService.hideLoader();
        this.showDashBoard = true;
      }
    });

  }
  workqueueTabApiTrigger(){
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
      else{
        this.loaderService.hideLoader();
      }
    },
    error:  (error) => {},
    complete:()=>{
      if(this.tabs && this.tabs.length > 0){
        this.gridApiTrigger();
      }
      else{
        this.loaderService.hideLoader();
      }
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
      this.sessionStorage.setObj("insightsChartData", this.chartInput);
      this.openPopup();
  }
  openPopup(){
    if(!this.popupOpened){
      this.popupOpened = true;
      if (!this.dialog.openDialogs.length){
        this.loaderService.hideLoader();
        const dialogRef = this.dialog.open(WorkqueuePopupComponent, {
          panelClass: 'document-list-overlay',
          data: {
            type : 'insightsGrid',
            title: 'Document List',
            titlePosition: 'left',
            // contentPosition: 'center',
            buttonPosition: 'right',
            showDeclineButton: false,
            showAcceptButton: false,
            gridWidget: this.gridWidget,
            btnList: this.btnList,
            showClose: true
          },
          height: '100vh',
          width: '100vw',
          // position: {
          //     top: `${ 24 }px`
          //   },
        });

    
        dialogRef.disableClose = true;
    
        dialogRef.afterClosed().subscribe(result => {
          this.popupOpened = false;
        });
      }
    }
  }
}
