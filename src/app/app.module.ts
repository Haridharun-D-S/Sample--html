import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PieChartModule } from "./modules/pie-chart/pie-chart.module";
import { AuthModule } from './modules/auth/auth.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CoreProjectServicesModule } from './shared/services/core-project-services.module';
import { BarChartModule } from "./modules/bar-chart/bar-chart.module";
import { CombinationChartModule } from './modules/combination-chart/combination-chart.module';
import { GroupedandStackedChartModule } from "./modules/GroupedandStacked-chart/GroupedandStacked-chart.module";
import { ScatterChartModule } from "./modules/scatter-chart/scatter-chart.module";
import { SummaryOutputModule } from './modules/summary-output/summary-output.module';
import { FileExplorerViewModule } from './modules/file-explorer-view/file-explorer-view.module';
import { DatePipe } from '@angular/common';
import { SafeHtmlPipe } from './shared/pipe/safe-html.pipe';
import { ContextMenuModule } from "./modules/context-menu/context-menu.module";
import { DataEntryModule } from './modules/data-entry/data-entry.module';
import { TokenInterceptor } from 'src/app/core/interceptor/token.interceptor';
import { DateConvertPipe } from './shared/pipe/date-convert-pipe';
import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise';
import { LicenseManager } from 'ag-grid-enterprise';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { CommonLoaderComponent } from './Standalone/common-loader/common-loader.component';
import { ErrorInterceptor } from './core/interceptor/error.interceptor';
import { FormsModule } from '@angular/forms';
import { HeaderAppsModule } from './layouts/header-apps/header-apps.module';
import { ProcessBatchModule } from './modules/process-batch/process-batch.module';
LicenseManager.setLicenseKey(
  'Using_this_{AG_Grid}_Enterprise_key_{AG-056889}_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_changing_this_key_please_contact_info@ag-grid.com___{Novacis_Digital,_LLC}_is_granted_a_{Multiple_Applications}_Developer_License_for_{1}_Front-End_JavaScript_developer___All_Front-End_JavaScript_developers_need_to_be_licensed_in_addition_to_the_ones_working_with_{AG_Grid}_Enterprise___This_key_has_not_been_granted_a_Deployment_License_Add-on___This_key_works_with_{AG_Grid}_Enterprise_versions_released_before_{15_April_2025}____[v3]_[01]_MTc0NDY3MTYwMDAwMA==234d4045253812c3b356b5b6a91dd107'
);
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    PieChartModule,
    ScatterChartModule,
    BarChartModule,
    CombinationChartModule,
    GroupedandStackedChartModule,
    FormsModule,
    CoreProjectServicesModule,
    AuthModule,
    SummaryOutputModule,
    FileExplorerViewModule,
    ContextMenuModule,
    DataEntryModule,
    AgGridModule,
    BrowserAnimationsModule,
    MaterialModule,
    ProcessBatchModule,
    CommonLoaderComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    DatePipe,
    SafeHtmlPipe,
    DateConvertPipe,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
