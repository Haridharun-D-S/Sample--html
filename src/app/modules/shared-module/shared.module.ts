import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { WidgetModule } from "../widget/widget-chart.module";
import { PopupTemplateComponent } from "./popup-template/popup-template.component";
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PopupCustomComponent } from './popup-custom/popup-custom.component';
import { MaterialModule } from 'src/app/material/material.module';
import { PopupSuccessComponent } from './popup-success/popup-success.component';
import { PopupErrorComponent } from './popup-error/popup-error.component';
import { FileExplorerViewModule } from '../file-explorer-view/file-explorer-view.module';
import { DateConvertPipeModule } from 'src/app/shared/pipe/date-convert-pipe';
import { ClientSideGridComponent } from 'src/app/Standalone/client-side-grid/client-side-grid.component';
import { FileExplorerBasicModule } from '../file-explorer-basic/file-explorer-basic.module';
@NgModule({
  declarations: [
      PopupTemplateComponent,
      PopupCustomComponent,
      PopupSuccessComponent,
      PopupErrorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    WidgetModule,
    MatDialogModule,
    MatIconModule,
    MaterialModule,
    ReactiveFormsModule,
    FileExplorerViewModule,
    DateConvertPipeModule,
    ClientSideGridComponent,
    FileExplorerBasicModule
    ],
    exports: [PopupTemplateComponent]
})
export class SharedCoreModule { }
