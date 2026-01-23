import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NdPackagesComponent } from './nd-packages/nd-packages.component';
import { PagesComponent } from './pages.component';
import { DesignStandardsComponent } from '../design-standards/design-standards.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: '', redirectTo: 'widget', pathMatch: 'full' },
      {
        path: 'widget',
        loadChildren: () =>
          import('./nd-widget/nd-widget.module').then((m) => m.NdWidgetModule),
        data: { menu: true, label: 'Widget', icon: 'fas fa-th-large' }
      },
      {
        path: 'dropdown',
        loadChildren: () =>
          import('./nd-dropdown/nd-dropdown.module').then(
            (m) => m.NdDropdownModule
          ),
          data: { menu: true, label: 'Dropdown', icon: 'fas fa-chevron-down' }
      },
      {
        path: 'datepicker',
        loadChildren: () =>
          import('./nd-datepicker/nd-datepicker.module').then(
            (m) => m.NdDatepickerModule
          ),
          data: { menu: true, label: 'Datepicker', icon: 'fas fa-calendar-alt' }
      },
      {
        path: 'loader',
        loadChildren: () =>
          import('./nd-loader/nd-loader.module').then((m) => m.NdLoaderModule),
        data: { menu: false, label: 'Loader', icon: 'fas fa-th-large' }
      },
      {
        path: 'header',
        loadChildren: () =>
          import('./nd-header/nd-header.module').then((m) => m.NdHeaderModule),
        data: { menu: true, label: 'Header', icon: 'fas fa-window-restore' }
      },
      {
        path: 'dynamic-forms',
        loadChildren: () =>
          import('./nd-dynamic-forms/nd-dynamic-forms.module').then(
            (m) => m.NdDynamicFormsModule
          ),
          data: { menu: true, label: 'Dynamic Forms', icon: 'fas fa-bell' }
      },
      {
        path: 'tabs',
        loadChildren: () =>
          import('./nd-tabs/nd-tabs.module').then((m) => m.NdTabsModule),
        data: { menu: true, label: 'Dynamic Tabs', icon: 'fas fa-folder-open' }
      },
      {
        path: 'stepper',
        loadChildren: () =>
          import('./nd-stepper/nd-stepper.module').then(
            (m) => m.NdStepperModule
          ),
          data: { menu: true, label: 'Stepper', icon: 'fas fa-window-restore' }
      },
      {
        path: 'fileupload',
        loadChildren: () =>
          import('./nd-fileupload/nd-fileupload.module').then(
            (m) => m.NdFileuploadModule
          ),
          data: { menu: true, label: 'File Upload', icon: 'fas fa-file-upload' }
      },
      {
        path: 'design-standards',
        component: DesignStandardsComponent, // ← ADD THIS
      },
      {
        path: 'modal',
        loadChildren: () =>
          import('./nd-modal/nd-modal.module').then((m) => m.NdModalModule),
        data: { menu: true, label: 'Modal Popup', icon: 'fas fa-window-restore' }
      },
      {
        path: 'splitter',
        loadChildren: () =>
          import('./nd-splitter/nd-splitter.module').then((m) => m.NdSplitterModule),
        data: { menu: true, label: 'Screen Splitter', icon: 'fas fa-hand-pointer' }
      },
      {
        path: 'toaster',
        loadChildren: () =>
          import('./nd-toaster/nd-toaster.module').then((m) => m.NdToasterModule),
        data: { menu: true, label: 'Toaster', icon: 'fas fa-keyboard' }
      },
      {
        path: 'accordion',
        loadChildren: () =>
          import('./nd-accordion/nd-accordion.module').then((m) => m.NdAccordionModule),
        data: { menu: true, label: 'Accordion', icon: 'fas fa-keyboard' }
      },
      // {
      //   path: 'easter-egg',
      //   loadChildren: () =>
      //     import('./rdev/rdev.module').then((m) => m.RdevModule)
      // },
      {
  path: 'easter-egg',
  loadChildren: () =>
    // import('./rdev/rdev.module').then((m) => m.RdevModule),
      import('./nd-formbuilder/nd-formbuilder.module').then((m) => m.NdFormbuilderModule),
  data: {
    menu: true,
    label: 'Form Builder',
    icon: 'fas fa-list-alt'
  }
},

      {
        path: 'hil',
        loadChildren: () =>
          import('./nd-hil/nd-hil.module').then((m) => m.NdHILModule),
        data: { menu: true, label: 'HIL', icon: 'fa-regular fa-robot' }
      },
      { path: 'nd-packages', component: NdPackagesComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
