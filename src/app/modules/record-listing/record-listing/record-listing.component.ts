import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EcareGridSettings } from 'src/app/shared/modal/ecareGridSetting';
import { SharedServiceService } from 'src/app/shared/services/sharedservice.service';
import { SessionStorageService } from 'src/app/shared/services/storage.service';
import { environment } from 'src/environments/environments';
import { DataEntryPopupViewComponent, IDataEntryDynamicDialogConfig } from '../../data-entry-popup-view/data-entry-popup-view/data-entry-popup-view.component';
import { FileExplorerViewComponent } from '../../file-explorer-view/file-explorer-view/file-explorer-view.component';
import { CommonLoaderService } from 'src/app/Standalone/common-loader/common-loader.service';
import { ClientSideGridComponent } from 'src/app/Standalone/client-side-grid/client-side-grid.component';
import { IDynamicDialogConfig, PopupTemplateComponent } from '../../shared-module/popup-template/popup-template.component';
declare var $;

@Component({
  selector: 'app-record-listing',
  templateUrl: './record-listing.component.html',
  styleUrls: ['./record-listing.component.scss']
})
export class RecordListingComponent implements OnInit {
  @Input() PageFieldType: string;
  @Output() closeCompleteEventEmitter = new EventEmitter<string>();
  /*
      *** View Child declaration ***
  */
  @ViewChild('recordListing') recordListing: FileExplorerViewComponent;
  @ViewChild(ClientSideGridComponent) ClientSideGridComponent: ClientSideGridComponent;
  /*
      *** Variable declaration ***
  */
  gridWidget: EcareGridSettings;
  loadRecordListingGrid : boolean = true;
  loadPDFViewer : boolean = true;
  fileDetails = {};
  popoutPath: string;
  CaseDetails;
  loader: boolean = false;
  tempPageVariable: number;
  selectedObj: { pageNo: number[]; tor: any; };
  gridDataValues: any;
  offsetValues: any;
  userDetail;
  gridData: any;
  hideQAVerified: boolean = false;
  PageType: string = 'RecordListing';

  constructor(
    private sessionStorage: SessionStorageService,
    private sharedService: SharedServiceService,
    public dialog: MatDialog,
    private loaderService: CommonLoaderService
    ) {}
  
  ngOnInit(): void {
    this.userDetail = this.sessionStorage.getObj('currentUser');
    this.CaseDetails = JSON.parse(this.sessionStorage.getItem('selectedCaseDetails'));
    this.sessionStorage.setItem('recordListingPageType', this.PageFieldType)
    this.popoutPath = "recordListing";
    this.selectedObj = {
      pageNo: [],
      tor: ''
    }
    this.gridApiTrigger();
    this.getFileDetails();
  };
  gridApiTrigger(){
    // this.getGridMetaData();
    this.getGridData();
  }
  /*
      *** get grid meta data ***
  */
  getGridMetaData(): void {
    const reqObj = {
      "caseId": this.CaseDetails['Case_ID'].toString(),
      "PageBunchingFlag":"N",
      "Token":""
    };
    this.sharedService.GetGridMetadata(reqObj).subscribe({
      next: (response) => {
        // Handle 'next' callback
        this.fileDetails = response[0];
      },
      error: (error) => {
          // Handle 'error' callback
      },
      complete: () => {
          // Handle 'complete' callback
          this.getGridData();
      }
    });
  }
  /*
      *** get grid meta data ***
  */
  getGridData(): void {
    const reqObj = {
      "CaseId": this.CaseDetails['Case_ID'].toString(),
    };
    this.gridWidget = {
      id: 'RecordListing',
      checklocaljson : false,
      apiMethod: 'post',
      apiUrl: `${environment.apiService}DocProcessing/GetGridData`,
      apiRequest: reqObj,
      rowSelection: 'single',
      gridname: 'RecordListingGrid'
    };
    setTimeout(() => {
      this.loadRecordListingGrid = false;
    }, 100);
    this.loader = false;
  }
  
