import { Component, Input, OnInit } from '@angular/core';
import { CommonLoaderService } from 'src/app/Standalone/common-loader/common-loader.service';
import { SessionStorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-file-explorer-basic',
  templateUrl: './file-explorer-basic.component.html',
  styleUrls: ['./file-explorer-basic.component.scss']
})
export class FileExplorerBasicComponent implements OnInit {
  /*
      *** Input declaration ***
  */
  @Input() fileDetails;
  @Input() popoutPath;
  @Input() PageType: string;
  /*
      *** Variable declaration ***
  */
  showthumbnail: boolean = false;
  showcontrols: boolean;
  pagevariable: number = 1;
  totalPages: number;
  isLoaded: boolean = false;
  fileName: string;
  selectedCaseDetails;
  fileLocation: string;
  pdfSrcView: string;
  showPDFViewer: boolean;
  rotationval: number = 0;
  zoomval: number = 0.8;
  namepinch: string;
  enableScroll: boolean = true;
  enablSticktopage: boolean = true;
  
  constructor(
    private loaderService: CommonLoaderService,
    private sessionStorage: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.sessionStorage.setItem('PDFViewerLoaded', 'N');
    this.enableScroll = true;
    this.enablSticktopage = true;
    this.rotationval = 0;
    this.zoomval = 0.8;
    if(this.PageType == 'ViewDoc'){
      this.zoomval = 0.5;
    }
    this.getCaseDetails();
  }
  /*
      *** get Case Details ***
  */
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
      *** get File Details from workqueue ***
  */
  getFileDetails(): void {
    this.fileDetails = {};
    this.fileDetails['File Location'] = this.selectedCaseDetails['File Location'];
    this.fileDetails['File Name'] = this.selectedCaseDetails['Doc Name'];
    let pageCSV: string = this.selectedCaseDetails['Pages'] ? "1-" + this.selectedCaseDetails['Pages'].toString() : "1-1";
    this.fileDetails['Page Range CSV'] = pageCSV;
    this.getDetails();
  }
  /*
      *** get File Details ***
  */
  getDetails(): void {
    this.fileName = this.fileDetails['File Name'];
    if (this.fileLocation == undefined || this.fileLocation == null) {
      this.fileLocation = this.fileDetails['File Location'];
    }

    if (this.fileName == undefined || this.fileName == null) {
      this.fileName = this.fileDetails['File Name'] ? this.fileDetails['File Name'] : this.selectedCaseDetails['Doc Name'];
    }

    this.loadPdfFromUrl();
  }

  afterLoadComplete(pdfData: any): void {
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
    this.sessionStorage.setItem('PDFViewerLoaded', 'Y');
    let loadingStatus = this.sessionStorage.getItem('lsLoaded');
    if(loadingStatus === 'Y'){
      this.loaderService.hideLoader();
    }
    this.loaderService.hideLoader();
  }

  nextPage(): void {
    if(this.pagevariable >= 1){
      this.pagevariable++;
    }
  }

  prevPage(): void {
    if(this.pagevariable <= this.totalPages){
      this.pagevariable--;
    }
  }

  changePageinput(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pagevariable = page;
    }
  }
  loadPdfFromUrl(){
    if(this.fileLocation){
      this.sessionStorage.setItem('PDFViewerLoaded', 'N');
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

}
