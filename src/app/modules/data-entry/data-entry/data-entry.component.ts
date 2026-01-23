import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
declare var $;
import { EventEmitterService } from 'src/app/shared/services/eventemitter.service';
import { SharedServiceService } from 'src/app/shared/services/sharedservice.service';
import { SessionStorageService } from 'src/app/shared/services/storage.service';
import { FileExplorerHighlightComponent } from '../../file-explorer-highlight/file-explorer-highlight/file-explorer-highlight.component';
import { DataEntryDetailsComponent } from '../data-entry-details/data-entry-details.component';
import { CommonLoaderService } from 'src/app/Standalone/common-loader/common-loader.service';


@Component({
  selector: 'app-data-entry',
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.scss']
})
export class DataEntryComponent implements OnInit {
  /*
      *** Input decorator declaration ***
  */
  @Input() pageNumber: EventEmitter<any>;
  @Input() FromPage;
  @Input() PageType;
  @Input() PageFieldType: string;
  @Input() TemplateName: string;
  /*
      *** Output decorator declaration ***
  */
  @Output() pageBunchEmitter = new EventEmitter<any>();
  @Output() tabEmitter = new EventEmitter<any>();  
  @Output() ViewEmitter = new EventEmitter<any>();  
  @Output() bookmarkValuesEmitter = new EventEmitter<any>();
  @Output() ClinicalPdfHighLightKey = new EventEmitter<any>();  
  @Output() pageNoEmit = new EventEmitter<any>();  
  @Output() highlightPopup = new EventEmitter<any>();
  @Output() fileExplorerActiveEmmiter = new EventEmitter<any>();
  @Output() ResetDataEntry = new EventEmitter<any>();
  @Output() closeCompleteEventEmitter = new EventEmitter<string>();
  /*
      *** View Child declaration ***
  */
  @ViewChild(FileExplorerHighlightComponent) FileExplorerComponent: FileExplorerHighlightComponent;
  @ViewChild('AiExtractFile') AiExtractFile: FileExplorerHighlightComponent;
  @ViewChild(DataEntryDetailsComponent) DataEntryDetailsComponent: DataEntryDetailsComponent;
  /*
      *** Variable declaration ***
  */
  loadPage: boolean = false;
  loadReviewTask: boolean = false;
  taskTabTitle;
  Tabtitle = [];
  indexvalue: number;
  tabTitle;
  fileDetails = {};
  saveInformationMessage;
  fileExplorerPageActive: boolean = true;
  commonTocModalShow: boolean = false;
  errorMessage: string;
  otherComments;
  clientComments;
  fileLevelDetails;
  taskTemplateCode;
  leftSidePanel: number = 2;
  rightSidePanel: number = 2;
  currentPageNo;
  fileExplorerCurrentPageDetails;
  HighLightArraywords;
  pageFilteredData;
  filteredPageNum;
  ResetFilteredData : boolean = false;
  filterDataMRR;
  defaultLoader: boolean = false;
  ClinicalPdfHighLightArrayValue: any = '';
  offsetValues;
  ProcessingCardDetails: { Category: string; Typeofservice: string; TOS_ID: any; Pageno: string; ExtractionType: any; BunchConfidenceScore: string; Extractedsummary: any; Confidencescore: any; EntityGroupCount: { DX: string; RX: string; PX: string; BP: string; }; TableGroupCount: { CleanCount: string; CleanWithMinimalErrorPossibilityCount: string; UncleanCount: string; IrrelevantCount: string; }; SearchFilePageNumbers: any; SearchFormPageNumbers: any; VersionNumber: any; FormType: any; UniqueKeyIdentifier: any; FormGroup: any; Status: string; DOS: string; Facility: string; PhysicianName: string; TableIdentificationFlag: string; typeOfRecord: string; torId: string; }[];
  RecordNo: number = 1;
  TotalRecordNo: number = 1;
  CaseDetails;
  popoutPath: string = 'dataEntry';
  PageWaitLoader: boolean = true;
  showTORNavigation: boolean;
  showMultipleBunchNavigation: boolean;
  totalPageCount: any;
  currentPageRecordNo: any;
  currentPageNoValue: any;
  pageDataCollection: any;
  recordDetails: any;
  showRecordNav: boolean;
  latestViewPage: number;
  // PageType: string;
  constructor(
    private sharedService: SharedServiceService,
    private sessionStorage: SessionStorageService,
    private router: Router,
    private eventEmitService: EventEmitterService,
    private loaderService: CommonLoaderService
    ) {
      this.loadPageSize();
    }

