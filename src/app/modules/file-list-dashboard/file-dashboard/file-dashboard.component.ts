import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy, HostListener, ViewChildren, QueryList } from '@angular/core';
import { WidgetSettings } from 'src/app/shared/modal/widgetsettings.modal';
import { Widget } from 'src/app/shared/modal/widget.modal';
import { Subject } from 'rxjs';
import { ModalService } from 'src/app/shared/services/modal.service';

import { HttpClient } from '@angular/common/http';
import { SharedServiceService } from 'src/app/shared/services/sharedservice.service';
import { environment } from 'src/environments/environments';
import { EventEmitterService } from 'src/app/shared/services/eventemitter.service';
import * as Highcharts from 'highcharts';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { SessionStorageService } from 'src/app/shared/services/storage.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { EncryptionService } from 'src/app/shared/services/encryption.service';
import { Options, LabelType } from '@angular-slider/ngx-slider';
declare let $: any;

@Component({
  selector: 'app-file-dashboard',
  templateUrl: './file-dashboard.component.html',
  styleUrls: ['./file-dashboard.component.scss']
})
export class FileDashboardComponent implements OnInit, OnDestroy {
  @Input('dashboardItems') dashboardItems: Array<any>;
  @Input() pageType;
  @Input() workQueueType;

  widgetEvent: Subject<any> = new Subject<any>();
  displayAnalyzer: boolean = false;
  displayProfiler: boolean = false;
  displayProfilerModal: boolean = false;
  displayAnalyzerScatter: boolean = false;
  analyzerWidget;
  analyzerScatterWidget;
  profilerWidget;
  secondaryProfilerWidget;
  showfirstAccordion: boolean = false;
  showsecondAccordion: boolean = false;
  showthirdAccordion: boolean = false;
  indexStart = 0;
  accordionConfiguration: any;
  activeTab: any;
  hoverIconControls: any = '';
  dashboardData: any;
  displayDashboard: boolean = false;
  @ViewChild('collapseOne') collapseOne: ElementRef;
  @ViewChild('collapseTwo') collapseTwo: ElementRef;
  @ViewChild('navContact') navContact: ElementRef;
  @ViewChild('myList') myList: ElementRef;

  claimDetails: any;
  params: any;
  toggleActiveData: boolean;
  toggleActiveExplore: boolean;
  claimId: any;
  dashboardId: any;
  widget: Widget;
  displayGrid: boolean;
  participantListDetails: any;
  analyserParticipantListWidget: any;
  displayAnalyzerParticipant: boolean;
  profilerModalParticipantListWidget: any;
  displayProfilerModalParticipant: boolean;
  grossChartLoader: boolean;
  showDelIcon: boolean;
  deletewidgetdata: any;

  infoLinkClicked: boolean;
  dynamicInformation: any;
  runtimePeriod: any;
  keyArray: string[];

  trendChart: Highcharts.Chart;
  trendChartOptions: any;
  participantLoader: boolean;
  frmTabLoadonly: boolean;
  breadCrumbText: any;
  participantFactId: any;
  primaryProfileName: any;
  primaryProfileValue: any;
  headerBreadcrum: any;

  patientTabAct: boolean;
  activeBackPatientgroundTab1: boolean;
  activeBackPatentgroundTab2: boolean;
  patientOneActive: boolean;
  patientTwoActive: boolean;
  patientTabsActive: boolean;
  claimDetailsActive: any;
  participantListInput: {
    domainID?: any;
    objectID?: any;
    timeID?: any;
    chartTemplateID?: any;
    bandId?: any;
    orgId?: any;
    PatternScore?: any
    measurebandId?: any
  } = {};
  patternparticipantListInput: {
    domainID?: any;
    objectID?: any;
    timeID?: any;
    chartTemplateID?: any;
    bandId?: any;
  } = {};
  loadParticipantList: boolean;
  participantListWidget: Widget;
  patternparticipantListWidget: Widget;
  profilerParticipantListWidget: Widget;
  loadProfilerParticipantList: boolean;
  displaySecondaryProfilerModal: boolean;

  profilerBadgeText: any;
  secondProfilerBadgeText: any;
  dimensionBadgeText: any;
  allowAccordTwoClick: boolean;
  allowAccordOneClick: boolean;
  claimnumber: any;
  breadCrumbTextModal: any;
  secondaryprofileactiveTab: any;
  primaryProfileactiveTab: any;
  secondaryProfileName: any;
  secondaryProfileValue: any;
  participantFactValueEnd: any;
  dummyvalue: any;
  showActionButton1: boolean;
  showActionButton: any;
  showEditButton: boolean;
  showDeleteButton: boolean;
  showbutton: boolean;
  selectedRow: any;
  selectedDatatValue: any;
  selectedRowCount: any;
  accordiontitle: any;
  loadParticipantList1: boolean = false;
  loadParticipantListMeasure: boolean;
  loadParticipantListPattern: boolean;
  appName: any;
  currentUser: any;
  initiatePopup: any;
  chargesId: any;
  chargesNumber: any;
  caseNotes: string;
  selectedCaseType: string;
  caseName: string;
  today: Date;
  date: any;
  chargesName: any;
  caseNumber: any;
  requestUrl: string;
  showSecondAccordionProfilerLabel: boolean;
  CurrentTime: string;
  selectedCaseReason: any;
  hideBreadcrum: boolean = true;
  routeurl: string;
  gridFeatures: any[];
  widgetData1: any;
  edaDashboardTimeId: any;
  searchListParticipant: boolean;
  disableToolBar: boolean;
  caseDetail: any;
  showWorkQueue: boolean;
  infoDisable: boolean;

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
  toggleAccord1: boolean = true;
  toggleAccord2: boolean = true;
  roleName: any;
  loadParticipantWidget: boolean;
  loadAccordionParticipantWidget: boolean;
  dimensionalScatteractiveTab: any;
  hideIcons: boolean;
  selectedCaseDetails: any;
  drildownfirst = false;
  showsecondAccordion1: boolean;
  dimensionalScatterWidget: any;
  tempProfileWidgetDetails: string;

  showLevel1: any;
  nestedMenuItems: any[];
  nestedSubMenuItems: any[];
  subMenuItems: any[] = [];
  caseInitiationForm: FormGroup;
  toggleAccord4: boolean;
  selectedMenu: any;
  visible = true;
  selectable = true;
  removable = true;
  caseInitiationLookups: any;
  searchEntity;
  caseEntityList: any;
  claimIdNew: any;
  caseSourceData: string;
  claimIDValue: any;
  memberId: any;
  caseInitiationDetails: any;
  initiatedDate: any;
  InitiatedCaseId: any;
  gridFeatures1: any[];
  InvestigationFocusGrid: Widget;
  loadInvestigationFocusGrid: boolean;
  showSubMenu: boolean = true;
  loadPopGrid: boolean;
  InvestigationFocusGridPop: Widget;
  menuName: any = 'Claim Group';
  loadMenus: boolean;
  selectedIds: any = '';
  selectedIdsArray: any = [];
  investTagList: any;
  tempProcInvest: string;
  tempDiagInvest: string;
  temporaryTabCheck: boolean;
  selectedCheckBoxValue: any = null;
  showIconOne: boolean;
  claimLevel: string;
  showInitiateCase: boolean;
  dimensionalScatterFactIdForParticipant: any;
  topNTableChartData: any;
  enableSparklineWidgetLoader: boolean;
  profilerBadgeTextArray: any[];
  secondProfilerBadgeTextArray: any[];
  showDimArray: boolean;
  sunBurstWidget: Widget; sunBurstWidget2: Widget; sunBurstWidget3: Widget; sunBurstWidget4: Widget; sunBurstWidget5: Widget;
  sanKeyWidget: Widget;
  sanKeyWidget2: Widget;
  loadStaticChartWidgets: boolean;
  multiAxesWidget: Widget;
  combinedSeriesWidget: Widget;
  showBackbtn: boolean;
  loadSunburstChart1: boolean;
  loadSunburstChart2: boolean;
  loadSankeyChart1: boolean;
  disableCaseInitiation: boolean;
  disableSFCaseInitiation: boolean;

  itemList = [];
  selectedItems = [];
  settings = {};
  sunBurstWidget6: Widget;
  loadSankeyChart2: boolean;
  loadSunburstChart3: boolean;
  mapWidget: Widget;
  loadmapChart: boolean;
  linkAnalysisWidget: Widget;
  loanLinkAnalysis: boolean;
  hideDashboardWidget: boolean;
  currentOrgInfo: any;
  initiateFlag: any;
  selectedOrgId: string;
  newdata: boolean = true;
  newWidget: Widget;

  showToggle = false;
  showTogglePattern = false;
  possiblepiechartactive = false;
  possiblebar1chartactive = false;
  possiblescatterchartactive = false;
  possiblemeasurebandchartactive = false;
  showSelectedChart = false;
  possiblebarchartactive: boolean = false;
  possibleareachartactive: boolean = false;
  possiblescatterbandchartactive: boolean = false;
  @ViewChild("insideElement") insideElement;
  dashboardEDAItems;
  nodeSelectedcsv;
  networkGraphBadgeDetails;
  treemapNew: Widget;
  treemapNHA: boolean;
  sunburstNew: Widget;
  sunburstNHA: boolean;
  geoMapNew: Widget;
  geoMapNewVar: boolean;
  participantBadges = [];
  drilldownAccordionScatter: boolean = false;
  drilldownAccordionParticipantList: boolean = false;
  drilldownSecondAccordionProfiler: boolean = false;
  drilldownDimensionalScatter: boolean = false;
  loaderForDimensionalScatter = false;
  ScatterbreadCrumbTextArray: any[];
  DimensionbreadCrumbTextArray: any[];
  displayPopout: boolean = false;
  orgDropdown: any;
  selectedTimePeriod: any;
  selectedOrganization: boolean;

  baseWidgetDetails;
  options: Options = {
    showTicksValues: true,
    showSelectionBar: true,
    stepsArray: [
      { value: 10 },
      { value: 20 },
      { value: 30 },
      { value: 40 },
      { value: 50 },
      { value: 60 },
      { value: 70 },
      { value: 80 },
      { value: 90 },
      { value: 100 }
    ],
    translate: (value: number, _label: LabelType): string => {
      if (value != 100) {
        // switch (value) {
        return "Top" + " " + value + "%";
        // } 
      } else {
        return value + "%";
      }

    },
  };
  possibledetailedgeomapactive: boolean = false;
  possiblehighlevelgeomapactive: boolean = false;

  isHighChartNetwork: boolean = false;

  possibledetailedtreemapactive: boolean = false;
  possiblehighleveltreemapactive: boolean = false;

  possiblestackedcolumnactive : boolean = false;
  possiblegroupedbaractive : boolean = false;

  @ViewChildren('changeChartType') changeChartType: QueryList <ElementRef>;
  changeChartTypeTouchSelection = null;

  scrollX: any;
  scrollY: any;

  showSecondAccordionProfiler = false;
  minDateFrom;
  constructor(
    private http: HttpClient,
    private modalService: ModalService,
    private userAccess: SharedServiceService,
    private pagesService: SharedServiceService,
    private eventEmitService: EventEmitterService,
    private router: Router,
    private datePipe: DatePipe,
    private storage: SessionStorageService,
    private fb: FormBuilder, private cdref: ChangeDetectorRef,
    private encryptDecrypt: EncryptionService
  ) {
    this.accordionConfiguration = {
      profilerModal: {
        accordionOne: false,
        accordionTwo: false,
        accordionThree: false
      }
    };
    this.userAccess.chartareaclicked.next(undefined);
    this.userAccess.initiateSalesBtn.next(false);
  }

  ngOnInit() {
    this.currentUser = this.storage.getObj('currentUser');
    this.selectedCaseDetails = this.storage.getObj('selectedCaseDetails')
    const currentUser = this.storage.getObj('currentUser');
    this.userId = this.encryptDecrypt.decrypt('DecryptRevoKey11', currentUser.UserId)
    this.roleid = this.encryptDecrypt.decrypt('DecryptRevoKey11', currentUser.RoleId)
    this.orgId = this.encryptDecrypt.decrypt('DecryptRevoKey11', currentUser.OrgId)
    this.token = currentUser.Token
    this.roleName = currentUser.RoleName


    if (this.router.url === '/pages/docReviewTool') {
      this.hideIcons = true
    }
    else {
      this.hideIcons = false
    }

    // Breadcrum Name
    this.pagesService.appBreadCrumName.subscribe(val => {
      if (val !== undefined) {
        this.appName = val;
      }
    });
    this.grossChartLoader = true;


    this.userAccess.breadcrumName.subscribe(val => {
      if (val !== undefined) {
        this.headerBreadcrum = val;
      }
    });
    this.userAccess.dashboardItems.subscribe(val => {
      if (val !== undefined) {
        // this.getRefreshedChartData(val);
      }
    });
    this.userAccess.loadOriginalState.subscribe(val => {
      if (val === true) {
        // retain back to original dashboard page
        this.resetDisplaySettings();
      }
    });
    this.userAccess.dashDelIcon.subscribe(val => {
      if (val === 'true') {
        // retain back to original dashboard page
        this.showDelIcon = true;
      } else {
        this.showDelIcon = false;
      }
    });
    this.patientTabAct = true;
    this.activeBackPatientgroundTab1 = true;
    this.patientTabsActive = true;
    // this.patientTab();
    // this.tabsOnInitFunc();

    this.pagesService.claimIdSub.subscribe(val => {
      this.claimId = val;
    });

    // Initiate Case Popup
    this.today = new Date();
    // this.CurrentTime = new Date().getHours() + ':' + new Date().getMinutes() + ':'+  new Date().getSeconds();
    this.date = this.today.toISOString().split('T')[0];
    this.date = this.datePipe.transform(this.today, 'MM-dd-yyyy');
    this.initiatePopup = this.userAccess.initiateBtn.subscribe(val => {
      this.userAccess.rowDetails.subscribe(val1 => {
        if (val1 !== undefined) {
          // Case Initiate editable flag check
          if (val1['Initiate PrePay Case Editable Flag'] === 'N') {
            this.caseInitiationForm.disable()
            this.disableCaseInitiation = true
          } else {
            this.caseInitiationForm.enable()
            this.disableCaseInitiation = false
          }


          // New case initiation
          this.claimIdNew = val1['Transaction ID'];
          this.caseSourceData = val1['measureCode'] + '-' + val1['measureName']
          this.claimIDValue = val1['Claim ID'];
          this.memberId = val1['Member ID'];
          if (this.widgetData1 && this.widgetData1.DomainId === 6) {
            this.chargesId = val1['Charges ID'];
            this.chargesNumber = val1['Provider ID'];
            this.chargesName = val1['Billing Provider Name'];
            if (this.chargesName !== undefined) {
              this.caseName = 'Program Integrity Case for ' + this.chargesName;
            } else {
            }
          } else if (this.widgetData1 && this.widgetData1.DomainId === 1) {
            this.chargesId = val1['Charges ID'];
            this.chargesNumber = val1['Transaction Header ID'];
            this.chargesName = val1['Billing Provider Name'];
            if (this.chargesName !== undefined) {
              this.caseName = 'Program Integrity Case for Claim ' + this.chargesName;
            } else {
            }
          }
        }
      });
      if (val === true) {
        this.openInitiateCase(); // new case initiation pop-up

        this.caseNotes = '';
        // this.caseName = 'Program Integrity Case for ' + this.chargesName;
        this.selectedCaseType = 'Select Case Type';
        this.selectedCaseReason = 'Select Case Reason';
      }
    });

    this.initiatePopup = this.userAccess.initiateSalesBtn.subscribe(val => {
      this.userAccess.rowDetails.subscribe(val1 => {
        if (val1 !== undefined) {
          this.initiateFlag = val1['Initiate Lead Flag']
          // Case Initiate editable flag check
          if (val1['Initiate Case Editable Flag'] === 'N') {
            // this.caseInitiationForm.disable()
            this.disableSFCaseInitiation = true
          } else {
            // this.caseInitiationForm.enable()
            this.disableSFCaseInitiation = false
          }
          // New case initiation
          this.claimIdNew = val1['Transaction ID'];
          this.caseSourceData = val1['measureCode'] + '-' + val1['measureName']
          this.claimIDValue = val1['Claim ID'];
          this.memberId = val1['Member ID'];
          if (this.widgetData1 && this.widgetData1.DomainId === 6) {
            this.chargesId = val1['Charges ID'];
            this.chargesNumber = val1['Transaction ID'];
            this.chargesName = val1['Provider Name'];
            if (this.chargesName !== undefined) {
              this.caseName = 'Program Integrity Case for ' + this.chargesName;
            } else {
              // this.chargesNumber = val1['Transaction ID'];
              // this.chargesName = val1['Transaction ID'];
              // this.caseName = 'Program Integrity Case for Claim ' + this.chargesName;
            }
          } else if (this.widgetData1 && this.widgetData1.DomainId === 1) {
            this.chargesId = val1['Charges ID'];
            this.chargesNumber = val1['Transaction ID'];
            this.chargesName = val1['Provider Name'];
            if (this.chargesName !== undefined) {
              this.caseName = 'Program Integrity Case for Claim ' + this.chargesName;
            } else {
              // this.chargesNumber = val1['Transaction Header ID'];
              // this.chargesName = val1['Billing Provider Name'];
              // this.caseName = 'Program Integrity Case for Claim ' + this.chargesName;
            }
          }
          this.caseNotes = this.caseName
          this.selectedCaseReason = "--None--"
          this.selectedCaseType = "--None--"
        }
      });
      if (val === true) {
        if (this.initiateFlag != undefined) {
          (<any>$('#investigation-initiate-modal')).modal('show');
        }
        else {
          (<any>$('#activity-initiate-modal')).modal('show');
        }


        // this.caseNotes = '';
        // this.selectedCaseType = 'Select Case Type';
        // this.selectedCaseReason = 'Select Case Reason';
        this.caseNotes = this.caseName
        this.selectedCaseReason = "--None--"
        this.selectedCaseType = "--None--"
      }
    });


    this.userAccess.chartareaclicked.subscribe(val => {
      if (val !== undefined && document.getElementById('gridDiv')) {
        document.getElementById('gridDiv').focus();
        setTimeout(() => {
          document.getElementById('gridDiv').blur();
        }, 1000);
        this.chartClickedStatusName = val.name;
        this.chartClickedobjectid = val.objectid;
        if (this.chartClickedobjectid === 12 || this.chartClickedobjectid === 13 ||
          this.chartClickedobjectid === 14 || this.chartClickedobjectid === 15 ||
          this.chartClickedobjectid === 16) {
        }
        else if (this.chartClickedobjectid === 17) {
          // this.loadMyFilteredTaskTab();
        }
      }
    });

    // Case Initiation form
    this.caseInitiationForm = this.fb.group({
      initiationDate: [null],
      initiatedBy: [null],
      caseName: [null],
      caseSource: [null],
      caseSourceType: [null],
      caseEntityType: [null],
      caseReason: [null],
      caseEntityId: [null],
      investigationFocus: [null],
      caseNotes: [null],
      typeOfDocument: [null],
      letterTemplate: [null],
      additionalMessage: [null],
      caseEntityIdNew: [null]
    });

    //(<any>$('#caseInitiationNew')).modal('hide');
    this.showInitiateCase = false
    this.menuName === 'Claim Group'
    // Temp json for nested menu
    this.nestedMenuItems = [
      {
        menuName: 'Claim Group',
        menuId: '1',
        menuType: 'select',
        children: []
      },
      {
        menuName: 'Claim Services',
        menuId: '2',
        menuType: 'select',
        children: []
      },
      {
        menuName: 'Member',
        menuId: '3',
        menuType: 'select',
        children: []
      },
      {
        menuName: 'Provider',
        menuId: '4',
        menuType: 'select',
        children: []


      },
      {
        menuName: 'Procedure',
        menuId: '5',
        menuType: 'select',
        children: []
      },
      {
        menuName: 'Diagnosis',
        menuId: '7',
        menuType: 'select',
        children: []
      }
    ]

    this.userAccess.dashboardid.subscribe(id => {
        this.clearStaticWidgets()
    })

    this.settings = {
      singleSelection: false,
      text: "Select Fields",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      searchPlaceholderText: 'Search Fields',
      enableSearchFilter: true,
      badgeShowLimit: 5,
      groupBy: "category"
    };
  }