  /*
      *** get File Details ***
  */
  getFileDetails(): void {
    this.loadPDFViewer = false;
    setTimeout(() => {
      this.renderDragforPopup()
    }, 1000);
  }

   gridClickEvent(event){
    console.log(event);
    let data = event.Data;
    const tempPageValue = this.expandPageRanges(data['Page No']);
    this.selectedObj = {
      pageNo: tempPageValue,
      tor: data['Record Type']
    }
    if(event.From === 'HyperlinkRendererComponent'){
      let RecodDetailsArr: { typeOfRecord: string; torId: string; Pageno: string; }[] =[];
      let AllData = event.AllData;
      if(AllData && AllData?.length > 0){
        AllData.forEach(element => {
          let numbers: number[] = this.getPageNumbers(element['Page No']);
          let PageNumbers: string = '';
          if(numbers && numbers.length > 0){
            PageNumbers = numbers.map(num => num.toString()).join(',');
          }
          let tempObj: { typeOfRecord: string; torId: string; Pageno: string; PageNumbers: string; }
          tempObj = {
            "typeOfRecord": element['Record Type'],
            "torId": element['TOR Id'],
            "Pageno": element['Page No'],
            "PageNumbers": PageNumbers
          }
          RecodDetailsArr.push(tempObj);
        });
      }
      if(this.recordListing){
        this.tempPageVariable = this.recordListing.pagevariableView;
      }
      this.sessionStorage.setItem('recordListingData', JSON.stringify(RecodDetailsArr));
      this.sessionStorage.setItem('selectedTORID', data['TOR Id']);
      const dialogRef = this.dialog.open(DataEntryPopupViewComponent, {
        width: '100vw',
        height: '100vh',
        panelClass: 'task-details-full-view',
        data: <IDataEntryDynamicDialogConfig>{
          title: 'Manage Listing',
          titleFontSize: "15",
          showClose: true,
          titlePosition: 'left',
          contentPosition: 'None',
          buttonPosition: 'right',
          selectorName: 'Record Split',
          showActionButtons: false,
          dataEntryPageInput: 'popup',
          RecordSplitPageInput: 'Record Split',
          PageFieldType: this.PageFieldType,
          TabName: 'Record Listing'
        }
      });
      dialogRef.disableClose = true;

      dialogRef.componentInstance.buttonClicked.subscribe(action => {
        switch (action) {
          case 'accept':
            // console.log('User clicked "Yes"');
            // Handle "Yes" button click
            break;
          case 'decline':
            // console.log('User clicked "No"');
            this.loadRecordListingGrid = true;
            this.gridApiTrigger();
            if(this.recordListing){
              this.recordListing.pagevariableView = this.tempPageVariable;
              this.recordListing.removeDIVforHighlight('dataEntry');
            }
            // Handle "No" button click
            break;
          case 'later':
            // console.log('User clicked "later"');
            break;
            case 'save':
            // console.log('User clicked "save"');
            this.loadRecordListingGrid = true;
            this.gridApiTrigger();
            // Handle additional button click
            break;
        }
      });
    }
    else if (event.From === 'ActionRendererComponent'  && this.PageFieldType == 'editable'){
      let reqObj = {
        "caseId": this.CaseDetails['Case_ID'],
        "torId": data['TOR Id'],
        "recordReviewFlag": data.action == "fa-solid fa-thumbs-down" ? "Y" : "N",
        "recordReviewStatus": data['Record Review Status'],
        "task": "Record Listing",
        "user": this.userDetail.Name
      }
      this.sharedService.UpdateRecordReviewStatus(reqObj).subscribe({
        next: (response) => {
          // Handle 'next' callback
        },
        error: (error) => {
            // Handle 'error' callback
        },
        complete: () => {
            // Handle 'complete' callback
        }
      });
    }
    // else if (event.From === 'StatusRendererComponent'){
      
    // }
   }
   getPageNumbers(pageString: string): number[] {
     const pages: number[] = [];
     const ranges = pageString.split(',');
 
     ranges.forEach((range) => {
         if (range.includes('-')) {
             const [start, end] = range.split('-').map(Number);
             for (let i = start; i <= end; i++) {
                 pages.push(i);
             }
         } else {
             pages.push(Number(range));
         }
     });
 
     return pages;
   }

