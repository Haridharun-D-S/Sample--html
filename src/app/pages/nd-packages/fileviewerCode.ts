export const HtmlFileViewerCode = 
`<ng-container [ngSwitch]="fileExtension">
  <!-- PDF viewer -->
  <div class="pdf-toolbar" *ngIf="showToolbar && fileType === 'pdf' && totalPages">
     <button class="btn-primary" (click)="prevPage()" *ngIf="displayTotalPage" [disabled]="displayCurrentPage <= 1">Prev</button>
    <button class="btn-primary" (click)="prevPage()" *ngIf="!displayTotalPage" [disabled]="currentPage <= 1">Prev</button>
  <div style="display: flex;">
     <div class="icons">
     <button (click)="zoomOut()"><img src="/assets/zoonout.png"></button>
    <!-- <span>{{ (zoom * 100) | number: '1.0-0' }}%</span> -->
    <button (click)="zoomIn()"><img src="/assets/zoomin.png"></button>
    <button (click)="rotateLeft()"><img src="/assets/rotate-left.png"></button>
    <button (click)="rotateRight()"><img src="/assets/rotate-right.png"></button>

   </div >

     <input type="number" [value]="displayCurrentPage || currentPage" [readonly]="readonlyCurrentPage" (change)="goToPage($event)" min="1"
      [max]="displayTotalPage || totalPages" style="width: 50px; text-align: center;" />
    <span>/ {{ displayTotalPage || totalPages }}</span>
  </div>
   
  
    <div class="right-btns">
      <button class="btn-primary" (click)="nextPage()" *ngIf="displayTotalPage"[disabled]="displayCurrentPage >= displayTotalPage">Next</button>
    <button class="btn-primary" (click)="nextPage()" *ngIf="!displayTotalPage" [disabled]="currentPage >= totalPages">Next</button>
    <button class="btn-primary" (click)="resetView()">Reset</button>
    </div>
  </div>

  <pdf-viewer *ngSwitchCase="'pdf'" [src]="fileUrl" [render-text]="renderText" [original-size]="originalSize"
    [show-all]="showAll" [zoom]="zoom" [page]="currentPage" [rotation]="rotation" [autoresize]="autoresize"
    [fit-to-page]="fitToPage" [highlight]="true" (after-load-complete)="onLoadComplete($event)"
    (on-progress)="onProgress($event)" (error)="onError($event)" (pageRendered)="onPageRendered($event)"
    (text-layer-rendered)="ontextLayerRendered($event)" (pageChange)="onPageChange($event)"
    style="width: 100%; height: 600px; overflow-y: auto;" class="pdf-container"></pdf-viewer>

  <!-- Document viewer -->
  <ngx-doc-viewer *ngSwitchCase="'docx'" [url]="fileUrl" [external]="true"
    style="width: 100%; height: 600px;"></ngx-doc-viewer>

  <!-- Images -->
<!-- Image Toolbar -->
<div class="image-toolbar pdf-toolbar" *ngIf="showToolbar && ['jpg', 'jpeg', 'png'].includes(fileType)">
  
    <button class="btn-primary" (click)="prevPage()" *ngIf="displayTotalPage" [disabled]="displayCurrentPage <= 1">Prev</button>

  
    <div style="display: flex;">
        <div class="icons">
     <button (click)="imgZoomOut()"><img src="/assets/zoonout.png"></button>
  <!-- <span>{{ (imgZoom * 100) | number: '1.0-0' }}%</span> -->
  <button (click)="imgZoomIn()"><img src="/assets/zoomin.png"></button>
  <button (click)="imgRotateLeft()"><img src="/assets/rotate-left.png"></button>
  <button (click)="imgRotateRight()"><img src="/assets/rotate-right.png"></button>
  </div>
      <input type="number" [value]="displayCurrentPage || currentPage" [readonly]="readonlyCurrentPage" (change)="goToPage($event)" min="1"
      [max]="displayTotalPage || totalPages" style="width: 50px; text-align: center;" />
    <span>/ {{ displayTotalPage || totalPages }}</span>
    </div>
    <div class="right-btns">
      <button class="btn-primary" (click)="nextPage()" *ngIf="displayTotalPage"[disabled]="displayCurrentPage >= displayTotalPage">Next</button>
  <button class="btn-primary" (click)="imgReset()">Reset</button>
    </div>
</div>

<!-- Scrollable + Draggable Image Container -->
<div 
*ngIf="['jpg', 'jpeg', 'png'].includes(fileType)"
  class="image-container" 
  #imageContainer
  (mousedown)="startPan($event)" 
  (mousemove)="onPan($event)" 
  (mouseup)="endPan()" 
  (mouseleave)="endPan()"
>
  <img
    [src]="fileUrl"
    alt="Image Viewer"
    [style.transform]="imgTransform"
    draggable="false"
  />
</div>


  <div class="pdf-toolbar" *ngIf="fileType === 'tiff' && tiffTotalPages">

     <button class="btn-primary" (click)="tiffPrevPage()" *ngIf="displayTotalPage"
      [disabled]="displayCurrentPage <= 1">Prev</button>
    <button class="btn-primary" (click)="tiffPrevPage()" *ngIf="!displayTotalPage"
      [disabled]="tiffCurrentPage <= 0">Prev</button>


     <div class="" style="display: flex;">
       <div class="icons">
     <button (click)="zoomInTiff()"><img src="/assets/zoonout.png"></button>
    <!-- <span>{{ (tiffZoom * 100) | number: '1.0-0' }}%</span> -->
    <button (click)="zoomOutTiff()"><img src="/assets/zoomin.png"></button>
    <button (click)="rotateLeftTiff()"><img src="/assets/rotate-left.png"></button>
    <button (click)="rotateRightTiff()"><img src="/assets/rotate-right.png"></button>
   </div>
    <input type="number" [value]="displayCurrentPage || tiffCurrentPage + 1" (change)="tiffGoToPage($event)" [min]="1"
      (keydown)="blockNegative($event)" [readonly]="readonlyCurrentPage" [max]="displayTotalPage || tiffTotalPages"
      style="width: 50px; text-align: center;" />
    <span>/ {{ displayTotalPage || tiffTotalPages }}</span>
     </div>

    <div class="right-btns">
      <button class="btn-primary" (click)="tiffNextPage()" *ngIf="displayTotalPage "
      [disabled]="displayCurrentPage >= displayTotalPage">Next</button>
    <button class="btn-primary" (click)="tiffNextPage()" *ngIf="!displayTotalPage "
      [disabled]="tiffCurrentPage >= tiffTotalPages - 1">Next</button>
    <button class="btn-primary" (click)="tiffResetView()">Reset</button>
    </div>
  </div>

  <div *ngSwitchCase="'tiff'" class="tiff-container" [style.transform]="'rotate(' + tiffRotation + 'deg)'">
    <canvas class="img-responsive pdf-viewer-cont work-area canvas" width="600" height="800"
      style="display: block; width: 100%; height: 100vh;" #canvas>
    </canvas>
  </div>
  </ng-container>`
