import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NdSplitterRoutingModule } from './nd-splitter-routing.module';
import { AngularSplitModule } from 'angular-split';
import { NdSplitterComponent } from './nd-splitter.component';
import { SplitterComponent } from './splitter/splitter.component';
import { CommonModuleModule } from 'src/app/shared/common-module/common-module.module';


@NgModule({
  declarations: [NdSplitterComponent, SplitterComponent],
  imports: [
    CommonModule,
    NdSplitterRoutingModule,
    AngularSplitModule,
    CommonModuleModule
  ]
})
export class NdSplitterModule { }
