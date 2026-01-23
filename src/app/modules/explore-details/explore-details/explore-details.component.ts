import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SharedServiceService } from 'src/app/shared/services/sharedservice.service';
import { SessionStorageService } from 'src/app/shared/services/storage.service';
import { CommonLoaderService } from 'src/app/Standalone/common-loader/common-loader.service';
import * as UTIF from 'utif';
declare var $;

@Component({
  selector: 'app-explore-details',
  templateUrl: './explore-details.component.html',
  styleUrls: ['./explore-details.component.scss']
})
export class ExploreDetailsComponent implements OnInit, AfterViewInit {
  accordianOpen: boolean = true;
  showTiffViewer: boolean = false;
  convertedImageUrl: string;
  batchDetails: any[] = [];
  originalBatchDetails : any;
  fileUrl: any;
  selectedFileDetails: any;
  fileIndex: number;
  totalFiles: any;
  offsetValues: any;
  rotation = 0;
  scale = 1;
  showInvalidFormat: boolean = false;
  cancelAuditBoolean: boolean = false;
  cancelUnsavedBoolean: boolean = false;
  isThumbsDown = false;
  @ViewChild('okButton') okButton!: ElementRef;
  showDocTypeDropdown: any;
  alertMsg: any;
  msgHeader: string;
  torListings: any;
  disableReviewBtn: boolean;

 


  constructor(private sharedServiceService: SharedServiceService, private zone: NgZone,   private loaderService: CommonLoaderService,
   private router: Router, private sessionStorage: SessionStorageService) {
    this.loaderService.showLoader();
   }
  ngOnInit() {
    this.fileIndex = 0;
    setTimeout(() => {
      const isSelectAllSelected = this.sessionStorage.getItem("isSelectAllSelected");
      if(isSelectAllSelected == 'true') {
        this.selectedFileDetails = JSON.parse(this.sessionStorage.getItem("selectedAllFileDetails"));
        this.selectedFileDetails = this.selectedFileDetails.filter(item => item.isSelect);
      } else {
        this.selectedFileDetails = JSON.parse(this.sessionStorage.getItem("selectedCasesDetails"));
      }
      // this.sessionStorage.setItem("isSelectAllSelected", false);
      this.totalFiles = this.selectedFileDetails.length;
      this.fileIndex = 0;
      this.showTiffViewer = true;
      this.convertedImageUrl = '';
      setTimeout(() => {
        this.renderDragforPopup()
      }, 1000);
      this.getExploreDetails();
      // this.getGetTORLookups();
      this.getTiffUrl();
    }, 500);
  
  }

  ngAfterViewInit() {
    ($('#saveSuccess') as any).on('shown.bs.modal', () => {
        this.okButton.nativeElement.focus();
    });
  }

