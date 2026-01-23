# ND-File-Viewer

A comprehensive Angular file viewer component that supports multiple file formats including PDF, DOCX, TIFF, and various image formats. Built with modern Angular practices and optimized for performance.

## Features

- 📄 **PDF Support**: Full PDF viewing with zoom, rotation, and page navigation
- 📝 **DOCX Support**: Microsoft Word document viewing
- 🖼️ **TIFF Support**: Multi-page TIFF image viewing with advanced controls
- 🖼️ **Image Support**: PNG, JPG, and other image formats
- 🔍 **Zoom & Pan**: Interactive zoom and pan functionality
- 🔄 **Rotation**: 90-degree rotation controls
- ⚡ **Performance**: Optimized rendering and memory management

## Installation

```bash
npm install @novacisdigital/nd-file-viewer
```

## Peer Dependencies

This library requires the following peer dependencies:

```json
{
  "@angular/common": "^16.2.0",
  "@angular/core": "^16.2.0",
  "ngx-doc-viewer": "^15.0.1",
  "ng2-pdf-viewer": "^10.0.0",
  "pdfjs-dist": "^2.16.105",
  "utif": "^3.1.0",
  "tiff": "^7.1.0",
  "geotiff": "^2.0.7",
  "@types/utif": "^3.0.5"
}
```

## Quick Start

### 1. Import the Module

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NdFileViewerModule } from '@novacisdigital/nd-file-viewer';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NdFileViewerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### 2. Use the Component

```html
<nd-file-viewer
  [fileUrl]="fileUrl"
  [fileType]="fileType"
  [zoom]="1.5"
  [currentPage]="1"
  [rotation]="0"
  (afterLoadComplete)="onLoadComplete($event)"
  (pageChange)="onPageChange($event)"
  (error)="onError($event)">
</nd-file-viewer>
```

## API Reference

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `fileUrl` | `string` | `''` | URL or path to the file to display |
| `fileType` | `string` | `''` | File type ('pdf', 'docx', 'tiff', 'png', 'jpg', etc.) |
| `renderText` | `boolean` | `true` | Enable text rendering for PDFs |
| `originalSize` | `boolean` | `true` | Display in original size |
| `showAll` | `boolean` | `false` | Show all pages at once |
| `zoom` | `number` | `1.5` | Initial zoom level |
| `currentPage` | `number` | `1` | Initial page number |
| `rotation` | `number` | `0` | Initial rotation angle (degrees) |
| `autoresize` | `boolean` | `true` | Auto-resize to fit container |
| `fitToPage` | `boolean` | `true` | Fit content to page |
| `readonlyCurrentPage` | `boolean` | `false` | Make current page read-only |
| `displayCurrentPage` | `number` | `0` | Display current page number |
| `displayTotalPage` | `number` | `0` | Display total page count |

### Outputs

| Event | Type | Description |
|-------|------|-------------|
| `afterLoadComplete` | `PDFDocumentProxy` | Emitted when PDF is fully loaded |
| `progress` | `PDFProgressData` | Emitted during PDF loading progress |
| `error` | `any` | Emitted when an error occurs |
| `pageRendered` | `any` | Emitted when a page is rendered |
| `textLayerRendered` | `any` | Emitted when text layer is rendered |
| `pageChange` | `any` | Emitted when page changes |
| `getCurrentPage` | `any` | Emitted when current page is requested |
| `getNextPage` | `any` | Emitted when next page is requested |
| `getPrevPage` | `any` | Emitted when previous page is requested |
| `getReset` | `any` | Emitted when view is reset |

## Usage Examples

### Basic PDF Viewer

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-pdf-viewer',
  template: `
    <nd-file-viewer
      [fileUrl]="pdfUrl"
      fileType="pdf"
      [zoom]="1.2"
      (afterLoadComplete)="onPdfLoaded($event)"
      (pageChange)="onPageChanged($event)">
    </nd-file-viewer>
  `
})
export class PdfViewerComponent {
  pdfUrl = 'assets/sample.pdf';

  onPdfLoaded(pdf: any) {
    console.log('PDF loaded with', pdf.numPages, 'pages');
  }

  onPageChanged(event: any) {
    console.log('Page changed to:', event.page);
  }
}
```

### TIFF Image Viewer with Controls

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-tiff-viewer',
  template: `
    <div class="viewer-container">
      <nd-file-viewer
        [fileUrl]="tiffUrl"
        fileType="tiff"
        [zoom]="1.0"
        (afterLoadComplete)="onTiffLoaded($event)">
      </nd-file-viewer>
      
      <div class="controls">
        <button (click)="zoomIn()">Zoom In</button>
        <button (click)="zoomOut()">Zoom Out</button>
        <button (click)="rotateLeft()">Rotate Left</button>
        <button (click)="rotateRight()">Rotate Right</button>
        <button (click)="resetView()">Reset</button>
      </div>
    </div>
  `,
  styles: [`
    .viewer-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .controls {
      display: flex;
      gap: 0.5rem;
    }
    
    .controls button {
      padding: 0.5rem 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: #f8f9fa;
      cursor: pointer;
    }
    
    .controls button:hover {
      background: #e9ecef;
    }
  `]
})
export class TiffViewerComponent {
  tiffUrl = 'assets/sample.tiff';

  onTiffLoaded(event: any) {
    console.log('TIFF loaded successfully');
  }

  zoomIn() {
    // Access component methods via ViewChild if needed
  }

  zoomOut() {
    // Implementation
  }

  rotateLeft() {
    // Implementation
  }

  rotateRight() {
    // Implementation
  }

  resetView() {
    // Implementation
  }
}
```

### DOCX Document Viewer

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-docx-viewer',
  template: `
    <nd-file-viewer
      [fileUrl]="docxUrl"
      fileType="docx"
      [autoresize]="true"
      [fitToPage]="true">
    </nd-file-viewer>
  `
})
export class DocxViewerComponent {
  docxUrl = 'assets/document.docx';
}
```

## Advanced Configuration

### Custom Styling

You can customize the appearance by overriding the component's CSS classes:

```scss
// In your component's styles
nd-file-viewer {
  .pdf-container {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .tiff-controls {
    background: #f8f9fa;
    padding: 1rem;
    border-top: 1px solid #dee2e6;
  }
  
  .zoom-controls {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
}
```

### Error Handling

```typescript
@Component({
  template: `
    <nd-file-viewer
      [fileUrl]="fileUrl"
      [fileType]="fileType"
      (error)="handleError($event)">
    </nd-file-viewer>
    
    <div *ngIf="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  `
})
export class FileViewerComponent {
  fileUrl = '';
  fileType = '';
  errorMessage = '';

  handleError(error: any) {
    console.error('File viewer error:', error);
    this.errorMessage = 'Failed to load file. Please try again.';
  }
}
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### v1.0.0
- Initial release
- PDF, DOCX, TIFF, and image support
- Zoom, rotation, and pan controls
- Responsive design
- TypeScript support

---

**Made with by Novacis Digital**