  isShowbase: boolean = false;
  bscollapse: boolean = false;
  isShowDrillDown: boolean = false;
  accordianbase() {
    this.bscollapse = !this.bscollapse;
  }
  baseWidget(widgetInfo) {
    console.log(widgetInfo.eventName);
    
    if (widgetInfo.eventName === 'dimensionalScatter' || 
    widgetInfo.eventName === 'scatter' ||
    widgetInfo.eventName === 'participantsList' ||
    widgetInfo.eventName === 'profilerInModal' ||
    widgetInfo.eventName === 'showSecondaryProfiler') {
      
   
    this.displayAnalyzer = false;
    this.isShowbase = true;
    this.displayPopout = true;
    const widgetItem = this.dashboardItems.find(item => item.widgetId === widgetInfo.id);
    this.baseWidgetDetails = Object.assign({}, widgetItem);
    this.bscollapse = false;
    
    if (Object.prototype.hasOwnProperty.call(this.baseWidgetDetails, 'showToggle')) {
      this.baseWidgetDetails.showToggle = false;
    }
    if (this.baseWidgetDetails.data.chartDetail.container) {
      this.orgDropdown = this.baseWidgetDetails.data.chartDetail.container.inputs[0]
      if (this.baseWidgetDetails.selected) {
        let val
        this.orgDropdown.values.map(item => {
          if (this.baseWidgetDetails.selected == item.id) {
            val = item.timeLimit
          }
        })
        this.selectedTimePeriod = val
      }
      else {
        this.selectedTimePeriod = this.orgDropdown.values[0].timeLimit
      }
      if (this.baseWidgetDetails.selectedOrg) {
        let val
        this.orgDropdown.orgs.map(item => {
          if (this.baseWidgetDetails.selectedOrg == item.orgid) {
            val = item.orgname
          }
        })
        this.selectedOrganization = val
      }
      else {
        this.selectedOrganization = this.orgDropdown.orgs[0].orgname
      }

    }

    // this.displayAnalyzer=true;
   
    if (this.baseWidgetDetails.data["ChartTemplateId"]) {
      this.baseWidgetDetails.ChartTemplateId = this.baseWidgetDetails.data["ChartTemplateId"];
    }
    if (widgetInfo.data.chartTemplateId === 37 || widgetInfo.data.chartTemplateId === 38) {
      this.baseWidgetDetails['widgetSizeDrilldownAccordOne'] = true;
    } else {
      this.baseWidgetDetails['widgetSizeDrilldownAccordOne'] = false;
    }
    this.baseWidgetDetails.displayWidget = false;
    this.baseWidgetDetails.hideInfo = false;
    this.baseWidgetDetails.name = 'analyzer';
    if (
      widgetItem.DomainId === 6 &&
      (this.baseWidgetDetails.ChartType === 'bar' || this.baseWidgetDetails.ChartType === 'areaspline')
    ) {
      this.baseWidgetDetails.ChartType = 'Pattern Score Summary';
    }

    // rpas-127
    if (widgetItem.DomainId === 6) {
      this.baseWidgetDetails.widgetDescription = this.baseWidgetDetails.widgetTitle
      this.baseWidgetDetails.type = 'Pattern Analyzer: '
    } else {
      this.baseWidgetDetails.type = 'Measure Analyzer: '
    }
    // ---
    if (this.baseWidgetDetails.data) {
      if (this.baseWidgetDetails.showSparkline && this.baseWidgetDetails.Has_Access_Flag === 'Y' && this.baseWidgetDetails.Load_Data_Flag === 'Y') {
      //  code implementation
      }
      else {
        delete this.baseWidgetDetails.data;
      }
    }
    if (this.displayPopout && this.baseWidgetDetails.Load_Data_Flag == 'Y') {
      this.setDynamicInforContent(this.baseWidgetDetails.data.chartDetail.Information, 'dashboardInfo', this.baseWidgetDetails.data.chartDetail.Information);
    }
    this.allowAccordOneClick = true;

    this.isShowDrillDown = true;
  }
  }

  baseChartChangeDeduct() {
    this.bscollapse = true;
    this.displayAnalyzer = false;
    this.allowAccordOneClick = true;
    this.drilldownAccordionScatter = false;
    this.drilldownDimensionalScatter = false;
    this.drilldownAccordionParticipantList = false;
    this.displayProfilerModal = false;
    this.showfirstAccordion = false;
    this.showsecondAccordion = false;
    this.loadParticipantList = false;
    this.displaySecondaryProfilerModal = false;
    this.profilerBadgeText = '';
    this.profilerBadgeTextArray = [];
    this.secondProfilerBadgeText = '';
    this.secondProfilerBadgeTextArray = [];
    this.secondaryProfilerWidget = undefined;
    this.profilerWidget = undefined;
    this.storage.setObj('ProfilePatternFVEnd', 0);
    this.storage.setObj('SecProfilePatternBandId', '');
    this.storage.setObj('SecProfilePatternScore', 0);
    this.userAccess.gridHeightForProfilerModal.next(undefined);
    this.userAccess.rowDetailsForParticipant.next(undefined);
    this.storage.setObj('DimensionData', undefined)
    this.storage.removeItem('DimensionalWidgetPointData')
    const requestObj = JSON.parse(localStorage.getItem('scatterWidgetItem'))
    if (requestObj != null) {
      requestObj['type'] = this.showsecondAccordion1 && this.displayAnalyzer ? 'dimension' : 'analyzer';
    }
    localStorage.setItem('scatterWidgetItem', JSON.stringify(requestObj))
    localStorage.removeItem('filterItems')
    localStorage.removeItem('PrimaryRef')
    this.nodeSelectedcsv = '';
    this.networkGraphBadgeDetails = [];
    this.storage.removeItem('scatterdilldowninput');
    this.storage.removeItem('scatterdilldowninput1');
    this.ScatterbreadCrumbTextArray = [];
    this.DimensionbreadCrumbTextArray = []
    this.storage.removeItem('saveCase');
    this.defaultUpDisabled = true;
    this.defaultDownDisabled = true;
    this.defaultDownCount = 0;
    this.defaultUpCount = 0;
    localStorage.removeItem('upCount');
    localStorage.removeItem('downCount');
    this.isShowDrillDown = false;
  }

  changeChartTypeTouch(dashboardItem) {
    this.changeChartTypeTouchSelection = dashboardItem;
    this.dashboardItems.forEach(element => {
      if (Object.prototype.hasOwnProperty.call(element, 'showToggle')) {
        if (element.widgetId != dashboardItem.widgetId) {
          if (element.showToggle === true) {
            element.showToggle = false;
          }
        }
      }
    })
  }

  @HostListener('document:click', ['$event.target'])
  onClick(targetElement) {
    const found = this.changeChartType.toArray().some(el => el.nativeElement.contains(targetElement));
    if (!found && this.changeChartTypeTouchSelection != null) {
      this.changeChartTypeTouchSelection.showToggle = false;
    }
  }

  @HostListener('window:scroll', ['$event']) onScrollEvent(_$event){
    if(!this.displayPopout&&!this.displayAnalyzer&&!this.isShowbase){
      this.getScrollPosition(window.pageXOffset,window.pageYOffset)
    }
  }


  ngAfterViewChecked(): void {
    this.cdref.detectChanges();
  }

  loadInvestigationfocus() {
    this.loadMenus = true
    this.menuSelection(this.nestedMenuItems[0], 0)
  }
  loadCaseDetailsTab() {
    // this.selectedIds = ''
    // this.selectedIdsArray = []
    this.loadMenus = false
    this.selectedCheckBoxValue = null
    this.loadPopGrid = false;
    this.loadInvestigationFocusGrid = false;
  }
  handleCheckBoxEvent(event) {
    if (event) {
      if (!event.Selected) {
        const value = (this.selectedMenu === 'Procedure' && this.claimLevel === 'Line') ? event.selectedRowDetails['Claim Line ID'] : this.selectedMenu === 'Member' ? event.selectedRowDetails['Member ID'] : event.selectedRowDetails['Claim ID']
        const val = this.selectedCheckBoxValue !== null ? this.selectedCheckBoxValue + ',' + value : this.selectedMenu + ':' + value
        this.selectedIdsArray = this.selectedIdsArray.filter(e => e !== val)
        this.selectedIds = this.selectedIdsArray.join(",");
      }
      else {
        if (event.selectedRowDetails) {
          let val
          const value = (this.selectedMenu === 'Procedure' && this.claimLevel === 'Line') ? event.selectedRowDetails['Claim Line ID'] : this.selectedMenu === 'Member' ? event.selectedRowDetails['Member ID'] : event.selectedRowDetails['Claim ID']
          if (this.selectedCheckBoxValue !== null) {
            this.selectedIdsArray.map(item => {
              let tempItem = item
              const splitVal = item.split(',')
              const splitVal1 = item.split(':')
              if (splitVal[0] === this.selectedCheckBoxValue && this.selectedMenu === "Procedure") {
                this.selectedIdsArray = this.selectedIdsArray.filter(e => e !== item)
                tempItem = tempItem + ',' + this.claimLevel + '-' + value
                val = tempItem
              }
              else if (splitVal1[0] === this.selectedMenu && this.selectedMenu !== "Procedure") {
                this.selectedIdsArray = this.selectedIdsArray.filter(e => e !== item)
                tempItem = tempItem + ',' + value
                val = tempItem
                // val = this.selectedCheckBoxValue+ ',' + value
              }
              else {
                // this.selectedIdsArray = this.selectedIdsArray.filter(e => e !== item)
                tempItem = this.selectedCheckBoxValue + ',' + value
                val = tempItem
                // val = this.selectedCheckBoxValue+ ',' + value
              }
            })
          }
          else {
            val = this.selectedMenu + ':' + value
          }
          if (!this.selectedIdsArray.includes(val)) {
            this.selectedIdsArray.push(val)
            this.selectedIds = this.selectedIds === '' ? value : this.selectedIds + ',' + value
          }
        }
      }
    }
  }
  delete(item) {
    this.selectedIdsArray = this.selectedIdsArray.filter(e => e !== item)
  }
  handleInputCheckBoxEvent($event, value) {
    value = value.replace(/\s/g, "")
    const splitval = value.split('-')
    const val = this.selectedMenu + ':' + splitval[0]
    if ($event.target.checked === true) {
      if (!this.selectedIdsArray.includes(val)) {
        this.selectedIdsArray.push(val)
      }
      this.selectedCheckBoxValue = val
    }
    else {
      this.selectedIdsArray = this.selectedIdsArray.filter(e => e !== val)
      this.selectedCheckBoxValue = null
    }
  }
  ngOnChanges() {
    this.toggleAccord1 = true;
  }

  // * Hover Icon Controls
  hoverIn(ind) {
    this.hoverIconControls = ind;
  }
  hoverOut(_ind) {
    this.hoverIconControls = '';
  }

  setWidgetData(widgetData, dashboardItem, widgetRegion) {
    this.widgetData1 = widgetData;
    // Widget Data
    if (widgetData.isSuccess) {
      if (widgetData.ChartTemplateId === 16) {
        //Badge details set for pattern and measure drildown scatter chart 
        this.ScatterbreadCrumbTextArray = widgetData.chartDetail.EdaLevel
      }
      if (dashboardItem.ChartTemplateId === 11 || dashboardItem.ChartTemplateId === 17) {
        if (widgetData.DomainId === 1) {
          this.participantListInput.domainID = widgetData.DomainId;
          this.participantListInput.objectID = widgetData.ObjectId;
          this.participantListInput.chartTemplateID = widgetData.ChartTemplateId;
        } else {
          this.patternparticipantListInput.domainID = widgetData.DomainId;
          this.patternparticipantListInput.objectID = widgetData.ObjectId;
          this.patternparticipantListInput.chartTemplateID = widgetData.ChartTemplateId;
        }
        this.participantListInput.timeID = widgetData.TimeId ? '' : widgetData.TimeId;
        this.participantListInput.orgId = widgetData.orgId

        dashboardItem.displayWidget = false;
        dashboardItem.showSparkline = false;
        dashboardItem.hideInfo = false;
        const url = `${environment.apiService}DataTransaction/GetParticipantList`;
        const reqObj = {
          DomainId: widgetData.DomainId,
          ObjectId: widgetData.ObjectId,
          BandId: '',
          PatternThreshold:
            widgetData.DomainId === 6 && widgetData.data ? widgetData.data.PatternThreshold : '0',
          MeasureChartTemplateId: '',
          TimeId: this.participantListInput.timeID,
          selectedorgid: this.participantListInput.orgId ? this.participantListInput.orgId : '',
          PatternBandId: widgetData.DomainId === 6 ? this.participantListInput.bandId : '',
          OutlierIndicator: '',
          RunId: '',
          TimeTypeId: '',
          DimensionalId: '',
          FactValueStart: '',
          FactValueEnd:
            widgetData.DomainId === 6 && this.participantFactValueEnd
              ? this.participantFactValueEnd
              : '0',
          DimensionName: '',
          FactId: widgetData.DomainId === 1 && this.participantFactId ? this.participantFactId : '',
          PatternParticipentId: widgetData.DomainId === 6 && this.participantFactId ? this.participantFactId : '',
          FactValue: '',
          DimensionValue: '',
          primaryProfileName:
            widgetData.DomainId === 1
              ? this.primaryProfileName
                ? ''
                : this.primaryProfileName
              : '',
          primaryProfileValue:
            widgetData.DomainId === 1
              ? this.primaryProfileValue
                ? ''
                : this.primaryProfileValue
              : '',
          SecondaryProfileName:
            widgetData.DomainId === 1
              ? this.secondaryProfileName
                ? ''
                : this.secondaryProfileName
              : '',
          SecondaryProfileValue:
            widgetData.DomainId === 1
              ? this.secondaryProfileValue
                ? ''
                : this.secondaryProfileValue
              : '',
          DashboardId: '',
          ExplorationMeasure: '',
          ProfileArray: '',
          ProfileString: '',
          // OrgId: ''
        };

        if (this.displayProfilerModal === false) {
          if (widgetData.DomainId === 1) {
            // Case/Task Workqueue grid on search add
            if (widgetData.ObjectId == 11) {
              this.showWorkQueue = true;
              this.loadParticipantListMeasure = false;
            } else {
              this.showWorkQueue = false;
              this.participantListWidget = new Widget();
              //  let participantListWidget: Widget;
              this.participantListWidget.type = 'grid';
              this.participantListWidget.settings = {
                apiMethod: 'POST',
                id: 'myGrid',
                enableFilter: true,
                enableSorting: true,
                enableRowSelection: true,
                rowSelection: 'single',
                apiUrl: url,
                linkableField: widgetData.DomainId === 1 ? 'Transaction Id' : 'Provider ID',
                apiRequest: reqObj,
                actionColumns: [],
                checklocaljson: false,
                // localjson: response,
                floatingOption: true,
                viewFloatingOption: true,
                exceloption: true,
                initiateFloatingOption: true
              };
              this.loadParticipantListMeasure = true;
            }
          } else {
            this.patternparticipantListWidget = new Widget();
            //  let participantListWidget: Widget;
            this.patternparticipantListWidget.type = 'grid';
            this.patternparticipantListWidget.settings = {
              apiMethod: 'POST',
              id: 'myGrid',
              enableFilter: true,
              enableSorting: true,
              enableRowSelection: true,
              rowSelection: 'single',
              apiUrl: url,
              linkableField: widgetData.DomainId === 1 ? 'Transaction Id' : 'Provider ID',
              apiRequest: reqObj,
              actionColumns: [],
              checklocaljson: false,
              // localjson: response,
              floatingOption: true,
              viewFloatingOption: true,
              exceloption: true,
              initiateFloatingOption: true
            };
            this.loadParticipantListPattern = true;
          }
        }
        dashboardItem.plFrmWidgetSave = true;

        // this.searchListParticipant = true;
        this.participantLoader = false;
      } else if (dashboardItem.ChartTemplateId === 28) {
        // Sparkline chart with table 
        this.enableSparklineWidgetLoader = true;

        dashboardItem.hideInfo = false;
        dashboardItem.displayWidget = false;
        dashboardItem.plFrmWidgetSave = false;
        dashboardItem.showSparkline = true
        // dashboardItem.showSparkline = dashboardItem.Load_Data_Flag === 'N' ? false : true
        this.participantLoader = false;
      } else if (widgetData.chartDetail.Dimensions) {
        // console.log(widgetData.chartDetail.Dimensions)

        const widget = new Widget();
        widget.id = widgetData.widgetId;
        widget.data = widgetData.chartDetail.ChartData;
        widget.data.ObjectId = widgetData.ObjectId;
        widget.data.TimeId = widgetData.TimeId != undefined ? widgetData.TimeId : widget.data.TimeId;
        widget.data.orgId = widgetData.orgId != undefined ? widgetData.orgId : widget.data.orgId

        widget.data.id = widgetData.widgetId;

        widget.settings = <WidgetSettings>{
          class: 'ecare-chart',
          id: 'chart'
        };
        widget.location = widgetRegion;
        widgetData.widgetInfo = widget;

        if (widgetData.chartDetail.Dimensions && widgetData.chartDetail.Dimensions.length > 0) {
          dashboardItem.Dimensions = widgetData.chartDetail.Dimensions;
          // this.activeTab = widgetData.chartDetail.Dimensions[0];

          this.dimensionalScatteractiveTab = widgetData.chartDetail.Dimensions[0];
          const currentTab = widgetData.chartDetail.Dimensions[0]
          this.onPrimaryTabChangeDimensionalScatter(currentTab, dashboardItem, 0)

          for (let i = 0; i < widgetData.chartDetail.Dimensions.length; i++) {
            const tabName = widgetData.chartDetail.Dimensions[i].DimensionName;
            if (!dashboardItem[tabName]) {
              
              dashboardItem[tabName] = {
                widgetInfo: JSON.parse(JSON.stringify(widgetData.widgetInfo))
              };
               const chartDataForDimension = widgetData.widgetInfo.data.find((chart: any) => {
                return chart.dimension.DimensionName === tabName;
              });

              if (chartDataForDimension != undefined) {
                dashboardItem[tabName].widgetInfo.data = JSON.parse(
                  JSON.stringify(chartDataForDimension)
                );
              }
            }
          }
        }
        widget.data.TimeId = widgetData.timeId
        // if(widgetData.timeId){
        //   widget.data.TimeId = widgetData.timeId
        // }
      } else if (widgetData.chartDetail.ChartData) {
        if (widgetData.chartDetail.ChartData.Widgettitle !== undefined) {
          if (widgetData.chartDetail.ChartData.Widgettitle !== null) {
            this.accordiontitle = widgetData.chartDetail.ChartData.Widgettitle;
          } else {
            this.accordiontitle = widgetData.chartDetail.ChartData.title;
          }
          localStorage.setItem('acctitlescatter', this.accordiontitle);
        }
        const widget = new Widget();
        if (widgetData.chartDetail.ChartData[0] !== undefined) {
          if (widgetData.chartDetail.ChartData[0].title !== undefined) {
            // condition for static map's
            if (
              widgetData.chartDetail.ChartData[0].title == 'Anamalous Billing in Hospitalizations'
            ) {
              this.disableToolBar = true;
              widget.type = 'map';
            } else if (widgetData.chartDetail.ChartData[0].title == 'Sample Pattern') {
              this.disableToolBar = true;
              widget.type = 'graph';
            } else {
              this.disableToolBar = false;
              widget.type = 'chart';
              this.showCaseWorkGridDetails = false;
            }
          }
        } else {
          if (widgetData.widgetId == '6') {
            this.showCaseWorkGridDetails = true;
          } else {
            widget.type = 'chart';
          }

        }
        // widget.type = 'chart';

        widget.id = widgetData.widgetId;
        widget.data = widgetData.chartDetail.ChartData;
        widget.data.ObjectId = widgetData.ObjectId;
        widget.data.dataLabel = widgetData.Data_Label;
        // widget.data.TimeId = widgetData.TimeId; // commented for timeId not passing in trend chart
        widget.data.TimeId = widgetData.TimeId != undefined ? widgetData.TimeId : widget.data.TimeId;

        if (Number(widgetData.DomainId) == 6) {
          widget.data.TimeId = widgetData.timeId
        }
        widget.data.id = widgetData.widgetId;
        widget.data.chartTemplateId = widgetData.ChartTemplateId

        widget.data.orgId = widgetData.orgId

        //   widget.FactId =this.participantFactId;
        widget.settings = <WidgetSettings>{
          class: 'ecare-chart',
          id: 'chart'
        };
        widget.location = widgetRegion;
        widgetData.widgetInfo = widget;
        if (widgetData.DomainId === 6) {
          if (widgetData.widgetInfo.data[0] !== undefined) {
            widgetData.widgetInfo.data[0].domainID = widgetData.DomainId;
            widgetData.widgetInfo.data[0].dataLabel = widgetData.Data_Label;
          } else {
            widgetData.widgetInfo.data.domainID = widgetData.DomainId;
            widgetData.widgetInfo.data.dataLabel = widgetData.Data_Label;
          }
        }

        if (widgetData.DomainId === 1) {
          if (widgetData.widgetInfo.data[0] !== undefined) {
            widgetData.widgetInfo.data[0].Template = widgetData.Template;
            widgetData.widgetInfo.data[0].domainID = widgetData.DomainId;
          } else {
            widgetData.widgetInfo.data.Template = widgetData.Template;
            widgetData.widgetInfo.data.domainID = widgetData.DomainId;
          }
        }

        if (widgetData.chartDetail.Tabs && widgetData.chartDetail.Tabs.length > 0) {
          dashboardItem.Tabs = widgetData.chartDetail.Tabs;
          this.activeTab = widgetData.chartDetail.Tabs[0];

          if (
            (widgetData.profilerWidgettitle ===
              'Measure Profiler - Secondary Peer Group' ||
              widgetData.profilerWidgettitle ===
              'Pattern Profiler - Secondary Peer Group') && this.temporaryTabCheck == true
          ) {
            // this.secondaryprofileactiveTab = widgetData.chartDetail.Tabs[0];
            const currentTab = widgetData.chartDetail.Tabs[0]
            if (this.displaySecondaryProfilerModal) {
              this.onTabChange(currentTab, dashboardItem, 0)
            } else {
              this.onSecondaryTabChange(currentTab, dashboardItem, 0)
            }
            this.temporaryTabCheck = false;
          } else if (
            widgetData.profilerWidgettitle ===
            'Measure Profiler - Primary Peer Group' && this.temporaryTabCheck == true
          ) {
            this.primaryProfileactiveTab = widgetData.chartDetail.Tabs[0];
            const currentTab = widgetData.chartDetail.Tabs[0]
            this.onPrimaryTabChange(currentTab, dashboardItem, 0)

          } else if (
            widgetData.Widgettitle ===
            'Dimensional Scatter Chart' && this.temporaryTabCheck == true
          ) {
            // .Widgettitle
            this.dimensionalScatteractiveTab = widgetData.chartDetail.Tabs[0];
            const currentTab = widgetData.chartDetail.Tabs[0]
            this.onPrimaryTabChangeDimensionalScatter(currentTab, dashboardItem, 0)
          }
          for (let i = 0; i < widgetData.chartDetail.Tabs.length; i++) {
            const tabName = widgetData.chartDetail.Tabs[i].DimensionName;
            if (!dashboardItem[tabName]) {
              dashboardItem[tabName] = {
                widgetInfo: JSON.parse(JSON.stringify(widgetData.widgetInfo))
              };
              const chartDataForDimension = widgetData.widgetInfo.data.find((chart: any) => {
                return chart.dimension.DimensionName === tabName;
              });

              if (chartDataForDimension != undefined) {
                dashboardItem[tabName].widgetInfo.data = JSON.parse(
                  JSON.stringify(chartDataForDimension)
                );
              }
            }
          }
        } else {
          dashboardItem.data = widgetData;
        }
        dashboardItem.plFrmWidgetSave = false;
        dashboardItem.showSparkline = false;
        // this.searchListParticipant = false;
        
        if (dashboardItem.ChartTemplateId === 37 && !Object.prototype.hasOwnProperty.call(dashboardItem, 'sliderValue')) {
          dashboardItem.sliderValue = 20;
        }
      }
    } else {
      dashboardItem.data = widgetData;
    }
    if (widgetData.ParticipantList) {
      dashboardItem.data = widgetData;
    }
    dashboardItem.displayWidget = true;
    if (this.router.url === '/pages/add' || this.router.url === '/pages/eda') {
      dashboardItem.hideInfo = true;
      dashboardItem.data.chartDetail.ChartData.MeasureTrendRate = '0';

      // localStorage.setItem('timeInfoOnEdaLoad', dashboardItem.data.chartDetail.ChartData.TimeInfo)
    }
    // dashboardItem.hideInfo = true;
    dashboardItem.isVisible = true;
    dashboardItem.refresh = false;
    this.grossChartLoader = false;
    this.drildownfirst = true;
    if (this.displayPopout && dashboardItem.Load_Data_Flag == 'Y') {
      this.setDynamicInforContent(dashboardItem.data.chartDetail.Information, 'dashboardInfo', dashboardItem.data.chartDetail.Information);
    }

    if (dashboardItem.data && dashboardItem.data.chartDetail && dashboardItem.data.chartDetail.container) {
      this.orgDropdown = dashboardItem.data.chartDetail.container.inputs[0]
      if (dashboardItem.selected) {
        let val
        this.orgDropdown.values.map(item => {
          if (dashboardItem.selected == item.id) {
            val = item.timeLimit
          }
        })
        this.selectedTimePeriod = val
      }
      else {
        this.selectedTimePeriod = this.orgDropdown.values[0].timeLimit
      }
      if (dashboardItem.selectedOrg) {
        let val
        this.orgDropdown.orgs.map(item => {
          if (dashboardItem.selectedOrg == item.orgid) {
            val = item.orgname
          }
        })
        this.selectedOrganization = val
      }
      else {
        this.selectedOrganization = this.orgDropdown.orgs[0].orgname
      }

    }
    // this.value = dashboardItem.data.chartDetail.container.inputs.values[0].id ;


  }

