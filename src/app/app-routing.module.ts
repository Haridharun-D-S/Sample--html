import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/authgaurd/auth.guard';
import { ProcessBatchComponent } from './modules/process-batch/process-batch.component';
const routes: Routes = [
  {
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full'
  },
  { path: 'login', loadChildren: () => import("./modules/auth/auth.module").then(module => module.AuthModule)},
  { path: 'summary-output', loadChildren: () => import('./modules/summary-output/summary-output.module').then(m => m.SummaryOutputModule), canActivate: [AuthGuard]},
  { path: 'file-explorer-view', loadChildren: () => import('./modules/file-explorer-view/file-explorer-view.module').then(m => m.FileExplorerViewModule), canActivate: [AuthGuard]},
  { path: 'work-queue', loadChildren: () => import('./modules/work-queue/work-queue.module').then(m => m.WorkQueueModule), canActivate: [AuthGuard]},
   { path: 'dashboard', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard]},
   { path: 'filelistdashboard', loadChildren: () => import('./modules/file-list-dashboard/file-list-dashboard.module').then(m => m.FileListDashboardModule), canActivate: [AuthGuard]},
   { path: 'exploredetails', loadChildren: () => import('./modules/explore-details/explore-details.module').then(m => m.ExploreDetailsModule), canActivate: [AuthGuard]},
   { path: 'data-entry', loadChildren: () => import('./modules/data-entry/data-entry.module').then(m => m.DataEntryModule), canActivate: [AuthGuard]},
  { path: 'file-explorer-highlight', loadChildren: () => import('./modules/file-explorer-highlight/file-explorer-highlight.module').then(m => m.FileExplorerHighlightModule), canActivate: [AuthGuard]},
  { path: 'dynamic-entry-page', loadChildren: () => import('./modules/dynamic-entry-page/dynamic-entry-page.module').then(m => m.DynamicEntryPageModule), canActivate: [AuthGuard]},
  { path: 'base-action-page', loadChildren: () => import('./modules/base-action-page/base-action-page.module').then(m => m.BaseActionPageModule), canActivate: [AuthGuard]},
  { path: 'record-listing', loadChildren: () => import('./modules/record-listing/record-listing.module').then(m => m.RecordListingModule), canActivate: [AuthGuard]},
  { path: 'data-entry-popup', loadChildren: () => import('./modules/data-entry-popup-view/data-entry-popup-view.module').then(m => m.DataEntryPopupViewModule), canActivate: [AuthGuard]},
  { path: 'dynamic-entry-page-popup', loadChildren: () => import('./modules/data-entry-popup-view/data-entry-popup-view.module').then(m => m.DataEntryPopupViewModule), canActivate: [AuthGuard]},
  { path: 'case-list-page', loadChildren: () => import('./modules/case-list-page/case-list-page.module').then(m => m.CaseListPageModule), canActivate: [AuthGuard]},
  { path: 'task-list-page', loadChildren: () => import('./modules/task-list-page/task-list-page.module').then(m => m.TaskListPageModule), canActivate: [AuthGuard]},
  { path: 'reports', loadChildren: () => import('./modules/reports/reports.module').then(m => m.ReportsModule), canActivate: [AuthGuard]},
  { path: 'insights', loadChildren: () => import('./modules/insights/insights.module').then(m => m.InsightsModule), canActivate: [AuthGuard]},
  { path: 'work-queue-popup', loadChildren: () => import('./modules/workqueue-popup/workqueue-popup.module').then(m => m.WorkqueuePopupModule), canActivate: [AuthGuard]},
  { path: 'combination', loadChildren: () => import('./modules/combination-chart/combination-chart.module').then(m => m.CombinationChartModule), canActivate: [AuthGuard]},
  { path: 'file-explorer-basic', loadChildren: () => import('./modules/file-explorer-basic/file-explorer-basic.module').then(m => m.FileExplorerBasicModule), canActivate: [AuthGuard]},
  { path: 'process-batch', loadChildren: () => import('./modules/process-batch/process-batch.module').then(m => m.ProcessBatchModule), canActivate: [AuthGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
 }