import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileExplorerViewRoutingModule } from './file-explorer-view-routing.module';
import { FileExplorerViewComponent } from './file-explorer-view/file-explorer-view.component';
import { FormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { PinchZoomModule } from '@meddv/ngx-pinch-zoom';


@NgModule({
  declarations: [
    FileExplorerViewComponent
  ],
  imports: [
    CommonModule,
    FileExplorerViewRoutingModule,
    FormsModule,
    PdfViewerModule,
    NgxJsonViewerModule,
    PinchZoomModule,
    NgxDocViewerModule
  ],
  exports: [
    FileExplorerViewComponent
  ]
})
export class FileExplorerViewModule { }