  onDemandLoadWidget(dashboardItem, type, values, target) {
    // dashboardItem.refresh = true;
    dashboardItem.Load_Data_Flag = 'Y';
    this.refreshChartData(dashboardItem, type, values, target)
  }

  refreshChartData(dashboardItem, type, values, target) {
    delete dashboardItem.data;

    localStorage.removeItem('filterItems')

    dashboardItem.refresh = true;
    if (type === 'Date Range') {
      dashboardItem.timeId = values[target.selectedIndex].id;
      this.edaDashboardTimeId = dashboardItem.timeId;
      dashboardItem.selected = dashboardItem.timeId;
      this.storage.setItem('timechangeforprofile',dashboardItem.timeId);
      this.selectedTimePeriod = values[target.selectedIndex].timeLimit;
    } else if (type === 'org') {
      // console.log(values[target.selectedIndex])
      let encryptedOrgId = values[target.selectedIndex].orgid.toString()
      dashboardItem.selectedOrg = true
      dashboardItem.selectedOrg = encryptedOrgId
      encryptedOrgId = this.encryptDecrypt.decrypt('DecryptRevoKey11', encryptedOrgId);
      this.selectedOrganization = values[target.selectedIndex].orgname
      // console.log(encryptedOrgId);
      encryptedOrgId = this.encryptDecrypt.encrypt(encryptedOrgId)
      // dashboardItem.orgId = values[target.selectedIndex].OrgID
      dashboardItem.orgId = encryptedOrgId
      // dashboardItem.selectedOrg = dashboardItem.orgId
    }
    dashboardItem.displayWidget = false;
    dashboardItem.hideInfo = false;
    if (this.isShowbase) {
      this.baseChartChangeDeduct();


    }
    // if(dashboardItem.data.chartDetail.container){
    //   this.orgDropdown = dashboardItem.data.chartDetail.container.inputs[0]
    // }
  }
  OnDemandRefreshFromWidget(event){
    this.refreshChartData(event.dashboardItem, event.type, event.values, event.target) 
  }
  onWidgetControlClicked(dashboardItem, action, _dashboarddata) {
    // condition for static map's
    if (
      dashboardItem.widgetDescription === 'Anamalous Billing in Hospitalizations' ||
      dashboardItem.widgetDescription === 'Sample Pattern'
    ) {
      // code implementation
    } else {

      localStorage.removeItem('filterItems')
      let refinedSize;
      switch (action) {
        case 'maximize':
          refinedSize = parseInt(dashboardItem.size) <= 8 ? parseInt(dashboardItem.size) + 4 : 12;
          // save widget size call
          this.resizeDashboard(dashboardItem.widgetId, refinedSize)

          dashboardItem.refresh = true;
          dashboardItem.displayWidget = false;
          dashboardItem.hideInfo = false;
          break;
        case 'minimize':
          refinedSize = parseInt(dashboardItem.size) >= 8 ? parseInt(dashboardItem.size) - 4 : 4;
          //        this.reflowClick(dashboardItem,'');
          // save widget size call
          this.resizeDashboard(dashboardItem.widgetId, refinedSize)

          dashboardItem.refresh = true;
          dashboardItem.displayWidget = false;
          dashboardItem.hideInfo = false;
          break;
        case 'collapse':
          dashboardItem.isVisible = !dashboardItem.isVisible;
          this.hideDashboardWidget = !this.hideDashboardWidget;
          break;
        default:
          //  this.deleteWidgetForDashboard(dashboardItem,dashboarddata);
          break;
      }
      dashboardItem.size = refinedSize > 0 ? refinedSize.toString() : dashboardItem.size;
      this.widgetEvent.next(dashboardItem);
    }
  }

  resizeDashboard(widgetId, size) {
  //   this.userAccess.resizeDashboard(widgetId, size).subscribe({
  //    next: (_res) => {
  //   }, 
  //   error :(error) => {
  //   },
  //   complete:()=>{
  //     //complete
  //   }
  // })
  }
  showPoputWidget(item) {
    const chartEventDetail = {
      eventName: "drilldown",
      id: item.widgetId,
      data: item.data,
      // pointdata: this.pointDataOnClick
    };
    this.handleWidgetEvent(chartEventDetail, 'PopOut', item.data.chartDetail.Information, item);
    // let chartEventDetail = {
    //   name: actionName,
    //   data: this.chartData,
    //   pointdata: this.pointDataOnClick
    // };
    // this.handleWidgetEvent(chartEventDetail,,);
  }

  sliderEvent(fromWidgetName, dashboardItem) {
    let val;
    if (dashboardItem.sliderValue === 10) {
      val = 10
    } else if (dashboardItem.sliderValue === 20) {
      val = 9
    } else if (dashboardItem.sliderValue === 30) {
      val = 8
    } else if (dashboardItem.sliderValue === 40) {
      val = 7
    } else if (dashboardItem.sliderValue === 50) {
      val = 6
    } else if (dashboardItem.sliderValue === 60) {
      val = 5
    } else if (dashboardItem.sliderValue === 70) {
      val = 4
    } else if (dashboardItem.sliderValue === 80) {
      val = 3
    } else if (dashboardItem.sliderValue === 90) {
      val = 2
    } else if (dashboardItem.sliderValue === 100) {
      val = 1
    }
    if (fromWidgetName === 'dashboard') {
      dashboardItem.refresh = true;
      dashboardItem.showReset = false;
      //dashboardItem.sliderValue = dashboardItem.sliderValue;
      dashboardItem.NodeIdCSV = '';
      dashboardItem.NormalizationValue = val;
      dashboardItem.displayWidget = false;
      dashboardItem.hideInfo = false;
    } else if (fromWidgetName === 'scoresummary') {
      this.baseWidgetDetails = Object.assign({}, dashboardItem);
      this.baseWidgetDetails.refresh = true;
      this.baseWidgetDetails.showReset = false;
      //this.baseWidgetDetails.sliderValue = this.baseWidgetDetails.sliderValue;
      this.baseWidgetDetails.NodeIdCSV = '';
      this.baseWidgetDetails.NormalizationValue = val;
      this.baseWidgetDetails.displayWidget = false;
      this.baseWidgetDetails.hideInfo = false;
    }
  }

  removeDrilldownLevels(value) {
    if (value == 'y') {
      this.handleWidgetEvent(this.baseDrilldownData.widgetInfo,
        this.baseDrilldownData.fromWidgetName, this.baseDrilldownData.infoModalData,
        this.baseDrilldownData.dashboardItem)
    } else {
      this.baseDrilldownData = '';
    }
  }

  baseDrilldownData;
  drilldownChange(widgetInfo, fromWidgetName, infoModalData, dashboardItem) {

    if (this.isShowDrillDown == true) {
      if (fromWidgetName == 'dimensionalScatter') {
        if (this.drilldownSecondAccordionProfiler == true ||
          this.drilldownAccordionParticipantList == true || 
         this.drilldownAccordionScatter == true ) {
          this.drilldownChangeShowPopup();
        }
        else {
          this.handleWidgetEvent(widgetInfo, fromWidgetName, infoModalData, dashboardItem)
        }
      }else if(fromWidgetName == 'scatter'){
        if (this.drilldownSecondAccordionProfiler == true ||
          this.drilldownAccordionParticipantList == true || 
         this.drilldownDimensionalScatter == true ) {
          this.drilldownChangeShowPopup();
        }
        else {
          this.handleWidgetEvent(widgetInfo, fromWidgetName, infoModalData, dashboardItem)
        }
      }
      else {
        this.drilldownChangeShowPopup();
      }
    } else {
      this.handleWidgetEvent(widgetInfo, fromWidgetName, infoModalData, dashboardItem)
    }
    this.baseDrilldownData = {
      widgetInfo: widgetInfo, fromWidgetName: fromWidgetName,
      infoModalData: infoModalData, dashboardItem: dashboardItem
    }
  }

  drilldownChangeShowPopup() {
    (<any>$('#data-refresh')).modal('show');
  }

