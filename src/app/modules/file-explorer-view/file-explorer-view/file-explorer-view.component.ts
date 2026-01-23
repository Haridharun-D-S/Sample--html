import { Component, OnInit, Input, Output, EventEmitter, Renderer2, ElementRef } from '@angular/core';
import { CommonLoaderService } from 'src/app/Standalone/common-loader/common-loader.service';
import { SharedServiceService } from 'src/app/shared/services/sharedservice.service';
import { SessionStorageService } from 'src/app/shared/services/storage.service';

let fastScrollOff: any;
declare let $: any;

@Component({
  selector: 'app-file-explorer-view',
  templateUrl: './file-explorer-view.component.html',
  styleUrls: ['./file-explorer-view.component.scss']
})
export class FileExplorerViewComponent implements OnInit {
  //Input
  @Input() fileDetails;
  @Input() popoutPath;
  @Input() viewPath;
  @Input() PageType: string;
  //Output
  @Output() pdfLoaded = new EventEmitter<any>();
  @Output() pageNumberEmitter = new EventEmitter<any>();
  //Variable
  fileName: string;
  loadPdfPage: number;
  zoomval: number;
  rotationval: number;
  highlightArray: any[];
  selectedTaskDetails: any;
  selectedCaseDetails: any;
  showFileExplorerloader: boolean;
  expandmore: boolean;
  fileLocation: string;
  generateOutputFile: boolean;
  totalPages: number;
  fromPage: number;
  pagevariableView: number = 1;
  updateRangePagevariable: number;
  docSearchEnabled: boolean;
  pdfSrcView: string;
  outputtotalpages: number;
  enableScroll: boolean;
  showicons: boolean;
  showHighlight: boolean;
  fileExplorerData: { pageNumber: number; Event: string; pageFrom: string; };
  showWordViewer: boolean;
  wordDoc: any;
  showJsonViewer: boolean;
  JsonValue: any;
  namepinch: string;
  pageNumbersCopied: any;
  enablSticktopage: boolean;
  currentPageNumberCopy: any;
  errorMessage: string;
  showthumbnail: boolean = false;
  showcontrols: boolean;
  showPDFViewer: boolean = false;
  idPath: string = '';
  selectedRecordDetails: {
    pageNo: number[];
    tor: string;
  }
  torPageDetails: number[];
  torPageValue: number;
  torArrayIndex: number;
  pagevariable: number;
  constructor(
    private sessionStorage: SessionStorageService,
    private renderer: Renderer2,
    private el: ElementRef,
    private sharedService: SharedServiceService,
    private loaderService: CommonLoaderService
  ) { }

  ngOnInit() {
    this.sessionStorage.setItem('PDFViewerLoaded', 'N');
    this.getCaseDetails();
    this.idPath = this.popoutPath;
    this.showFileExplorerloader = true;
    this.loadPdfPage = 1;
    this.zoomval = 0.8;
    if(this.PageType == 'ViewDoc'){
      this.zoomval = 0.5;
    }
    this.rotationval = 0;
    this.highlightArray = [];
    this.expandmore = true;
    this.selectedRecordDetails = {
      pageNo: [],
      tor: ''
    }
    this.torPageDetails = this.selectedRecordDetails.pageNo;
    this.torArrayIndex = 0;
    this.torPageValue = this.torPageDetails[this.torArrayIndex];    
    
  }

