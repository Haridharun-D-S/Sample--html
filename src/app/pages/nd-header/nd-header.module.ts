import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NdHeaderRoutingModule } from './nd-header-routing.module';
import { NdHeaderComponent } from './nd-header.component';
import { CommonModuleModule } from "src/app/shared/common-module/common-module.module";
import { PagesModule } from "../pages.module";
import { HeaderappsComponent } from './header-apps/header-apps.component';

@NgModule({
  declarations: [
    NdHeaderComponent,HeaderappsComponent
  ],
  imports: [
    CommonModule,
    NdHeaderRoutingModule,
    CommonModuleModule,
    PagesModule
    
],
exports: [HeaderappsComponent]
})
export class NdHeaderModule { }
