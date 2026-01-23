import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NdWidgetRoutingModule } from './nd-widget-routing.module';
import { NdWidgetComponent } from './nd-widget.component';
import { WidgetsComponent } from './widgets/widgets.component';
import { PagesModule } from '../pages.module';
import { CustomNdHighchartsModule } from '@novacisdigital/nd-custom-highcharts';
import { NdGridModule } from '@novacisdigital/nd-custom-grid';
import { CommonModuleModule } from 'src/app/shared/common-module/common-module.module';

@NgModule({
  declarations: [NdWidgetComponent, WidgetsComponent],
  imports: [
    CommonModule,
    NdWidgetRoutingModule,
    PagesModule,
    CustomNdHighchartsModule,
    NdGridModule.forRoot(
      'Using_this_{AG_Grid}_Enterprise_key_{AG-076863}_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_changing_this_key_please_contact_info@ag-grid.com___{Novacis_Digital,_LLC}_is_granted_a_{Multiple_Applications}_Developer_License_for_{1}_Front-End_JavaScript_developer___All_Front-End_JavaScript_developers_need_to_be_licensed_in_addition_to_the_ones_working_with_{AG_Grid}_Enterprise___This_key_has_not_been_granted_a_Deployment_License_Add-on___This_key_works_with_{AG_Grid}_Enterprise_versions_released_before_{15_April_2026}____[v3]_[01]_MTc3NjIwNzYwMDAwMA==7bf5cbe3b1d0a12c720b12abe1b56916'
    ),
    CommonModuleModule
  ],
})
export class NdWidgetModule {}