  drilldownModalTitle
  handleWidgetEvent(widgetInfo, fromWidgetName, infoModalData, dashboardItem) {
    console.log('handle widget event');

    localStorage.removeItem('pieSelectedIndex')
    
    if (widgetInfo.eventName === 'drilldown') {
      this.bscollapse = true;
      const widgetItem = this.dashboardItems.find(item => item.widgetId === widgetInfo.id);
      this.baseWidgetDetails = Object.assign({}, widgetItem);
      if ( Object.prototype.hasOwnProperty.call(this.baseWidgetDetails, 'showToggle')) {
        this.baseWidgetDetails.showToggle = false;
      }
      if (this.baseWidgetDetails.data.chartDetail.container) {
        this.orgDropdown = this.baseWidgetDetails.data.chartDetail.container.inputs[0]
        if (this.baseWidgetDetails.selected) {
          let val
          this.orgDropdown.values.map(item => {
            if (this.baseWidgetDetails.selected == item.id) {
              val = item.timeLimit
            }
          })
          this.selectedTimePeriod = val
        }
        else {
          this.selectedTimePeriod = this.orgDropdown.values[0].timeLimit
        }
        if (this.baseWidgetDetails.selectedOrg) {
          let val
          this.orgDropdown.orgs.map(item => {
            if (this.baseWidgetDetails.selectedOrg == item.orgid) {
              val = item.orgname
            }
          })
          this.selectedOrganization = val
        }
        else {
          this.selectedOrganization = this.orgDropdown.orgs[0].orgname
        }

      }

      this.displayAnalyzer = true;
      this.displayPopout = true;
      if (this.baseWidgetDetails.data["ChartTemplateId"]) {
        this.baseWidgetDetails.ChartTemplateId = this.baseWidgetDetails.data["ChartTemplateId"];
      }
      if (widgetInfo.data.chartTemplateId === 37 || widgetInfo.data.chartTemplateId === 38) {
        this.baseWidgetDetails['widgetSizeDrilldownAccordOne'] = true;
      } else {
        this.baseWidgetDetails['widgetSizeDrilldownAccordOne'] = false;
      }
      this.baseWidgetDetails.displayWidget = false;
      this.baseWidgetDetails.hideInfo = false;
      this.baseWidgetDetails.name = 'analyzer';
      if (
        widgetItem.DomainId === 6 &&
        (this.baseWidgetDetails.ChartType === 'bar' || this.baseWidgetDetails.ChartType === 'areaspline')
      ) {
        this.baseWidgetDetails.ChartType = 'Pattern Score Summary';
      }

      // rpas-127
      if (widgetItem.DomainId === 6) {
        this.baseWidgetDetails.widgetDescription = this.baseWidgetDetails.widgetTitle
        this.baseWidgetDetails.type = 'Pattern Analyzer: '
      } else {
        this.baseWidgetDetails.type = 'Measure Analyzer: '
      }
      // ---
      if (this.baseWidgetDetails.data) {
        if (this.baseWidgetDetails.showSparkline && this.baseWidgetDetails.Has_Access_Flag === 'Y') {
// --- implementation
        }
        else {
          delete this.baseWidgetDetails.data;
        }

      }
      this.baseWidgetDetails.Data_Label = dashboardItem.hasOwnProperty('toggleLegend') ? dashboardItem.toggleLegend.toString() : dashboardItem.Data_Label.toString()
      this.isShowbase = true;
      this.allowAccordOneClick = true;
      this.accordionOne();
    } else if (widgetInfo.eventName === 'eda') {
      widgetInfo.data.TimeId = this.edaDashboardTimeId;
      const edaReqObj = widgetInfo;
      const widgetItem = this.dashboardItems.find(item => item.widgetId === widgetInfo.id);
      const edaAction = Object.assign({}, widgetItem);
      
      if (Object.prototype.hasOwnProperty.call(edaAction, 'DefaultChartType')) {
        edaAction.DefaultChartType = null;
      }
      if (Object.prototype.hasOwnProperty.call(edaAction, 'selectedChart')) {
        edaAction.selectedChart = ''
      }
      edaReqObj['factId'] = widgetItem.FactId
      edaReqObj.data['ObjectId'] = widgetItem.ObjectId
      edaReqObj.data['OrgId'] = widgetItem.data.chartDetail.ChartData.OrgId
      const index = JSON.parse(localStorage.getItem('chartIndex'))
      const measureScatterPointData = this.storage.getObj('DimensionalWidgetPointData')
      // const factArray = widgetInfo.pointDataValue.factId && widgetInfo.pointDataValue.factId != '' ?
      //   widgetInfo.pointDataValue.factId.split(',') : edaReqObj['factId'] ? edaReqObj['factId'].split(',') :
      //     measureScatterPointData && measureScatterPointData.factId ? measureScatterPointData.factId.split(',') : ''
      // if (factArray.length > 1) {
      //   index.chartIndex = null
      // }
      const dimensionData = this.storage.getObj('DimensionData')

      const obj = {
        factId: widgetInfo.pointDataValue.factId && widgetInfo.pointDataValue.factId != '' ?
          widgetInfo.pointDataValue.factId : edaReqObj['factId'] ? edaReqObj['factId'] :
            measureScatterPointData && measureScatterPointData.factId ? measureScatterPointData.factId : '',
        pieSelectedIndex: index ? index.chartIndex : undefined,
        dimensionName: widgetInfo.pointDataValue.DimensionName ? widgetInfo.pointDataValue.DimensionName : dimensionData && dimensionData.DimensionName ? dimensionData.DimensionName : null,
        dimensionValue: widgetInfo.pointDataValue.DimensionValue ? widgetInfo.pointDataValue.DimensionValue : dimensionData && dimensionData.DimensionValue ? dimensionData.DimensionValue : null,
        profileName: widgetInfo.pointDataValue.primaryProfileName ? widgetInfo.pointDataValue.primaryProfileName : null,
        profileValue: widgetInfo.pointDataValue.primaryProfileValue ? widgetInfo.pointDataValue.primaryProfileValue : null,
        secProfileName: widgetInfo.pointDataValue.SecondaryProfileName ? widgetInfo.pointDataValue.SecondaryProfileName : null,
        secProfileValue: widgetInfo.pointDataValue.SecondaryProfileValue ? widgetInfo.pointDataValue.SecondaryProfileValue : null,
      };
      localStorage.setItem('pieSelectedIndex', JSON.stringify(obj))
      localStorage.removeItem('chartIndex')
      this.userAccess.measureDetailsToEda1.next(edaReqObj);
      this.router.navigate(['/pages/eda']);
      this.closeModal('profiler-modal')
      // (<any>$('#profiler-modal')).modal('hide');

    } else if (widgetInfo.eventName === 'scatter') {
      this.bscollapse = false;
      this.isShowDrillDown = true;
      const widgetItem = this.dashboardItems.find(item => item.widgetId === widgetInfo.id);
      this.analyzerScatterWidget = Object.assign({}, widgetItem);
      this.ScatterbreadCrumbTextArray = [];
      // console.log(this.analyzerScatterWidget)
      
      if (Object.prototype.hasOwnProperty.call(this.analyzerScatterWidget, 'DefaultChartType')) {
        this.analyzerScatterWidget.DefaultChartType = null;
      }
      if (Object.prototype.hasOwnProperty.call(this.analyzerScatterWidget, 'selectedChart')) {
        this.analyzerScatterWidget.selectedChart = ''
      }
      // localStorage.setItem('scatterWidgetItem', JSON.stringify(this.analyzerScatterWidget))
      this.analyzerScatterWidget.displayWidget = false;
      this.analyzerScatterWidget.hideInfo = false;
      this.analyzerScatterWidget.name = 'analyzer';
      if (this.analyzerScatterWidget.Load_Data_Flag == 'N') {
        this.analyzerScatterWidget.Load_Data_Flag = 'Y'
      }

      this.analyzerScatterWidget.DimensionName = widgetInfo.pointDataValue ? widgetInfo.pointDataValue.DimensionName : '';
      this.analyzerScatterWidget.DimensionValue = widgetInfo.pointDataValue ? widgetInfo.pointDataValue.DimensionValue : '';
      this.analyzerScatterWidget.title = localStorage.getItem('acctitlescatter');
      //Nth level profile Value send Start
      this.dashboardEDAItems = this.dashboardItems.find(item => item.widgetId === widgetInfo.id);
      this.dashboardEDAItems.DimensionName = widgetInfo.pointDataValue ? widgetInfo.pointDataValue.DimensionName : '';
      this.dashboardEDAItems.DimensionValue = widgetInfo.pointDataValue ? widgetInfo.pointDataValue.DimensionValue : '';
      //Nth level profile Value send End
      if (widgetItem.DomainId === 1) {
        this.analyzerScatterWidget.ChartTemplateId = 8;
        //Nth level profile Value send Start
        this.dashboardEDAItems.ChartTemplateId = 8;
        //Nth level profile Value send End
      } else if (widgetItem.DomainId === 6) {
        this.analyzerScatterWidget.ChartTemplateId = 16;

        //Nth level profile Value send Start
        this.dashboardEDAItems.ChartTemplateId = 16;
        this.dashboardEDAItems.PatternThreshold = widgetInfo.data.PatternThreshold;
        if (widgetInfo.location == "analyzer" || widgetInfo.location == 'dashboard') {
          const patternBandId = this.storage.getObj('DimensionalWidgetPointData')
          this.storage.setObj('scatterdilldowninput', patternBandId)
          // this.dashboardEDAItems.BandId = patternBandId != undefined ? patternBandId.bandId : ''
        }
        if (widgetInfo.location == "analyzer" || widgetInfo.location == 'dashboard') {
          const patternScoreId = this.storage.getObj('DimensionalWidgetPointData')
          this.storage.setObj('scatterdilldowninput1', patternScoreId)
          // this.dashboardEDAItems.BandId = patternBandId != undefined ? patternBandId.bandId : ''
        }
        this.dashboardEDAItems.BandId = widgetInfo.pointDataValue
          ? widgetInfo.pointDataValue.bandId
          : '';
        this.dashboardEDAItems.PatternScore = widgetInfo.pointDataValue
          ? widgetInfo.pointDataValue.PatternScore
          : '';
        this.dashboardEDAItems.FactValueEnd = widgetInfo.pointDataValue
          ? widgetInfo.pointDataValue.factValueEnd
          : '';
        //Nth level profile Value send End

        this.analyzerScatterWidget.PatternThreshold = widgetInfo.data.PatternThreshold;
        this.analyzerScatterWidget.BandId = widgetInfo.pointDataValue
          ? widgetInfo.pointDataValue.bandId
          : '';
        this.analyzerScatterWidget.PatternScore = widgetInfo.pointDataValue
          ? widgetInfo.pointDataValue.PatternScore
          : '';
        this.analyzerScatterWidget.FactValueEnd = widgetInfo.pointDataValue
          ? widgetInfo.pointDataValue.factValueEnd
          : '';
        // this.breadCrumbTextArray = widgetInfo.pointDataValue
        //   ? widgetInfo.pointDataValue.breadCrumbText
        //   : '';
      }
      this.drilldownAccordionScatter = true;
      // this.openModal('drilldown-modal');
      // this.displayDimensionalScatter = false;
      this.drilldownDimensionalScatter = false;
      this.drilldownAccordionParticipantList = false;
      this.drilldownSecondAccordionProfiler = false;
      if (this.analyzerScatterWidget.data) {
        delete this.analyzerScatterWidget.data;
      }
      this.displayAnalyzerScatter = true;
      this.allowAccordTwoClick = true;
      this.accordionTwo();
      this.showsecondAccordion = true;
    } else if (widgetInfo.eventName === 'dimensionalScatter') {
      this.bscollapse = false;
      this.isShowDrillDown = true;
      this.tempProfileWidgetDetails = '';
      const widgetItem = this.dashboardItems.find(item => item.widgetId === widgetInfo.id);
      this.dimensionalScatterWidget = Object.assign({}, widgetItem);
      
      if (Object.prototype.hasOwnProperty.call(this.dimensionalScatterWidget, 'DefaultChartType')) {
        this.dimensionalScatterWidget.DefaultChartType = null;
      }
      if (Object.prototype.hasOwnProperty.call(this.dimensionalScatterWidget, 'selectedChart')) {
        this.dimensionalScatterWidget.selectedChart = ''
      }
      this.DimensionbreadCrumbTextArray = [];
      this.dimensionalScatterWidget.displayWidget = false;
      this.dimensionalScatterWidget.hideInfo = false;
      this.dimensionalScatterWidget.name = 'dimensionScatter';

      // passing factId for dimensional scatter chart
      this.dimensionalScatterWidget.FactId = widgetInfo.pointDataValue.factId;

      this.dimensionalScatterWidget.DimensionName = widgetInfo.pointDataValue ? widgetInfo.pointDataValue.DimensionName : '';
      this.dimensionalScatterWidget.DimensionValue = widgetInfo.pointDataValue ? widgetInfo.pointDataValue.DimensionValue : '';
      this.dimensionalScatterWidget.title = localStorage.getItem('acctitlescatter');
      if (widgetItem.DomainId === 1) {
        this.dimensionalScatterWidget.ChartTemplateId = 8;
        this.dimensionalScatterWidget.measurebandId = widgetInfo.pointDataValue
          ? widgetInfo.pointDataValue.measurebandId
          : '';
      } else if (widgetItem.DomainId === 6) {
        this.dimensionalScatterWidget.ChartTemplateId = 16;
        this.dimensionalScatterWidget.PatternThreshold = widgetInfo.data.PatternThreshold;
        this.dimensionalScatterWidget.BandId = widgetInfo.pointDataValue
          ? widgetInfo.pointDataValue.bandId
          : '';
        this.dimensionalScatterWidget.PatternScore = widgetInfo.pointDataValue
          ? widgetInfo.pointDataValue.PatternScore
          : '';
        this.dimensionalScatterWidget.FactValueEnd = widgetInfo.pointDataValue
          ? widgetInfo.pointDataValue.factValueEnd
          : '';
      }
      // this.displayDimensionalScatter = true;
      this.drilldownDimensionalScatter = true;
      //this.openModal('drilldown-modal');
      this.drilldownAccordionScatter = false;
      this.drilldownAccordionParticipantList = false;
      this.drilldownSecondAccordionProfiler = false;
      // this.dimensionArray = widgetInfo.pointDataValue
      //   ? widgetInfo.pointDataValue.profilerBadgeText
      //   : '';
      // this.dimensionArray = this.dimensionArray && this.dimensionArray.length > 0 ? this.dimensionArray : widgetInfo.pointDataValue
      //   ? widgetInfo.pointDataValue.breadCrumbText
      //   : '';
      if (this.dimensionalScatterWidget.data) {
        delete this.dimensionalScatterWidget.data;
      }
      this.displayAnalyzerScatter = false;
      this.allowAccordTwoClick = true;
      this.accordionTwo1();
      this.showsecondAccordion1 = true;

    } else if (widgetInfo.eventName === 'participantsList') {
      this.bscollapse = false;
      this.isShowDrillDown = true;
      const widgetItem = this.dashboardItems.find(item => item.widgetId === widgetInfo.id);
      // this.openModal('drilldown-modal');
      this.drilldownAccordionParticipantList = true;
      if (widgetInfo.location === 'dashboard' || widgetInfo.location === 'analyzer') {
        widgetItem.PatternParticipentId = null;
        if (widgetItem.ChartType === 'Measure Enterprise chart') {
          widgetItem.FactId = null;
        }
      }
      // this.accordionTwo1()
      // this.showsecondAccordion1 = false
      this.storage.setObj('DimensionData', undefined)
      this.accordionThree();
      this.showthirdAccordion = true;
      if (fromWidgetName === 'scatter') {
        this.drilldownAccordionScatter = true;
        this.drilldownSecondAccordionProfiler = false;
      } else {
        this.drilldownAccordionScatter = false;
        this.drilldownSecondAccordionProfiler = false;
      }

      if (fromWidgetName == 'dimensionalScatter') {
        // Dimension Badge Text
        this.dimensionBadgeText = widgetInfo.pointDataValue.DimensionName ? widgetInfo.pointDataValue.DimensionName + ' : ' + widgetInfo.pointDataValue.DimensionValue : '';
        if (this.dimensionBadgeText === undefined) {
          this.dimensionBadgeText = '';
        }

        // passing factId from dimensional scatter chart
        const measureScatterPointData = this.storage.getObj('DimensionalWidgetPointData')
        widgetInfo.pointDataValue.factId = measureScatterPointData != undefined ? measureScatterPointData.factId : ''
        widgetInfo.pointDataValue.measurebandId = measureScatterPointData != undefined ? measureScatterPointData.measurebandId : ''
        this.drilldownDimensionalScatter = true;
        this.drilldownSecondAccordionProfiler = false;
      } else {
        //widgetInfo.pointDataValue = widgetInfo.pointDataValue
        this.dimensionBadgeText = '';
        if (fromWidgetName == 'scoresummary') {
          // this.displayDimensionalScatter = false;
          this.drilldownDimensionalScatter = false;
          this.DimensionbreadCrumbTextArray = [];
        }
        this.drilldownDimensionalScatter = false;
        this.drilldownSecondAccordionProfiler = false;
      }

      this.loadParticipantList = false;
      // }
      if (fromWidgetName == 'profiler') {
        // this.showSecondAccordionProfiler = false;
        this.secondProfilerBadgeText = ''
        this.secondProfilerBadgeTextArray = [];
      }
      if (fromWidgetName == 'profilerInModal') {
        // this.displaySecondaryProfilerModal = false;
        this.secondProfilerBadgeText = ''
        this.secondProfilerBadgeTextArray = [];
      }


      this.breadCrumbText = widgetInfo.pointDataValue
        ? widgetInfo.pointDataValue.breadCrumbText
        : '';
      // if (widgetItem.DomainId === 1 || fromWidgetName == 'Secprofiler' || fromWidgetName == 'scoresummary') {
      //   this.breadCrumbTextArray = widgetInfo.pointDataValue
      //     ? widgetInfo.pointDataValue.breadCrumbText
      //     : '';
      // }

      if (widgetItem.DomainId === 6 && widgetInfo.location === 'analyzerScatter') {
        this.profilerBadgeTextArray = widgetInfo.pointDataValue
          ? widgetInfo.pointDataValue.profilerBadgeText
          : '';
      }
      
      if (Object.prototype.hasOwnProperty.call(widgetInfo.pointDataValue, 'nodeSelectedcsv')) {
        this.networkGraphBadgeDetails = widgetInfo.pointDataValue.nodeSelectedcsv;
        if (widgetInfo.pointDataValue.nodeSelectedcsv.length) {
          const csv = widgetInfo.pointDataValue.nodeSelectedcsv.map(d => {
            return d;
          }).join('|~');
          this.nodeSelectedcsv = csv
        }
      }
      this.participantFactId = widgetInfo.pointDataValue
        ? widgetInfo.pointDataValue.factId === ''
          ? widgetItem.FactId
          : widgetInfo.pointDataValue.factId
        : '';
      this.participantFactValueEnd = widgetInfo.pointDataValue
        ? widgetInfo.pointDataValue.factValueEnd
        : '';
      this.primaryProfileName = widgetInfo.pointDataValue
        ? widgetInfo.pointDataValue.primaryProfileName
        : '';
      this.primaryProfileValue = widgetInfo.pointDataValue
        ? widgetInfo.pointDataValue.primaryProfileValue
        : '';
      this.secondaryProfileName = widgetInfo.pointDataValue
        ? widgetInfo.pointDataValue.SecondaryProfileName
        : '';
      this.secondaryProfileValue = widgetInfo.pointDataValue
        ? widgetInfo.pointDataValue.SecondaryProfileValue
        : '';
      // let secScoreid = this.storage.getObj('SecProfilePatternScore');
      // if (secScoreid !== undefined || secScoreid != 0) {
      //   this.participantListInput.PatternScore = secScoreid;
      // } else {
      this.participantListInput.PatternScore = widgetInfo.pointDataValue
        ? widgetInfo.pointDataValue.PatternScore
        : '';
      // }

      this.participantListInput.measurebandId = widgetInfo.pointDataValue
        ? widgetInfo.pointDataValue.measurebandId
        : '';

      const secfactid = this.storage.getObj('SecProfilePatternBandId');
      if (secfactid !== undefined) {
        this.participantListInput.bandId = secfactid;
      } else {
        this.participantListInput.bandId = widgetInfo.pointDataValue
          ? widgetInfo.pointDataValue.bandId
          : '';
      }
      const patternFactValueEnd = this.storage.getObj('ProfilePatternFVEnd');
      if (patternFactValueEnd !== undefined) {
        this.participantFactValueEnd = patternFactValueEnd;
      } else {
        this.participantFactValueEnd = widgetInfo.pointDataValue
          ? widgetInfo.pointDataValue.factValueEnd
          : '';
      }

      this.participantListInput.domainID = widgetItem.DomainId;
      this.participantListInput.objectID = widgetItem.ObjectId;
      this.participantListInput.chartTemplateID = widgetItem.ChartTemplateId;
      if (widgetItem.DomainId === 1) {
        this.participantListInput.timeID = widgetInfo.data
          ? widgetInfo.data.TimeId === '' || widgetInfo.data.TimeId === null
            ? widgetItem.timeId
            : widgetInfo.data.TimeId
          : '';

        this.participantListInput.orgId = widgetItem.orgId

      } else if (widgetItem.DomainId === 6) {
        if (widgetItem.ChartTemplateId === 15) {
          if (widgetInfo.data[0] !== undefined) {
            this.participantListInput.timeID = widgetInfo.data[0].TimeId
              ? widgetInfo.data[0].TimeId
              : '';

            this.participantListInput.orgId = widgetInfo.data[0].orgId
              ? widgetInfo.data[0].orgId : '';
          } else {
            this.participantListInput.timeID = widgetInfo.data
              ? widgetInfo.data.TimeId === '' || widgetInfo.data.TimeId === null
                ? widgetItem.timeId
                : widgetInfo.data.TimeId
              : '';
            this.participantListInput.orgId = widgetItem.orgId
          }
        } else if (widgetItem.ChartTemplateId === 14) {
          this.participantListInput.timeID = widgetInfo.data
            ? widgetInfo.data.TimeId === '' || widgetInfo.data.TimeId === null
              ? widgetItem.timeId
              : widgetInfo.data.TimeId
            : '';
          this.participantListInput.orgId = widgetItem.orgId
        } else if (widgetItem.ChartTemplateId === 16) {
          this.participantListInput.timeID = widgetInfo.data
            ? widgetInfo.data.TimeId === '' || widgetInfo.data.TimeId === null
              ? widgetItem.timeId
              : widgetInfo.data.TimeId
            : '';
          this.participantListInput.orgId = widgetItem.orgId
        }
      }

      //dashboardItem.displayWidget = false;
      // this.participantLoader = true ;
      // this.domainID = widgetData.DomainId;
      // this.objectID = widgetData.ObjectId;
      // this.timeID = widgetData.TimeId;

      const dimensionData = this.storage.getObj('DimensionData')

      const stackedDimensionData = JSON.parse(localStorage.getItem('scatterWidgetItem'))

      // let url = `${environment.apiService}Charts/GetParticipantList`;
      //const url = `${environment.sapphireService}DataTransaction/GetGridData`;
      const reqObj = {
        DomainId: widgetItem.DomainId,
        ObjectId: widgetItem.ObjectId,
        BandId: '',
        // BandId: widgetInfo.pointDataValue.bandId,
        PatternThreshold:
          widgetItem.DomainId === 6 && widgetInfo.data.PatternThreshold
            ? widgetInfo.data.PatternThreshold
            : '0',
        MeasureChartTemplateId: '',
        TimeId: this.participantListInput.timeID,
        selectedorgid: this.participantListInput.orgId ? this.participantListInput.orgId : '',
        PatternBandId: widgetItem.DomainId === 6 ? this.participantListInput.bandId : '',
        PatternScoreId: widgetItem.DomainId === 6 ? this.participantListInput.PatternScore ? this.participantListInput.PatternScore : '' : '',
        OutlierIndicator: '',
        RunId: '',
        TimeTypeId: '',
        DimensionalId: '',
        FactValueStart: '',
        FactValueEnd:
          widgetItem.DomainId === 6 && this.participantFactValueEnd
            ? this.participantFactValueEnd
            : '0',
        DimensionName: widgetInfo.pointDataValue.DimensionName != '' && widgetInfo.pointDataValue.DimensionName != undefined ? widgetInfo.pointDataValue.DimensionName : dimensionData != undefined ? dimensionData.DimensionName : '',
        FactId: widgetItem.DomainId === 1 ? (this.participantFactId
          ? this.participantFactId
          : this.dimensionalScatterFactIdForParticipant ? this.dimensionalScatterFactIdForParticipant : widgetItem.FactId
            ? widgetItem.FactId
            : '') : undefined,
        PatternParticipentId: widgetItem.DomainId === 6 ? (this.participantFactId
          ? this.participantFactId
          : widgetItem.FactId
            ? widgetItem.FactId : widgetItem.PatternParticipentId ? widgetItem.PatternParticipentId : '') : undefined,
        FactValue: '',
        DimensionValue: widgetInfo.pointDataValue.DimensionValue != '' && widgetInfo.pointDataValue.DimensionValue != undefined ? widgetInfo.pointDataValue.DimensionValue : dimensionData != undefined ? dimensionData.DimensionValue : '',
        primaryProfileName: widgetItem.DomainId === 1 ? this.primaryProfileName : '',
        primaryProfileValue: widgetItem.DomainId === 1 ? this.primaryProfileValue : '',
        SecondaryProfileName: this.secondaryProfileName, // widgetItem.DomainId === 1 ? this.secondaryProfileName : '',
        SecondaryProfileValue: this.secondaryProfileValue, // widgetItem.DomainId === 1 ? this.secondaryProfileValue : '',
        DashboardId: '',
        ExplorationMeasure: '',
        ProfileArray: '',
        ProfileString: '',
        // OrgId: '',
        SortValue: [

        ],
        Filtervalue: [
        ],
        DimensionFilterValues: widgetInfo.pointDataValue.dimensionStackedValues != undefined ? widgetInfo.pointDataValue.dimensionStackedValues : stackedDimensionData.DimensionFilterValues != undefined && stackedDimensionData.DimensionFilterValues != '' ? stackedDimensionData.DimensionFilterValues : undefined,
        StackedDimension1: widgetInfo.pointDataValue.dimensionStackedValues1 != undefined ? widgetInfo.pointDataValue.dimensionStackedValues1 : stackedDimensionData.StackedDimension1 != undefined && stackedDimensionData.StackedDimension1 != '' ? stackedDimensionData.StackedDimension1 : undefined,
        StackedDimension2: widgetInfo.pointDataValue.dimensionStackedValues2 != undefined ? widgetInfo.pointDataValue.dimensionStackedValues2 : stackedDimensionData.StackedDimension2 != undefined && stackedDimensionData.StackedDimension2 != '' ? stackedDimensionData.StackedDimension2 : undefined,
        NodeIdCSV: this.nodeSelectedcsv ? this.nodeSelectedcsv : '',
        MeasureBandIdCSV: this.participantListInput.measurebandId != '' ? this.participantListInput.measurebandId : '',     
        BurstSelectionId: Object.prototype.hasOwnProperty.call(widgetInfo.pointDataValue, 'sunburstId') ? widgetInfo.pointDataValue.sunburstId : undefined,
        GeoMapCode: Object.prototype.hasOwnProperty.call(widgetInfo.pointDataValue, 'geoMapData') ? widgetInfo.pointDataValue.geoMapData : undefined,
        TreeMapSelectionId: Object.prototype.hasOwnProperty.call(widgetInfo.pointDataValue, 'treeMapId') ? widgetInfo.pointDataValue.treeMapId : undefined
      };
      this.storage.setObj('saveCase', reqObj);
      this.participantBadges = [];
      if (widgetItem.DomainId === 1) {
        this.gridFeatures = [];
        this.loadAccordionParticipantWidget = true;
      //   this.pagesService.getTransactionParticipant(reqObj).subscribe({
      //   next:  (val) => {
      //     this.gridFeatures = val.gridDetails[0];
      //     this.participantBadges = val.BadgeDetails;
      //     this.gridFeatures['reqObj'] = reqObj;
      //     this.gridFeatures['floatingOption'] = true;
      //     this.gridFeatures['viewFloatingOption'] = true;
      //     this.gridFeatures['initiateFloatingOption'] = true;
      //     reqObj["InstanceId"] = this.gridFeatures["Grid Instance ID"];
      //     if (this.gridFeatures) {
      //       this.participantListWidget = new Widget();
      //       //  let participantListWidget: Widget;
      //       // this.participantListWidget.type = this.gridFeatures['Grid Name'];
      //       const url = `${environment.apiService}DataTransaction/GetGridData`
      //       this.participantListWidget.type = widgetItem.DomainId === 6 ? this.gridFeatures['Grid Name'] : this.gridFeatures['Grid Name'];
      //       // this.participantListWidget.type = widgetItem.DomainId === 6 ? this.gridFeatures['Grid Name'] : 'Type 5';
      //       this.participantListWidget.settings = {
      //         apiMethod: 'POST',
      //         apiUrl: url,
      //         apiRequest: reqObj,
      //         gridname: 'measureParticipant',
      //         gridFeatures: this.gridFeatures
      //       };
      //       this.loadAccordionParticipantWidget = false;
      //       this.loadParticipantList = true;
      //     }
      //   },
      //   error:(err)=>{
      //     //error
      //   },
      //   complete:()=>{
      //     //complete
      //   }
      // });
      } else {
        // changing into new grid format
        this.loadAccordionParticipantWidget = true;
        reqObj["PatternParticipentId"] = reqObj["PatternParticipentId"] && reqObj["PatternParticipentId"] == "" ? this.secondaryProfilerWidget.PatternParticipentId : reqObj["PatternParticipentId"]
        // this.pagesService.getPatternParticipant(reqObj).subscribe({
        // next:  (val) => {
        //   this.gridFeatures = val.gridDetails[0];
        //   this.participantBadges = val.BadgeDetails;
        //   this.gridFeatures['reqObj'] = reqObj;
        //   this.gridFeatures['floatingOption'] = true;
        //   this.gridFeatures['viewFloatingOption'] = true;
        //   this.gridFeatures['initiateFloatingOption'] = true;
        //   reqObj["InstanceId"] = this.gridFeatures["Grid Instance ID"];
        //   const url = `${environment.apiService}DataTransaction/GetPatternParticipantDataList`;
        //   if (this.gridFeatures) {
        //     this.participantListWidget = new Widget();
        //     this.participantListWidget.type = this.gridFeatures['Grid Name'];
        //     this.participantListWidget.settings = {
        //       apiMethod: 'POST',
        //       apiUrl: url,
        //       apiRequest: reqObj,
        //       gridname: 'patternParticipant',
        //       gridFeatures: this.gridFeatures
        //     };
        //     this.loadAccordionParticipantWidget = false;
        //     this.loadParticipantList = true;
        //   }
        // },
        // error : (err)=>{
        //   //error
        // },
        // complete:()=>{
        //   //complete
        // }});
      }
    } else if (widgetInfo.eventName === 'profilerInModal') {
      this.bscollapse = false;
      this.isShowDrillDown = true;
      this.dashboardEDAItems = this.dashboardItems.find(item => item.widgetId === widgetInfo.id);
      
      if (Object.prototype.hasOwnProperty.call(widgetInfo.pointDataValue, 'nodeSelectedcsv')) {
        if (widgetInfo.pointDataValue.nodeSelectedcsv.length) {
          const csv = widgetInfo.pointDataValue.nodeSelectedcsv.map(d => {
            return d;
          }).join('|~');
          this.nodeSelectedcsv = csv
        }
      }
      this.dashboardEDAItems.nodeSelectedcsv = this.nodeSelectedcsv ? this.nodeSelectedcsv : '';
      this.dashboardEDAItems.sunburstId =Object.prototype.hasOwnProperty.call(widgetInfo.pointDataValue, 'sunburstId') ? widgetInfo.pointDataValue.sunburstId : undefined,
      this.dashboardEDAItems.geoMapData = Object.prototype.hasOwnProperty.call(widgetInfo.pointDataValue, 'geoMapData') ? widgetInfo.pointDataValue.geoMapData : undefined,
      this.dashboardEDAItems.treeMapId = Object.prototype.hasOwnProperty.call(widgetInfo.pointDataValue, 'treeMapId') ? widgetInfo.pointDataValue.treeMapId : undefined,
      this.dashboardEDAItems.dimensionStackedValues = widgetInfo.pointDataValue.dimensionStackedValues ? widgetInfo.pointDataValue.dimensionStackedValues : '';
      this.dashboardEDAItems.dimensionStackedValues1 = widgetInfo.pointDataValue.dimensionStackedValues1 ? widgetInfo.pointDataValue.dimensionStackedValues1 : '';
      this.dashboardEDAItems.dimensionStackedValues2 = widgetInfo.pointDataValue.dimensionStackedValues2 ? widgetInfo.pointDataValue.dimensionStackedValues2 : '';
      if (!Object.prototype.hasOwnProperty.call(widgetInfo.pointDataValue, 'measurebandId')) {
        const measureBand = this.storage.getObj('DimensionalWidgetPointData');
        this.dashboardEDAItems.measurebandId = measureBand != undefined ? measureBand.measurebandId : ''
      } else {
        this.dashboardEDAItems.measurebandId = widgetInfo.pointDataValue
          ? widgetInfo.pointDataValue.measurebandId
          : '';
      }
      this.participantLoader = true;
      this.drilldownSecondAccordionProfiler = false;
      const widgetItem = this.dashboardItems.find(item => item.widgetId === widgetInfo.id);

      // if(fromWidgetName != 'scatter' && fromWidgetName != 'dimensionalScatter') {
      // this.displayProfilerModal = true;
      // this.accordionConfiguration.profilerModal.accordionOne = true;
      // this.openModal('profiler-modal');
      // this.showSecondAccordionProfilerLabel = true;
      // }
      //  this.openModal('drilldown-modal')
      if (widgetInfo.location == "dimensionalScatter") {
        this.showDimArray = true
        const measureScatterPointData = this.storage.getObj('DimensionalWidgetPointData')
        widgetItem.FactId = measureScatterPointData != undefined ? measureScatterPointData.factId : ''
        setTimeout(() => {
          this.drilldownAccordionParticipantList = false;
          this.drilldownSecondAccordionProfiler = true;
          this.allowAccordTwoClick = true;
          this.accordionTwo1();
        }, 500)
      } else {
        this.showDimArray = false
        widgetItem.FactId = widgetInfo.pointDataValue ? widgetInfo.pointDataValue.factId : '';
        setTimeout(() => {
          this.drilldownAccordionParticipantList = false;
          this.drilldownSecondAccordionProfiler = true;
          this.allowAccordTwoClick = true;
          this.accordionTwo();
        }, 500)
      }
    } else if (widgetInfo.eventName === 'showSecondaryProfiler') {
      this.isShowDrillDown = true;
      this.bscollapse = false;
      this.participantLoader = true;
      this.drilldownSecondAccordionProfiler = false;
      // if(fromWidgetName != 'scatter') {
      //   this.openModal('profiler-modal');
      //   this.displayProfilerModal = true;
      //   this.showSecondAccordionProfilerLabel = true;
      // }
      // this.openModal('drilldown-modal')
      if (this.displayProfilerModal === true) {
        this.displaySecondaryProfilerModal = true;

        this.displayProfilerModalParticipant = false;
        this.accordionConfiguration.profilerModal.accordionTwo = false;
        this.accordionConfiguration.profilerModal.accordionOne = false;
        this.accordionConfiguration.profilerModal.accordionThree = true;
      } else {
        setTimeout(() => {
          this.drilldownAccordionParticipantList = false;
          this.drilldownSecondAccordionProfiler = true;
          this.showSecondAccordionProfilerLabel = false;
          this.allowAccordTwoClick = true;
          this.accordionTwo();
        }, 500)

      }

      // Start New Profile
      this.dashboardEDAItems = this.dashboardItems.find(item => item.widgetId === widgetInfo.id);
      
      if (!Object.prototype.hasOwnProperty.call(widgetInfo.pointDataValue, 'PatternScore')) {
        const patternScoreId = this.storage.getObj('scatterdilldowninput1');
        this.dashboardEDAItems.PatternScore = patternScoreId != undefined ? patternScoreId.PatternScore : ''
      } else {
        this.dashboardEDAItems.PatternScore = widgetInfo.pointDataValue
          ? widgetInfo.pointDataValue.PatternScore
          : '';
      }
      this.dashboardEDAItems.FactValueEnd = widgetInfo.pointDataValue
        ? widgetInfo.pointDataValue.factValueEnd
        : '';
      this.dashboardEDAItems["PatternParticipentId"] = widgetInfo.pointDataValue
        ? widgetInfo.pointDataValue.factId
        : '';
        
      if (!Object.prototype.hasOwnProperty.call(widgetInfo.pointDataValue, 'bandId')) {
        const patternBandId = this.storage.getObj('scatterdilldowninput');
        this.dashboardEDAItems.BandId = patternBandId != undefined ? patternBandId.bandId : ''
      } else {
        this.dashboardEDAItems.BandId = widgetInfo.pointDataValue
          ? widgetInfo.pointDataValue.bandId
          : '';
      }
      // End New Profile
    } else if (widgetInfo.eventName === 'drilldowntochart') {
      if (fromWidgetName != 'scoresummary') {    
        if (Object.prototype.hasOwnProperty.call(widgetInfo.pointDataValue, 'nodeSelectedcsv')) {
          if (widgetInfo.pointDataValue.nodeSelectedcsv.length) {
            const csv = widgetInfo.pointDataValue.nodeSelectedcsv.map(d => {
              return d;
            }).join('|~');
            this.nodeSelectedcsv = csv
          }
        }
        dashboardItem.refresh = true;
        dashboardItem.showReset = true;
        dashboardItem.NodeIdCSV = this.nodeSelectedcsv;
        dashboardItem.displayWidget = false;
        dashboardItem.hideInfo = false;
      } else {
        
        if (Object.prototype.hasOwnProperty.call(widgetInfo.pointDataValue, 'nodeSelectedcsv')) {
          if (widgetInfo.pointDataValue.nodeSelectedcsv.length) {
            const csv = widgetInfo.pointDataValue.nodeSelectedcsv.map(d => {
              return d;
            }).join('|~');
            this.nodeSelectedcsv = csv
          }
        }
        this.baseWidgetDetails = Object.assign({}, dashboardItem);
        this.baseWidgetDetails.showReset = true;
        this.baseWidgetDetails.refresh = true;
        this.baseWidgetDetails.NodeIdCSV = this.nodeSelectedcsv;
        this.baseWidgetDetails.displayWidget = false;
        this.baseWidgetDetails.hideInfo = false;
      }

    }
   
    this.temporaryTabCheck = true;
    // Set Clicked Measure data shown in drilldown modal    
    if (fromWidgetName === 'PopOut') {
      if (widgetInfo.data.length) {
        this.drilldownModalTitle = widgetInfo.data[0].title
      } else {
        this.drilldownModalTitle = widgetInfo.data.title
      }
      // set information modal data and runtime data
      // if(widgetInfo.eventName !== 'dimensionalScatter'&&widgetInfo.eventName !== 'scatter'&&this.analyzerWidget.Load_Data_Flag=='Y'&&!this.displayPopout){
      if (widgetInfo.eventName !== 'dimensionalScatter' && widgetInfo.eventName !== 'scatter' && widgetInfo.eventName !== 'scatter' && this.baseWidgetDetails.Load_Data_Flag == 'Y') {
        this.setDynamicInforContent(infoModalData, 'dashboardInfo', infoModalData);
      }

      // }

      if (widgetInfo.data.TimeInfo !== undefined) {
        this.runtimePeriod = widgetInfo.data.TimeInfo;
        this.currentOrgInfo = widgetInfo.data.OrgName;
      } else if (widgetInfo.data.TimeInfo === undefined) {
        this.runtimePeriod = widgetInfo.data[0].TimeInfo;
        this.currentOrgInfo = widgetInfo.data[0].OrgName;
      }
    }

    if (fromWidgetName === 'dashboard' || fromWidgetName === 'scoresummary') {
      if (widgetInfo.data.length) {
        this.drilldownModalTitle = widgetInfo.data[0].title
      } else {
        this.drilldownModalTitle = widgetInfo.data.title
      }
      // set information modal data and runtime data
      // this.setDynamicInforContent(infoModalData, 'dashboardInfo', infoModalData);
      if (!this.displayPopout) {
        this.setDynamicInforContent(infoModalData, 'dashboardInfo', infoModalData);
      }

      if (widgetInfo.data.TimeInfo !== undefined) {
        this.runtimePeriod = widgetInfo.data.TimeInfo;
        this.currentOrgInfo = widgetInfo.data.OrgName;
      } else if (widgetInfo.data.TimeInfo === undefined) {
        this.runtimePeriod = widgetInfo.data[0].TimeInfo;
        this.currentOrgInfo = widgetInfo.data[0].OrgName;
      }
    }
  }

