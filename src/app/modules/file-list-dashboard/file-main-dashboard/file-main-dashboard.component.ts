import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonLoaderService } from 'src/app/Standalone/common-loader/common-loader.service';
import { Widget } from 'src/app/shared/modal/widget.modal';
import { SharedServiceService } from 'src/app/shared/services/sharedservice.service';
import { SessionStorageService } from 'src/app/shared/services/storage.service';
import { environment } from 'src/environments/environments';
declare let $: any;

@Component({
  selector: 'app-file-main-dashboard',
  templateUrl: './file-main-dashboard.component.html',
  styleUrls: ['./file-main-dashboard.component.scss']
})
export class FileMainDashboardComponent implements OnInit{

  @ViewChild('advancedecareDashboard') advancedecareDashboard: ElementRef;
  sapphireAnalyticsDashboard : boolean = false;


  // Declarations for dashboard charts
  dashboardData: any = []
  displayDashboard: boolean = false
  activeBackgroundpatientTab1: boolean
  activeBackgroundClaimTab2: boolean
  activeBackgroundproviderTab3: boolean
  providerTabsActive: boolean
  cliamsTabsActive: boolean
  activeBackPatientgroundTab1: boolean
  activeBackPatentgroundTab2: boolean
  patientOneActive: boolean
  patientTwoActive: boolean
  ProviderBackgroundTab1: boolean
  ProviderBackgroundTab2: boolean
  providerTab1Active: boolean
  providerTab2Active: boolean
  @ViewChild('collapseOne') collapseOne: ElementRef;
  @ViewChild('collapseTwo') collapseTwo: ElementRef;
  showfirstAccordion: boolean;
  showsecondAccordion: boolean;
  patientTabAct: boolean
  providerTabAct: boolean
  claimDetails: any
  params: any;
  //claimList:any
  activeBackgroundTab1: boolean;
  activeBackgroundTab2: boolean;
  toggleActiveData: boolean;
  toggleActiveExplore: boolean;
  claimListTab: boolean = false
  claimDetailsTab: boolean = false
  claimDetailsActive: any
  claimId: any
  claimTabAct: boolean = false
  patientTabsActive: boolean
  //columnDefs: ColDef[];
  claimDisabled: any
  dashboardId: any;

  widget: Widget;
  displayGrid: boolean;
  participantListDetails: any;
  _broadSub: any;
  headerBreadcrum: any;
  displayStaticDashboard: boolean;

  //Sparkline
  response;
  roleName: any;

  // Case workqueue grid
  CaseWorkQueueActive: boolean;
  TaskWorkQueueActive: boolean;
  caseQueueIndex: number;
  loadCaseList: boolean;
  caseQueueList: any;
  taskQueueIndex: number;
  loadTaskList: boolean;
  taskQueueList: any;
  chartClickedStatusName: any;
  allCaseswidget: Widget;
  userId: any;
  roleid: any;
  orgId: any;
  fromdate: any;
  todate: any;
  chartClickedobjectid: any;
  token: any;
  alltaskwidget: Widget;
  pageService: any;
  showCaseWorkQueue: boolean;
  showTaskWorkQueue: boolean;
  errorMessage: any;
  commonActionService: any;
  _sharedService: any;
  showCaseWorkGridDetails: boolean;
  toggleAccord1: boolean;
  toggleAccord2: boolean;
  currentUser;
  workQueueId: any;
  hoverIconControls: any = '';
  loaderpage = true;
  showDashBoard: boolean = false;
  WorkQueueType: any;

  constructor(
    private pagesService: SharedServiceService,
    private sessionStorage: SessionStorageService,
    private loaderService: CommonLoaderService
  ) { }
  ngOnInit(): void {
    this.currentUser = this.sessionStorage.getObj('currentUser');
    this.roleName = this.currentUser.RoleName;
    this.sessionStorage.setItem('dashboardLoaded', 'N');
    if(this.roleName == 'Admin'){
      this.dashboardId = 1;
      this.loadWidgetData();
      this.displayDashboard = true
    }
    else{
      this.dashboardId = 2;
      this.loadWidgetData();
      this.displayDashboard = true
    }
  }