  getCaseDetails(){
    this.selectedCaseDetails = JSON.parse(this.sessionStorage.getItem('selectedCaseDetails'));
    if (this.popoutPath === 'generateOutput') {
      this.getDetails();
    }
    else{
      this.getFileDetails();
    }
  }
  /*
      *** get File Details ***
  */
  getFileDetails(): void {
    this.fileDetails = {};
    this.fileDetails['File Location'] = this.selectedCaseDetails['File Location'];
    this.fileDetails['File Name'] = this.selectedCaseDetails['Doc Name'];
    let pageCSV: string = this.selectedCaseDetails['Pages'] ? "1-" + this.selectedCaseDetails['Pages'].toString() : "1-1";
    this.fileDetails['Page Range CSV'] = pageCSV;
    if(this.PageType == 'RecordListing' || this.PageType == 'ViewDoc'){
      this.outputtotalpages = this.selectedCaseDetails['Pages'];
      this.totalPages = this.selectedCaseDetails['Pages'];
    }
          this.getDetails();
  }
  /*
      *** get File Details ***
  */
  getDetails(): void {
    // this.fileName = this.fileDetails['File Name'].replace(".pdf", "");
    this.fileName = this.fileDetails['File Name'];
    if (this.fileLocation == undefined || this.fileLocation == null) {
      this.fileLocation = this.fileDetails['File Location'];
    }

    if (this.fileName == undefined || this.fileName == null) {
      this.fileName = this.fileDetails['File Name'] ? this.fileDetails['File Name'] : this.selectedCaseDetails['Doc Name'];
    }
    
    this.selectedthumbnail();

    if (this.fileDetails['Page Range CSV']) {
      this.setFileDetails();
    }
    if(this.PageType == 'SummaryOutput'){
      this.getPreSignedUrl(this.fileLocation);
    }
    else{
    this.getPreSignedUrl(this.fileLocation, 1);
  }
  }
  getPreSignedUrl(pdfUrl, pageNo?) { 
    if(pdfUrl){
      this.sessionStorage.setItem('PDFViewerLoaded', 'N');
      if(this.PageType == 'RecordListing' || this.PageType == 'ViewDoc'){
        this.outputtotalpages = this.selectedCaseDetails['Pages'];
        this.totalPages = this.selectedCaseDetails['Pages'];
      }
      this.pagevariable = 1;
      const fileurlSplittedValue = pdfUrl.split('.pdf')[0];
      const setFileUrl = fileurlSplittedValue + '-' + pageNo + '.pdf';
      const reqObj =
      {
        "FileLocation": pageNo ? setFileUrl : pdfUrl
      };
      if(this.pdfSrcView == reqObj.FileLocation){ 
        this.sessionStorage.setItem('PDFViewerLoaded', 'Y');
        let loadingStatus = this.sessionStorage.getItem('lsLoaded');
        if(loadingStatus === 'Y'){
          this.loaderService.hideLoader();
        }
      }
      this.pdfSrcView = reqObj.FileLocation;
      this.pagevariable = 1;
      this.showPDFViewer = true;
    }
  }

  setFileDetails() {
    if (!this.docSearchEnabled && this.fileDetails &&  this.fileDetails['Page Range CSV']) {
      const filePageRange = this.fileDetails['Page Range CSV'].split('-');
      this.fromPage = Number(filePageRange[0]);
      // this.pagevariableView = Number(filePageRange[0]);
      this.updateRangePagevariable = Number(filePageRange[0]);
    }
  }
  pageRendered(e: CustomEvent) {
    console.log('(page-rendered)', e);
  }

  afterLoadComplete(pdf: any) {
    this.sessionStorage.setItem('PDFViewerLoaded', 'Y');
    let loadingStatus = this.sessionStorage.getItem('lsLoaded');
    if(loadingStatus === 'Y'){
      this.loaderService.hideLoader();
    }
    setTimeout(() => {
      if(this.PageType == 'SummaryOutput'){
      this.outputtotalpages = pdf.numPages;
      this.totalPages = pdf.numPages;
      }
      this.showFileExplorerloader = false;
      this.pdfLoaded.emit(true);
      this.setFileDetails()
      // if (this.enableScroll && this.showicons) {
      //   this.scrollLock()
      // }
      this.showHighlight = true;
    }, 100);
  }

  previous(action) {
    this.rotationval = 0;
    this.zoomval = 0.8;
    if(this.PageType == 'ViewDoc'){
      this.zoomval = 0.5;
    }
    const temppage = Number(this.pagevariableView) - 1;
    if (Number(temppage) >= 1) {
      setTimeout(() => {
        if (temppage !== 0) {
          this.pagevariableView = temppage;
          this.fileExplorerData = {
            pageNumber: temppage,
            Event: action,
            pageFrom: 'Previous'
          };
          this.pageNumberEmitter.emit(this.fileExplorerData);
        }
      }, 100);
      this.torArrayIndex = 0
      if(this.viewPath != 'summaryOutput') {
        this.getPreSignedUrl(this.fileLocation, temppage);
      } else {
        this.pagevariable = temppage;
      }
    }
  }
  Next(action) {
    this.zoomval = 0.8;
    if(this.PageType == 'ViewDoc'){
      this.zoomval = 0.5;
    }
    this.rotationval = 0;
    const temppage = Number(this.pagevariableView) + 1;
    if (Number(temppage) <= Number(this.totalPages)) {
      setTimeout(() => {
        this.pagevariableView = temppage;

        this.fileExplorerData = {
          pageNumber: temppage,
          Event: action,
          pageFrom: 'Next'
        };
        this.pageNumberEmitter.emit(this.fileExplorerData);
      }, 100);
      this.torArrayIndex = 0
      if(this.viewPath != 'summaryOutput') {
        this.getPreSignedUrl(this.fileLocation, temppage);
      } else {
        this.pagevariable = temppage;
      }
    }
  }

