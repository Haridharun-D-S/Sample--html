import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NdLoaderRoutingModule } from './nd-loader-routing.module';
import { NdLoaderComponent } from './nd-loader.component';
import { CommonModuleModule } from "src/app/shared/common-module/common-module.module";
import { LoaderComponent } from './loader/loader.component';


@NgModule({
  declarations: [
    NdLoaderComponent,LoaderComponent
  ],
  imports: [
    CommonModule,
    NdLoaderRoutingModule,
    CommonModuleModule
],
exports:[LoaderComponent]
})
export class NdLoaderModule { }