  loadAHWidgetData() {

  }
  loadWidgetData() {
    this.loaderService.showLoader();
    this.currentUser = this.sessionStorage.getObj('currentUser');
    this.WorkQueueType = this.sessionStorage.getItem('WorkQueueType');
    if(this.WorkQueueType == 'By Batch') {
      this.dashboardId = 1;
    } else {
      this.dashboardId = 2;
    }
    this.showCaseWorkGridDetails = false;
    this.pagesService.getloadWidgetData(this.dashboardId).subscribe({
      next: (res) => {
        this.loaderpage = false;
        this.dashboardData = []
        for (let i = 0; i < res.length; i++) {
            this.dashboardData.push(res[i]);
            this.workQueueId = ''
        }
        this.dashboardData.map(item => {
          item.possibleareachartactive = false;
          item.possiblebarchartactive = true;
        });
      },
      error: (error) => {},
      complete:()=>{
        this.showDashBoard = true;
        this.sessionStorage.setItem('dashboardLoaded', 'Y');
        let loaderStatus = this.sessionStorage.getItem('workqueueLoaded');
        if(loaderStatus == 'Y'){
          this.loaderService.hideLoader();
        }
      }
    });

  }
  getUserQueues() {
    const reqObj = {
      "token": this.token
    }

    this.pagesService.getUserQueue(reqObj).subscribe({
     next: (response) => {
      this.caseQueueList = []
      this.taskQueueList = []
      this.showCaseWorkQueue = false
      this.showTaskWorkQueue = false
      if (response.length > 0) {
        response.map(item => {
          if (item.WorkQueue_Level === 'Case') {
            this.caseQueueList = item.QueList;
            this.showCaseWorkQueue = true
          }
          if (item.WorkQueue_Level === 'Task') {
            this.taskQueueList = item.QueList;
            this.showTaskWorkQueue = true
          }

          if (this.showTaskWorkQueue === true) {
            localStorage.setItem('From Page Name', 'Dashboard');
          }

          if (this.showCaseWorkQueue) {
            const showQueueActive = localStorage.getItem('Dashboard Queue')
            if (showQueueActive === 'Task') {
              this.CaseWorkQueueActive = false
              this.TaskWorkQueueActive = true
              // this.loadTaskWidget(this.taskQueueList[0].WorkQueue_Id)
              localStorage.removeItem('Dashboard Queue')
            } else {
              this.CaseWorkQueueActive = true
              this.TaskWorkQueueActive = false
              // this.loadCaseWidget(this.caseQueueList[0].WorkQueue_Id)
            }
          } else if (this.showTaskWorkQueue) {
            this.CaseWorkQueueActive = false
            this.TaskWorkQueueActive = true
            // this.loadTaskWidget(this.taskQueueList[0].WorkQueue_Id)
          }

          if (this.showCaseWorkQueue) {
            this.loadCaseWidget(this.caseQueueList[0].WorkQueue_Id)
          } else if (this.showTaskWorkQueue) {
            this.loadTaskWidget(this.taskQueueList[0].WorkQueue_Id)
          }
        })
      }

    },
    error:  (error) => {
        this.errorMessage = this.commonActionService.handlePageError('', error);
        setTimeout(() => {
          $('#landingPageErrorPopup').modal('show');
          document.getElementById('landingPageErrorFocus').focus();
        }, 25);
      },
      complete:()=>{
        //complete
      }
    })
  }