  getTiffUrl() {
    let reqObj = {
      "caseId": this.selectedFileDetails[this.fileIndex].Case_Id
  }
    this.sharedServiceService.getTiffUrl(reqObj).subscribe({
      next: (response) => {
        this.showInvalidFormat = false;
        // this.loaderService.showLoader();
        this.getPresignedUrl(response);
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
    this.sharedServiceService.getPresignedTiffUrl(reqObj).subscribe({
      next: (response) => {
        this.fileUrl = response
        this.convertTiffUrlToImageFormat(this.fileUrl);
      },
      error: (error) => {
        this.loaderService.hideLoader();
      },
      complete: () => {
          
      }
    });
  }

  getExploreDetails(){
    this.cancelAuditBoolean = false;
    this.cancelUnsavedBoolean = false;
    $(".grey-non .highlightBox").remove();
    let reqObj = {
        "batchId": this.selectedFileDetails[this.fileIndex].Batch_ID,
        "caseIdCSV": this.selectedFileDetails[this.fileIndex].Case_Id
    }
    this.sharedServiceService.getBatchDetails(reqObj).subscribe({
      next: (response) => {
        this.batchDetails = response;
        this.torListings = this.batchDetails[0]['Lookups'];
        this.isThumbsDown = this.batchDetails[0]['File Details']['Thumbs Down Flag'] == '' ||  this.batchDetails[0]['File Details']['Thumbs Down Flag'] == 'N' ? false : true;
        if(this.batchDetails[0]['File Details']['File Business Status'] == 'Audit Completed' ) {
          this.batchDetails[0]['Record Details'].forEach(item=>{
            item.borderColor = (this.isThumbsDown && this.batchDetails[0]['TOR'] == 'Welcome Letter') ? 'Red' :  (!this.isThumbsDown && this.batchDetails[0]['TOR'] == 'Welcome Letter') ? 'Green' : this.isThumbsDown && (this.batchDetails[0]['TOR'] == 'Not-Classified' || this.batchDetails[0]['TOR'] == 'Not-Processed') ? 'Green' : 'Black'
          });
        }        
        this.originalBatchDetails  = JSON.parse(JSON.stringify(this.batchDetails));
      },
      error: (error) => {
      },
      complete: () => {
        this.showDocTypeDropdown = false;
      }
    });
  }

  getGetTORLookups() {
  this.sharedServiceService.getTORLookups().subscribe({
    next: (response) => {
      this.torListings = response.Lookups;
    },
    error: (error) => {
    },
    complete: () => {
    }
  });
  }


  convertTiffUrlToImageFormat(tiffUrl: string) {
    fetch(tiffUrl)
      .then((response) => response.arrayBuffer())
      .then((buffer) => this.convertArrayBufferToImage(buffer))
      .catch((error) => {
        this.loaderService.hideLoader();
        console.error('Error fetching TIFF image:', error);
      });
  }

  convertArrayBufferToImage(arrayBuffer: ArrayBuffer) {
    try {
      this.showInvalidFormat = false;
      // Step 1: Decode TIFF using UTIF.js
      const tiffData = UTIF.decode(arrayBuffer);
      UTIF.decodeImage(arrayBuffer, tiffData[0]);
      const rgba = UTIF.toRGBA8(tiffData[0]); // RGBA pixel data
  
      // Step 2: Create a canvas and draw the decoded image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = tiffData[0].width;
      canvas.height = tiffData[0].height;
  
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      imageData.data.set(rgba); // Set pixel data
      ctx.putImageData(imageData, 0, 0);
  
      // Step 3: Convert the canvas to the desired format
      const dataUrl = canvas.toDataURL(`image/${'png'}`);
      // console.log('Converted Image URL:', dataUrl);
  
      // Store the result
      this.convertedImageUrl = dataUrl;
      this.loaderService.hideLoader();
      this.resetTransform();
    } catch (error) {
      this.loaderService.hideLoader();
      this.showInvalidFormat = true;
      console.error('Error decoding TIFF:', error);
    }
  }

  renderDragforPopup() {
    const component6 = this;
    var isResizing = false,
    lastDownX = 0;
      var container = $('#container_explore'),
          left = $('#left_panel_explore'),
          right = $('#right_panel_explore'),
          handle = $('#drag_explore'),
          offsetRight = 0;
      $('#drag_explore').on('mousedown', function (e) {
          isResizing = true;
          lastDownX = e.clientX;
      });

      $(document).on('mousemove', function (e) {
          // we don't want to do anything if we aren't resizing.
          if (!isResizing) 
              return;
          
          offsetRight = container.width() - (e.clientX - container.offset().left);
          if(offsetRight <= 900 && offsetRight >= 500) {
            left.css('right', offsetRight);
            right.css('width', offsetRight);
          }
      }).on('mouseup', function (e) {
          // stop resizing
          if (!isResizing) 
          return;

          // if(component6.GenerateOutputFile) {
          //   component6.GenerateOutputFile.enablSticktopage = false;
          //   setTimeout(() => {
          //     component6.GenerateOutputFile.enablSticktopage = true;
          //   }, 500);
          // }
          component6.getOffsetValue(offsetRight);
          isResizing = false;
      });
  }

  backToFileList() {
    // if(this.selectedFileDetails[this.fileIndex]['Business Status'] == 'Pending Audit') {
    //   (<any>$('#savealert')).modal('show');
    // } else {
      if(!this.validateForm() && !this.cancelUnsavedBoolean) {
        this.sessionStorage.setItem("Navigation", 'exit');
        (<any>$('#unsavedChange')).modal('show');
        return;
      }
      this.router.navigate(['/filelistdashboard']);
    // }
  }

  auditConfirm() {
    let reqObj = {
      "caseId": this.selectedFileDetails[this.fileIndex].Case_Id
  }
    this.sharedServiceService.completeAudit(reqObj).subscribe({
      next: (response) => {
        (<any>$('#savealert')).modal('hide');
        this.router.navigate(['/filelistdashboard']);
      },
      error: (error) => {
      },
      complete: () => {
          
      }
    });
  }

  auditConfirmComplete() {
    let reqObj = {
      "caseId": this.selectedFileDetails[this.fileIndex].Case_Id
  }
    this.sharedServiceService.completeAudit(reqObj).subscribe({
      next: (response) => {
        (<any>$('#auditComplete')).modal('hide');
        this.selectedFileDetails[this.fileIndex]['Business Status'] = 'Audit Completed';
        this.sessionStorage.setItem("selectedAllFileDetails", JSON.stringify(this.selectedFileDetails));
      },
      error: (error) => {
      },
      complete: () => {
        const auditNaviagtion = this.sessionStorage.getItem("auditNaviagtion");
        if(auditNaviagtion == 'prevNav') {
          this.prevNav();
        } else if(auditNaviagtion == 'nextNav') {
          this.nextNav();
        } else if(auditNaviagtion == 'lastNavPage') {
          this.lastNavPage();
        } else if(auditNaviagtion == 'firstNavPage') {
          this.firstNavPage();
        } 
      }
    });
  }

  cancelAuditComplete() {
    (<any>$('#auditComplete')).modal('hide');
    this.cancelAuditBoolean = true;
    const auditNaviagtion = this.sessionStorage.getItem("auditNaviagtion");
    if(auditNaviagtion == 'prevNav') {
      this.prevNav();
    } else if(auditNaviagtion == 'nextNav') {
      this.nextNav();
    } else if(auditNaviagtion == 'lastNavPage') {
      this.lastNavPage();
    } else if(auditNaviagtion == 'firstNavPage') {
      this.firstNavPage();
    } 
  }

  navigateNextLevel() {
    (<any>$('#unsavedChange')).modal('hide');
    this.cancelUnsavedBoolean = true;
    const auditNaviagtion = this.sessionStorage.getItem("Navigation");
    if(auditNaviagtion == 'prevNav') {
      this.prevNav();
    } else if(auditNaviagtion == 'nextNav') {
      this.nextNav();
    } else if(auditNaviagtion == 'lastNavPage') {
      this.lastNavPage();
    } else if(auditNaviagtion == 'firstNavPage') {
      this.firstNavPage();
    } else if(auditNaviagtion == 'exit') {
      this.backToFileList();
    }
  }

  validateForm() {
    if (JSON.stringify(this.batchDetails) !== JSON.stringify(this.originalBatchDetails)) {
      return false
    }
    return true;
  }

  prevNav() {
    if(this.fileIndex > 0) {
      // if(this.selectedFileDetails[this.fileIndex]['Business Status'] == 'Pending Audit' && !this.cancelAuditBoolean) {
      //   this.sessionStorage.setItem("auditNaviagtion", 'prevNav');
      //   (<any>$('#auditComplete')).modal('show');
      //   return;
      // }
      if(!this.validateForm() && !this.cancelUnsavedBoolean) {
        this.sessionStorage.setItem("Navigation", 'prevNav');
        (<any>$('#unsavedChange')).modal('show');
        return;
      }
      this.fileIndex--;
      this.getExploreDetails();
      this.getTiffUrl();
    }
  }

  nextNav() {
    if (this.fileIndex < this.totalFiles - 1) {
      // if(this.selectedFileDetails[this.fileIndex]['Business Status'] == 'Pending Audit' && !this.cancelAuditBoolean) {
      //   this.sessionStorage.setItem("auditNaviagtion", 'nextNav');
      //   (<any>$('#auditComplete')).modal('show');
      //   return;
      // }
      if(!this.validateForm() && !this.cancelUnsavedBoolean) {
        this.sessionStorage.setItem("Navigation", 'nextNav');
        (<any>$('#unsavedChange')).modal('show');
        return;
      }
      this.fileIndex++;
      this.getExploreDetails();
      this.getTiffUrl();
    }
  }

  lastNavPage() {
    if(this.totalFiles != 1) {
      if(this.totalFiles != this.fileIndex + 1) {
      // if(this.selectedFileDetails[this.fileIndex]['Business Status'] == 'Pending Audit' && !this.cancelAuditBoolean) {
      //   this.sessionStorage.setItem("auditNaviagtion", 'lastNavPage');
      //   (<any>$('#auditComplete')).modal('show');
      //   return;
      // }
      if(!this.validateForm() && !this.cancelUnsavedBoolean) {
        this.sessionStorage.setItem("Navigation", 'lastNavPage');
        (<any>$('#unsavedChange')).modal('show');
        return;
      }
      this.fileIndex = this.totalFiles - 1;
      this.getExploreDetails();
      this.getTiffUrl();
     }
    }
  }

  firstNavPage() {
    if(this.totalFiles != 1) {
      if(this.fileIndex != 0) {
      // if(this.selectedFileDetails[this.fileIndex]['Business Status'] == 'Pending Audit' && !this.cancelAuditBoolean) {
      //   this.sessionStorage.setItem("auditNaviagtion", 'firstNavPage');
      //   (<any>$('#auditComplete')).modal('show');
      //   return;
      // }
      if(!this.validateForm() && !this.cancelUnsavedBoolean) {
        this.sessionStorage.setItem("Navigation", 'firstNavPage');
        (<any>$('#unsavedChange')).modal('show');
        return;
      }
      this.fileIndex = 0;
      this.getExploreDetails();
      this.getTiffUrl();
     }
    }
  }
  
  getOffsetValue(val) {
    this.offsetValues = val;
  }

  highlightBox(value) {
    $(".grey-non .highlightBox").remove();
    value.Dimensions.forEach(item=>{
      var rect = $("<div>", {
        class: "highlightBox"
      }).appendTo($(".grey-non")).css({
        width: item.Width * 100 + '%',
        height: item.Height * 100 + '%',
        top: item.Top * 100 + 1 + '%',
        left: item.Left * 100 + '%',
        position: "absolute",
        background: '#16fb1d52'
      });
    })
  }

  saveRecordDetails(key, value) {
    let reqObj = {
      "caseId": this.selectedFileDetails[this.fileIndex].Case_Id,
      "batchId": this.selectedFileDetails[this.fileIndex].Batch_ID,
      "fieldName": key,
      "fieldValue": value
  }
    this.sharedServiceService.updateRecordDetails(reqObj).subscribe({
      next: (response) => {
        
      },
      error: (error) => {
      },
      complete: () => {
          
      }
    });
  }

  cancelAudit() {
    this.router.navigate(['/filelistdashboard']);
  }

  get transform(): string {
    return `rotate(${this.rotation}deg) scale(${this.scale})`;
  }

  rotateImage(): void {
    $(".grey-non .highlightBox").remove();
    this.rotation = (this.rotation + 90); // Increment rotation by 90 degrees, reset to 0 after a full loop
  }

  zoomImage(factor: number): void {
    $(".grey-non .highlightBox").remove();
    this.scale = Math.max(1, this.scale + factor); // Prevent scale from going below 0.1
  }

  resetTransform(): void {
    this.rotation = 0;
    this.scale = 1;
  }

  validateRecordDetails(recordDetails) {
    let missingFields = [];

    for (const field of recordDetails) {
        if (field.IsMandatory === 'Y' && (!field.Value || field.Value.trim() === '')) {
            missingFields.push(field.Key);
        }
    }

    if (missingFields.length > 0) {
        // Create a dynamic message
        const fieldList = missingFields.join(', ');
        // const message = `Please ensure all field(s) (${fieldList}) are filled before completing the audit.`;
        const message = `Please ensure all mandatory field(s) are filled before completing the audit.`;
        // Inject the message into the modal content
        document.getElementById('validateAlertMessage').innerText = message;

        // Show modal (assuming Bootstrap modal)
        (<any>$('#validateAlert')).modal('show');

        return false;
    }

    return true; // All good, continue submission
}

  saveAttributes(item) {
    // if((this.batchDetails[0]['TOR'] == 'Welcome Letter' && !this.isThumbsDown) && (item[0].Value == '' || item[1].Value == '' || item[2].Value == '')) {
    //   (<any>$('#validateAlert')).modal('show');
    //   return
    // }
    // if(((this.batchDetails[0]['TOR'] == 'Not-Classified' || this.batchDetails[0]['TOR'] == 'Not-Processed') && this.isThumbsDown) && (item[0].Value == '' || item[1].Value == '' || item[2].Value == '')) {
    //   (<any>$('#validateAlert')).modal('show');
    //   return
    // }
    // const originalBatchDetails = JSON.stringify(this.originalBatchDetails);
    if(this.isThumbsDown && this.batchDetails[0]['TOR'] == this.originalBatchDetails[0]['TOR']) {
      (<any>$('#validateTor')).modal('show');
      return
    }

    let isValid = true;
    if(this.batchDetails[0]['TOR'] != 'Non-Relevant Page') {
      isValid = this.validateRecordDetails(item);
    } 

    if(isValid) {
      let mappedDetails = []
    // Convert Record Details array into an object with Key: Value pairs
    if(this.batchDetails[0]['TOR'] != 'Non-Relevant Page') {
       mappedDetails = item.reduce((acc, item) => {
        acc[item.Key] = item.Value;
        return acc;
      }, {} as Record<string, string>);
    } 

    const isNonRelevant = this.batchDetails[0]['TOR'] === 'Non-Relevant Page';

    // Construct the final request object
    const reqObj = {
      caseId: this.selectedFileDetails[this.fileIndex].Case_Id,
      batchId: this.selectedFileDetails[this.fileIndex].Batch_ID,
      ...(isNonRelevant ? {} : mappedDetails),
      typeOfRecord: this.batchDetails[0]['TOR'] ,
      thumbsDownFlag: this.isThumbsDown ? 'Y' : 'N'
    };

   console.log(reqObj)
   this.loaderService.showLoader();
    this.sharedServiceService.updateRecordDetails(reqObj).subscribe({
      next: (response) => {
           this.loaderService.hideLoader();
        // this.batchDetails[0]['Record Details'].forEach(item=>{
        //   item.borderColor = (this.isThumbsDown && this.batchDetails[0]['TOR'] == 'Welcome Letter') ? 'Red' :  (!this.isThumbsDown && this.batchDetails[0]['TOR'] == 'Welcome Letter') ? 'Green' : 'Black'
        // });
      },
      error: (error) => {
            this.loaderService.hideLoader();
      },
      complete: () => {
        (<any>$('#saveSuccess')).modal('show');
      }
    });
   }
  }

  saveSuccessAudit() {
    (<any>$('#saveSuccess')).modal('hide');
    this.getExploreDetails();
  }

  reprocessBatch() {
    (<any>$('#reprocessbatch')).modal('hide');
    this.getExploreDetails();
  }

  toggleThumbsDown(status, TOR) {
    // this.showDocTypeDropdown = false;
    if(status == 'Pending Audit') {
      this.isThumbsDown = !this.isThumbsDown;
      // if(this.isThumbsDown && TOR == 'Not-Classified') {
        // this.showDocTypeDropdown = true;
        if(TOR == 'Not-Classified') {
          this.disableReviewBtn = true;
        } else {
          this.disableReviewBtn = false;
        }
      // } else {
      //   this.showDocTypeDropdown = false;
      // }
    }
  }

  torChange(value) {
    if(this.batchDetails[0]['TOR'] == this.originalBatchDetails[0]['TOR']) {
      this.isThumbsDown = false;
    } else {
      this.isThumbsDown = true;
    }
    this.disableReviewBtn = false;
    let reqObj = {
        "typeOfRecord": value,
        "batchId": this.selectedFileDetails[this.fileIndex].Batch_ID,
        "caseIdCSV": this.selectedFileDetails[this.fileIndex].Case_Id
    }

    this.sharedServiceService.getDynamicFieldDetailsForTOR(reqObj).subscribe({
      next: (response) => {
        if(response && Object.keys(response).length > 0) {
          this.batchDetails[0]['Record Details'] = response['Record Details'];
          this.batchDetails[0]['File Details'] = response['File Details'];
          this.batchDetails[0]['Error Details'] = response['Error Details'];
        } else {
          this.batchDetails[0]['File Details']['Rename File Name'] = '';
         this.batchDetails[0]['Record Details'] = [];

        }
      },
      error: (error) => {
      },
      complete: () => {        
      }
    });
  }


  reProcessFile(item) {
    if(this.isThumbsDown && this.batchDetails[0]['TOR'] == this.originalBatchDetails[0]['TOR']) {
      (<any>$('#validateTorReprocess')).modal('show');
      return
    }
    let reqObj = {
      "caseIdCSV": this.selectedFileDetails[this.fileIndex].Case_Id,
      "batchId": this.selectedFileDetails[this.fileIndex].Batch_ID,
      "typeOfRecord": this.batchDetails[0]['TOR'],
    };
  
    console.log(reqObj);
    this.loaderService.showLoader();
    this.sharedServiceService.newReprocessBatch(reqObj).subscribe({
      next: (response) => {
        this.alertMsg = response.Status;
        this.loaderService.hideLoader();
        if(this.alertMsg.includes('Reprocessed successfully')) {
          this.msgHeader = 'Success';
        } else {
          this.msgHeader = 'Missing Extraction';
        }

        // this.batchDetails = response;
        setTimeout(() => {
                  (<any>$('#reprocessbatch')).modal('show');
        }, 500);
        // this.isThumbsDown = this.batchDetails[0]['File Details']['Thumbs Down Flag'] == '' ||  this.batchDetails[0]['File Details']['Thumbs Down Flag'] == 'N' ? false : true;
      },
      error: (error) => {
          this.loaderService.hideLoader();
      },
      complete: () => {        
        // this.showDocTypeDropdown = false;
      }
    });
  }
}
