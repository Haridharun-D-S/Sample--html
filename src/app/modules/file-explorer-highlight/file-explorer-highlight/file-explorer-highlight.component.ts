import { HttpClient } from '@angular/common/http';
import { OnInit,Component, EventEmitter, Input, Output, ViewChild, HostListener, Renderer2, ElementRef } from '@angular/core';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { CommonLoaderService } from 'src/app/Standalone/common-loader/common-loader.service';
import { SharedServiceService } from 'src/app/shared/services/sharedservice.service';
import { SessionStorageService } from 'src/app/shared/services/storage.service';
declare var $;
let fastScrollOff;

@Component({
  selector: 'app-file-explorer-highlight',
  templateUrl: './file-explorer-highlight.component.html',
  styleUrls: ['./file-explorer-highlight.component.scss']
})
export class FileExplorerHighlightComponent implements OnInit {
  /*
      *** Input decorator declaration ***
  */
  @Input() fileDetails;
  @Input() HighlightKeywordArray;
  @Input() popoutPath;
  @Input() pageBunchEmitter: EventEmitter<any>;
  @Input() tabEmitter: EventEmitter<any>;
  @Input() viewEmitter: EventEmitter<any>;
  @Input() FromPage;
  /*
      *** Output decorator declaration ***
  */
  @Output() pageNumberEmitter = new EventEmitter<any>();
  @Output() bookmarkPagesEmitter = new EventEmitter<any>();
  @Output() mrrSelectedHghlght = new EventEmitter<any>();
  @Output() resetFiltrPageList = new EventEmitter<any>();
 /*
      *** View Child declaration ***
  */
  @ViewChild('myPinch') myPinch;
  selectedCaseDetails: any;
  pagevariable: number;
  pdfSrcThumbnail: any;
  showthumbnailPdfView: boolean;
  selectThumbnailByRange: boolean;
  thumbnailLoader: boolean;
  thumbnailPdfPagesLoaded: boolean;
  previousPageIpBx: number;
  /*
       *** Host Listener ***
   */
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    // page up
    if (event.keyCode === 38) {
      fastScrollOff = true;
    }
    // page down
    if (event.keyCode === 40) {
      fastScrollOff = true;
    }
  }
  /*
      *** Variable declaration ***
  */
  selectedTaskDetails;
  enableBookmark: boolean;
  selectBookmark: boolean = false;
  pdfSrcHghLght: string;
  pagevariableHghLght: number = 1;
  showthumbnail: boolean = false;
  showcontrols: boolean;
  rotationval = 0;
  zoomval: number;
  totalPages: number;
  enableScroll: boolean;
  enablSticktopage: boolean;
  dataFrom: string;
  namepinch: string = 'enablezoompinch';
  fromPage: number;
  fileLocation: string;
  fileName;
  updateRangePagevariable: number = 1
  showHighlight: boolean;
  highlightArray = [];
  bookmarkPagesArray: number[] = [];
  caseDetails;
  highDimension;
  listHigh = [];
  mediumDimension;
  listMedium = [];
  lowDimension;
  listLow = [];
  allDimension;
  listAll = [];
  activeButtonHigh = false;
  activeButtonMedium = false;
  activeButtonLow = false;
  activeButtonAll = false;
  thumbnailtoggle = false;
  customNavPageVariable: number;
  customNavTotalPages: number;
  customNavPageArray: number[];
  customNavPageIndex: number;
  fileExplorerData: { pageNumber: number; Event: any; pageFrom: string; PreviousPage: number; bookmark: boolean };
  CustomInputFieldValue: string;
  showTOR: boolean;
  CustomInputFieldProperties: string;
  showPDFViewer: boolean = false;
  idPath: string;
  thumbnail = [];
  thumbnailShowAllPage: boolean = true;
  PageType: string;

  showImage: boolean = false;
  currentPage = 1;
  totalPa: number;
  currentImageUrl: string;
  zoomLevel = 1;
  rotationAngle = 0;
  @ViewChild('thumbnailContainer') thumbnailContainer: ElementRef;

  constructor( 
    private sessionStorage: SessionStorageService,
    public http: HttpClient,
    private renderer: Renderer2,
    private el: ElementRef,
    private sharedService: SharedServiceService,
    private loaderService: CommonLoaderService
    ) {
      this.loadImage(this.currentPage);
  }

  loadImage(page: number) {
      this.currentImageUrl = '../../../../assets/Images/Vaers Logo 3.png';
      this.totalPa = 25; 
  }

  nextPage() {
    if (this.currentPage <= this.totalPages) {
      this.currentPage++;
      this.currentImageUrl = '../../../../assets/Images/Vaers Logo 3.png';
      this.totalPa = 25; 
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.currentImageUrl = '../../../../assets/Images/login-left1.png';
      this.totalPa = 25;
    }
  }

  zoomIn() {
    this.zoomLevel += 0.1;
  }

  zoomOut() {
    if (this.zoomLevel > 0.1) {
      this.zoomLevel -= 0.1;
    }
  }

  

  rotateLeft() {
    this.rotationAngle -= 90;
  }

  rotateRight() {
    this.rotationAngle += 90;
  }


  ngOnInit() {
    this.sessionStorage.setItem('PDFViewerLoaded', 'N');
    this.idPath = this.popoutPath;
    this.thumbnailPdfPagesLoaded = false;
    this.dataFrom = '';
    this.zoomval = 0.8;
    this.getCaseDetails();
    this.pageBunchEmitter.subscribe((data) => {
      if(data.trigger == 'Start') {
        this.enableBookmark = true;
        this.selectBookmark = false;
        this.bookmarkPagesArray = data.pageValues;
        if(this.enableBookmark) {
          this.selectByRange('Range');
        }
        this.thumbnail.map(item=>{
          item.bunchingMarked = false
        })
        setTimeout(() => {
          this.bookmarkPagesArray.map(item=>{
            if(item == this.pagevariableHghLght) {
              this.selectBookmark = true;
            }
          })

          this.thumbnail.map((item, i)=>{
            this.bookmarkPagesArray.map(val=>{
              if(item.page == val) {
                item.bunchingMarked = true;
                if(item.page == this.pagevariableHghLght){
                  const id = `thumbnail${this.FromPage}${i}`;
                  const element = document.getElementById(id);
                  const container = this.thumbnailContainer.nativeElement;
                  if (container && element) {
                    const offsetTop = element.offsetTop;
                    const containerScrollTop = container.scrollTop;
                    const containerOffsetTop = container.getBoundingClientRect().top;
                    const scrollTo = offsetTop - containerOffsetTop;
                    container.scrollTo({ top: scrollTo, behavior: 'smooth' });
                  }
                }
              }
            })
          })
        }, 200);
      } else if(data.trigger == 'Stop') {
        this.enableBookmark = false;
        this.thumbnail.map(item=>{
          item.bunchingMarked = false
        })
        this.thumbnail.map((item,i)=>{
          if(item.page == this.pagevariableHghLght) {
            item.bunchingMarked = true;
            if(item.page == this.pagevariableHghLght){
              const id = `thumbnail${this.FromPage}${i}`;
              const element = document.getElementById(id);
              const container = this.thumbnailContainer.nativeElement;
              if (container && element) {
                const offsetTop = element.offsetTop;
                const containerScrollTop = container.scrollTop;
                const containerOffsetTop = container.getBoundingClientRect().top;
                const scrollTo = offsetTop - containerOffsetTop;
                container.scrollTo({ top: scrollTo, behavior: 'smooth' });
              }
            }
          }
        })
      }
      else if(data.trigger == 'Update') {
        this.selectBookmark = false;
        if(this.enableBookmark) {
          this.bookmarkPagesArray = data.pageValues;
          this.thumbnail.map(item=>{
            item.bunchingMarked = false
          })
        }
        else{
          this.thumbnail.map(item=>{
            item.bunchingMarked = false
          })
          this.thumbnail.map((item, i)=>{
            if(item.page == this.pagevariableHghLght) {
              item.bunchingMarked = true;
            }
          })
        }
        setTimeout(() => {
          this.bookmarkPagesArray.map(item=>{
            if(item == this.pagevariableHghLght) {
              this.selectBookmark = true;
            }
          })

          this.thumbnail.map((item, i)=>{
            this.bookmarkPagesArray.map(val=>{
              if(item.page == val) {
                item.bunchingMarked = true
                const id = `thumbnail${this.FromPage}${i}`;
                const element = document.getElementById(id);
                const container = this.thumbnailContainer.nativeElement;
                if (container && element) {
                  const offsetTop = element.offsetTop;
                  const containerScrollTop = container.scrollTop;
                  const containerOffsetTop = container.getBoundingClientRect().top;
                  // const scrollTo = offsetTop - containerOffsetTop + containerScrollTop;
                  const scrollTo = offsetTop - containerOffsetTop;
            
                  // Scroll the container to bring the target element into view
                  container.scrollTo({ top: scrollTo, behavior: 'smooth' });
                  // element.scrollIntoView({ behavior: 'smooth', block: 'start'});
                }
              }
            })
          })
        }, 200);
      }
      else {
        this.enableBookmark = false;
      }
      
    });

      this.tabEmitter.subscribe((data) => {
        this.activeButtonHigh = false;
        this.activeButtonMedium = false;
        this.activeButtonLow = false;
        this.activeButtonAll = false;
      })
      this.viewEmitter.subscribe((data) => {
        this.activeButtonHigh = false;
        this.activeButtonMedium = false;
        this.activeButtonLow = false;
        this.activeButtonAll = false;
      })
  }

  getCaseDetails(){
    this.selectedCaseDetails = JSON.parse(this.sessionStorage.getItem('selectedCaseDetails'));
    this.getFileDetails();
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
          this.getDetails();
  }
  /*
      *** get File Details ***
  */
  getDetails(): void {
    this.selectedthumbnail();
    this.fileLocation = this.fileDetails['File Location'];
    this.fileName = this.fileDetails['File Name'] ? this.fileDetails['File Name'] : '';
    this.fileLocation = this.fileLocation.replace(/#/g, "%23")
    this.fileLocation = this.fileLocation.replace(/,/g, "%2C")
    this.fileLocation = this.fileLocation.replace(/\(/g, "%28")
    this.fileLocation = this.fileLocation.replace(/\)/g, "%29")
    // this.fileName = this.fileDetails['File Name'].replace(".pdf", "");
    this.fileName = this.fileDetails['File Name'];
    this.selectedthumbnail();

    if (this.fileDetails['Page Range CSV']) {
      this.setFileDetails();
    }
    this.getPreSignedUrl(this.fileLocation, 1);
    this.getAllPagesPreSignedUrl(this.fileLocation)
  }
  /*
      *** fetching PreSigned URL ***
  */
  getPreSignedUrl(pdfUrl, pageNo) { 
    this.sessionStorage.setItem('PDFViewerLoaded', 'N');
    this.pagevariable = 1;
    const fileurlSplittedValue = pdfUrl.split('.pdf')[0];
    const setFileUrl = fileurlSplittedValue + '-' + pageNo + '.pdf';
    if(this.pdfSrcHghLght == setFileUrl){ 
      this.sessionStorage.setItem('PDFViewerLoaded', 'Y');
      let loadingStatus = this.sessionStorage.getItem('lsLoaded');
      if(loadingStatus === 'Y'){
        this.loaderService.hideLoader();
      }
    }
    const reqObj =
    {
      "FileLocation": setFileUrl
    };
    this.pdfSrcHghLght = setFileUrl;
    this.pagevariable = 1;
    this.showPDFViewer = true;
  }

   /*
      *** fetching All pdf pages PreSigned URL ***
  */
  getAllPagesPreSignedUrl(pdfUrl) {
    const fileurlSplittedValue = pdfUrl.split('.pdf')[0];
    const setFileUrl = fileurlSplittedValue + '-' + 'thumbnail' + '.pdf';
    this.pdfSrcThumbnail = setFileUrl;
  }

  /*
      *** Enable Thumbnail ***
  */
  enableThumbnail() {
    this.showthumbnailPdfView = false;
    this.thumbnailtoggle = !this.thumbnailtoggle
    if(this.thumbnailtoggle) {
      this.showthumbnailPdfView = true;
      this.thumbnailLoader = true;
      if(this.enableBookmark) {
        this.selectByRange('Range');
      }
      this.thumbnail.map(item=>{
        item.bunchingMarked = false
      })
      this.thumbnail.map((item, i)=>{
        if(item.page == this.pagevariableHghLght) {
          item.bunchingMarked = true
          const id = `thumbnail${this.FromPage}${i}`;
          const element = document.getElementById(id);
          const container = this.thumbnailContainer.nativeElement;
          if (container && element) {
            const offsetTop = element.offsetTop;
            const containerScrollTop = container.scrollTop;
            const containerOffsetTop = container.getBoundingClientRect().top;
            // const scrollTo = offsetTop - containerOffsetTop + containerScrollTop;
            const scrollTo = offsetTop - containerOffsetTop;
      
            // Scroll the container to bring the target element into view
            container.scrollTo({ top: scrollTo, behavior: 'smooth' });
            // element.scrollIntoView({ behavior: 'smooth', block: 'start'});
          }
        }
      })
    }
  }
  enableThumbnailFromParent() {
    this.showthumbnailPdfView = false;
    if(this.thumbnailtoggle) {
      this.showthumbnailPdfView = true;
      this.thumbnailLoader = true;
      if(this.enableBookmark) {
        this.selectByRange('Range');
      }
    }
  }

  onClickBookmark() {
    this.thumbnail.map(item=>{
      item.bunchingMarked = false
    })
    this.selectBookmark = !this.selectBookmark;
    if(this.selectBookmark) {
      this.bookmarkPagesArray.push(this.pagevariableHghLght);
    } else {
      this.bookmarkPagesArray = this.bookmarkPagesArray.filter(item => item !== this.pagevariableHghLght);
    }
    this.thumbnail.map((item,i)=>{
      this.bookmarkPagesArray.map(val=>{
        if(item.page == val) {
          item.bunchingMarked = true
          // const id = `thumbnail${i}`;
          // const element = document.getElementById(id);
          // if (element) {
          // element.scrollIntoView({ behavior: 'smooth', block: 'start'});
          // }
        }
      })
    })
    this.bookmarkPagesArray.sort((a, b) => a - b);
    this.bookmarkPagesEmitter.emit(this.bookmarkPagesArray);
  }

  ngAfterViewChecked() {
    if (this.fileDetails && this.fileDetails['Page Range CSV']) {
      if (this.pagevariableHghLght < Number(this.fileDetails['Page Range CSV'].split('-')[0])) {
        this.pagevariableHghLght = Number(this.fileDetails['Page Range CSV'].split('-')[0]);
      }
      if (this.pagevariableHghLght > Number(this.fileDetails['Page Range CSV'].split('-')[1])) {
        this.pagevariableHghLght = Number(this.fileDetails['Page Range CSV'].split('-')[1]);
      }
    }
  }

  setFileDetails() {
    if(this.fileDetails && this.fileDetails['Page Range CSV']){
      let filePageRange;
      filePageRange = this.fileDetails['Page Range CSV'].split('-');
      this.totalPages = Number(filePageRange[1]);
      this.fromPage = Number(filePageRange[0]);
      // this.pagevariableHghLght = Number(filePageRange[0]);
      this.updateRangePagevariable = Number(filePageRange[0]);
    }
  }

  resetPageNumbers(){
    this.dataFrom = ''
    const filePageRange = this.fileDetails['Page Range CSV'].split('-');
    this.totalPages = Number(filePageRange[1]);
    this.fromPage = Number(filePageRange[0]);
    this.pagevariableHghLght = Number(filePageRange[0]);
  }
  
  afterLoadComplete(pdf: any) {
    this.thumbnail.map((item, i)=>{
      if(item.page == this.pagevariableHghLght) {
        if(!this.enableBookmark) {
          item.bunchingMarked = true;
        }
        const id = `thumbnail${this.FromPage}${i}`;
        const element = document.getElementById(id);
        const container = this.thumbnailContainer.nativeElement;
        if (container && element) {
          const offsetTop = element.offsetTop;
          const containerScrollTop = container.scrollTop;
          const containerOffsetTop = container.getBoundingClientRect().top;
          // const scrollTo = offsetTop - containerOffsetTop + containerScrollTop;
          const scrollTo = offsetTop - containerOffsetTop;
    
          // Scroll the container to bring the target element into view
          container.scrollTo({ top: scrollTo, behavior: 'smooth' });
          // element.scrollIntoView({ behavior: 'smooth', block: 'start'});
        }
      }
    })
    this.previousPageIpBx = this.pagevariableHghLght;
    this.sessionStorage.setItem('PDFViewerLoaded', 'Y');
    let loadingStatus = this.sessionStorage.getItem('lsLoaded');
    if(loadingStatus === 'Y'){
      this.loaderService.hideLoader();
    }
    setTimeout(() => {
      this.setFileDetails()
      this.enableScroll = false
      if (this.enableScroll) {
        this.scrollLock()
      }
    }, 100);
  }
  previous(action) {
    this.rotationval = 0;
    this.zoomval = 0.8;
    const temppage = Number(this.pagevariableHghLght) - 1;
    if (Number(temppage) >= this.fromPage) {
      this.selectBookmark = false;
      this.getPreSignedUrl(this.fileLocation, temppage);
      setTimeout(() => {
        if (temppage !== 0) {
          this.pagevariableHghLght = temppage;
          this.fileExplorerData = {
            pageNumber: temppage,
            Event: action,
            pageFrom: 'Previous',
            PreviousPage: 0,
            bookmark: this.enableBookmark
          };
          this.pageNumberEmitter.emit(this.fileExplorerData);
          this.previousPageIpBx = this.pagevariableHghLght;
        }
      }, 100);
      if(!this.enableBookmark) {
        this.thumbnail.map(item=>{
          item.bunchingMarked = false
        });
        setTimeout(() => {
          this.thumbnail.map((item, i)=>{
            if(item.page == this.pagevariableHghLght) {
              item.bunchingMarked = true;
            }
          })
        }, 100);
      }
      setTimeout(() => {
        this.bookmarkPagesArray.map(item=>{
          if(item == this.pagevariableHghLght) {
            this.selectBookmark = true;
          } 
          else if(item != this.pagevariableHghLght && this.enableBookmark) {
            this.selectBookmark = true;
            if (this.selectBookmark) {
              const isPageBookmarked = this.bookmarkPagesArray.includes(temppage);
              if (!isPageBookmarked) {
                this.bookmarkPagesArray.push(temppage);
                this.bookmarkPagesArray.sort((a, b) => a - b);
                this.bookmarkPagesEmitter.emit(this.bookmarkPagesArray);
                this.thumbnail.map(item=>{
                  this.bookmarkPagesArray.map(val=>{
                    if(item.page == val) {
                      item.bunchingMarked = true
                    }
                  })
                })
              }
                  
            } 
          }
        })
        this.intelliScroll(0); 
        // if (this.thumbnailtoggle) {
        //   const pageElement = this.thumbnailContainer.nativeElement.querySelector(`#page${this.pagevariableHghLght}`);
        //   if (pageElement) {
        //     pageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        //   }
        // }
      }, 200);
    }
  }
  Next(action) {
    this.zoomval = 0.8;
    this.rotationval = 0;
    const temppage = Number(this.pagevariableHghLght) + 1;
    if (Number(temppage) <= Number(this.totalPages)) {
      this.selectBookmark = false;
      this.getPreSignedUrl(this.fileLocation, temppage);
      setTimeout(() => {
        this.pagevariableHghLght = temppage;

        this.fileExplorerData = {
          pageNumber: temppage,
          Event: action,
          pageFrom: 'Next',
          PreviousPage: 0,
          bookmark: this.enableBookmark
        };
        this.pageNumberEmitter.emit(this.fileExplorerData);
        this.previousPageIpBx = this.pagevariableHghLght;
      }, 100);
      if(!this.enableBookmark) {
        this.thumbnail.map(item=>{
          item.bunchingMarked = false
        });
        setTimeout(() => {
          this.thumbnail.map((item, i)=>{
            if(item.page == this.pagevariableHghLght) {
              item.bunchingMarked = true;
            }
          })
        }, 100);
      }
      setTimeout(() => {
        // console.log(this.bookmarkPagesArray,this.pagevariableHghLght, this.thumbnail);
        this.bookmarkPagesArray.map(item=>{
          if(item == this.pagevariableHghLght) {
            this.selectBookmark = true;
          } 
          else if(item != this.pagevariableHghLght && this.enableBookmark) {
            this.selectBookmark = true;
            if (this.selectBookmark) {
              const isPageBookmarked = this.bookmarkPagesArray.includes(temppage);
              if (!isPageBookmarked) {
                this.bookmarkPagesArray.push(temppage);
                this.bookmarkPagesArray.sort((a, b) => a - b);
                this.bookmarkPagesEmitter.emit(this.bookmarkPagesArray);
                this.thumbnail.map(item=>{
                  this.bookmarkPagesArray.map(val=>{
                    if(item.page == val) {
                      item.bunchingMarked = true
                    }
                  })
                })
              }
                  
            } 
          }
        })
        this.intelliScroll(0); 
        // if (this.thumbnailtoggle) {
        //   const pageElement = this.thumbnailContainer.nativeElement.querySelector(`#page${this.pagevariableHghLght}`);
        //   if (pageElement) {
        //     pageElement.scrollIntoView({ behavior: 'smooth', block: 'center'});
        //   }
        // }
      }, 200);
    }
  }

  changePageinput(value) {
    const previousPage = this.pagevariableHghLght;
    this.rotationval = 0;
    this.zoomval = 0.8;
    if (Number(value) >= this.fromPage && Number(value) <= this.totalPages) {
      this.pagevariableHghLght = Number(value);
      this.updateRangePagevariable = Number(value);
      this.fileExplorerData = {
        pageNumber: this.pagevariableHghLght,
        Event: 'FileExplorerIconClick',
        pageFrom: 'Manual',
        PreviousPage: this.previousPageIpBx,
        bookmark: this.enableBookmark
      };
      this.pageNumberEmitter.emit(this.fileExplorerData);
      this.previousPageIpBx = this.pagevariableHghLght;
      this.getPreSignedUrl(this.fileLocation, this.pagevariableHghLght);
      if(!this.enableBookmark) {
        this.thumbnail.map(item=>{
          item.bunchingMarked = false
        });
        setTimeout(() => {
          this.thumbnail.map((item, i)=>{
            if(item.page == this.pagevariableHghLght) {
              item.bunchingMarked = true;
            }
          })
        }, 100);
      }
      setTimeout(() => {
        this.bookmarkPagesArray.map(item=>{
          if(item == this.pagevariableHghLght) {
            this.selectBookmark = true;
          } 
          else if(item != this.pagevariableHghLght && this.enableBookmark) {
            this.selectBookmark = true;
            if (this.selectBookmark) {
              const isPageBookmarked = this.bookmarkPagesArray.includes(value);
              if (!isPageBookmarked) {
                this.bookmarkPagesArray.push(value);
                this.bookmarkPagesArray.sort((a, b) => a - b);
                this.bookmarkPagesEmitter.emit(this.bookmarkPagesArray);
                this.thumbnail.map(item=>{
                  this.bookmarkPagesArray.map(val=>{
                    if(item.page == val) {
                      item.bunchingMarked = true
                    }
                  })
                })
              }
                  
            } 
          }
        })
        this.bookmarkPagesArray.map(item=>{
          if(item == this.pagevariableHghLght) {
            this.selectBookmark = true;
          }
        })
        this.intelliScroll(0);  
      }, 200);
    }
    if (!(Number(value) >= this.fromPage && Number(value) <= this.totalPages)) {
      this.pagevariableHghLght = undefined;
      setTimeout(() => {
        this.pagevariableHghLght = previousPage;
      }, 100);
    }
  }
  changePageinputV2(value) {
    const previousPage = this.pagevariableHghLght;
    this.rotationval = 0;
    this.zoomval = 0.8;
    if (Number(value) >= this.fromPage && Number(value) <= this.totalPages) {
      this.pagevariableHghLght = Number(value);
      this.updateRangePagevariable = Number(value);
      this.fileExplorerData = {
        pageNumber: this.pagevariableHghLght,
        Event: 'FileExplorerIconClick',
        pageFrom: '',
        PreviousPage: previousPage,
        bookmark: this.enableBookmark
      };
      this.pageNumberEmitter.emit(this.fileExplorerData);
      this.previousPageIpBx = this.pagevariableHghLght;
      this.getPreSignedUrl(this.fileLocation, this.pagevariableHghLght);
      if(!this.enableBookmark) {
        this.thumbnail.map(item=>{
          item.bunchingMarked = false
        });
        setTimeout(() => {
          this.thumbnail.map((item, i)=>{
            if(item.page == this.pagevariableHghLght) {
              item.bunchingMarked = true;
            }
          })
        }, 100);
      }
      setTimeout(() => {
        this.bookmarkPagesArray.map(item=>{
          if(item == this.pagevariableHghLght) {
            this.selectBookmark = true;
          } 
          else if(item != this.pagevariableHghLght && this.enableBookmark) {
            this.selectBookmark = true;
            if (this.selectBookmark) {
              const isPageBookmarked = this.bookmarkPagesArray.includes(value);
              if (!isPageBookmarked) {
                this.bookmarkPagesArray.push(value);
                this.bookmarkPagesArray.sort((a, b) => a - b);
                this.bookmarkPagesEmitter.emit(this.bookmarkPagesArray);
                this.thumbnail.map(item=>{
                  this.bookmarkPagesArray.map(val=>{
                    if(item.page == val) {
                      item.bunchingMarked = true
                    }
                  })
                })
              }
                  
            } 
          }
        })
        this.bookmarkPagesArray.map(item=>{
          if(item == this.pagevariableHghLght) {
            this.selectBookmark = true;
          }
        })
        this.intelliScroll(0);  
      }, 200);
    }
    if (!(Number(value) >= this.fromPage && Number(value) <= this.totalPages)) {
      this.pagevariableHghLght = previousPage;
    }
  }

  clockwiseRotation() {
    this.rotationval += 90;
  }
  anticlockwiseRotation() {
    this.rotationval -= 90;
  }
  zoomin(): void {
    this.zoomval += 0.05;
    // this.myPinch.toggleZoom();
  }
  zoomout(): void {
    // this.myPinch.toggleZoom();
    if (this.zoomval !== 1) {
      this.zoomval -= 0.05;
    }
  }
  scrollLock() {
    this.namepinch = 'disablezoompinch'
    this.enableScroll = true;
    this.enablSticktopage = true;
  }
  
  selectedthumbnail() {
    // const that = this;
    // $('body').on('click', '.pdfViewer .page', function () {
    //   const x = $(this).attr('data-page-number');
    //   that.pagevariableHghLght = x;
    // });
  }
  pdfExpandRefresh() {
    this.enablSticktopage = false;
    setTimeout(() => {
      this.enablSticktopage = true;
    }, 500);
  }

  newDIVforHighlight() {
    setTimeout(() => {
      let parentElement = this.el.nativeElement.querySelector('.page');
      if (parentElement) {
        let divsToRemove = parentElement.querySelectorAll('#' + this.idPath);
        // console.log(divsToRemove)
        if (divsToRemove && divsToRemove.length) {
          divsToRemove.forEach(divToRemove => {
            this.renderer.removeChild(parentElement, divToRemove);
          });
        }
      };
      $('highlightBox').removeAttr('style');
      $('highlightBox').removeClass();
      this.highlightArray.map(item=>{
        var rect = $("<div>", {
          class: 'highlightBox',
          id: this.idPath
        }).appendTo($(".page")).css({
          width: item.Width,
          height: item.Height,
          top: item.Top,
          left: item.Left,
          position: "absolute",
          border: '2px solid ' + item.color,
          background: '#0000'
        });
        rect.click(() => {
          this.selectedHighlight(item);
        });
      });
    }, 400);
  }


  HighlightPDF(){
    
    this.highlightArray = [];
    this.showHighlight = false;
    if(this.HighlightKeywordArray.length != 0) {
      this.HighlightKeywordArray.filter(item => {
        let obj = {
          "Height" : Number(item.Height) * 100 + '%',
          "Top" : Number(item.Top) * 100 + '%',
          "Width" : Number(item.Width) * 100 + '%',
          "Left" : Number(item.Left) * 100 + '%',
          "fieldName": item.fieldName ? item.fieldName : '',
          "id": item.id ? item.id : '',
          "category": item.category ? item.category : '',
          "sectionId": item.sectionId ? item.sectionId : '',
          "color" : item.color ? item.color : '#3CC47C'
        }
        this.highlightArray.push(obj)
        this.showHighlight = true
        this.pagevariableHghLght = this.HighlightKeywordArray[0].pageNo;
      });
    } else {
      this.showHighlight = false
    }
 
    this.newDIVforHighlight();
    setTimeout(() => {
      if(document.getElementById('highlightId')){
        var myDivHeight= document.getElementById('highlightId').offsetTop;
        myDivHeight = myDivHeight - 60;
        this.intelliScroll(myDivHeight);  
      }
    }, 500);
  }

  selectedHighlight(value) {
    this.mrrSelectedHghlght.emit(value);
  }

  clearConfidenceBtn() {
    this.activeButtonHigh = false;
    this.activeButtonMedium = false;
    this.activeButtonLow = false;
    this.activeButtonAll = false;
  }
  selectDimension(Type){

  }

  resetFilteredPageList(){
    // this.resetFiltrPageList.emit('clear');
    // this.fromPageFilteredData = null;
    // this.FilteredPageVariable = null;
    // this.pageListExist = false;
    // this.myPageList = [];
    this.pagevariableHghLght=1;
    this.resetPageNumbers();
    this.setFileDetails();
    this.resetAction("FileExplorerIconClick");
    // this.fromFilterPageName = null;
  }

  resetAction(action){
      this.zoomval = 0.8;
    this.rotationval = 0;
        this.pagevariableHghLght = 1;
        const temppage = Number(this.pagevariableHghLght)    
          setTimeout(() => {
            this.pagevariableHghLght = temppage;
            this.fileExplorerData = {
              pageNumber: temppage,
              Event: action,
              pageFrom: '',
              PreviousPage: 0,
              bookmark: this.enableBookmark
            };
            // this.pageNumberEmitter.emit(this.fileExplorerData);
            if (action === 'HotKey') {
              if (fastScrollOff) {
                fastScrollOff = false
                this.pagevariableHghLght = this.fileExplorerData.pageNumber
                //this.fileExplorerData.pageNumber = this.pagevariableHghLght;
                this.pageNumberEmitter.emit(this.fileExplorerData);
              }
            } else {
              fastScrollOff = false
              //this.fileExplorerData.pageNumber = this.pagevariableHghLght;
              this.pageNumberEmitter.emit(this.fileExplorerData);
            }
          }, 100);
  }
  /*
      *** Custom Navigation ***
  */
  CustomNavigation(action: string): void{
    if(action === "Previous"){
      if (this.customNavPageIndex > 0) {
          this.customNavPageIndex--;
          this.customNavPageVariable = Number(this.customNavPageIndex + 1);
          this.pagevariableHghLght = this.customNavPageArray[this.customNavPageIndex];
          this.getPreSignedUrl(this.fileLocation, this.pagevariableHghLght);
          if(!this.enableBookmark) {
            this.thumbnail.map(item=>{
              item.bunchingMarked = false
            });
            setTimeout(() => {
              this.thumbnail.map((item, i)=>{
                if(item.page == this.pagevariableHghLght) {
                  item.bunchingMarked = true;
                }
              })
            }, 100);
          }
          setTimeout(() => {
            this.bookmarkPagesArray.map(item=>{
              if(item == this.pagevariableHghLght) {
                this.selectBookmark = true;
              } 
              else if(item != this.pagevariableHghLght && this.enableBookmark) {
                this.selectBookmark = true;
                if (this.selectBookmark) {
                  const isPageBookmarked = this.bookmarkPagesArray.includes(this.pagevariableHghLght);
                  if (!isPageBookmarked) {
                    this.bookmarkPagesArray.push(this.pagevariableHghLght);
                    this.bookmarkPagesArray.sort((a, b) => a - b);
                    this.bookmarkPagesEmitter.emit(this.bookmarkPagesArray);
                    this.thumbnail.map(item=>{
                      this.bookmarkPagesArray.map(val=>{
                        if(item.page == val) {
                          item.bunchingMarked = true
                        }
                      })
                    })
                  }
                      
                } 
              }
            })
            this.bookmarkPagesArray.map(item=>{
              if(item == this.pagevariableHghLght) {
                this.selectBookmark = true;
              }
            })
            this.intelliScroll(0);  
          }, 200);
      }
    }
    else{
      if (this.customNavPageIndex < this.customNavPageArray.length - 1) {
        this.customNavPageIndex++;
        this.customNavPageVariable = Number(this.customNavPageIndex + 1);
        this.pagevariableHghLght = this.customNavPageArray[this.customNavPageIndex];
        this.getPreSignedUrl(this.fileLocation, this.pagevariableHghLght);
        if(!this.enableBookmark) {
          this.thumbnail.map(item=>{
            item.bunchingMarked = false
          });
          setTimeout(() => {
            this.thumbnail.map((item, i)=>{
              if(item.page == this.pagevariableHghLght) {
                item.bunchingMarked = true;
              }
            })
          }, 100);
        }
        setTimeout(() => {
          this.bookmarkPagesArray.map(item=>{
            if(item == this.pagevariableHghLght) {
              this.selectBookmark = true;
            } 
            else if(item != this.pagevariableHghLght && this.enableBookmark) {
              this.selectBookmark = true;
              if (this.selectBookmark) {
                const isPageBookmarked = this.bookmarkPagesArray.includes(this.pagevariableHghLght);
                if (!isPageBookmarked) {
                  this.bookmarkPagesArray.push(this.pagevariableHghLght);
                  this.bookmarkPagesArray.sort((a, b) => a - b);
                  this.bookmarkPagesEmitter.emit(this.bookmarkPagesArray);
                  this.thumbnail.map(item=>{
                    this.bookmarkPagesArray.map(val=>{
                      if(item.page == val) {
                        item.bunchingMarked = true
                      }
                    })
                  })
                }
                    
              } 
            }
          })
          this.bookmarkPagesArray.map(item=>{
            if(item == this.pagevariableHghLght) {
              this.selectBookmark = true;
            }
          })
          this.intelliScroll(0);  
        }, 200);
      }
    }
  }
  /*
      *** Custom Input Field Value Change ***
  */
  CustomInputFieldValueChange(_value: string): void{
  }

  intelliScroll(val) {
    document.getElementById(this.idPath).scrollTop = val; 
  }

  public Thumbnails: { page: number, url: string }[] = [];

  public async OnAfterLoadComplete(pdf: PDFDocumentProxy) {
    if(!this.thumbnailPdfPagesLoaded) {
      this.thumbnailPdfPagesLoaded = true;
    
      const promises = [];    

      for (let pageNo = 1; pageNo <= pdf.numPages; pageNo += 1) {
        const page = await pdf.getPage(pageNo);
        let canvasElement = document.createElement('canvas');
        canvasElement.height = 750; 
        canvasElement.width = 680;
        let canvasContext = canvasElement.getContext('2d');

        if (canvasContext) {
          const renderPromise = page.render({
            viewport: page.getViewport({ scale: 8}),
            canvasContext: canvasContext
          }).promise;

          promises.push(renderPromise.then(() => ({
            page: pageNo,
            url: canvasElement.toDataURL(),
            bunchingMarked: false
          })));
        }
      }

      this.thumbnail = (await Promise.all(promises)); 
      this.thumbnailLoader = false;
      if(this.thumbnail){
        this.thumbnail.map(item=>{
          item.bunchingMarked = false
        })
        this.thumbnail.map((item, i)=>{
          if(item.page == this.pagevariableHghLght) {
            item.bunchingMarked = true
            const id = `thumbnail${this.FromPage}${i}`;
            setTimeout(() => {
              const element = document.getElementById(id);
              const container = this.thumbnailContainer.nativeElement;
              if (container && element) {
                const offsetTop = element.offsetTop;
                const containerScrollTop = container.scrollTop;
                const containerOffsetTop = container.getBoundingClientRect().top;
                const scrollTo = offsetTop - containerOffsetTop;
                container.scrollTo({ top: scrollTo, behavior: 'smooth' });
              }
            }, 100);
          }
        })
      }
    } else {
      this.thumbnailLoader = false;
    }
  }

  public async OnAfterLoadCompleteNew(pdf: PDFDocumentProxy) {
    if (!this.thumbnailPdfPagesLoaded) {
      this.thumbnailPdfPagesLoaded = true;
      const numPages = pdf.numPages;

      let startPage = 1;
      const batchSize = 10;

      while (startPage <= numPages) {
        const endPage = Math.min(startPage + batchSize - 1, numPages);

        const batchThumbnails = [];
        for (let pageNo = startPage; pageNo <= endPage; pageNo += 1) {
          const page = await pdf.getPage(pageNo);
          let canvasElement = document.createElement('canvas');
          canvasElement.height = 750;
          canvasElement.width = 680;
          let canvasContext = canvasElement.getContext('2d');

          if (canvasContext) {
            const renderPromise = page.render({
              viewport: page.getViewport({ scale: 1}),
              canvasContext: canvasContext
            }).promise;

            await renderPromise;

            batchThumbnails.push({
              page: pageNo,
              url: canvasElement.toDataURL(),
              bunchingMarked: false
            });
          }
        }

        this.thumbnail.push(...batchThumbnails);
        this.thumbnailLoader = false;

        if(this.thumbnail && startPage == 1){
          this.thumbnail.map(item=>{
            item.bunchingMarked = false
          })
          this.thumbnail.map((item, i)=>{
            if(item.page == this.pagevariableHghLght) {
              item.bunchingMarked = true
              const id = `thumbnail${this.FromPage}${i}`;
              setTimeout(() => {
                const element = document.getElementById(id);
                const container = this.thumbnailContainer.nativeElement;
                if (container && element) {
                  const offsetTop = element.offsetTop;
                  const containerScrollTop = container.scrollTop;
                  const containerOffsetTop = container.getBoundingClientRect().top;
                  const scrollTo = offsetTop - containerOffsetTop;
                  container.scrollTo({ top: scrollTo, behavior: 'smooth' });
                }
              }, 100);
            }
          })
        }
        

        startPage += batchSize;
      }

      if(this.thumbnail){
        this.thumbnail.map(item=>{
          item.bunchingMarked = false
        })
        this.thumbnail.map((item, i)=>{
          if(item.page == this.pagevariableHghLght) {
            if(!item.bunchingMarked){
              item.bunchingMarked = true
              const id = `thumbnail${this.FromPage}${i}`;
              setTimeout(() => {
                const element = document.getElementById(id);
                const container = this.thumbnailContainer.nativeElement;
                if (container && element) {
                  const offsetTop = element.offsetTop;
                  const containerScrollTop = container.scrollTop;
                  const containerOffsetTop = container.getBoundingClientRect().top;
                  const scrollTo = offsetTop - containerOffsetTop;
                  container.scrollTo({ top: scrollTo, behavior: 'smooth' });
                }
              }, 100);
            }
          }
        })
      }
    } else {
      this.thumbnailLoader = false;
    }
  }

  onClickPage(pageNo, pageBunched) {
    if(this.enableBookmark) {
      this.pagevariableHghLght = pageNo;
      this.getPreSignedUrl(this.fileLocation, pageNo);
      if(this.selectThumbnailByRange) {
        if(!pageBunched) {
          this.selectBookmark = true;
          this.generateBookmarkArray(pageNo);
        } else {
          this.bookmarkPagesArray = this.bookmarkPagesArray.filter(item => item !== pageNo);
          this.selectBookmark = false;
        }
      }
      else{
        if(!pageBunched) {
          this.bookmarkPagesArray.push(pageNo);
          this.selectBookmark = true;
        } else {
          this.bookmarkPagesArray = this.bookmarkPagesArray.filter(item => item !== pageNo);
          this.selectBookmark = false;
        }
      }
      this.thumbnail.map(item=>{
        item.bunchingMarked = false
      })
      this.thumbnail.map(item=>{
        this.bookmarkPagesArray.map(val=>{
          if(item.page == val) {
            item.bunchingMarked = true;
          }
        })
      })
      this.bookmarkPagesArray.sort((a, b) => a - b);
      this.bookmarkPagesEmitter.emit(this.bookmarkPagesArray);
    } else {
      this.pagevariableHghLght = pageNo;
      this.thumbnail.map(item=>{
        item.bunchingMarked = false
      });
      this.thumbnail.map((item, i)=>{
        if(item.page == pageNo) {
          item.bunchingMarked = true
          // const id = `thumbnail${i}`;
          // const element = document.getElementById(id);
          // if (element) {
          // element.scrollIntoView({ behavior: 'smooth', block: 'start'});
          // }
        }
      })
      this.getPreSignedUrl(this.fileLocation, pageNo);
      this.changePageinput(pageNo);
    }
    
  }
  generateBookmarkArray(inputPageNumber: number): void {
    if (inputPageNumber < 1 || inputPageNumber > this.totalPages) {
        return;
    }

    const index = this.bookmarkPagesArray.indexOf(inputPageNumber);

    if (index !== -1) {
        this.bookmarkPagesArray.splice(index, 1);
    } else if (inputPageNumber < this.bookmarkPagesArray[0]) {
        const newPagesArray = [];
        for (let i = inputPageNumber; i <= this.bookmarkPagesArray[0]; i++) {
            newPagesArray.push(i);
        }
        this.bookmarkPagesArray = newPagesArray.concat(this.bookmarkPagesArray);
    } else if (inputPageNumber > this.bookmarkPagesArray[this.bookmarkPagesArray.length - 1]) {
        const lastPage = this.bookmarkPagesArray[this.bookmarkPagesArray.length - 1];
        for (let i = lastPage + 1; i <= inputPageNumber; i++) {
            this.bookmarkPagesArray.push(i);
        }
    } else {
        // Find the position to insert the inputPageNumber
        let insertIndex = 0;
        while (insertIndex < this.bookmarkPagesArray.length && this.bookmarkPagesArray[insertIndex] < inputPageNumber) {
            insertIndex++;
        }
        this.bookmarkPagesArray.splice(insertIndex, 0, inputPageNumber);
    }

    // Remove duplicates
    this.bookmarkPagesArray = Array.from(new Set(this.bookmarkPagesArray));
  }

  selectByRange(Type) {
    if(Type == 'Range'){
      this.selectThumbnailByRange = true;
    }
    else{
      this.selectThumbnailByRange = false;
    }

  }
}