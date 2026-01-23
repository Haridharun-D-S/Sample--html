import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcessBatchRoutingModule } from './process-batch-routing.module';
import { ProcessBatchComponent } from './process-batch.component';
import { HeaderAppsModule } from 'src/app/layouts/header-apps/header-apps.module';


@NgModule({
  declarations: [
    ProcessBatchComponent
  ],
  imports: [
    CommonModule,
    ProcessBatchRoutingModule,
    HeaderAppsModule    
  ]
})
export class ProcessBatchModule { }
