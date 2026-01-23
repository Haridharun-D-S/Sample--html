import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExploreDetailsRoutingModule } from './explore-details-routing.module';
import { ExploreDetailsComponent } from './explore-details/explore-details.component';
import { HeaderAppsModule } from 'src/app/layouts/header-apps/header-apps.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ExploreDetailsComponent
  ],
  imports: [
    CommonModule,
    ExploreDetailsRoutingModule,
    HeaderAppsModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ExploreDetailsModule { }