  clearNodeFilter(dashboardItem) {
    dashboardItem.refresh = true;
    dashboardItem.showReset = false;
    dashboardItem.NodeIdCSV = null;
    dashboardItem.displayWidget = false;
    dashboardItem.hideInfo = false;
  }

  resetDisplaySettings() {
    this.displayProfiler = false;
    // this.userAccess.fetchProfileLevels.next(undefined);
    this.displayAnalyzer = false;
    this.displayPopout = false;
    this.orgDropdown = []
    // this.showSecondAccordionProfiler = false;
    setTimeout(() => {
      this.toggleAccord1 = true;
    }, 500);

    this.drilldownAccordionScatter = false;
    // this.displayDimensionalScatter = false;
    this.drilldownDimensionalScatter = false;
    this.drilldownAccordionParticipantList = false;

    this.displayProfilerModal = false;
    this.showfirstAccordion = false;
    this.showsecondAccordion = false;
    this.loadParticipantList = false;

    this.displaySecondaryProfilerModal = false;
    this.breadCrumbText = '';
    this.profilerBadgeText = '';
    this.profilerBadgeTextArray = [];
    this.secondProfilerBadgeText = '';
    this.secondProfilerBadgeTextArray = [];
    this.secondaryProfilerWidget = undefined;
    this.profilerWidget = undefined;
    this.storage.setObj('ProfilePatternFVEnd', 0);
    this.storage.setObj('SecProfilePatternBandId', '');
    this.storage.setObj('SecProfilePatternScore', 0);
    this.userAccess.gridHeightForProfilerModal.next(undefined);
    this.userAccess.rowDetailsForParticipant.next(undefined);

    this.storage.setObj('DimensionData', undefined)
    this.storage.removeItem('DimensionalWidgetPointData')
    const requestObj = JSON.parse(localStorage.getItem('scatterWidgetItem'))
    if (requestObj != null) {
      requestObj['type'] = this.showsecondAccordion1 && this.displayAnalyzer ? 'dimension' : 'analyzer';
    }
    localStorage.setItem('scatterWidgetItem', JSON.stringify(requestObj))
    localStorage.removeItem('filterItems')
    localStorage.removeItem('PrimaryRef')
    this.nodeSelectedcsv = '';
    this.networkGraphBadgeDetails = [];
    this.storage.removeItem('scatterdilldowninput');
    this.storage.removeItem('scatterdilldowninput1');
    this.ScatterbreadCrumbTextArray = [];
    this.DimensionbreadCrumbTextArray = []
    this.storage.removeItem('saveCase');
    setTimeout(() => {
      window.scrollBy(this.scrollX, this.scrollY);
    }, 100);
    this.defaultUpDisabled = true;
    this.defaultDownDisabled = true;
    this.defaultDownCount = 0;
    this.defaultUpCount = 0;
    localStorage.removeItem('upCount');
    localStorage.removeItem('downCount');
    this.ClassSetFullView = 'default';
    this.isShowbase = false;
    this.isShowDrillDown = false;
    this.storage.setItem('timechangeforprofile',"");
  }

  accordionOne() {
    this.showfirstAccordion = !this.showfirstAccordion;
    this.showsecondAccordion = false;
    this.showthirdAccordion = false;
  }

  accordionPopupProfilerOne() {
    this.showfirstAccordion = !this.showfirstAccordion;
    this.showsecondAccordion = false;
    this.showthirdAccordion = false;
  }

  accordionOneTabActive(_tabname) {

    //  this.activeTab.DimensionName = tabname ;
  }

  accordionTwo() {
    this.showsecondAccordion = !this.showsecondAccordion;
    this.showthirdAccordion = false;
    this.showsecondAccordion1 = false;
  }

  accordionTwo1() {
    this.showsecondAccordion = false;
    this.showsecondAccordion1 = !this.showsecondAccordion1;
    this.showthirdAccordion = false;
  }

  accordionTwoTabActive(_tabname) {
    //   this.activeTab.DimensionName = tabname ;
  }
  accordionThree() {
    this.showthirdAccordion = !this.showthirdAccordion;
    this.showsecondAccordion = false;
    this.showsecondAccordion1 = false;
  }

