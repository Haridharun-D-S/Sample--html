import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NdModalRoutingModule } from './nd-modal-routing.module';
import { NdModalComponent } from './nd-modal.component';
import { ModalComponent } from './modal/modal.component';
import { PagesModule } from '../pages.module';
import { CommonModuleModule } from 'src/app/shared/common-module/common-module.module';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [NdModalComponent, ModalComponent],
  imports: [
    CommonModule,
    NdModalRoutingModule,
    PagesModule,
    CommonModuleModule,
    MatDialogModule,
    HttpClientModule,
    MatCheckboxModule,
    ReactiveFormsModule
  ],
})
export class NdModalModule {}
