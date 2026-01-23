import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileExplorerBasicRoutingModule } from './file-explorer-basic-routing.module';
import { FileExplorerBasicComponent } from './file-explorer-basic/file-explorer-basic.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PinchZoomModule } from '@meddv/ngx-pinch-zoom';


@NgModule({
  declarations: [
    FileExplorerBasicComponent
  ],
  imports: [
    CommonModule,
    FileExplorerBasicRoutingModule,
    PdfViewerModule,
    PinchZoomModule
  ],
  exports: [
    FileExplorerBasicComponent
  ]
})
export class FileExplorerBasicModule { }