  loadCaseWidget(queueId) {
    this.loadCaseList = false;
    this.allCaseswidget = new Widget();
    this.allCaseswidget.type = 'grid';
    if (queueId === 3) {
      const requestObject = {
        "caseId": 0,
        "taskId": 0,
        "tocId": 0,
        "claimantId": 0,
        "pageNo": "",
        "excludedPage": "",
        "userId": this.userId,
        "roleId": this.roleid,
        "token": "",
        "orgId": this.orgId,
        "workQueId": queueId,
        "fromDate": this.fromdate,
        "toDate": this.todate,
        "status": "",
        "priority": "",
        "measureId": this.chartClickedobjectid,
        "filterValue": this.chartClickedStatusName,

      }
      this.allCaseswidget.settings = {
        id: 'myGrid',
        enableFilter: true,
        enableSorting: true,
        enableRowSelection: true,
        apiMethod: 'post',
        apiUrl: `${environment.apiService}Cases/GetWorkQueueData`,
        apiRequest: requestObject,
        actionColumns: [],
        linkableField: 'Case Number',
        rowSelection: 'single',
        floatingFilter: true,
        sidebar: true,
        pagination: true,
        exceloption: true,
        colWidth: 180,
        gridname: 'AllCase',
        firstRowSelection: false,
        noDataErrorMessage: 'No Case Records found. Please contact your administrator for more information',
        exportToExcel: false,
      };

    }
    else {
      const requestObject = {
        "userId": this.userId,
        "orgId": this.orgId,
        "roleId": this.roleid,
        "token": this.token,
        "workQueId": queueId,
        "fromDate": this.fromdate,
        "toDate": this.todate,
      }
      this.allCaseswidget.settings = {
        id: 'myGrid',
        enableFilter: true,
        enableSorting: true,
        enableRowSelection: true,
        apiMethod: 'post',
        apiUrl: `${environment.apiService}Cases/GetWorkQueueData`,
        apiRequest: requestObject,
        actionColumns: [],
        linkableField: 'Case Number',
        rowSelection: 'single',
        floatingFilter: true,
        sidebar: true,
        pagination: true,
        exceloption: true,
        colWidth: 180,
        gridname: 'AllCase',
        firstRowSelection: false,
        noDataErrorMessage: 'No Case Records found. Please contact your administrator for more information',
        exportToExcel: false,
      };
    }
    setTimeout(() => {
      this.loadCaseList = true;
    }, 100);
  }

  loadTaskWidget(queueId) {
    this.loadTaskList = false;
    this.alltaskwidget = new Widget();
    this.alltaskwidget.type = 'grid';
    const requestObject = {
      "caseId": 0,
      "taskId": 0,
      "tocId": 0,
      "claimantId": 0,
      "pageNo": "",
      "excludedPage": "",
      "userId": this.userId,
      "roleId": this.roleid,
      "token": "",
      "orgId": this.orgId,
      "workQueId": queueId,
      "fromDate": this.fromdate,
      "toDate": this.todate,
      "status": "",
      "priority": "",
      "measureId": this.chartClickedobjectid,
      "filterValue": this.chartClickedStatusName
    }
    this.alltaskwidget.settings = {
      id: 'myGrid',
      enableFilter: true,
      enableSorting: true,
      enableRowSelection: true,
      apiMethod: 'post',
      // apiMethod: 'get',
      apiUrl: `${environment.apiService}Cases/GetWorkQueueData`,
      apiRequest: requestObject,
      actionColumns: [],
      // linkableField: 'Task Id',
      linkableField: 'Task Number',
      rowSelection: 'single',
      floatingFilter: true,
      sidebar: true,
      pagination: true,
      exceloption: true,
      colWidth: 180,
      gridname: 'AllTask',
      firstRowSelection: false,
      noDataErrorMessage: 'No task Records found. Please contact your administrator for more information',
      exportToExcel: false,
    };
    setTimeout(() => {
      this.loadTaskList = true
    }, 100);
  }
  reloadDashBoard(event: boolean): void {
    if(event){
      this.sessionStorage.setItem('dashboardLoaded', 'N');
      this.showDashBoard = false;
      this.loadWidgetData();
      // setTimeout(() => {
      //   this.showDashBoard = true;
      // }, 200);
    }
  }
}
