import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileExplorerHighlightRoutingModule } from './file-explorer-highlight-routing.module';
import { FileExplorerHighlightComponent } from './file-explorer-highlight/file-explorer-highlight.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { PinchZoomModule } from '@meddv/ngx-pinch-zoom';
import { MaterialModule } from 'src/app/material/material.module';


@NgModule({
  declarations: [
    FileExplorerHighlightComponent
  ],
  imports: [
    CommonModule,
    FileExplorerHighlightRoutingModule,
    FormsModule,
    PdfViewerModule,
    NgxJsonViewerModule,
    PinchZoomModule,
    NgxDocViewerModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    FileExplorerHighlightComponent
  ]
})
export class FileExplorerHighlightModule { }
