import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecordListingRoutingModule } from './record-listing-routing.module';
import { RecordListingComponent } from './record-listing/record-listing.component';
import { ClientSideGridComponent } from 'src/app/Standalone/client-side-grid/client-side-grid.component';
import { FileExplorerViewModule } from '../file-explorer-view/file-explorer-view.module';
import { SharedCoreModule } from '../shared-module/shared.module';


@NgModule({
  declarations: [
    RecordListingComponent
  ],
  imports: [
    CommonModule,
    RecordListingRoutingModule,
    ClientSideGridComponent,
    FileExplorerViewModule,
    SharedCoreModule
  ],
  exports: [
    RecordListingComponent
  ],
})
export class RecordListingModule { }