  onPrimaryTabChange(currentTab, dashboardItem, _i) {
    // this.primaryProfileactiveTab = currentTab;
    // this.activeTab = currentTab;
    // console.log(this.primaryProfileactiveTab)
    // console.log(dashboardItem)
    //const index = i;
    this.temporaryTabCheck = false;
    const requestObj = this.storage.getObj('profilerIPObject')

    requestObj['ProfileGroupName'] = currentTab.DimensionName;
    this.storage.setObj('profilerIPObject', requestObj)

    requestObj['primaryProfileName'] = undefined;
    requestObj['primaryProfileValue'] = undefined;
    // requestObj['tabIndex'] = index + 1;
    requestObj['Title'] = dashboardItem.widgetTitle;

    requestObj['DimensionFilterValues'] = dashboardItem.StackedDimensionValue;
    requestObj['StackedDimension1'] = dashboardItem.StackedDimensionValue1;
    requestObj['StackedDimension2'] = dashboardItem.StackedDimensionValue2;
    requestObj['selectedorgid'] = dashboardItem.orgId ? dashboardItem.orgId : ''
    requestObj['OrgId'] = undefined
    requestObj['PatternParticipentId'] = dashboardItem.DomainId === 6 ? (this.participantFactId
      ? this.participantFactId
      : dashboardItem.FactId
        ? dashboardItem.FactId : dashboardItem.PatternParticipentId ? dashboardItem.PatternParticipentId :
          '') : undefined
    // let requestUrl = `${environment.apiService}Charts/GetProfileCharts`;
    const requestUrl = `${environment.apiService}Charts/GetProfileChartsByTab`;

    this.primaryProfileactiveTab = undefined
    this.http.post(requestUrl, requestObj).subscribe({
     next: (data:any) => {
        data.ChartData[0]["ObjectId"] = requestObj.ObjectId;
        this.profilerWidget[currentTab.DimensionName].widgetInfo.data = data.ChartData[0];
        this.primaryProfileactiveTab = currentTab;
        this.activeTab = currentTab;
      },
      error :(err)=>{
        //error
      },
      complete:()=>{
        //complete
      }})
  }

  onPrimaryTabChangeDimensionalScatter(currentTab, dashboardItem, _i) {
    // this.dimensionalScatteractiveTab = currentTab;
    // this.activeTab = currentTab;
    //const index = i;
    this.temporaryTabCheck = false;

    const requestObj = JSON.parse(localStorage.getItem('scatterWidgetItem'))
    requestObj.DimensionName = currentTab.DimensionName
    requestObj.DimensionalId = currentTab.DimensionId
    requestObj['selectedorgid'] = dashboardItem.orgId ? dashboardItem.orgId : ''
    requestObj['OrgId'] = undefined
    requestObj['MeasureBandIdCSV'] = dashboardItem.measurebandId != '' ? dashboardItem.measurebandId : ''
    delete requestObj.type;
    if (requestObj.MeasureChartTemplateId == null || requestObj.MeasureChartTemplateId == '') {
      requestObj.MeasureChartTemplateId = '4'
    }
    // requestObj['ProfileGroupName'] = currentTab.DimensionName;
    // this.storage.setObj('profilerIPObject', requestObj)

    // requestObj['primaryProfileName'] = undefined;
    // requestObj['primaryProfileValue'] = undefined;
    // requestObj['tabIndex'] = index + 1;
    // requestObj['Title'] = dashboardItem.widgetTitle;
    this.loaderForDimensionalScatter = true;
    const requestUrl = `${environment.apiService}Charts/GetDimensionalScatterChartList`;

    this.dimensionalScatteractiveTab = undefined;
    this.activeTab = undefined;
    this.http.post(requestUrl, requestObj).subscribe({
    next:  (data:any) => {
        this.DimensionbreadCrumbTextArray = data.EdaLevel;
        this.loaderForDimensionalScatter = false;
        this.dimensionalScatterWidget[currentTab.DimensionName].widgetInfo.type = "chart"
        this.dimensionalScatterWidget[currentTab.DimensionName].widgetInfo.data = data.ChartData[0];
        this.dimensionalScatterWidget[currentTab.DimensionName].widgetInfo.data.Widgettitle = 'Dimensional Scatter Chart'
        this.dimensionalScatteractiveTab = currentTab.DimensionName;
        this.activeTab = currentTab.DimensionName;


        // fix for objectId passing null or mismatched value passing in dimensional scatter filter
        this.dimensionalScatterWidget[currentTab.DimensionName].widgetInfo.data.ObjectId = requestObj.ObjectId
        this.dimensionalScatterWidget[currentTab.DimensionName].widgetInfo.data.domainID = requestObj.DomainId
        this.dimensionalScatterWidget[currentTab.DimensionName].widgetInfo.data.TimeId = requestObj.TimeId
        this.dimensionalScatterWidget[currentTab.DimensionName].widgetInfo.data.orgId = requestObj.selectedorgid ? requestObj.selectedorgid : ''
        localStorage.setItem('currentActiveDimensionTab', JSON.stringify(currentTab))
      },
     error: (error) => {
        this.loaderForDimensionalScatter = false;
      },
      complete:()=>{
        //complete
      }
  });
  }

  onSecondaryTabChange(currentTab, dashboardItem, _i) {
    // this.secondaryprofileactiveTab = currentTab;
    // this.activeTab = currentTab;

    //const index = i;
    this.temporaryTabCheck = false;
    const requestObj = this.storage.getObj('profilerIPObject')
    // requestObj['tabIndex'] = index + 1;
    requestObj['ProfileGroupName'] = currentTab.DimensionName;
    this.storage.setObj('profilerIPObject', requestObj)

    requestObj['Title'] = dashboardItem.widgetTitle;

    requestObj['DimensionFilterValues'] = dashboardItem.StackedDimensionValue;
    requestObj['StackedDimension1'] = dashboardItem.StackedDimensionValue1;
    requestObj['StackedDimension2'] = dashboardItem.StackedDimensionValue2;
    requestObj['selectedorgid'] = dashboardItem.orgId ? dashboardItem.orgId : ''
    requestObj['OrgId'] = undefined
    requestObj['PatternParticipentId'] = dashboardItem.DomainId === 6 ? (this.participantFactId
      ? this.participantFactId
      : dashboardItem.FactId
        ? dashboardItem.FactId : dashboardItem.PatternParticipentId ? dashboardItem.PatternParticipentId :
          '') : undefined
    // let requestUrl = `${environment.apiService}Charts/GetProfileCharts`;
    const requestUrl = `${environment.apiService}Charts/GetProfileChartsByTab`;

    this.secondaryprofileactiveTab = undefined
    this.http.post(requestUrl, requestObj).subscribe({
     next: (data:any) => {
        data.ChartData[0]["ObjectId"] = requestObj.ObjectId;
        this.secondaryProfilerWidget[currentTab.DimensionName].widgetInfo.data = data.ChartData[0];
        this.secondaryprofileactiveTab = currentTab;
        this.activeTab = currentTab;
      },
      error:(_err)=>{

      },
      complete: ()=>{
        //complete
      }
  })
  }
  onTabChange(currentTab, dashboardItem, i) {
    // this.activeTab = currentTab;
    const index = i;
    this.temporaryTabCheck = false;
    const requestObj = this.storage.getObj('profilerIPObject')
    requestObj['tabIndex'] = index + 1;
    requestObj['ProfileGroupName'] = currentTab.DimensionName;
    this.storage.setObj('profilerIPObject', requestObj)

    requestObj['Title'] = dashboardItem.widgetTitle;

    requestObj['DimensionFilterValues'] = dashboardItem.StackedDimensionValue;
    requestObj['StackedDimension1'] = dashboardItem.StackedDimensionValue1;
    requestObj['StackedDimension2'] = dashboardItem.StackedDimensionValue2;
    requestObj['selectedorgid'] = dashboardItem.orgId ? dashboardItem.orgId : ''
    requestObj['OrgId'] = undefined
    requestObj['PatternParticipentId'] = dashboardItem.DomainId === 6 ? (this.participantFactId
      ? ''
      : dashboardItem.FactId
        ? dashboardItem.FactId : dashboardItem.PatternParticipentId ? dashboardItem.PatternParticipentId :
          '') : undefined
    // requestObj['PatternParticipentId'] =  dashboardItem.DomainId === 6 ? (this.participantFactId
    //   ? this.participantFactId
    //   : dashboardItem.FactId
    //     ? dashboardItem.FactId:dashboardItem.PatternParticipentId?dashboardItem.PatternParticipentId:
    //      '') : undefined
    // let requestUrl = `${environment.apiService}Charts/GetProfileCharts`;
    const requestUrl = `${environment.apiService}Charts/GetProfileChartsByTab`;

    this.activeTab = undefined
    this.secondaryprofileactiveTab = undefined
    this.http.post(requestUrl, requestObj).subscribe({
    next:  (data:any) => {
        data.ChartData[0]["ObjectId"] = requestObj.ObjectId;
        this.secondaryProfilerWidget[currentTab.DimensionName].widgetInfo.data = data.ChartData[0];
        this.secondaryprofileactiveTab = currentTab;
        this.activeTab = currentTab;
      },
      error:(_err)=>{

      },
      complete:()=>{

      }
  })
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    // this.userAccess.fetchProfileLevels.next(undefined);
    this.storage.setObj('DimensionData', undefined)
    this.modalService.close(id);
    this.displayProfilerModalParticipant = false;
    this.displayProfilerModal = false;
    this.loadProfilerParticipantList = false;
    this.displaySecondaryProfilerModal = false;
    this.accordionConfiguration.profilerModal.accordionOne = false;
    this.accordionConfiguration.profilerModal.accordionTwo = false;
    this.accordionConfiguration.profilerModal.accordionThree = false;
    this.breadCrumbTextModal = '';
    this.profilerBadgeText = '';
    this.profilerBadgeTextArray = [];
    this.secondProfilerBadgeText = '';
    this.secondProfilerBadgeTextArray = [];
    // this.showSecondAccordionProfiler = false;
    this.secondaryProfilerWidget = undefined;

    const requestObj = JSON.parse(localStorage.getItem('scatterWidgetItem'))
    requestObj['type'] = this.showsecondAccordion1 && this.displayAnalyzer ? 'dimension' : 'analyzer';
    localStorage.setItem('scatterWidgetItem', JSON.stringify(requestObj))
    // this.analyzerScatterWidget.title = localStorage.getItem('acctitlescatter');
    this.accordiontitle = localStorage.getItem('acctitlescatter');
    this.userAccess.gridHeightForProfilerModal.next(undefined);
    localStorage.removeItem('filterItems')
    this.drilldownAccordionScatter = false;
    this.drilldownAccordionParticipantList = false;
    this.drilldownSecondAccordionProfiler = false;
    this.drilldownDimensionalScatter = false;
    this.nodeSelectedcsv = '';
    this.networkGraphBadgeDetails = [];
    this.storage.removeItem('scatterdilldowninput');
    this.storage.removeItem('scatterdilldowninput1');
    this.ScatterbreadCrumbTextArray = [];
    this.DimensionbreadCrumbTextArray = [];

    this.secondaryProfilerWidget = undefined;
    this.profilerWidget = undefined;
    this.storage.setObj('ProfilePatternFVEnd', 0);
    this.storage.setObj('SecProfilePatternBandId', '');
    this.storage.setObj('SecProfilePatternScore', 0);
    this.userAccess.gridHeightForProfilerModal.next(undefined);
    this.userAccess.rowDetailsForParticipant.next(undefined);
    this.storage.setObj('DimensionData', undefined)
    this.storage.removeItem('DimensionalWidgetPointData')
    localStorage.removeItem('filterItems')
    localStorage.removeItem('PrimaryRef')
    this.storage.removeItem('saveCase');
    this.isShowbase = false;
    this.isShowDrillDown = false;

  }

  toggleAccordion(target, accordionName) {
    const accordionList = Object.keys(this.accordionConfiguration[target]);
    for (let i = 0; i < accordionList.length; i++) {
      if (accordionList[i] !== accordionName) {
        this.accordionConfiguration[target][accordionList[i]] = false;
      }
    }
    this.accordionConfiguration[target][accordionName] = !this.accordionConfiguration[target][
      accordionName
    ];
  }

  getAccordionStatus(target, accordionName) {
    return this.accordionConfiguration[target][accordionName];
  }

  getRefreshedChartData(dashboardItem) {
    if (
      dashboardItem.MeasureChartTemplateId === '11' ||
      dashboardItem.MeasureChartTemplateId === '17'
    ) {
      // code implementataion
    } else {
      const requestObject = {
        DomainId: dashboardItem.DomainId,
        ObjectId: dashboardItem.ObjectId,
        BandId: "",
        InstanceId: 0,
        ChartType: "",
        PatternThreshold: "0",
        MeasureChartTemplateId: dashboardItem.MeasureChartTemplateId,
        TimeId: dashboardItem.timeId ? dashboardItem.timeId : '',
        PatternBandId: "",
        OutlierIndicator: "",
        RunId: "",
        TimeTypeId: "",
        DimensionalId: "",
        FactValueStart: "",
        FactValueEnd: "0",
        DimensionName: "",
        FactId: "",
        FactValue: "",
        DimensionValue: "",
        primaryProfileName: "",
        primaryProfileValue: "",
        SecondaryProfileName: "",
        SecondaryProfileValue: "",
        DashboardId: dashboardItem.Template,
        ExplorationMeasure: "",
        ProfileArray: "",
        ProfileString: "",
        MeasureScoreId: "",
        ProfileEntity: "",
        ProfileDimension: "",
        OldFileId: "",
        NewFileId: "",
        FilterCategory: "",
        FilterSubCategory: "",
        Type: ""
      };
      const requestUrl = `${environment.apiService}Charts/GetChartForDashBoard`;
      const widgetResponse: any = {};
      delete dashboardItem.data;
      this.http.post(requestUrl, requestObject).subscribe({
      next:  (data: any) => {
          if (data) {
            data = JSON.parse(
              '{"container":{"inputs":[{"label":"Date Range","values":["05/01/2015 - 05/31/2015"]}]},"ChartData":{"title":"Monthly Total Paid Amount by Vinoth","TimeId":"8041","type":"pie","measureValue":null,"data":{"pieData":[{"name":"Monthly Total Paid Amount by Vinoth","y":1500}]}},"drilldownActions":["Measure Scatter Chart","Transaction Participant List","Measure Profiler - Primary Peer Group"]}'
            );
            data.ChartData.data.pieData.push({
              name: 'Monthly Total Paid Amount by Someone',
              y: 1000
            });
          }
          widgetResponse.chartDetail = data;
          if (data.ChartData) {
            widgetResponse.chartDetail.ChartData.drilldownActions = data.drilldownActions;
          }
          widgetResponse.widgetId = dashboardItem.WidgetId;
          widgetResponse.isSuccess = true;
          widgetResponse.isCompleted = true;
          this.setWidgetData(widgetResponse, dashboardItem, 'dashboard');
        },
     error:   (_error) => {
          widgetResponse.isSuccess = false;
          widgetResponse.isCompleted = true;
          this.setWidgetData(widgetResponse, dashboardItem, 'dashboard');
        },
       complete: () => {
          widgetResponse.isCompleted = true;
          this.setWidgetData(widgetResponse, dashboardItem, 'dashboard');
        }
    });
    }
  }
  onWidgetControlClicked1(dashitem) {
    // condition for static map's
    if (
      dashitem.widgetDescription === 'Anamalous Billing in Hospitalizations' ||
      dashitem.widgetDescription === 'Sample Pattern'
    ) {
      // code implementation
    } else {
      this.deletewidgetdata = dashitem;
    }
  }

  // Delete Widget for dashboard GET /api/Dashboard/DeleteWidget/{dashboardId}/{widgetId}
  // DashboardService/DeleteWidget/310/2212 ObjectId: 3 Template: 16
  deleteWidgetForDashboard() {
    const requestUrl =
      `${environment.apiService}Dashboard/DeleteWidget/` +
      this.deletewidgetdata.Template +
      '/' +
      this.deletewidgetdata.widgetId;

    this.http.get(requestUrl).subscribe({
     next: (_data) => {
      // this.userAccess.dashboardid.next(this.deletewidgetdata.Template);
      // console.log(this.dashboardItems)
      // console.log(this.deletewidgetdata.widgetId)

      //const dashboardItemsAfterDelete = []
      for (let i = 0; i < this.dashboardItems.length; i++) {
        if (this.dashboardItems[i].widgetId === this.deletewidgetdata.widgetId) {
          // dashboardItemsAfterDelete.push(this.dashboardItems[i])
          this.dashboardItems.splice(i, 1)
        }
      }

      (<any>$('#deleteConfirm')).modal('show');

      // this.dashboardItems = dashboardItemsAfterDelete
      // console.log(dashboardItemsAfterDelete)
    },
    error: (error) => {
    },
    complete:()=>{
//complete
    }});
  }
  // tab functionaity in participant list new
  // tabsOnInitFunc() {
  //   this.pagesService.getClaim().subscribe(x => {
  //     this.claimDetailsActive = x;
  //     if (this.claimDetailsActive == true) {
  //         this.patientTabAct = false;
  //         this.activeBackPatientgroundTab1 = false;
  //         this.activeBackPatentgroundTab2 = true;
  //         this.patientOneActive = false;
  //         this.patientTwoActive = true;

  //     }
  //   });
  // }
  // patientTab() {
  //   this.patientTabsActive = true;
  //   this.patientClaimTab1();
  // }

  // patientClaimTab1() {
  //   this.activeBackPatientgroundTab1 = true;
  //   this.activeBackPatentgroundTab2 = false;
  //   this.patientOneActive = true;
  //   this.patientTwoActive = false;
  //   this.patientTabAct = true;
  // }
  // tab functionaity in participant list new

  //GeoMap CharType Toggle
  showChangeToggleGeoMap(dashboardItem) {
    dashboardItem.showToggle = true;
    if (dashboardItem.data.widgetInfo.data.type === "High Level Geo Map Chart") {
      this.possibledetailedgeomapactive = true;
      this.possiblehighlevelgeomapactive = false;
    } else if (dashboardItem.data.widgetInfo.data.type === "Granular Level Geo Map Chart") {
      this.possibledetailedgeomapactive = false;
      this.possiblehighlevelgeomapactive = true;
    }
  }

  changeChartGeoMap(dashboardItem, chartType) {
    dashboardItem.displayWidget = false;
    dashboardItem.hideInfo = false;
    dashboardItem.isVisible = false;
    dashboardItem.showSelectedChart = true;
    dashboardItem.selectedChart = chartType;
    if (chartType === 'High Level Geo Map Chart') {
      // dashboardItem.ChartType = '';
      dashboardItem.MeasureChartTemplateId = 40;
      dashboardItem.ChartTemplateId = 40;
      this.possibledetailedgeomapactive = true;
      this.possiblehighlevelgeomapactive = false;
      dashboardItem.showToggle = false;
    } else if (chartType == "Granular Level Geo Map Chart") {
      // dashboardItem.ChartType = '';
      dashboardItem.MeasureChartTemplateId = 41;
      dashboardItem.ChartTemplateId = 41;
      this.possibledetailedgeomapactive = false;
      this.possiblehighlevelgeomapactive = true;
      dashboardItem.showToggle = false;
    }
    this.getChangedChartViewData2(dashboardItem, chartType);

    if (this.router.url === '/pages/add' || this.router.url === '/pages/eda') {
      dashboardItem.hideInfo = true;
    }
    dashboardItem.isVisible = true;
  }

