import {
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
import { NgxJsonViewerModule } from 'ngx-json-viewer';
@Component({
  selector: 'app-fileviewer',
  templateUrl: './fileviewer.component.html',
  styleUrls: ['./fileviewer.component.scss']
})
export class FileviewerComponent {
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
  @Input() showToolbar: boolean = true; 

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
  jsonData: any = null;
  formattedJson: string = '';
  isJsonTreeView: boolean = true;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.fileUrl) {
      this.fileExtension = this.fileType || this.getExtension(this.fileUrl);
      this.safeUrl = this.getSafeUrl();
      if (this.fileExtension === 'json') {
        this.loadJsonFile();
      }
    }
  }
    private async loadJsonFile() {
    try {
      const response = await fetch(this.fileUrl);
      const text = await response.text();
      this.jsonData = JSON.parse(text);
      this.formattedJson = JSON.stringify(this.jsonData, null, 2);
    } catch (error) {
      console.error('Error loading JSON file:', error);
      this.formattedJson = 'Invalid or corrupted JSON file.';
    }
  }

  toggleJsonViewMode() {
    this.isJsonTreeView = !this.isJsonTreeView;
  }

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

  updateTransform() {
    this.imgTransform = `scale(${this.imgZoom}) rotate(${this.imgRotation}deg)`;
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
}
