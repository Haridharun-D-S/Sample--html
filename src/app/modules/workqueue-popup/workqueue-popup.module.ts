import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkqueuePopupRoutingModule } from './workqueue-popup-routing.module';
import { WorkqueuePopupComponent } from './workqueue-popup/workqueue-popup.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { ClientSideGridComponent } from 'src/app/Standalone/client-side-grid/client-side-grid.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';


@NgModule({
  declarations: [
    WorkqueuePopupComponent
  ],
  imports: [
    CommonModule,
    WorkqueuePopupRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTabsModule,
    ClientSideGridComponent,
    MatProgressSpinnerModule,
    MaterialModule,
    FormsModule, 
    ReactiveFormsModule
  ],
  exports:[WorkqueuePopupComponent]
})
export class WorkqueuePopupModule { }