  showChangeToggleNetworkMap(dashboardItem) {
    dashboardItem.showToggle = true;    
    if (dashboardItem.data.widgetInfo.data.type == "d3networkgraph") {
      this.isHighChartNetwork = false;
    } else if (dashboardItem.data.widgetInfo.data.type == "networkgraph") {
     
      this.isHighChartNetwork = true;
    }
  }
  changeChartNetworkMap(dashboardItem, chartType) {
    dashboardItem.displayWidget = false;
    dashboardItem.hideInfo = false;
    dashboardItem.isVisible = false;
    dashboardItem.showSelectedChart = true;
    dashboardItem.selectedChart = "network";
    const Ctype = "network";
    if (chartType === 'd3network') {
      // dashboardItem.ChartType = '';
      dashboardItem.MeasureChartTemplateId = 45;
      dashboardItem.ChartTemplateId = 45;
      this.isHighChartNetwork = false;
      this.possiblehighlevelgeomapactive = false;
      dashboardItem.showToggle = false;
    } else if (chartType == "network") {
      // dashboardItem.ChartType = '';
      dashboardItem.MeasureChartTemplateId = 37;
      dashboardItem.ChartTemplateId = 37;
      this.isHighChartNetwork = true;
      this.possiblehighlevelgeomapactive = true;
      dashboardItem.showToggle = false;
    }
    this.getChangedChartViewData2(dashboardItem, Ctype);

    if (this.router.url === '/pages/add' || this.router.url === '/pages/eda') {
      dashboardItem.hideInfo = true;
    }
    dashboardItem.isVisible = true;
  }

  getChangedChartViewData2(dashboardItem, chartType) {
    let encryptedOrgId = ''
    if (dashboardItem.selectedOrg && dashboardItem.selectedOrg != "") {
      encryptedOrgId = this.encryptDecrypt.decrypt('DecryptRevoKey11', dashboardItem.selectedOrg);
      // console.log(encryptedOrgId);
      encryptedOrgId = this.encryptDecrypt.encrypt(encryptedOrgId)
    }

    const requestObject = {
      ObjectId: dashboardItem.ObjectId,
      DomainId: dashboardItem.DomainId,
      BandId: '',
      PatternThreshold: '0',
      MeasureChartTemplateId: dashboardItem.ChartTemplateId,
      MeasureScoreId: '',
      DefaultChartType: dashboardItem.DefaultChartType,
      SelectedChartType: chartType,
      ChartType: chartType,
      TimeId: dashboardItem.timeId ? dashboardItem.timeId : '',
      PatternBandId: '',
      OutlierIndicator: '',
      RunId: '',
      TimeTypeId: '',
      DimensionalId: '',
      FactValueStart: '',
      FactValueEnd: '0',
      DimensionName: '',
      FactId: '',
      FactValue: '',
      DimensionValue: '',
      primaryProfileName: '',
      primaryProfileValue: '',
      SecondaryProfileName: '',
      SecondaryProfileValue: '',
      DashboardId: dashboardItem.Template,
      ExplorationMeasure: '',
      ProfileArray: '',
      ProfileString: '',
      selectedorgid: encryptedOrgId

      // OrgId: ''
    };
    const requestUrl = `${environment.apiService}Charts/GetChartForDashBoard`;
    // let requestUrl = `${environment.apiService}Charts/GetChartForDashBoard`;

    const widgetResponse: any = {};
    delete dashboardItem.data;
    this.http.post(requestUrl, requestObject).subscribe({
     next: (data: any) => {
        widgetResponse.chartDetail = data;
        if (data.ChartData) {
          widgetResponse.chartDetail.ChartData.drilldownActions = data.drilldownActions;
          // to be changed when spline chart is ready
          // if(chartType === 'area'){
          //   widgetResponse.chartDetail.ChartData.type = 'areaspline'
          // }
        }
        widgetResponse.widgetId = dashboardItem.widgetId;
        widgetResponse.isSuccess = true;
        widgetResponse.isCompleted = true;
        widgetResponse.DomainId = dashboardItem.DomainId;
        widgetResponse.ObjectId = dashboardItem.ObjectId;
        widgetResponse.ChartTemplateId = dashboardItem.ChartTemplateId
        widgetResponse.Data_Label = dashboardItem.hasOwnProperty('toggleLegend') ? dashboardItem.toggleLegend : dashboardItem.Data_Label
        this.setWidgetData(widgetResponse, dashboardItem, 'dashboard');
        dashboardItem.displayWidget = true;
      },
     error: (_error: any) => {
        widgetResponse.isSuccess = false;
        widgetResponse.isCompleted = true;
        this.setWidgetData(widgetResponse, dashboardItem, 'dashboard');
      },
     complete: () => {
        widgetResponse.isCompleted = true;
        this.setWidgetData(widgetResponse, dashboardItem, 'dashboard');
      }
  });
  }

  // TreeMap Chart Charnge
  showChangeToggleTreeMap(dashboardItem) {
    dashboardItem.showToggle = true;
    if (dashboardItem.data.widgetInfo.data.type === "Granular Level Tree Map Chart") {
      this.possibledetailedtreemapactive = true;
      this.possiblehighleveltreemapactive = false;
    } else if (dashboardItem.data.widgetInfo.data.type === "High Level Tree Map Chart") {
      this.possibledetailedtreemapactive = false;
      this.possiblehighleveltreemapactive = true;
    }
  }

  changeChartTreeMap(dashboardItem, chartType) {
    dashboardItem.displayWidget = false;
    dashboardItem.hideInfo = false;
    dashboardItem.isVisible = false;
    dashboardItem.showSelectedChart = true;
    dashboardItem.selectedChart = chartType;
    if (chartType === 'Granular Level Tree Map Chart') {
      // dashboardItem.ChartType = '';
      dashboardItem.MeasureChartTemplateId = 42;
      dashboardItem.ChartTemplateId = 42;
      this.possibledetailedtreemapactive = true;
      this.possiblehighleveltreemapactive = false;
      dashboardItem.showToggle = false;
    } else if (chartType == "High Level Tree Map Chart") {
      // dashboardItem.ChartType = '';
      dashboardItem.MeasureChartTemplateId = 43;
      dashboardItem.ChartTemplateId = 43;
      this.possibledetailedtreemapactive = false;
      this.possiblehighleveltreemapactive = true;
      dashboardItem.showToggle = false;
    }
    this.getChangedChartViewData3(dashboardItem, chartType);

    if (this.router.url === '/pages/add' || this.router.url === '/pages/eda') {
      dashboardItem.hideInfo = true;
    }
    dashboardItem.isVisible = true;
  }

  getChangedChartViewData3(dashboardItem, chartType) {
    let encryptedOrgId = ''
    if (dashboardItem.selectedOrg && dashboardItem.selectedOrg != "") {
      encryptedOrgId = this.encryptDecrypt.decrypt('DecryptRevoKey11', dashboardItem.selectedOrg);
      // console.log(encryptedOrgId);
      encryptedOrgId = this.encryptDecrypt.encrypt(encryptedOrgId)
    }

    const requestObject = {
      ObjectId: dashboardItem.ObjectId,
      DomainId: dashboardItem.DomainId,
      BandId: '',
      PatternThreshold: '0',
      MeasureChartTemplateId: dashboardItem.ChartTemplateId,
      MeasureScoreId: '',
      DefaultChartType: dashboardItem.DefaultChartType,
      SelectedChartType: chartType,
      ChartType: chartType,
      TimeId: dashboardItem.timeId ? dashboardItem.timeId : '',
      PatternBandId: '',
      OutlierIndicator: '',
      RunId: '',
      TimeTypeId: '',
      DimensionalId: '',
      FactValueStart: '',
      FactValueEnd: '0',
      DimensionName: '',
      FactId: '',
      FactValue: '',
      DimensionValue: '',
      primaryProfileName: '',
      primaryProfileValue: '',
      SecondaryProfileName: '',
      SecondaryProfileValue: '',
      DashboardId: dashboardItem.Template,
      ExplorationMeasure: '',
      ProfileArray: '',
      ProfileString: '',
      selectedorgid: encryptedOrgId

      // OrgId: ''
    };
    const requestUrl = `${environment.apiService}Charts/GetChartForDashBoard`;
    // let requestUrl = `${environment.apiService}Charts/GetChartForDashBoard`;

    const widgetResponse: any = {};
    delete dashboardItem.data;
    this.http.post(requestUrl, requestObject).subscribe({
     next: (data: any) => {
        widgetResponse.chartDetail = data;
        if (data.ChartData) {
          widgetResponse.chartDetail.ChartData.drilldownActions = data.drilldownActions;
          // to be changed when spline chart is ready
          // if(chartType === 'area'){
          //   widgetResponse.chartDetail.ChartData.type = 'areaspline'
          // }
        }
        widgetResponse.widgetId = dashboardItem.widgetId;
        widgetResponse.isSuccess = true;
        widgetResponse.isCompleted = true;
        widgetResponse.DomainId = dashboardItem.DomainId;
        widgetResponse.ObjectId = dashboardItem.ObjectId;
        widgetResponse.ChartTemplateId = dashboardItem.ChartTemplateId
        widgetResponse.Data_Label = dashboardItem.hasOwnProperty('toggleLegend') ? dashboardItem.toggleLegend : dashboardItem.Data_Label
        this.setWidgetData(widgetResponse, dashboardItem, 'dashboard');
        dashboardItem.displayWidget = true;
      },
    error:  (_error: any) => {
        widgetResponse.isSuccess = false;
        widgetResponse.isCompleted = true;
        this.setWidgetData(widgetResponse, dashboardItem, 'dashboard');
      },
    complete:  () => {
        widgetResponse.isCompleted = true;
        this.setWidgetData(widgetResponse, dashboardItem, 'dashboard');
      }
  });
  }

  //Stacked Column CharType Toggle
  showChangeToggleStackedChart(dashboardItem) {
    console.log(dashboardItem);
    dashboardItem.showToggle = true;
        if(dashboardItem.ChartTemplateId === 31) {
          this.possiblestackedcolumnactive = true;
          this.possiblegroupedbaractive = false;
        } else if(dashboardItem.ChartTemplateId === 44) {
          this.possiblestackedcolumnactive = false;
          this.possiblegroupedbaractive = true;
        } 
  }

  changeStackedChart(dashboardItem,chartType) {
    dashboardItem.displayWidget = false;
    dashboardItem.hideInfo = false;
    dashboardItem.isVisible = false;
    dashboardItem.showSelectedChart = true;
    dashboardItem.selectedChart = chartType;
    if (chartType === 'Stacked Column') {
      dashboardItem.MeasureChartTemplateId = 31;
      dashboardItem.ChartTemplateId = 31;
      this.possiblestackedcolumnactive = true;
      this.possiblegroupedbaractive = false;
      dashboardItem.showToggle = false;
      this.getChangedChartViewData4(dashboardItem, 'Stacked Column');
    } else if (chartType == "Grouped Bar") {
      // dashboardItem.ChartType = '';
      dashboardItem.MeasureChartTemplateId = 44;
      dashboardItem.ChartTemplateId = 44;
      this.possiblestackedcolumnactive = false;
      this.possiblegroupedbaractive = true;
      dashboardItem.showToggle = false;
      this.getChangedChartViewData4(dashboardItem, 'Stacked Column');
    } 
    
    
    if (this.router.url === '/pages/add' || this.router.url === '/pages/eda') {
      dashboardItem.hideInfo = true;
    }
    dashboardItem.isVisible = true;
  }

  getChangedChartViewData4(dashboardItem, chartType) {
    let encryptedOrgId = ''
    if(dashboardItem.selectedOrg&&dashboardItem.selectedOrg!=""){
      encryptedOrgId = this.encryptDecrypt.decrypt('DecryptRevoKey11', dashboardItem.selectedOrg);
      // console.log(encryptedOrgId);
      encryptedOrgId = this.encryptDecrypt.encrypt(encryptedOrgId)
    }

    const requestObject = {
      ObjectId: dashboardItem.ObjectId,
      DomainId: dashboardItem.DomainId,
      BandId: '',
      PatternThreshold: '0',
      MeasureChartTemplateId: dashboardItem.ChartTemplateId,
      MeasureScoreId: '',
      DefaultChartType: dashboardItem.DefaultChartType,
      SelectedChartType: chartType,
      ChartType: chartType,
      TimeId: dashboardItem.timeId ? dashboardItem.timeId : '',
      PatternBandId: '',
      OutlierIndicator: '',
      RunId: '',
      TimeTypeId: '',
      DimensionalId: '',
      FactValueStart: '',
      FactValueEnd: '0',
      DimensionName: '',
      FactId: '',
      FactValue: '',
      DimensionValue: '',
      primaryProfileName: '',
      primaryProfileValue: '',
      SecondaryProfileName: '',
      SecondaryProfileValue: '',
      DashboardId: dashboardItem.Template,
      ExplorationMeasure: '',
      ProfileArray: '',
      ProfileString: '',
      selectedorgid:encryptedOrgId

      // OrgId: ''
    };
    const requestUrl = `${environment.apiService}Charts/GetChartForDashBoard`;
    // let requestUrl = `${environment.apiService}Charts/GetChartForDashBoard`;

    const widgetResponse: any = {};
    delete dashboardItem.data;
    this.http.post(requestUrl, requestObject).subscribe({
    next:  (data: any) => {
        widgetResponse.chartDetail = data;
        if (data.ChartData) {
          widgetResponse.chartDetail.ChartData.drilldownActions = data.drilldownActions;
          // to be changed when spline chart is ready
          // if(chartType === 'area'){
          //   widgetResponse.chartDetail.ChartData.type = 'areaspline'
          // }
        }
        widgetResponse.widgetId = dashboardItem.widgetId;
        widgetResponse.isSuccess = true;
        widgetResponse.isCompleted = true;
        widgetResponse.DomainId = dashboardItem.DomainId;
        widgetResponse.ObjectId = dashboardItem.ObjectId;
        widgetResponse.ChartTemplateId = dashboardItem.ChartTemplateId
        widgetResponse.Data_Label = dashboardItem.hasOwnProperty('toggleLegend') ? dashboardItem.toggleLegend : dashboardItem.Data_Label
        this.setWidgetData(widgetResponse, dashboardItem, 'dashboard');
        dashboardItem.displayWidget = true;
      },
     error: (_error: any) => {
        widgetResponse.isSuccess = false;
        widgetResponse.isCompleted = true;
        this.setWidgetData(widgetResponse, dashboardItem, 'dashboard');
      },
    complete:  () => {
        widgetResponse.isCompleted = true;
        this.setWidgetData(widgetResponse, dashboardItem, 'dashboard');
      }
  });
  }

  
  //Change ChartType Toggle
  showChangeToggle(dashboardItem) {
    dashboardItem.showToggle = true;
    if (dashboardItem.data.widgetInfo.data.type === 'bar') {
      this.possiblepiechartactive = false;
      this.possiblebar1chartactive = true;
      this.possiblescatterchartactive = false;
      this.possiblemeasurebandchartactive = false;
    } else if (dashboardItem.data.widgetInfo.data.type === 'scatter') {
      this.possiblepiechartactive = false;
      this.possiblebar1chartactive = false;
      this.possiblescatterchartactive = true;
      this.possiblemeasurebandchartactive = false;
    } else if (dashboardItem.data.widgetInfo.data.type === 'pie') {
      this.possiblepiechartactive = true;
      this.possiblebar1chartactive = false;
      this.possiblescatterchartactive = false;
      this.possiblemeasurebandchartactive = false;
    } else if (dashboardItem.data.widgetInfo.data.type === 'MeasureBand') {
      this.possiblepiechartactive = false;
      this.possiblebar1chartactive = false;
      this.possiblescatterchartactive = false;
      this.possiblemeasurebandchartactive = true;
    }
  }
  changeChart(dashboardItem, chartType) {
    dashboardItem.displayWidget = false;
    dashboardItem.hideInfo = false;
    dashboardItem.isVisible = false;
    dashboardItem.showSelectedChart = true;
    dashboardItem.selectedChart = chartType;
    if (chartType === 'pie') {
      // dashboardItem.ChartType = '';
      dashboardItem.MeasureChartTemplateId = 7;
      dashboardItem.ChartTemplateId = 7;
      this.possiblepiechartactive = true;
      this.possiblebar1chartactive = false;
      this.possiblescatterchartactive = false;
      this.possiblemeasurebandchartactive = false;
      dashboardItem.showToggle = false;
    } else if (chartType == 'bar') {
      // dashboardItem.ChartType = '';
      dashboardItem.MeasureChartTemplateId = 7;
      dashboardItem.ChartTemplateId = 7;
      this.possiblepiechartactive = false;
      this.possiblebar1chartactive = true;
      this.possiblescatterchartactive = false;
      this.possiblemeasurebandchartactive = false;
      dashboardItem.showToggle = false;
    } else if (chartType == 'scatter') {
      // dashboardItem.ChartType = '';
      dashboardItem.MeasureChartTemplateId = 7;
      dashboardItem.ChartTemplateId = 7;
      this.possiblepiechartactive = false;
      this.possiblebar1chartactive = false;
      this.possiblescatterchartactive = true;
      this.possiblemeasurebandchartactive = false;
      dashboardItem.showToggle = false;
    } else if (chartType == 'MeasureBand') {
      // dashboardItem.ChartType = '';
      dashboardItem.MeasureChartTemplateId = 6;
      dashboardItem.ChartTemplateId = 6;
      this.possiblepiechartactive = false;
      this.possiblebar1chartactive = false;
      this.possiblescatterchartactive = false;
      this.possiblemeasurebandchartactive = true;
      dashboardItem.showToggle = false;
    }
    this.getChangedChartViewData1(dashboardItem, chartType);

    if (this.router.url === '/pages/add' || this.router.url === '/pages/eda') {
      dashboardItem.hideInfo = true;
    }
    dashboardItem.isVisible = true;
  }

  getChangedChartViewData1(dashboardItem, chartType) {
    let encryptedOrgId = ''
    if (dashboardItem.selectedOrg && dashboardItem.selectedOrg != "") {
      encryptedOrgId = this.encryptDecrypt.decrypt('DecryptRevoKey11', dashboardItem.selectedOrg);
      // console.log(encryptedOrgId);
      encryptedOrgId = this.encryptDecrypt.encrypt(encryptedOrgId)
    }

    const requestObject = {
      ObjectId: dashboardItem.ObjectId,
      DomainId: dashboardItem.DomainId,
      BandId: '',
      PatternThreshold: '0',
      MeasureChartTemplateId: dashboardItem.ChartTemplateId,
      MeasureScoreId: '',
      DefaultChartType: dashboardItem.DefaultChartType,
      SelectedChartType: chartType,
      ChartType: chartType,
      TimeId: dashboardItem.timeId ? dashboardItem.timeId : '',
      PatternBandId: '',
      OutlierIndicator: '',
      RunId: '',
      TimeTypeId: '',
      DimensionalId: '',
      FactValueStart: '',
      FactValueEnd: '0',
      DimensionName: '',
      FactId: '',
      FactValue: '',
      DimensionValue: '',
      primaryProfileName: '',
      primaryProfileValue: '',
      SecondaryProfileName: '',
      SecondaryProfileValue: '',
      DashboardId: dashboardItem.Template,
      ExplorationMeasure: '',
      ProfileArray: '',
      ProfileString: '',
      selectedorgid: encryptedOrgId

      // OrgId: ''
    };
    const requestUrl = `${environment.apiService}Charts/GetChartForDashBoard`;
    // let requestUrl = `${environment.apiService}Charts/GetChartForDashBoard`;

    const widgetResponse: any = {};
    delete dashboardItem.data;
    this.http.post(requestUrl, requestObject).subscribe({
    next:  (data: any) => {
        widgetResponse.chartDetail = data;
        if (data.ChartData) {
          widgetResponse.chartDetail.ChartData.drilldownActions = data.drilldownActions;
          // to be changed when spline chart is ready
          // if(chartType === 'area'){
          //   widgetResponse.chartDetail.ChartData.type = 'areaspline'
          // }
        }
        widgetResponse.widgetId = dashboardItem.widgetId;
        widgetResponse.isSuccess = true;
        widgetResponse.isCompleted = true;
        widgetResponse.DomainId = dashboardItem.DomainId;
        widgetResponse.ObjectId = dashboardItem.ObjectId;
        widgetResponse.ChartTemplateId = dashboardItem.ChartTemplateId
        widgetResponse.Data_Label = dashboardItem.hasOwnProperty('toggleLegend') ? dashboardItem.toggleLegend : dashboardItem.Data_Label
        this.setWidgetData(widgetResponse, dashboardItem, 'dashboard');
        dashboardItem.displayWidget = true;
      },
     error: (_error: any) => {
        widgetResponse.isSuccess = false;
        widgetResponse.isCompleted = true;
        this.setWidgetData(widgetResponse, dashboardItem, 'dashboard');
      },
    complete:  () => {
        widgetResponse.isCompleted = true;
        this.setWidgetData(widgetResponse, dashboardItem, 'dashboard');
      }
  });
  }

