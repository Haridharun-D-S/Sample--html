import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NdFileuploadRoutingModule } from './nd-fileupload-routing.module';
import { NdFileuploadComponent } from './nd-fileupload.component';
import { FileuploadComponent } from './fileupload/fileupload.component';
import { CommonModuleModule } from "src/app/shared/common-module/common-module.module";


@NgModule({
  declarations: [
    NdFileuploadComponent,FileuploadComponent
  ],
  imports: [
    CommonModule,
    NdFileuploadRoutingModule,
    CommonModuleModule
],
  exports:[FileuploadComponent]
})
export class NdFileuploadModule { }