  /*
      *** Ng On Init ***
  */
  ngOnInit(): void {
    // this.loaderService.showLoader();
    this.CaseDetails = JSON.parse(this.sessionStorage.getItem('selectedCaseDetails'));
    this.getFileDetails('initial');
    this.pageFilteredData = JSON.parse(this.sessionStorage.getItem('filterMRR'));
    if(this.pageFilteredData != null && this.pageFilteredData != undefined){
      this.ResetFilteredData = false;
      let filteredNo = this.pageFilteredData.pageNo;
      let finalval = [];
      filteredNo.forEach((x)=> {
        const splitted = x.split(',');
        if(splitted.length > 1){ 
            splitted.forEach((x)=> finalval.push(x));
        }
        else{
            finalval.push(splitted[0])
      }});
      this.pageFilteredData.pageNo = finalval;
      this.filteredPageNum = finalval[0];
      this.filterDataMRR = this.pageFilteredData
    }
    else{
      this.filteredPageNum = null;
    }
    this.sessionStorage.setItem('pageBunging', 'false');
  }
  
  /*
      *** Scroll Into view on focus ***
  */
  scrollToField(fieldId: string) {
    const field = document.getElementById(fieldId);
    if (field) {
      field.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }


  /*
      *** get File Details ***
  */
  getFileDetails(action: string): void {
            this.loadPage = true;
        if(action == 'refresh'){
          this.fileExplorerPageActive = true;
          this.leftSidePanel = 2;
          this.rightSidePanel = 2;
        }
        this.fileExplorerPageActive = true;
        this.loadPage = true;
        if(this.PageType === 'Record Split'){
          if(this.FromPage === 'popup'){
            this.getProcessingCardDetailsForPopup();
          }
          else{
            this.showTORNavigation = false;
            this.getRecordDetails();
          }
          setTimeout(() => {
            if(this.FileExplorerComponent){
              this.FileExplorerComponent.customNavPageIndex = 0;
              this.FileExplorerComponent.PageType = this.PageType;
              this.FileExplorerComponent.thumbnailtoggle = true;
              this.FileExplorerComponent.enableThumbnailFromParent();
            }
          }, 100);
        }
        else if(this.PageType === 'Establish Case'){
          setTimeout(() => {
            if(this.DataEntryDetailsComponent){
              this.DataEntryDetailsComponent.PageType = this.PageType;
              this.DataEntryDetailsComponent.getDynamicData();
            }
            if(this.FileExplorerComponent){
              this.FileExplorerComponent.customNavPageIndex = 0;
              this.FileExplorerComponent.PageType = this.PageType;
            }
          }, 100);
          this.PageWaitLoader = false;
        }
        setTimeout(() => {
          this.renderDragforPopup();
          this.renderDragforPopupforMrr();
          this.defaultLoader = false;
        }, 1000);
      }
   /*
      *** get Dyanmic Data without TOR ***
  */
    getDynamicDatawithoutTorData() {
    setTimeout(() => {
      if(this.DataEntryDetailsComponent){
        let pageNo = 1;
        this.DataEntryDetailsComponent.PageType = this.PageType;
        this.DataEntryDetailsComponent.getDynamicDataWithoutTOR(pageNo, '');
      }
      if(this.FileExplorerComponent){
        this.FileExplorerComponent.PageType = this.PageType;
        this.FileExplorerComponent.customNavPageIndex = 0;
      }
    }, 100);
  }

  /*
      *** get Processing Card Details ***
  */
  getProcessingCardDetails(): void {
    // this.loaderService.showLoader();
    this.defaultLoader = true;
    const reqObj = {"CaseId":this.CaseDetails['Case_ID'] ,"TypeOfService":""};
    this.sharedService.getRecordDetails(reqObj).subscribe({
      next: (response) => {
        // Handle 'next' callback
        this.ProcessingCardDetails = response.processingDetails;
      },
      error: (error) => {
      },
      complete: () => {
        this.TotalRecordNo = this.ProcessingCardDetails.length;
        setTimeout(() => {
          if(this.DataEntryDetailsComponent){
            this.DataEntryDetailsComponent.PageType = this.PageType;
            this.DataEntryDetailsComponent.ProcessingCardDetails = this.ProcessingCardDetails;
            this.DataEntryDetailsComponent.RecordNo = this.RecordNo;
            this.DataEntryDetailsComponent.TotalRecordNo = this.TotalRecordNo;
            this.DataEntryDetailsComponent.getDynamicData();
          }
          if(this.FileExplorerComponent){
            this.FileExplorerComponent.PageType = this.PageType;
            this.FileExplorerComponent.customNavPageIndex = 0;
          }
        }, 100);
        this.PageWaitLoader = false;
      }
    });
  }

    /*
      *** get Processing Card Details on View Details ***
   */
    getProcessingCardViewDetails(): void {
      // this.loaderService.showLoader();
      this.defaultLoader = true;
      const reqObj = {"CaseId":this.CaseDetails['Case_ID'] ,"TypeOfService":""};
      this.sharedService.getRecordDetails(reqObj).subscribe({
        next: (response) => {
          this.showTORNavigation = true;
          this.ProcessingCardDetails = response.processingDetails;
        },
        error: (error) => {
        },
        complete: () => {
          //Record Number Calculation
          this.TotalRecordNo = this.ProcessingCardDetails.length;
          setTimeout(() => {
            if(this.DataEntryDetailsComponent){
            this.DataEntryDetailsComponent.PageType = this.PageType;            
              this.DataEntryDetailsComponent.ProcessingCardDetails = this.ProcessingCardDetails;
              this.DataEntryDetailsComponent.RecordNo = this.RecordNo;
              this.DataEntryDetailsComponent.TotalRecordNo = this.TotalRecordNo;
              this.DataEntryDetailsComponent.getDynamicData();
            }
            if(this.FileExplorerComponent){
              this.FileExplorerComponent.customNavPageIndex = 0;
            this.FileExplorerComponent.PageType = this.PageType;
            }
          }, 100);
          this.PageWaitLoader = false;
        }
      });
      // this.getstaticData();
    }

     /*
      *** get Processing Card Details ***
  */
  getProcessingCardDetailsDataAlone(): void {
    // this.loaderService.showLoader();
    this.defaultLoader = true;
    const reqObj = {"CaseId":this.CaseDetails['Case_ID'] ,"TypeOfService":""};
    this.sharedService.getRecordDetails(reqObj).subscribe({
      next: (response) => {
        // Handle 'next' callback
        this.ProcessingCardDetails = response.processingDetails;
      },
      error: (error) => {
      },
      complete: () => {
          // Handle 'complete' callback
        //Record Number Calculation
        this.TotalRecordNo = this.ProcessingCardDetails.length;
        this.DataEntryDetailsComponent.RecordNo = this.RecordNo;
        this.PageWaitLoader = false;
        // this.loaderService.hideLoader();
      }
    });
    // this.getstaticData();
  }

    /*
      *** get Record Details ***
  */
    getRecordDetails(): void {
      const reqObj = {"CaseId":this.CaseDetails['Case_ID']};
      this.sharedService.getRecordDetails(reqObj).subscribe({
        next: (response) => {
          this.recordDetails = response;
          if(this.recordDetails.TotalRecords != 0) {
            this.showRecordNav = true;
            this.getProcessingCardDetails();
          } else {
            this.showRecordNav = false;
            this.getDynamicDatawithoutTorData();
          }
        },
        error: (error) => {},
        complete: () => {}
      });
    }
  
  /*
      *** get Processing Card Details ***
  */
  /*
      *** get Processing Card Details ***
  */
  getProcessingCardDetailsForPopup(): void {
    this.defaultLoader = true;
    this.ProcessingCardDetails = [];
    let recordListingData = JSON.parse(this.sessionStorage.getItem('recordListingData'));
    let selectedTORID = JSON.parse(this.sessionStorage.getItem('selectedTORID'));
    // this.ProcessingCardDetails.push(recordListingData);
    this.ProcessingCardDetails = recordListingData;
    let index = this.ProcessingCardDetails.findIndex(obj => obj.torId == selectedTORID);
    this.RecordNo = index + 1;
    this.TotalRecordNo = this.ProcessingCardDetails.length;
    this.recordDetails = {
      TotalRecords: this.ProcessingCardDetails.length,
      processingDetails: this.ProcessingCardDetails
    }
    if(this.TotalRecordNo != 0) {
      this.showRecordNav = true;
      this.showTORNavigation = true;
    } else {
      this.showRecordNav = false;
    }
    setTimeout(() => {
      if(this.DataEntryDetailsComponent){
        this.DataEntryDetailsComponent.ProcessingCardDetails = this.ProcessingCardDetails;
        this.DataEntryDetailsComponent.PageType = this.PageType;
        this.DataEntryDetailsComponent.RecordNo = this.RecordNo;
        this.DataEntryDetailsComponent.TotalRecordNo = this.TotalRecordNo;
        this.DataEntryDetailsComponent.getDynamicData();
      }
      if(this.FileExplorerComponent){
        this.FileExplorerComponent.customNavPageIndex = 0;
        this.FileExplorerComponent.PageType = this.PageType;
      }
    }, 100);
    this.PageWaitLoader = false;
  }

  viewRecords() {
    this.RecordNo = 1;
    this.getProcessingCardViewDetails();
    if(this.FileExplorerComponent){
      this.latestViewPage = this.FileExplorerComponent.pagevariableHghLght;
    }
  }

  backToEdit() {
    this.showTORNavigation = false;
    if(this.FileExplorerComponent){
      this.FileExplorerComponent.changePageinput(this.latestViewPage);
    }
  }

  recordNavigation(action: string): void{
    if(action === 'First'){
      if(this.RecordNo != 1) {
      this.RecordNo = 1;
      this.sessionStorage.setItem('lsLoaded', 'N');
        this.loaderService.showLoader();
      setTimeout(() => {
        if(this.DataEntryDetailsComponent){
          this.DataEntryDetailsComponent.PageType = this.PageType;
          this.DataEntryDetailsComponent.RecordNo = this.RecordNo;
          this.DataEntryDetailsComponent.getDynamicData();
            this.DataEntryDetailsComponent.stopPageBunching();
        }
        if(this.FileExplorerComponent){
          this.FileExplorerComponent.customNavPageIndex = 0;
          // this.FileExplorerComponent.thumbnailtoggle = false;
          this.FileExplorerComponent.PageType = this.PageType;
        }
      }, 100);
      }
    }
    else if(action === 'Last'){
      if(this.RecordNo != this.ProcessingCardDetails.length) {
      this.RecordNo = this.ProcessingCardDetails.length;
      this.sessionStorage.setItem('lsLoaded', 'N');
        this.loaderService.showLoader();
      setTimeout(() => {
        if(this.DataEntryDetailsComponent){
          this.DataEntryDetailsComponent.PageType = this.PageType;
          this.DataEntryDetailsComponent.RecordNo = this.RecordNo;
          this.DataEntryDetailsComponent.getDynamicData();
            this.DataEntryDetailsComponent.stopPageBunching();
        }
        if(this.FileExplorerComponent){
          this.FileExplorerComponent.customNavPageIndex = 0;
          // this.FileExplorerComponent.thumbnailtoggle = false;
          this.FileExplorerComponent.PageType = this.PageType;
        }
      }, 100);
      }
    }
    else if(action === 'Previous'){
      if(this.RecordNo > 1){
        this.sessionStorage.setItem('lsLoaded', 'N');
        this.loaderService.showLoader();
        this.RecordNo--;
        setTimeout(() => {
          if(this.DataEntryDetailsComponent){
            this.DataEntryDetailsComponent.PageType = this.PageType;
            this.DataEntryDetailsComponent.RecordNo = this.RecordNo;
            this.DataEntryDetailsComponent.getDynamicData();
            this.DataEntryDetailsComponent.stopPageBunching();
          }
          if(this.FileExplorerComponent){
            this.FileExplorerComponent.customNavPageIndex = 0;
            // this.FileExplorerComponent.thumbnailtoggle = false;
            this.FileExplorerComponent.PageType = this.PageType;
          }
        }, 100);
      }
    }
    else if(action === 'Next'){
      if(this.RecordNo < this.TotalRecordNo){
        this.sessionStorage.setItem('lsLoaded', 'N');
        this.loaderService.showLoader();
        this.RecordNo++;
        setTimeout(() => {
          if(this.DataEntryDetailsComponent){
            this.DataEntryDetailsComponent.PageType = this.PageType;
            this.DataEntryDetailsComponent.RecordNo = this.RecordNo;
            this.DataEntryDetailsComponent.getDynamicData();
            this.DataEntryDetailsComponent.stopPageBunching();
          }
          if(this.FileExplorerComponent){
            this.FileExplorerComponent.customNavPageIndex = 0;
            // this.FileExplorerComponent.thumbnailtoggle = false;
            this.FileExplorerComponent.PageType = this.PageType;
          }
        }, 100);
      }
    }
  }

  /*
      *** Go to Tasklist ***
  */
  gotoTasklist(): void {
  }

  /*
      *** Toggle sidenave & topnav ***
  */
  toggleSideMenu(event: MouseEvent): void {
    this.eventEmitService.onTopNavClick();
  }

  /*
      *** Toggle sidenave & topnav ***
  */
  toggleTopMenu(event: MouseEvent): void {
    this.eventEmitService.TopMenuNavClick();
  }

  /*
      *** handle PageNumber Event ***
  */
  handlePageNumberEvent(fileExplorerData): void {
    this.showTORNavigation = false;
    this.pageNumber = fileExplorerData;
    // this.FileExplorerComponent.thumbnailtoggle = false;
    this.pageNoEmit.emit(fileExplorerData);
  }
  /*
      *** max Wid Right Panel ***
  */
  maxWidRightPanel(): void {
    this.rightSidePanel = this.rightSidePanel + 1;
    if(this.rightSidePanel > 4) {
      this.rightSidePanel = 2;
    }
    this.leftSidePanel = this.leftSidePanel - 1;
    if(this.leftSidePanel < 0) {
      this.leftSidePanel = 2;
    }
    // this.FileExplorerComponent.leftSidePanel = this.FileExplorerComponent.leftSidePanel - 1;
    // if(this.FileExplorerComponent.leftSidePanel < 0) {
    //   this.FileExplorerComponent.leftSidePanel = 2;
    // }
    this.FileExplorerComponent.pdfExpandRefresh();
  }
  /*
      *** min Wid Right Panel ***
  */
  minWidRightPanel(): void {
    this.rightSidePanel = this.rightSidePanel - 1;
    if(this.rightSidePanel < 0) {
      this.rightSidePanel = 2;
    }
    this.leftSidePanel = this.leftSidePanel + 1;
    if(this.leftSidePanel > 4) {
      this.leftSidePanel = 2;
    }
    // this.FileExplorerComponent.leftSidePanel = this.FileExplorerComponent.leftSidePanel + 1;
    // if(this.FileExplorerComponent.leftSidePanel > 4) {
    //   this.FileExplorerComponent.leftSidePanel = 2;
    // }
    this.FileExplorerComponent.pdfExpandRefresh();
  }
  /*
      *** handle Hightlight value Emit ***
  */
  handleHightlightvalueEmit(value): void {
   this.HighLightArraywords = value;
   if(this.FileExplorerComponent){
    this.FileExplorerComponent.HighlightKeywordArray = value;
    this.FileExplorerComponent.HighlightPDF();
   }
  }
  /*
      *** clear Confidence Btn ***
  */
  clearConfidenceBtn(event): void {
    if(event) {
      this.FileExplorerComponent.clearConfidenceBtn()
    }
  }
  /*
      *** Tab Index Emit ***
  */
  TabIndexEmit(tabval): void{
    this.tabEmitter.emit(tabval);
  }
  /*
      *** View Index Emit ***
  */
  viewTabEmit(): void{
    this.ViewEmitter.emit('t');
  }
  /*
      *** page Bunching Emitter ***
  */
  pageBunchingEmitter(value): void{
    this.pageBunchEmitter.emit(value);
  }
  /*
      *** bookmark Pages Emitter ***
  */
  bookmarkPagesEmitter(value): void{
    this.bookmarkValuesEmitter.emit(value);
  }
  /*
      *** load Page Size ***
  */
  loadPageSize(): void{
    var leftControl = $('#left_panel');
    var rightControl = $('#right_panel');
      leftControl.css('right', 900);
      rightControl.css('width', 900);
      if(this.AiExtractFile) {
        this.AiExtractFile.enablSticktopage = false;
        setTimeout(() => {
          this.AiExtractFile.enablSticktopage = true;
        }, 500);
      }
      this.getOffsetValue('1200')
  }
  /*
      *** get Offset Value ***
  */
  getOffsetValue(val) {
    this.offsetValues = val;
  }
  /*
      *** open Highlight ***
  */
  openHghlght(val) {
    
    this.highlightPopup.emit(val);
  }
  /*
      *** render Drag for Popup for Mrr ***
  */
  renderDragforPopupforMrr() {
    const component6 = this;
    let isResizing = false,
    lastDownX = 0;
      let container = $('#container'),
          left = $('#left_panel'),
          right = $('#right_panel'),
          handle = $('#drag'),
          offsetRight = 0;
          
      handle.on('mousedown', function (e) {
          isResizing = true;
          lastDownX = e.clientX;
      });

      $(document).on('mousemove', function (e) {
          // we don't want to do anything if we aren't resizing.
          if (!isResizing) 
              return;
          
          offsetRight = container.width() - (e.clientX - container.offset().left);
          if(component6.PageType === 'Establish Case'){
            if(offsetRight <= 890 && offsetRight >= 270) {
              left.css('right', offsetRight);
              right.css('width', offsetRight);
            }
          }
          else{
            if(offsetRight <= 1090 && offsetRight >= 270) {
              left.css('right', offsetRight);
              right.css('width', offsetRight);
            }
          }
      }).on('mouseup', function (e) {
          // stop resizing
          if (!isResizing) 
           return;
  
           if(component6.AiExtractFile) {
            component6.AiExtractFile.enablSticktopage = false;
            setTimeout(() => {
              component6.AiExtractFile.enablSticktopage = true;
            }, 500);
          }
          component6.getOffsetValue(offsetRight);
          isResizing = false;
      });
  }
  /*
      *** reset Filtered Page List ***
  */
  resetFilteredPageList(){
    this.pageFilteredData = null;
    this.sessionStorage.removeItem("filterMRR");
    this.ResetFilteredData = true;
    this.filteredPageNum = null;
  }
  /*
      *** get Page Numbers for pdf viewer record navigation ***
  */
  PageNumbersForRecordNav(PageNumbers: number[]): void{
    if(this.FileExplorerComponent){
      let minNumber: number = Math.min(...PageNumbers);
      this.FileExplorerComponent.customNavPageArray = PageNumbers;
      this.FileExplorerComponent.customNavPageVariable = 1;
      this.FileExplorerComponent.customNavTotalPages = PageNumbers.length;
      let index: number = this.RecordNo - 1;
      if(this.ProcessingCardDetails && this.ProcessingCardDetails.length > 0){
        let obj = this.ProcessingCardDetails[index];
        this.FileExplorerComponent.CustomInputFieldValue = obj.typeOfRecord;
        this.FileExplorerComponent.showTOR = true;
      }
      else{
        this.FileExplorerComponent.CustomInputFieldValue = '';
      }
      this.FileExplorerComponent.CustomInputFieldProperties = "readonly";
      setTimeout(() => {
        this.FileExplorerComponent.PageType = this.PageType;
        this.FileExplorerComponent.pagevariableHghLght = PageNumbers[this.FileExplorerComponent.customNavPageIndex];
        this.FileExplorerComponent.getPreSignedUrl(this.FileExplorerComponent.fileLocation ,this.FileExplorerComponent.pagevariableHghLght)
      }, 100);
    }
  }
  /*
      ***Close mat auto complete on container close ***
  */
  onContainerScroll(): void{
    if(this.DataEntryDetailsComponent){
      const container = document.querySelector('.card-body-panel-content');
      const scrollOffset = container.scrollTop;
      this.DataEntryDetailsComponent.onContainerScroll(scrollOffset)
    }
  }

   /*
      *** pdf navigation TOR event ***
  */
  RecordNoUpdate(value) {
    value.PageNumbers.forEach((element,i) => {
      if(element == this.FileExplorerComponent.pagevariableHghLght) {
        // this.RecordNo = value.index + 1;
        this.FileExplorerComponent.CustomInputFieldValue = value.CustomInputFieldValue;
        this.FileExplorerComponent.CustomInputFieldProperties = value.CustomInputFieldProperties;
        this.FileExplorerComponent.customNavTotalPages = value.customNavTotalPages;
        this.FileExplorerComponent.customNavPageVariable = i+1;
        this.FileExplorerComponent.customNavPageIndex = i;
        this.FileExplorerComponent.customNavPageArray = value.PageNumbers;
        this.FileExplorerComponent.PageType = this.PageType;
        this.FileExplorerComponent.showTOR = true;
      }
    });
  }

  /*
      *** No TOR Data Emit ***
  */
  NoTORDataEmitter(value) {
    if(value) {
      // this.FileExplorerComponent.showTOR = false;
    }
  }

  /*
      *** Drag & Drop Event ***
  */  
  renderDragforPopup() {
    const component6 = this;
    var isResizing = false,
    lastDownX = 0;
      var container = $('#container'),
          left = $('#left_panel'),
          right = $('#right_panel'),
          handle = $('#drag'),
          offsetRight = 0;
      $('#drag').on('mousedown', function (e) {
          isResizing = true;
          lastDownX = e.clientX;
      });

      $(document).on('mousemove', function (e) {
          // we don't want to do anything if we aren't resizing.
          if (!isResizing) 
              return;
          
          offsetRight = container.width() - (e.clientX - container.offset().left);
          if(component6.PageType === 'Establish Case'){
            if(offsetRight <= 890 && offsetRight >= 270) {
              left.css('right', offsetRight);
              right.css('width', offsetRight);
            }
          }
          else{
            if(offsetRight <= 1090 && offsetRight >= 270) {
              left.css('right', offsetRight);
              right.css('width', offsetRight);
            }
          }
      }).on('mouseup', function (e) {
          // stop resizing
          if (!isResizing) 
          return;
          isResizing = false;
      });
  }

/*
      *** Multiple Pages in TOR Event ***
  */ 
  multipleRecordPages(value) {
    if(value.totalCount != 1) {
      this.showMultipleBunchNavigation = true;
      this.totalPageCount = value.totalCount;
      this.currentPageRecordNo = value.currentIndex + 1;
      this.currentPageNoValue = value.currentPageNoValue;
      this.pageDataCollection = value.dataCollection;
    } else {
      this.showMultipleBunchNavigation = false;
    }
  }

  /*
      *** Page Navigation for Multiple Pages ***
  */ 
    navigatePages(action) {
      if(action === 'Previous'){
        if(this.currentPageRecordNo > 1){
          this.currentPageRecordNo--;
          setTimeout(() => {
            if(this.DataEntryDetailsComponent){
              this.DataEntryDetailsComponent.dynamicDataTorId = this.pageDataCollection[this.currentPageRecordNo-1].torId;
              this.DataEntryDetailsComponent.DynamicEntryPageInput = this.pageDataCollection[this.currentPageRecordNo-1].completeJson;
            }
          }, 100);
        }
      }
      else if(action === 'Next'){
        if(this.currentPageRecordNo < this.totalPageCount){
          this.currentPageRecordNo++;
          setTimeout(() => {
            if(this.DataEntryDetailsComponent){
              this.DataEntryDetailsComponent.dynamicDataTorId = this.pageDataCollection[this.currentPageRecordNo-1].torId;
              this.DataEntryDetailsComponent.DynamicEntryPageInput = this.pageDataCollection[this.currentPageRecordNo-1].completeJson;
            }
          }, 100);
        }
      }
    }
  
    /*
        *** Dynamic Entry Page Close & Complete EventEmitter ***
    */
    DynamicEntryPageCloseCompleteEventEmitter(event: string): void {
      this.closeCompleteEventEmitter.emit(event);
    }
    /*
        *** bulk Save Complete Flag ***
    */
    bulkSaveCompleteFlag(event: string): void {
      const reqObj = {"CaseId": this.CaseDetails['Case_ID'] ,"TypeOfService":""};
      // const reqObj = {"CaseId": '56770' ,"TypeOfService":""};
      this.sharedService.getRecordDetails(reqObj).subscribe({
        next: (response) => {
          // Handle 'next' callback
          this.ProcessingCardDetails = response.processingDetails;
        },
        error: (error) => {
            // Handle 'error' callback
        },
        complete: () => {
            // Handle 'complete' callback
          //Record Number Calculation
          if(this.FromPage == ''){
            let pageList: number[] = [];
            if(this.ProcessingCardDetails.length == 0){
              this.getDynamicDatawithoutTorData();
            }
            else{
              const values: number[] = [];
              this.ProcessingCardDetails.forEach(obj => {
                this.getPageList(obj.Pageno).forEach(pageNumber => {
                    values.push(pageNumber);
                  // }
                });
              });
              pageList = Array.from(new Set(values));
            }
            if(pageList.length > 0){
              let TotalPageNumbers = this.CaseDetails['Pages'];
              let totalPageList: number[] = [];
              for (let i = 1; i <= TotalPageNumbers; i++) {
                totalPageList.push(i);
              }
              let MissingPages: number[] = totalPageList.filter(page => !pageList.includes(page));
              if(MissingPages.length > 0){
                let page: number = Math.min(...MissingPages);
                setTimeout(() => {
                  let tempObj:  { Category: string; Typeofservice: string; TOS_ID: any; Pageno: string; ExtractionType: any; BunchConfidenceScore: string; Extractedsummary: any; Confidencescore: any; EntityGroupCount: { DX: string; RX: string; PX: string; BP: string; }; TableGroupCount: { CleanCount: string; CleanWithMinimalErrorPossibilityCount: string; UncleanCount: string; IrrelevantCount: string; }; SearchFilePageNumbers: any; SearchFormPageNumbers: any; VersionNumber: any; FormType: any; UniqueKeyIdentifier: any; FormGroup: any; Status: string; DOS: string; Facility: string; PhysicianName: string; TableIdentificationFlag: string; typeOfRecord: string; torId: string; } = {
                    Category: '',
                    Typeofservice: '',
                    torId: '',
                    TOS_ID: undefined,
                    Pageno: page.toString(),
                    ExtractionType: undefined,
                    BunchConfidenceScore: '',
                    Extractedsummary: undefined,
                    Confidencescore: undefined,
                    EntityGroupCount: {
                      DX: '',
                      RX: '',
                      PX: '',
                      BP: ''
                    },
                    TableGroupCount: {
                      CleanCount: '',
                      CleanWithMinimalErrorPossibilityCount: '',
                      UncleanCount: '',
                      IrrelevantCount: ''
                    },
                    SearchFilePageNumbers: undefined,
                    SearchFormPageNumbers: undefined,
                    VersionNumber: undefined,
                    FormType: undefined,
                    UniqueKeyIdentifier: undefined,
                    FormGroup: undefined,
                    Status: '',
                    DOS: '',
                    Facility: '',
                    PhysicianName: '',
                    TableIdentificationFlag: '',
                    typeOfRecord: event
                  }
                  this.ProcessingCardDetails.push(tempObj);
                  this.TotalRecordNo = this.ProcessingCardDetails.length;
                  this.RecordNo = this.TotalRecordNo;
                  if(this.DataEntryDetailsComponent){
                    let pageNo = page;          
                    this.DataEntryDetailsComponent.RecordNo = this.RecordNo;
                    this.DataEntryDetailsComponent.ProcessingCardDetails = this.ProcessingCardDetails;  
                    this.DataEntryDetailsComponent.TotalRecordNo = this.TotalRecordNo;
                    this.DataEntryDetailsComponent.PageType = this.PageType;
                    this.DataEntryDetailsComponent.getDynamicDataWithoutTOR(pageNo, '');
                    this.DataEntryDetailsComponent.stopPageBunching();
                  }
                  if(this.FileExplorerComponent){
                    setTimeout(() => {
                      this.FileExplorerComponent.pagevariableHghLght = page;
                      this.FileExplorerComponent.PageType = this.PageType;
                      this.FileExplorerComponent.getPreSignedUrl(this.FileExplorerComponent.fileLocation ,this.FileExplorerComponent.pagevariableHghLght)
                    }, 100);
                  }
                }, 100);
              }
            }
          }
          }
      });
    }
  recordDetailsUpdate(event): void {
    
    const reqObj = {"CaseId": this.CaseDetails['Case_ID'] ,"TypeOfService":""};
    // const reqObj = {"CaseId": '56770' ,"TypeOfService":""};
    this.sharedService.getRecordDetails(reqObj).subscribe({
      next: (response) => {
        // Handle 'next' callback
        this.ProcessingCardDetails = response.processingDetails;
      },
      error: (error) => {
          // Handle 'error' callback
      },
      complete: () => {
          let page: number = Number(event);
          setTimeout(() => {
            let tempObj:  { Category: string; Typeofservice: string; TOS_ID: any; Pageno: string; ExtractionType: any; BunchConfidenceScore: string; Extractedsummary: any; Confidencescore: any; EntityGroupCount: { DX: string; RX: string; PX: string; BP: string; }; TableGroupCount: { CleanCount: string; CleanWithMinimalErrorPossibilityCount: string; UncleanCount: string; IrrelevantCount: string; }; SearchFilePageNumbers: any; SearchFormPageNumbers: any; VersionNumber: any; FormType: any; UniqueKeyIdentifier: any; FormGroup: any; Status: string; DOS: string; Facility: string; PhysicianName: string; TableIdentificationFlag: string; typeOfRecord: string; torId: string; } = {
              Category: '',
              Typeofservice: '',
              torId: '',
              TOS_ID: undefined,
              Pageno: page.toString(),
              ExtractionType: undefined,
              BunchConfidenceScore: '',
              Extractedsummary: undefined,
              Confidencescore: undefined,
              EntityGroupCount: {
                DX: '',
                RX: '',
                PX: '',
                BP: ''
              },
              TableGroupCount: {
                CleanCount: '',
                CleanWithMinimalErrorPossibilityCount: '',
                UncleanCount: '',
                IrrelevantCount: ''
              },
              SearchFilePageNumbers: undefined,
              SearchFormPageNumbers: undefined,
              VersionNumber: undefined,
              FormType: undefined,
              UniqueKeyIdentifier: undefined,
              FormGroup: undefined,
              Status: '',
              DOS: '',
              Facility: '',
              PhysicianName: '',
              TableIdentificationFlag: '',
              typeOfRecord: ''
            }
            this.ProcessingCardDetails.push(tempObj);
            this.TotalRecordNo = this.ProcessingCardDetails.length;
            const index = this.ProcessingCardDetails.findIndex(item => item.Pageno.split(',').includes(page.toString()));
            this.RecordNo = index + 1;
            if(this.DataEntryDetailsComponent){
              let pageNo = page;          
              this.DataEntryDetailsComponent.RecordNo = this.RecordNo;
              this.DataEntryDetailsComponent.ProcessingCardDetails = this.ProcessingCardDetails;  
              this.DataEntryDetailsComponent.TotalRecordNo = this.TotalRecordNo;
              this.DataEntryDetailsComponent.PageType = this.PageType;
              this.DataEntryDetailsComponent.getDynamicDataWithoutTOR(pageNo, '');
            }
            if(this.FileExplorerComponent){
              setTimeout(() => {
                this.FileExplorerComponent.PageType = this.PageType;
              }, 100);
            }
          }, 100);
      // }
    }});
  }
  getPageList(pageString: string): number[] {
      const pages: number[] = [];
      const pageRanges: string[] = pageString.split(',');

      pageRanges.forEach(range => {
          if (range.includes('-')) {
              const [start, end] = range.split('-').map(Number);
              for (let i = start; i <= end; i++) {
                  pages.push(i);
              }
          } else {
              pages.push(Number(range));
          }
      });

      return pages.sort((a, b) => a - b);
  }
  /*
   *** Page Navigation for Multiple Pages ***
 */ 
 saveRecordDetailsDataEmitter(value) {
   if(value.TotalRecords) {
     this.recordDetails = value;
     if(this.recordDetails.TotalRecords != 0) {
      this.showRecordNav = true;
     }
   }
   let nextPage = Number(value.LastPage) + 1;
   if(this.FromPage !== 'popup'){
    this.FileExplorerComponent.changePageinputV2(nextPage);
    this.getProcessingCardDetailsDataAlone();
   }
  }

}