   gridDataEvent(event){
    this.gridDataValues = event;
    const tempPageValue = this.expandPageRanges(event[0]['Page No']);
    this.selectedObj = {
      pageNo: tempPageValue,
      tor: event[0]['Record Type']
    }
   }

   gridRowClickEvent(event) {
    console.log(event);
    if(event) {
      let data = event.Data
        const tempPageValue = this.expandPageRanges(data['Page No']);
        this.selectedObj = {
          pageNo: tempPageValue,
          tor: data['Record Type']
         }
         if(event.Type === 'Focus' && this.PageFieldType == 'editable'){
          
          let DataList = [];
          let torIdList = [];
          const indexes: number[] = [];
          for (let i = 0; i < event.AllData.length; i++) {
            if (i >= event.rowIndex) {
              break; // Stop the loop when we find the target torId
            }
            let tempObj = {
              "torId": event.AllData[i]['TOR Id'],
              "data": event.AllData[i]
            }
            if(event.AllData[i]['Record Review Status'] != 'Approved'){
              DataList.push(tempObj);
              torIdList.push(event.AllData[i]['TOR Id'])
            }
          }

          if(data['Record Review Status'] == 'Not Started'){
            let reqObj = {
              "caseId": this.CaseDetails['Case_ID'],
              "torId": data['TOR Id'],
              "recordReviewFlag": data.action == "fa-solid fa-thumbs-down" ? "Y" : "N",
              "recordReviewStatus": "In Progress",
              "task": "Record Listing",
              "user": this.userDetail.Name
            }
            this.sharedService.UpdateRecordReviewStatus(reqObj).subscribe({
              next: (response) => {
                // Handle 'next' callback
              },
              error: (error) => {
                  // Handle 'error' callback
              },
              complete: () => {
                  // Handle 'complete' callback
              }
            });
          }
          
          if(DataList.length > 0){
            
            setTimeout(() => {
              if(this.ClientSideGridComponent){
                DataList.forEach((val1, i) => {
                  val1.data.statusIcon = 'fa-solid fa-circle';
                  val1.data.statusIconColour = '#3cc47c';
                  this.ClientSideGridComponent.updateRowData(i, val1.data)
                });
              }
            }, 100);
            
          }
         }
         if(event.Type === 'FocusOut' && this.PageFieldType == 'editable'){
          let reqObj = {
            "caseId": this.CaseDetails['Case_ID'],
            "torId": data['TOR Id'],
            "recordReviewFlag": data.action == "fa-solid fa-thumbs-down" ? "Y" : "N",
            "recordReviewStatus": "Approved",
            "user": this.userDetail.Name
          }
          this.sharedService.UpdateRecordReviewStatus(reqObj).subscribe({
            next: (response) => {
              // Handle 'next' callback
            },
            error: (error) => {
                // Handle 'error' callback
            },
            complete: () => {
                // Handle 'complete' callback
            }
          });
         }
      if(event.From !== 'HyperlinkRendererComponent'){
      }

      this.recordListing.selectedRecordDetails = this.selectedObj;
      
      this.recordListing.setTorPagesFromGrid();
    }
   }

   generateRangeFromString(input: string): number[] {
    const [start, end] = input.split('-').map(Number);
    const range = [];
    if (isNaN(start) || isNaN(end)) {
      range.push(start)
    }
    
    for (let i = start; i <= end; i++) {
        range.push(i);
    }

    return range;
}

  afterpdfLoaded(event){
    if(event) {
      this.recordListing.selectedRecordDetails = this.selectedObj;
      this.recordListing.setTorPages();
    }
  }

