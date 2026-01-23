import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SharedServiceService } from 'src/app/shared/services/sharedservice.service';
import { SessionStorageService } from 'src/app/shared/services/storage.service';
import { saveAs } from 'file-saver-es';
import { CommonLoaderService } from 'src/app/Standalone/common-loader/common-loader.service';
import { IDynamicDialogConfig, PopupSuccessComponent } from '../../shared-module/popup-success/popup-success.component';
import { MatDialog } from '@angular/material/dialog';
import { PopupCustomComponent } from '../../shared-module/popup-custom/popup-custom.component';
import { PopupErrorComponent } from '../../shared-module/popup-error/popup-error.component';
import { PopupTemplateComponent } from '../../shared-module/popup-template/popup-template.component';
import { FileExplorerBasicComponent } from '../../file-explorer-basic/file-explorer-basic/file-explorer-basic.component';
declare var $;

@Component({
  selector: 'app-summary-output',
  templateUrl: './summary-output.component.html',
  styleUrls: ['./summary-output.component.scss']
})
export class SummaryOutputComponent implements OnInit {
  //ViewChild
  @Input() PageFieldType: string;
  @Input() status: string;
  @Output() closeCompleteEventEmitter = new EventEmitter<string>();
  @ViewChild('GenerateOutputFile') GenerateOutputFile: FileExplorerBasicComponent;  
  //Variables
  showGenerateOutputFile: boolean;
  pdfFileName: string;
  wordFileName: string;
  showGenerateOutputLoader: boolean;
  outputReviewDocStatus: string;
  pdfDownloadUrl: any;
  wordurl: any;
  outputFilePageCsv: any;
  currentCaseId: any;
  currentFileId: any;
  popoutPath: string;
  fileDetails: any[];
  externalCaseId: any;
  currentCaseNumber: any;
  parentCaseId: any;
  offsetValues: any;
  userDetail: any;
  PageType: string = 'SummaryOutput';
  sampleJsonOutputFiles;
  uploadFiles;

  constructor(
    private sessionStorage: SessionStorageService,
    private sharedService: SharedServiceService,
    private http: HttpClient,
    private loader: CommonLoaderService,
    public dialog: MatDialog
    ) { }

  ngOnInit() {
    this.userDetail = this.sessionStorage.getObj('currentUser');
    this.showGenerateOutputFile = false;
    this.fileDetails = [];
    this.pdfFileName = '';
    this.wordFileName = '';
    this.popoutPath = 'generateOutput';
    let selectedCaseDetails = JSON.parse(this.sessionStorage.getItem("selectedCaseDetails"));
    this.currentCaseId = selectedCaseDetails['Case_ID'];
    this.externalCaseId = selectedCaseDetails['External Case ID'];
    this.currentCaseNumber = selectedCaseDetails['Case Number'];
    this.parentCaseId = selectedCaseDetails['Parent Case ID'];
    if(this.status == 'Not Started'){
      this.notAvailableMessage();
    }
    else{
      this.getOutputUrlDetails();
    }
    setTimeout(() => {
      this.renderDragforPopup()
    }, 1000);
  }