  saveChangeChart(dashboardItem) {
    console.log(dashboardItem);
    const reqObj = {
      widgetid: dashboardItem.widgetId,
      defaultcharttype: dashboardItem.selectedChart,
      ChartTemplateId: dashboardItem.ChartTemplateId,
      DataLabel : dashboardItem.hasOwnProperty('toggleLegend') ? dashboardItem.toggleLegend : dashboardItem.Data_Label
    };
    const requestUrl = `${environment.apiService}Insights/SaveWidgetDefaultChartType`;
    this.http.post(requestUrl, reqObj).subscribe({
     next: (data: any) => {
        dashboardItem.showSelectedChart = false;
      },
      error:(err)=>{

      },
      complete:()=>{

      }
    });
  }

  showChangeTogglePattern(dashboardItem) {
    dashboardItem.showToggle = true;
    if (!Array.isArray(dashboardItem.data.widgetInfo.data)) {
      if (dashboardItem.data.widgetInfo.data.type === 'areaspline') {
        this.possibleareachartactive = true;
        this.possiblebarchartactive = false;
        this.possiblescatterbandchartactive = false;
      } else if (dashboardItem.data.widgetInfo.data.type === 'scatter') {
        this.possibleareachartactive = false;
        this.possiblebarchartactive = false;
        this.possiblescatterbandchartactive = true;
      }
    } else {
      if (dashboardItem.data.widgetInfo.data[0].type === 'bar') {
        this.possibleareachartactive = false;
        this.possiblebarchartactive = true;
        this.possiblescatterbandchartactive = false;
      }
    }
  }

  // Possible chart methods
  changeChartViewType(dashboardItem, chartType) {
    dashboardItem.displayWidget = false;
    dashboardItem.hideInfo = false;
    dashboardItem.isVisible = false;
    dashboardItem.showSelectedChart = true;
    dashboardItem.selectedChart = chartType;
    if (chartType === 'bar') {
      dashboardItem.ChartType = 'bar';
      dashboardItem.MeasureChartTemplateId = 15;
      dashboardItem.ChartTemplateId = 15;
      this.possibleareachartactive = false;
      this.possiblebarchartactive = true;
      this.possiblescatterbandchartactive = false;
      dashboardItem.showToggle = false;
    } else if (chartType == 'areaspline') {
      dashboardItem.ChartType = 'areaspline';
      dashboardItem.MeasureChartTemplateId = 14;
      dashboardItem.ChartTemplateId = 14;
      this.possibleareachartactive = true;
      this.possiblebarchartactive = false;
      this.possiblescatterbandchartactive = false;
      dashboardItem.showToggle = false;
    } else if (chartType == 'scatter') {
      dashboardItem.ChartType = 'scatter';
      dashboardItem.MeasureChartTemplateId = 16;
      dashboardItem.ChartTemplateId = 16;
      this.possibleareachartactive = false;
      this.possiblebarchartactive = false;
      this.possiblescatterbandchartactive = true;
      dashboardItem.showToggle = false;
    }
    this.getChangedChartViewData(dashboardItem, chartType);
    if (this.router.url === '/pages/add' || this.router.url === '/pages/eda') {
      dashboardItem.hideInfo = true;
    }
    dashboardItem.isVisible = true;
  }

  getChangedChartViewData(dashboardItem, chartType) {
    const requestObject = {
      ObjectId: dashboardItem.ObjectId,
      DomainId: dashboardItem.DomainId,
      BandId: '',
      PatternThreshold: '0',
      MeasureChartTemplateId: dashboardItem.ChartTemplateId,
      MeasureScoreId: '2',
      ChartType: dashboardItem.ChartType,
      TimeId: dashboardItem.timeId ? dashboardItem.timeId : '',
      PatternBandId: '',
      OutlierIndicator: '',
      RunId: '',
      TimeTypeId: '',
      DimensionalId: '',
      FactValueStart: '',
      FactValueEnd: '0',
      DimensionName: '',
      FactId: '',
      FactValue: '',
      DimensionValue: '',
      primaryProfileName: '',
      primaryProfileValue: '',
      SecondaryProfileName: '',
      SecondaryProfileValue: '',
      DashboardId: dashboardItem.Template,
      ExplorationMeasure: '',
      ProfileArray: '',
      ProfileString: '',
      DefaultChartType: dashboardItem.DefaultChartType,
      SelectedChartType: chartType
      // OrgId: ''
    };
    const requestUrl = `${environment.apiService}Charts/GetChartForDashBoard`;
    // let requestUrl = `${environment.apiService}Charts/GetChartForDashBoard`;

    const widgetResponse: any = {};
    delete dashboardItem.data;
    this.http.post(requestUrl, requestObject).subscribe({
     next: (data: any) => {
        widgetResponse.chartDetail = data;
        if (data.ChartData) {
          widgetResponse.chartDetail.ChartData.drilldownActions = data.drilldownActions;
          // to be changed when spline chart is ready
          // if(chartType === 'area'){
          //   widgetResponse.chartDetail.ChartData.type = 'areaspline'
          // }
        }
        widgetResponse.widgetId = dashboardItem.widgetId;
        widgetResponse.isSuccess = true;
        widgetResponse.isCompleted = true;
        widgetResponse.DomainId = dashboardItem.DomainId;
        widgetResponse.ObjectId = dashboardItem.ObjectId;
        widgetResponse.ChartTemplateId = dashboardItem.ChartTemplateId
        widgetResponse.Data_Label = dashboardItem.hasOwnProperty('toggleLegend') ? dashboardItem.toggleLegend : dashboardItem.Data_Label
        this.setWidgetData(widgetResponse, dashboardItem, 'dashboard');
        dashboardItem.displayWidget = true;
      },
     error: (_error: any) => {
        widgetResponse.isSuccess = false;
        widgetResponse.isCompleted = true;
        this.setWidgetData(widgetResponse, dashboardItem, 'dashboard');
      },
    complete:  () => {
        widgetResponse.isCompleted = true;
        this.setWidgetData(widgetResponse, dashboardItem, 'dashboard');
      }
  });
  }

  defaultUpDisabled = true;
  defaultDownDisabled = true;
  defaultDownCount = 0;
  defaultUpCount = 0;
  increaseSize
  ClassSetFullView = 'default';

  changePageUPHeight(dashboardItem) {
    if (this.defaultUpCount == 0) {
      localStorage.setItem('upCount', '50%');
      localStorage.setItem('downCount', '50%');
      this.defaultUpCount = 1;
      this.defaultDownCount = 1;
      this.defaultDownDisabled = true;
    } else if (this.defaultUpCount == 1) {
      localStorage.setItem('upCount', '100%');
      localStorage.setItem('downCount', '0%');
      this.defaultUpCount = 0;
      this.defaultDownCount = 0;
      this.defaultUpDisabled = true;
      this.defaultDownDisabled = true;
    }

    if (localStorage.getItem('upCount') === '50%' && localStorage.getItem('downCount') === '50%') {
      this.ClassSetFullView = 'midView';
    } else if (localStorage.getItem('upCount') === '100%' && localStorage.getItem('downCount') === '0%') {
      this.ClassSetFullView = 'default';
    }
    dashboardItem.refresh = true;
    dashboardItem.showReset = false;
    dashboardItem.displayWidget = false;
    dashboardItem.hideInfo = false;
  }

  changePageDownHeight(dashboardItem) {
    if (this.defaultDownCount == 0) {
      localStorage.setItem('downCount', '50%');
      localStorage.setItem('upCount', '50%');
      this.defaultDownCount = 1;
      this.defaultUpCount = 1;
      this.defaultUpDisabled = false;
    } else if (this.defaultDownCount == 1) {
      localStorage.setItem('downCount', '100%');
      localStorage.setItem('upCount', '0%');
      this.defaultDownCount = 0;
      this.defaultUpCount = 0;
      this.defaultDownDisabled = false;
      this.defaultUpDisabled = false;
    }
    if (localStorage.getItem('downCount') === '50%' && localStorage.getItem('upCount') === '50%') {
      this.ClassSetFullView = 'midView';
    } else if (localStorage.getItem('downCount') === '100%' && localStorage.getItem('upCount') === '0%') {
      this.ClassSetFullView = 'fullView';
    }
    dashboardItem.refresh = true;
    dashboardItem.showReset = false;
    dashboardItem.displayWidget = false;
    dashboardItem.hideInfo = false;
  }
  // * Toggle sidenave & topnav
  toggleSideMenu(_event: MouseEvent) {
    this.eventEmitService.onTopNavClick();
  }

  // set Dynamic Content for the Information Modal Starts here
  setDynamicInforContent(information, fromScreen, domainIdinfo) {
    if (fromScreen === 'dashboardInfo') {
      this.infoLinkClicked = true;
      this.dynamicInformation = information;
      if (this.dynamicInformation.DynamicInfoList) {
        this.keyArray = Object.keys(this.dynamicInformation.DynamicInfoList);
      } else {
        this.keyArray = [];
      }
    }
    
    if ( Object.prototype.hasOwnProperty.call(domainIdinfo, 'domainID')) {
      this.dynamicInformation.DomainId = domainIdinfo.domainID;
    } else if (Object.prototype.hasOwnProperty.call(domainIdinfo, 'DomainId')) {
      this.dynamicInformation.DomainId = domainIdinfo.DomainId;
    } else {
      this.dynamicInformation.DomainId = 1;
    }


    // * Info Modal Positioning - jQuery
    $('#infoModal').on('show.bs.modal', function (event) {
      const btnElem = $(event.relatedTarget),
        infoModal = $(this),
        modalWidth = infoModal.width(),
        btnWidth = btnElem.width();
      const btnPos = btnElem.offset();
      if (btnPos.left > modalWidth) {
        infoModal.css({ left: btnPos.left - modalWidth - btnWidth + 'px' });
      } else {
        infoModal.css({ left: btnPos.left + 2 * btnWidth + 'px' });
      }
    });
  }
  // set Dynamic Content for the Information Modal Ends here

  // Measure Trends chart starts here
  getMeasureTrendsChartInfor(dashboardItem) {
    const requestObject = {
      MeasureId: dashboardItem.ObjectId,
      ScoreId: '',
      TimeId: dashboardItem.data.chartDetail.ChartData.TimeId
        ? dashboardItem.data.chartDetail.ChartData.TimeId
        : '',
      TimeTypeId: '',
      RunId: ''
    };

    const requestUrl = `${environment.apiService}Measures/GetTrendChart`;
    let measureTrendResponse: any = {};
    this.http.post(requestUrl, requestObject).subscribe({
     next: (data: any) => {
      measureTrendResponse = data.ChartData;

      // unit & unit position formation
      const unit = measureTrendResponse.Units && measureTrendResponse.Units !== '' ? measureTrendResponse.Units : undefined
    const  unitDisplayPosition = measureTrendResponse.UnitDisplayPosition && measureTrendResponse.UnitDisplayPosition !== '' ? measureTrendResponse.UnitDisplayPosition : undefined


      this.trendChartOptions = {
        chart: {
          type: 'line'
        },
        title: {
          text: measureTrendResponse.title
        },
        xAxis: {
          title: {
            text: measureTrendResponse.data.xAxis.title
          },
          categories: measureTrendResponse.data.xAxis.values
        },

        yAxis: {
          title: {
            text: measureTrendResponse.data.yAxis.title
          }
        },
        plotOptions: {
          series: {
            label: {
              connectorAllowed: false
            }
          }
        },
        series: measureTrendResponse.data.yAxis.values,
        legend: {
          enabled: false
        },

        credits: {
          enabled: false
        },
        tooltip: {
          formatter: function () {
            let formattedString;
            if (unit && unitDisplayPosition && unitDisplayPosition === 'Prefix') {
              formattedString = this.x + '<br>' + measureTrendResponse.title + ' : <b>' + unit + ' ' + Highcharts.numberFormat(this.y, 1) + ' </b></br>'
            } else if (unit && unitDisplayPosition && unitDisplayPosition === 'Suffix') {
              formattedString = this.x + '<br>' + measureTrendResponse.title + ' : <b>' + Highcharts.numberFormat(this.y, 1) + ' ' + unit + ' </b></br>'
            } else {
              formattedString = this.x + '<br>' + measureTrendResponse.title + ' : <b>' + Highcharts.numberFormat(this.y, 1) + ' </b></br>'
            }

            return formattedString
          }
        },
        exporting: {
          enabled: false
        },

        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500
              },
              chartOptions: {
                legend: {
                  layout: 'horizontal',
                  align: 'center',
                  verticalAlign: 'bottom'
                }
              }
            }
          ]
        }
      };
      this.trendChart = Highcharts.chart(this.navContact.nativeElement, this.trendChartOptions);
    },
    error:(_err)=>{
      //err
    },
    complete:()=>{
      //complete
    }
  });
  }
  // Measure Trends chart ends here

  // Drag & Drop
  drop(event: CdkDragDrop<string[]>) {
    let dragcopyarr = [];
    const dragPosArr = [];
    let posval = 0;
    moveItemInArray(this.dashboardItems, event.previousIndex, event.currentIndex);
    if (event.previousIndex !== event.currentIndex) {
      dragcopyarr = this.dashboardItems;
      let widgetparamobj = {
        WidgetId: '',
        WidgetObjectId: '',
        WidgetPosition: ''
      };
      for (let i = 0; i < dragcopyarr.length; i++) {
        posval = i + 1;
        widgetparamobj = {
          WidgetId: dragcopyarr[i].widgetId,
          WidgetObjectId: dragcopyarr[i].ObjectId,
          WidgetPosition: posval.toString()
        };
        dragPosArr.push(widgetparamobj);
      }

      const reqobj = {
        // UserId: this.currentUser.UserId,
        DashboardId: dragcopyarr[0].Template,
        widgetParameters: dragPosArr
      };

      // Widget Drag&Drop Service Call
    //   this.userAccess.widgetReAlign(reqobj).subscribe({
    //    next:  (res) => {
    //     },
    //    error: (error) => {
    //     },
    //     complete:()=>{
    //       //complete
    //     }
    // });
    } 
  }

  ngOnDestroy() {
    // this.showDelIcon = false;
    // this.userAccess.dashDelIcon.unsubscribe();
  }

  // Case Initiation
  caseInitiate() {
    if (
      this.selectedCaseReason === 'Select Case Reason' ||
      this.selectedCaseType === 'Select Case Type' ||
      this.caseName === '' ||
      this.caseNotes === ''
    ) {
      return false;
    } else {
      (<any>$('#activity-initiate-modal')).modal('hide');
      (<any>$('#investigation-initiate-modal')).modal('hide');
      this.clear();
      //const requestUrl = `https://cors-anywhere.herokuapp.com/${environment.apiForSalesForce}apexrest/casecreation`;
 
      this.saveCase(this.caseDetail);
      (<any>$('#activity-initiate-modal')).modal('hide');
      (<any>$('#investigation-initiate-modal')).modal('hide');
      this.clear();
      this.date = this.datePipe.transform(this.today, 'MM-dd-yyyy');

      (<any>$('#caseInitConfirm')).modal('show');
    
      return true;
    }
  }

  // Saving Initiated Case
  saveCase(_caseDetails) {
    const Input = JSON.parse(JSON.stringify(this.storage.getObj('saveCase')));
    const saveObj = {
      "CaseNumber": '',
      "CaseNotes": this.caseNotes,
      "CaseReason": this.selectedCaseReason,
      "CaseName": this.caseName,
      "CaseType": this.selectedCaseType,
      "CaseStatus": "Initiated",
      "DomainId": Input['DomainId'],
      "DomainObjectId": Input['ObjectId'],
      "TimeId": Input['TimeId'] ? Input['TimeId'] : 0,
      "Assignedto": 1,
      "DueDate": "",
      // "UserId": 1,
      "EntityType": 1,
      "EntityId": 1,
      ParticipantId: this.claimIdNew

    }

  //   this.userAccess.saveCases(saveObj).subscribe({
  //   next:  (res) => {
  //     if (res) {
  //       this.caseNumber = res;
  //     }
  //   },
  //   error: (error) => {
  //   },
  //   complete:()=>{

  //   }
  // })
  }

  clear() {
    this.userAccess.initiateBtn.next(false);
    this.showInitiateCase = false
  }

  // * Toggle Accord
  toggleAccordTog1() {
    this.toggleAccord1 = !this.toggleAccord1;
  }


  // New Case Initiation Pop-up
  // Initiate Case popup
  openInitiateCase() {

    this.showInitiateCase = true;
    setTimeout(() => {
     // (<any>$('#caseInitiationNew')).modal('show');
    }, 100);
  }


  // Nested Menu popup
  openNestedMenus() {
    (<any>$('#subMenusPopup')).modal('show');
    this.menuSelection(this.nestedMenuItems[0], 0)
  }

  menuSelection(menuItem, _index) {
    if (this.disableCaseInitiation) {
      return
    }
    this.showIconOne = menuItem.menuName === 'Procedure' ? true : false
    this.selectedCheckBoxValue = null
    this.selectedMenu = menuItem
    this.loadPopGrid = false;
    this.loadInvestigationFocusGrid = false;
    if (menuItem.menuType == 'select') {
      this.showLevel1 = true;
    } else {
      this.showLevel1 = false;
    }
    this.selectedMenu = menuItem.menuName
    this.nestedSubMenuItems = [];
    this.nestedSubMenuItems.push(menuItem)
    this.searchEntity = ''
  }

  subMenuSelection(subMenuItem) {
    this.subMenuItems.push(subMenuItem);
    (<any>$('#subMenusPopup')).modal('hide');
    // console.log(this.subMenuItems);
  }

  removeSelectedMenu(menu) {
    if (this.disableCaseInitiation) {
      return
    }
    this.subMenuItems = this.subMenuItems.filter(val => val.subMenuName != menu.subMenuName)
  }

  removeInvestTag(menu) {
    this.investTagList = this.investTagList.filter(val => val != menu)
  }

  remove(_fruit: string): void {
    // const index = this.fruits.indexOf(fruit);

    // if (index >= 0) {
    //   this.fruits.splice(index, 1);
    // }
  }


  clearCaseInitiationForm() {
    this.caseInitiationForm.reset();
    this.clear()
  }

  clearStaticWidgets() {
    this.loadStaticChartWidgets = false
    this.loadSunburstChart1 = false
    this.loadSunburstChart2 = false
    this.loadSankeyChart1 = false
    this.loadSankeyChart2 = false
    this.loadSunburstChart3 = false
    this.loadmapChart = false
    this.loanLinkAnalysis = false
    this.treemapNHA = false
    this.sunburstNHA = false
    this.geoMapNewVar = false;
  }


  handleSunburstWidgetEvent(event) {
    if (event) {
      if (event.eventName == 'SunburstChart4') {
        this.showBackbtn = true;
      }
    }
  }

  gotoChart() {
    this.showBackbtn = true;
  }

  backtochart() {
    this.showBackbtn = false;
  }
  getScrollPosition(x, y) {   
    this.scrollX = x;
    this.scrollY = y;
  }
  handleGridLinkEvent(_event)
  {
    // code implementation
  }

  chartCompwidgetchanges(event,dashboardItem) {
    // console.log(event,dashboardItem);
      if(event) {
          dashboardItem.showSelectedChart = true;
          dashboardItem.toggleLegend = event.toggleLegend;
      }
  }

  nextChart() {
    if (this.indexStart + 2 < this.dashboardItems.length) {
      this.indexStart += 1;
    }
  }

  previousChart() {
    if (this.indexStart > 0) {
      this.indexStart -= 1;
    }
  }

}
