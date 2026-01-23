import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NdTabsRoutingModule } from './nd-tabs-routing.module';
import { NdTabsComponent } from './nd-tabs.component';
import { TabsComponent } from './tabs/tabs.component';
import { PagesModule } from '../pages.module';
import { CommonModuleModule } from 'src/app/shared/common-module/common-module.module';


@NgModule({
  declarations: [
    NdTabsComponent,
    TabsComponent
  ],
  imports: [
    CommonModule,
    NdTabsRoutingModule,
    PagesModule,
    CommonModuleModule
  ],
  exports:[TabsComponent]
})
export class NdTabsModule { }