  changePageinput(value) {
    const previousPage = this.pagevariableView;
    this.rotationval = 0;
    this.zoomval = 0.8;
    if(this.PageType == 'ViewDoc'){
      this.zoomval = 0.5;
    }
    if (Number(value) >= this.fromPage && Number(value) <= this.totalPages) {
      this.pagevariableView = Number(value);
      this.updateRangePagevariable = Number(value);
      this.fileExplorerData = {
        pageNumber: this.pagevariableView,
        Event: 'FileExplorerIconClick',
        pageFrom: ''
      };
      this.pageNumberEmitter.emit(this.fileExplorerData);
      this.torArrayIndex = 0
      if(this.viewPath != 'summaryOutput') {
        this.getPreSignedUrl(this.fileLocation, this.pagevariableView);
      } else {
        this.pagevariable = this.pagevariableView;
      }
    }
    if (!(Number(value) >= this.fromPage && Number(value) <= this.totalPages)) {
      this.pagevariableView = previousPage;
    }
  }

  clockwiseRotation() {
    this.rotationval += 90;
  }

  anticlockwiseRotation() {
    this.rotationval -= 90;
  }

  zoomin() {
    this.zoomval += 0.05;
  }

  zoomout() {
    if (this.zoomval !== 1) {
      this.zoomval -= 0.05;
    }
  }

  selectedthumbnail() {
  }
  
  scrollLock() {
    this.namepinch = 'disablezoompinch'
    if (!this.pageNumbersCopied) {
      this.currentPageNumberCopy['Current Page Number'] = this.pagevariableView;
      this.currentPageNumberCopy['Total Page Numbers'] = this.totalPages;
      this.currentPageNumberCopy['Output Total Page Numbers'] = this.outputtotalpages;
      this.totalPages = Number(this.fileDetails['Page Range CSV'].split('-')[1])
      this.pageNumbersCopied = true
    }
    this.enableScroll = true;
    this.enablSticktopage = true;
  }

  /***************End File explorer action keys*******************/
  toolbarCollapse() {
    this.expandmore = !this.expandmore;
  }

  loadPDFinPDFViewer() {
    // this.loaderService.showLoader();
      this.getPreSignedUrl(this.fileLocation);
  }

  loadPDFWithoutPreSign(src) {
    // this.loaderService.showLoader();
      if(this.fileLocation){
        if(this.pdfSrcView == this.fileLocation){ 
          this.sessionStorage.setItem('PDFViewerLoaded', 'Y');
          let loadingStatus = this.sessionStorage.getItem('lsLoaded');
          if(loadingStatus === 'Y'){
            this.loaderService.hideLoader();
          }
        }
        this.pdfSrcView = this.fileLocation;
        this.showPDFViewer = true;
      }
  }

  pdfInitialLoading() {
    const fileurlSplittedValue = this.fileDetails['File Location'].split('.pdf')[0];
    const setDynamicFileUrl = fileurlSplittedValue + '-' + 1 + '.pdf';
    this.fileLocation = setDynamicFileUrl;
    this.getPreSignedUrl(this.fileLocation, 1);
  }

  closeFileErrorPopup() {
    $('#FileExplorerErrorPopup').modal('hide');
  }
  
  removeDIVforHighlight(id: string): void {
    setTimeout(() => {
      let parentElement = this.el.nativeElement.querySelector('.page');
      if (parentElement) {
        let divsToRemove = parentElement.querySelectorAll('#' + id);
        console.log(divsToRemove)
        if (divsToRemove && divsToRemove.length) {
          divsToRemove.forEach(divToRemove => {
            this.renderer.removeChild(parentElement, divToRemove);
          });
        }
      }
    }, 100);
  }

  nextTor() {
    this.torArrayIndex++;
    if(this.torArrayIndex < this.torPageDetails.length) {
      this.torPageValue = this.torPageDetails[this.torArrayIndex];  
      this.getPreSignedUrl(this.fileLocation, this.torPageValue);
    } else {
      this.torArrayIndex = this.torPageDetails.length - 1;
    }
    this.pagevariableView = this.torPageDetails[this.torArrayIndex]; 
  }

  previousTor() {
    this.torArrayIndex--;
    if(this.torArrayIndex >= 0) {
      this.torPageValue = this.torPageDetails[this.torArrayIndex]; 
      this.getPreSignedUrl(this.fileLocation, this.torPageValue);
    } else {
      this.torArrayIndex = 0
    }
    this.pagevariableView = this.torPageDetails[this.torArrayIndex]; 
  }

  setTorPages() {
    this.torPageDetails = this.selectedRecordDetails.pageNo;
    // this.torArrayIndex = 0;
    this.torPageValue = this.torPageDetails[this.torArrayIndex]; 
  }

  setTorPagesFromGrid() {
    this.torPageDetails = this.selectedRecordDetails.pageNo;
    this.torArrayIndex = 0;
    this.torPageValue = this.torPageDetails[this.torArrayIndex]; 
    this.pagevariableView = Number(this.torPageValue);
    this.getPreSignedUrl(this.fileLocation, this.torPageValue);
  }
  onError(error: any) {
    this.loaderService.hideLoader();
    // do anything
    this.getDetails();
  }

}