export const CssFileViewerCode = `body{
  font-family: 'Open Sans' !important;
}


.pdf-toolbar {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  position: relative;
  z-index: 10;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom: none;
}

.pdf-toolbar button {
  /* background-color: #007bff; */
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  min-width: 30px;
}

.pdf-toolbar button:hover {
  /* background-color: #0056b3; */
}

.pdf-toolbar button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.pdf-toolbar input {
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 3px;
  text-align: center;
}

.tiff-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: calc(100vh - 80px);
  margin-top: 80px;
  /* Space for toolbar */
  transition: transform 0.3s ease;
  transform-origin: center center;
  overflow: auto;
  position: relative;
  z-index: 1;
}

.tiff-container canvas {
  max-width: 100%;
  height: auto;
  object-fit: contain;
}
.image-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 0;
  align-items: center;
}

.image-container {
  width: 100%;
  height: 600px;
  overflow: auto;
  border: 1px solid #ccc;
  cursor: grab;
  padding: 10px 0px;
}

.image-container:active {
  cursor: grabbing;
}

.image-container img {
  transform-origin: center center;
  transition: transform 0.3s ease;
  display: block;
  margin: auto;
}



/*  custom styles  */

.btn-primary{
    font-size: 16px !important;
    background-color: #0056b3 !important;
    color: #fff !important;
    border-radius: 5px !important;
    font-weight: 540 !important;
    padding: 4px 12px !important;
    height: 30px;
    border: none !important;
}

.right-btns button{
  margin-right: 5px;
}
.pdf-toolbar img{
  width: 20px !important;
}`
export const TSFileViewerCode = `import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PDFDocumentProxy, PDFProgressData } from 'ng2-pdf-viewer';
import { decode, decodeImage, toRGBA8 } from 'utif';
@Component({
  selector: 'nd-file-viewer',
  templateUrl: './nd-file-viewer.component.html',
  styleUrls: ['./nd-file-viewer.component.css'],
})
export class NdFileViewerComponent {
  @Input() fileUrl: string = '';
  @Input() fileType: string = ''; // Optional: 'pdf', 'docx', 'tiff', 'png', 'jpg'
  @Input() renderText = true;
  @Input() originalSize = true;
  @Input() showAll = false;
  @Input() zoom = 1.5;
  @Input() currentPage = 1;
  @Input() rotation = 0;
  @Input() autoresize = true;
  @Input() fitToPage = true;
  @Input() readonlyCurrentPage = false;
  @Input() displayCurrentPage: number = 0;
  @Input() displayTotalPage: number = 0;
  
  // OUTPUTS
  @Output() afterLoadComplete = new EventEmitter<PDFDocumentProxy>();
  @Output() progress = new EventEmitter<PDFProgressData>();
  @Output() error = new EventEmitter<any>();
  @Output() pageRendered = new EventEmitter<any>();
  @Output() textLayerRendered = new EventEmitter<any>();
  @Output() pageChange = new EventEmitter<any>();
  @Output() getCurrentPage = new EventEmitter<any>();
  @Output() getNextPage = new EventEmitter<any>();
  @Output() getPrevPage = new EventEmitter<any>();
  @Output() getReset = new EventEmitter<any>();

  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef;
  @ViewChild('canvasContainer', { static: true })
  canvasContainerRef!: ElementRef;
   @ViewChild('imageContainer', { static: false }) imageContainer!: ElementRef;
  safeUrl: SafeResourceUrl | string = '';
  totalPages: number = 1;
  fileExtension = '';
  tiffZoom = 1;
  tiffRotation = 0;
  tiffCurrentPage = 0;
  tiffTotalPages = 0;
  imgZoom = 1; // Scale factor
  imgRotation = 0; // Degrees
  imgTransform = 'scale(1) rotate(0deg)';
  isPanning = false;
  startX = 0;
  startY = 0;
  scrollLeft = 0;
  scrollTop = 0;
  
  ngOnChanges(changes: SimpleChanges): void {
    if (this.fileUrl) {
      this.fileExtension = this.fileType || this.getExtension(this.fileUrl);
      this.safeUrl = this.getSafeUrl();
       ngAfterViewInit(): void {
    if (this.fileExtension === 'tiff' || this.fileExtension === 'tif') {
      this.tiffInitializer();
    }
  }

  onLoadComplete(pdf: PDFDocumentProxy) {
    this.totalPages = pdf.numPages ?? 1;
    this.afterLoadComplete.emit(pdf);
  }

  onProgress(data: any) {
    this.progress.emit(data);
  }

  onPageRendered(renderData: any) {
    this.pageRendered.emit(renderData);
  }

  ontextLayerRendered(textLayer: any) {
    this.textLayerRendered.emit(textLayer);
  }

  onPageChange(pageChange: any) {
    if (this.displayTotalPage && this.displayCurrentPage) {
      const getPagedetails = {
        displayTotalPage: this.displayTotalPage,
        displayCurrentPage: this.displayCurrentPage,
        inputValue: pageChange?.target?.value,
      };
      this.getCurrentPage.emit(getPagedetails);
    } else {
      this.pageChange.emit(pageChange);
    }
  }
  onError(err: any) {
    this.error.emit(err);
  }

  private getSafeUrl(): SafeResourceUrl | string {
    if (this.fileUrl?.startsWith('http')) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.fileUrl);
    }
    return this.fileUrl;
  }

  private getExtension(url: string): string {
    return url.split('.').pop()?.toLowerCase() || '';
  }

  // Page navigation
  prevPage(): void {
    if (this.displayTotalPage && this.displayCurrentPage) {
      const getPagedetails = {
        displayTotalPage: this.displayTotalPage,
        displayCurrentPage: this.displayCurrentPage - 1,
      };
      this.getNextPage.emit(getPagedetails);
    } else {
      if (this.currentPage > 1) this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.displayTotalPage && this.displayCurrentPage) {
      const getPagedetails = {
        displayTotalPage: this.displayTotalPage,
        displayCurrentPage: this.displayCurrentPage + 1,
      };
      this.getNextPage.emit(getPagedetails);
    } else {
      if (this.currentPage < this.totalPages) this.currentPage++;
    }
  }

  goToPage(event: Event): void {
    const value = parseInt((<HTMLInputElement>event.target).value, 10);
    if (!isNaN(value) && value >= 1 && value <= this.totalPages) {
      this.currentPage = value;
    }
  }

  // Zoom
  zoomIn(): void {
    if (this.zoom < 3.0) {
      this.zoom = Math.min(this.zoom + 0.1, 3.0);
    }
  }

  zoomOut(): void {
    if (this.zoom > 0.5) {
      this.zoom = Math.max(this.zoom - 0.1, 0.5);
    }
  }

  // Rotation
  rotateLeft(): void {
    this.rotation = (this.rotation - 90) % 360;
  }

  rotateRight(): void {
    this.rotation = (this.rotation + 90) % 360;
  }

  resetView(): void {
    this.zoom = 1.5;
    this.rotation = 0;
    this.currentPage = 1;
    this.displayCurrentPage = 1;
    const getPagedetails = {
      displayTotalPage: this.displayTotalPage,
      displayCurrentPage: this.displayCurrentPage,
    };
    this.getReset.emit(getPagedetails);
  }

  tiffInitializer(pageIndex = 0) {
    const response = this.fileUrl;
    setTimeout(() => {
      fetch(response)
        .then((res) => res.arrayBuffer())
        .then((buf) => {
          const ifds = decode(buf);
          this.tiffTotalPages = ifds.length;

          if (pageIndex >= ifds.length) return;

          const canvas = this.canvasRef.nativeElement;
          const ctx = canvas.getContext('2d')!;
          const ifd = ifds[pageIndex];

          decodeImage(buf, ifd);
          const rgba = toRGBA8(ifd);

          const width = ifd.width!;
          const height = ifd.height!;
          const zoom = this.tiffZoom;

          // Set canvas dimensions based on zoom only (rotation handled by CSS)
          canvas.width = width * zoom;
          canvas.height = height * zoom;

          // Reset transform before drawing
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Apply zoom transform only
          ctx.scale(zoom, zoom);

          // Create and draw image data
          const imgData = ctx.createImageData(width, height);
          imgData.data.set(rgba);
          ctx.putImageData(imgData, 0, 0);

          this.tiffCurrentPage = pageIndex;
        });
    });
  }

  zoomInTiff() {
    const newZoom = this.tiffZoom * 100 + 30;
    this.tiffZoom = Math.min(3, newZoom / 100);
    this.tiffInitializer(this.tiffCurrentPage);
  }

  zoomOutTiff() {
    const newZoom = this.tiffZoom * 100 - 10;
    this.tiffZoom = Math.max(0.5, newZoom / 100);
    this.tiffInitializer(this.tiffCurrentPage);
  }

  rotateLeftTiff() {
    this.tiffRotation = (this.tiffRotation - 90 + 360) % 360;
  }

  rotateRightTiff() {
    this.tiffRotation = (this.tiffRotation + 90) % 360;
  }

  tiffPrevPage() {
    if (this.displayTotalPage && this.displayCurrentPage) {
      const getPagedetails = {
        displayTotalPage: this.displayTotalPage,
        displayCurrentPage: this.displayCurrentPage - 1,
      };
      this.getPrevPage.emit(getPagedetails);
    } else {
      if (this.tiffCurrentPage > 0) {
        this.tiffInitializer(this.tiffCurrentPage - 1);
      }
    }
  }

  tiffNextPage() {
    if (this.displayTotalPage && this.displayCurrentPage) {
      const getPagedetails = {
        displayTotalPage: this.displayTotalPage,
        displayCurrentPage: this.displayCurrentPage + 1,
      };
      this.getNextPage.emit(getPagedetails);
    } else {
      if (this.tiffCurrentPage < this.tiffTotalPages - 1) {
        this.tiffInitializer(this.tiffCurrentPage + 1);
      }
    }
  }

  tiffGoToPage(event: any) {
    if (this.displayTotalPage && this.displayCurrentPage) {
      const getPagedetails = {
        displayTotalPage: this.displayTotalPage,
        displayCurrentPage: this.displayCurrentPage,
        inputValue: event?.target?.value,
      };
      this.getCurrentPage.emit(getPagedetails);
    } else {
      const inputValue = +event.target.value;
      const pageIndex = inputValue - 1;
      if (pageIndex >= 0 && pageIndex < this.tiffTotalPages) {
        this.tiffInitializer(pageIndex);
      }
    }
  }

  tiffResetView() {
    this.tiffZoom = 1;
    this.tiffRotation = 0;
    this.tiffCurrentPage = 0;
    this.displayCurrentPage = 1;
    const getPagedetails = {
      displayTotalPage: this.displayTotalPage,
      displayCurrentPage: this.displayCurrentPage,
    };
    this.getReset.emit(getPagedetails);
    this.tiffInitializer(0);
  }

  blockNegative(event: KeyboardEvent) {
    if (event.key === '-' || event.code === 'Minus') {
      event.preventDefault();
    }
  }


 
  // Toolbar Actions
  imgZoomIn() {
    this.imgZoom += 0.1;
    this.updateTransform();
  }

  imgZoomOut() {
    if (this.imgZoom > 1) {
      this.imgZoom -= 0.1;
      this.updateTransform();
    }
  }

  imgRotateLeft() {
    this.imgRotation -= 90;
    this.updateTransform();
  }

  imgRotateRight() {
    this.imgRotation += 90;
    this.updateTransform();
  }

  imgReset() {
    this.imgZoom = 1;
    this.imgRotation = 0;
    this.updateTransform();
    if (this.imageContainer) {
      this.imageContainer.nativeElement.scrollTo(0, 0);
    }
  }

  

  // Panning Logic
  startPan(event: MouseEvent) {
    if (this.imgZoom <= 1) return; // No pan if not zoomed
    this.isPanning = true;
    this.startX = event.pageX - this.imageContainer.nativeElement.offsetLeft;
    this.startY = event.pageY - this.imageContainer.nativeElement.offsetTop;
    this.scrollLeft = this.imageContainer.nativeElement.scrollLeft;
    this.scrollTop = this.imageContainer.nativeElement.scrollTop;
  }

  onPan(event: MouseEvent) {
    if (!this.isPanning) return;
    event.preventDefault();
    const x = event.pageX - this.imageContainer.nativeElement.offsetLeft;
    const y = event.pageY - this.imageContainer.nativeElement.offsetTop;
    const walkX = (x - this.startX) * -1; // Reverse scroll
    const walkY = (y - this.startY) * -1;
    this.imageContainer.nativeElement.scrollLeft = this.scrollLeft + walkX;
    this.imageContainer.nativeElement.scrollTop = this.scrollTop + walkY;
  }

  endPan() {
    this.isPanning = false;
  }
}`