  pageNumberEmitter(event) {
    if(event) {
      this.gridDataValues.map(item=>{
        const tempPageValue = this.expandPageRanges(item['Page No']);
        tempPageValue.map(value=>{
          if(value == event.pageNumber) {
            this.selectedObj = {
              pageNo: tempPageValue,
              tor: item['Record Type']
            }
          }
        })
      })

      this.recordListing.selectedRecordDetails = this.selectedObj;
      this.recordListing.setTorPages();
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
              left = $('#left_panel_record'),
              right = $('#right_panel_record'),
              handle = $('#drag_record'),
              offsetRight = 0;
          $('#drag_record').on('mousedown', function (e) {
              isResizing = true;
              lastDownX = e.clientX;
          });
    
          $(document).on('mousemove', function (e) {
              // we don't want to do anything if we aren't resizing.
              if (!isResizing) 
                  return;
              
              offsetRight = container.width() - (e.clientX - container.offset().left);
              if(offsetRight <= 890 && offsetRight >= 270) {
                left.css('right', offsetRight);
                right.css('width', offsetRight);
              }
          }).on('mouseup', function (e) {
              // stop resizing
              if (!isResizing) 
              return;
    
              if(component6.recordListing) {
                component6.recordListing.enablSticktopage = false;
                setTimeout(() => {
                  component6.recordListing.enablSticktopage = true;
                }, 500);
              }
              component6.getOffsetValue(offsetRight);
              isResizing = false;
          });
      }

      getOffsetValue(val) {
        this.offsetValues = val;
      }

  close(){
    const dialogRef = this.dialog.open(PopupTemplateComponent, {
      width: '500px',
      data: <IDynamicDialogConfig>{
        title: 'Alert',
        titleFontSize:'20',
        dialogContent: 'You are about to leave this page. Any unsaved changes will be lost.',
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
          this.closeCompleteEventEmitter.emit("Close");
          break;
        case 'decline':

          break;
      }
    });
  }
  QAVerified(){
    let reqObj = {
      "CaseId": this.CaseDetails['Case_ID']
    }
    let thumbsDown: boolean = true;
    this.sharedService.GetCaseDislikedTorIdList(reqObj).subscribe({
      next: (response) => {
        if(response?.length == 0){
          thumbsDown = false
        }
        else{
          thumbsDown = true
        }
      },
      error: (error) => {
      },
      complete: () => {
        const dialogRef = this.dialog.open(PopupTemplateComponent, {
          width: '500px',
          data: <IDynamicDialogConfig>{
            title: 'Alert',
            titleFontSize:'20',
            dialogContent: thumbsDown ? 'You have flagged a few splits. Would you like to continue.' :'Are you sure to complete Record Review?',
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
              this.closeCompleteEventEmitter.emit("Complete");
              let reqObj = {
                "caseId": this.CaseDetails['Case_ID'],
                "torId": '',
                "recordReviewFlag": "",
                "recordReviewStatus": "",
                "user": this.userDetail.Name
              }
              this.sharedService.UpdateRecordReviewStatus(reqObj).subscribe({
                next: (response) => {
                  // Handle 'next' callback
                },
                error: (error) => {
                    // Handle 'error' callback
                },
                complete: () => {
                    // Handle 'complete' callback
                }
              });
              break;
            case 'decline':
    
              break;
          }
        });
      }
    });
  }
  expandPageRanges(pageRanges: string): number[] {
    const pages: number[] = [];

    // Split the pageRanges string by commas
    const rangeParts = pageRanges.split(',');

    // Process each part
    rangeParts.forEach(part => {
        // Check if the part contains a range (e.g., "4-7")
        if (part.includes('-')) {
            const [start, end] = part.split('-').map(Number);
            // Expand the range and add each page number to the array
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
        } else {
            // If it's a single page number, add it to the array
            pages.push(Number(part));
        }
    });

    // Sort and remove duplicate page numbers
    return Array.from(new Set(pages)).sort((a, b) => a - b);
}


}