  notAvailableMessage(){
    this.sessionStorage.setItem('lsLoaded', 'Y');
    this.loader.hideLoader();
    setTimeout(() => {
      this.loader.hideLoader();
    }, 500);
    const dialogRef = this.dialog.open(PopupErrorComponent, {
      width: '450px',
      data: <IDynamicDialogConfig>{
      title: 'Alert',
      titleFontSize:'20',
      // dialogContent: err?.message,
      dialogContent : 'The Summary Output will be available upon completion of the previous tasks.',
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

    dialogRef.disableClose = true;

    dialogRef.componentInstance.buttonClicked.subscribe(action => {
        switch (action) {
        case 'accept':
          this.closeCompleteEventEmitter.emit("Unavailable");
            break;
        case 'decline':
          this.closeCompleteEventEmitter.emit("Unavailable");
            break;
        case 'later':
          this.closeCompleteEventEmitter.emit("Unavailable");
            break;
            case 'save':
              this.closeCompleteEventEmitter.emit("Unavailable");
            break;
        }
    });
  }

  getOutputUrlDetails() {
    // const req = {
    //   "CaseId": this.currentCaseId
    // };
    let selectedCaseDetails1 = JSON.parse(this.sessionStorage.getItem("selectedCaseDetails"));

    const req = {
        "CaseId": selectedCaseDetails1['Case_ID'],
    };
    this.sharedService.GetSummaryOutputDetails(req).subscribe({
     next: (val) => {
       this.sampleJsonOutputFiles = val;
       if(this.sampleJsonOutputFiles.fileDetails){
        this.sampleJsonOutputFiles.fileDetails.selected = true;
        if(this.sampleJsonOutputFiles.fileDetails?.child.length > 0){
          this.sampleJsonOutputFiles.fileDetails.child.map(item => {
            item.selected = false;
          })
        }
       }
        this.pdfDownloadUrl = this.sampleJsonOutputFiles.fileDetails.outputpdfpath;
        this.fileDetails['File Name'] = this.sampleJsonOutputFiles.fileDetails.pdffilename;
        this.fileDetails['File Location'] = this.pdfDownloadUrl;
        this.fileDetails['Page Range CSV'] = this.sampleJsonOutputFiles.fileDetails.pdfpagerangecsv;
        this.fileDetails['path'] = 'generateOutput';
        this.outputFilePageCsv = this.sampleJsonOutputFiles.fileDetails.pdfpagerangecsv;
        this.outputReviewDocStatus = this.sampleJsonOutputFiles.caseDetails.status;
        if(this.outputReviewDocStatus == 'Review Doc Available') { 
          this.showGenerateOutputFile = true;
        } else {
          if(this.PageFieldType === 'editable'){
            this.triggerGenerateOutput();
          }
          else{
            this.loader.hideLoader();
          }
        }
        this.selectedFormation();
    //  }  
    },
    error: (_error) => {
      },
    complete:()=>{
      //complete
      setTimeout(() => {
        if(this.GenerateOutputFile){
          this.sessionStorage.setItem('lsLoaded', 'Y');
          this.GenerateOutputFile.fileName = this.sampleJsonOutputFiles.fileDetails.pdffilename;
          this.GenerateOutputFile.fileLocation = this.sampleJsonOutputFiles.fileDetails.outputpdfpath;
          // this.GenerateOutputFile.loadPDFWithoutPreSign(this.sampleJsonOutputFiles.fileDetails.outputpdfpath); 
          this.showoutputfile('pdf');
        }    
      }, 500);
    }})
    
  }

  selectedFormation() {
    this.uploadFiles = [];
    this.sampleJsonOutputFiles.fileDetails.child.forEach(childEle => {
        this.uploadFiles.push(childEle);
      // }
    });
  }

  uploadToVaers() {
    const dialogRef1 = this.dialog.open(PopupTemplateComponent, {
      width: '500px',
      data: <IDynamicDialogConfig>{
        title: 'Alert',
        titleFontSize:'20',
        dialogContent: 'The selected documents will be uploaded to VAERS and this action can not be reversed. Are you sure?',
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
    dialogRef1.disableClose = true;

    dialogRef1.componentInstance.buttonClicked.subscribe(action => {
      switch (action) {
        case 'accept':
          this.loader.showLoader();
          let selectedCaseDetails1 = JSON.parse(this.sessionStorage.getItem("selectedCaseDetails"));
            let reqObj = {
              "caseDetails": {
                "CaseId": selectedCaseDetails1['Case_ID'],
                "vaersId": selectedCaseDetails1['Case ID'],
                "status": this.outputReviewDocStatus
              },
              "fileDetails": { 
                "outputpdfpath": this.pdfDownloadUrl,
                "pdfpagerangecsv": this.outputFilePageCsv,
                "pdffilename": this.sampleJsonOutputFiles.fileDetails.pdffilename,
                child : this.uploadFiles
              },
              "user": this.userDetail.Name
            }
            console.log(reqObj);
            this.sharedService.UploadSplittedFilesToOutputFolder(reqObj).subscribe({
            next: (val) => {},
            error: (_error) => {},
            complete:()=>{
              
              this.loader.hideLoader();
                const dialogRef = this.dialog.open(PopupSuccessComponent, {
                  width: '450px',
                  data: <IDynamicDialogConfig>{
                  title: 'Success',
                  titleFontSize:'20',
                  dialogContent : 'Documents successfully uploaded to VAERS.',
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
      
              dialogRef.disableClose = true;
      
              dialogRef.componentInstance.buttonClicked.subscribe(action => {
                  switch (action) {
                  case 'accept':
                    this.closeCompleteEventEmitter.emit("Complete");
                      break;
                  case 'decline':
                    this.closeCompleteEventEmitter.emit("Complete");
                      break;
                  case 'later':
                    this.closeCompleteEventEmitter.emit("Complete");
                      break;
                      case 'save':
                        this.closeCompleteEventEmitter.emit("Complete");
                      break;
                  }
              });
            }
          })
          break;
        case 'decline':

          break;
      }
    });
  }

  triggerGenerateOutput(){
    this.showGenerateOutputLoader = true;
    
    let selectedCaseDetails2 = JSON.parse(this.sessionStorage.getItem("selectedCaseDetails"));

    const req = {
      "CaseId": selectedCaseDetails2['Case_ID'],
      "fileDate": selectedCaseDetails2['Created Date'],
      "docId": selectedCaseDetails2['Doc ID'],
      "userName": this.userDetail.Name
    }
    // const req = {
    //   "CaseId": this.currentCaseId
    // };
    this.sharedService.GenerateSummaryOutputDocument(req).subscribe({
     next: (val) => {
      if (val == 'Review Document Generated Successfully') {
      }  
    },
   error: (_error) => {},
    complete:()=>{
        this.getOutputUrlDetails();
    }});
  }

  showoutputfile(type: string, action?, pdfType?: string, childIndex?: number){
    console.log(action);
    if(type == 'pdf') {
      this.loader.showLoader();
      if(pdfType == 'Parent'){
        if(this.sampleJsonOutputFiles.fileDetails){
         this.sampleJsonOutputFiles.fileDetails.selected = true;
         if(this.sampleJsonOutputFiles.fileDetails?.child.length > 0){
           this.sampleJsonOutputFiles.fileDetails.child.map(item => {
             item.selected = false;
           })
         }
        }
      }
      else if (pdfType == 'Child'){
        if(this.sampleJsonOutputFiles.fileDetails){
         this.sampleJsonOutputFiles.fileDetails.selected = false;
         if(this.sampleJsonOutputFiles.fileDetails?.child.length > 0){
           this.sampleJsonOutputFiles.fileDetails.child.map((item, index) => {
            if(index == childIndex){
              item.selected = true;
            }
            else{
              item.selected = false;
            }
           })
         }
        }
      }
      if(action){
        this.fileDetails['File Location'] = action.outputpdfpath;
        let totalPage = this.getTotalPagesFromRange(action.pdfpagerangecsv);
        let tempPageRange = '1-' + totalPage;
        this.fileDetails['Page Range CSV'] = tempPageRange;
        this.fileDetails['File Name'] = action.pdffilename;
        this.GenerateOutputFile.fileLocation = action.outputpdfpath;
        this.GenerateOutputFile.fileName = action.pdffilename;
      }
      this.sessionStorage.setItem('lsLoaded', 'Y');
      this.GenerateOutputFile.pagevariable = 1;
      this.GenerateOutputFile.loadPdfFromUrl();
      let loadingStatus = this.sessionStorage.getItem('PDFViewerLoaded');
      if(loadingStatus === 'Y'){
        this.loader.hideLoader();
      }
    } 
  }

  getTotalPagesFromRange(pageRange: string): number {
    if (pageRange.includes('-')) {
      const [start, end] = pageRange.split('-').map(Number);
      return end - start + 1;
    } else {
        return 1;
    }
  }

  downloadFile(type: string){
    if(type == 'pdf') {
      if (this.pdfDownloadUrl) {
        this.http.get(this.pdfDownloadUrl, {responseType: 'blob'}).subscribe({
        next:  (res) => {
          // this.FileSaverService.save(res, this.outPutPdffilename);
          saveAs(res, this.pdfFileName)
        },
        error:(_err)=>{
          //error
        },
        complete:()=>{
          //complete
        }});
      }
    }
    else {
      if (this.wordurl) {
        this.http.get(this.wordurl, {responseType: 'blob'}).subscribe({
         next: (res) => {
          // this.FileSaverService.save(res, this.outPutWordfilename);
          saveAs(res, this.wordFileName)
        },
        error:(_err)=>{

        },
        complete:()=>{
          //complete
        }});
      }
    }
  }

   /*
      *** Drag & Drop Event ***
  */  
      renderDragforPopup() {
        const component6 = this;
        var isResizing = false,
        lastDownX = 0;
          var container = $('#container_summary'),
              left = $('#left_panel_summary'),
              right = $('#right_panel_summary'),
              handle = $('#drag_summary'),
              offsetRight = 0;
          $('#drag_summary').on('mousedown', function (e) {
              isResizing = true;
              lastDownX = e.clientX;
          });
    
          $(document).on('mousemove', function (e) {
              // we don't want to do anything if we aren't resizing.
              if (!isResizing) 
                  return;
              
              offsetRight = container.width() - (e.clientX - container.offset().left);
              if(offsetRight <= 1090 && offsetRight >= 270) {
                left.css('right', offsetRight);
                right.css('width', offsetRight);
              }
          }).on('mouseup', function (e) {
              // stop resizing
              if (!isResizing) 
              return;
    
              if(component6.GenerateOutputFile) {
                component6.GenerateOutputFile.enablSticktopage = false;
                setTimeout(() => {
                  component6.GenerateOutputFile.enablSticktopage = true;
                }, 500);
              }
              component6.getOffsetValue(offsetRight);
              isResizing = false;
          });
      }

      getOffsetValue(val) {
        this.offsetValues = val;
      }

      viewSourcFile() {
        let caseDetails = JSON.parse(this.sessionStorage.getItem("selectedCaseDetails"));
        const dialogRef = this.dialog.open(PopupCustomComponent, {
          panelClass: 'view-doc-full-view',
          data: <IDynamicDialogConfig>{
            title: 'ViewDoc',
            titleFontSize:'20',
            type : 'ViewDoc',
            titlePosition: 'left',
            additionalButtons: [],
            acceptButtonTitle: '',
            declineButtonTitle: '' ,
            caseDetail: caseDetails,
            fileDetails: ''
            },
            height: '100vh',
            width: '100vw',
        });
        dialogRef.disableClose = true;
    
        dialogRef.afterClosed().subscribe(result => {
        });
      }

}
