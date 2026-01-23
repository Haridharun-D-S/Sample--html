import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { environment } from 'src/environment/environment';
import { CustomNdHighchartsModule } from '@novacisdigital/nd-custom-highcharts';
import { NdGridModule } from '@novacisdigital/nd-custom-grid';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FilterPipe } from './filter.pipe';
import { MatSelectModule } from '@angular/material/select';
import { CopyDirective } from 'src/app/directive/copy.directive';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
@NgModule({
  declarations: [
    FilterPipe,
    CopyDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatTabsModule,
    MatNativeDateModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatPseudoCheckboxModule,
    CustomNdHighchartsModule,
    NdGridModule.forRoot(environment.agGridKey),
    DragDropModule,
    MatSelectModule,
    MatSnackBarModule,
    HttpClientModule,
    HttpClientJsonpModule,
    MatRadioModule,
    MatCheckboxModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatTabsModule,
    MatNativeDateModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatPseudoCheckboxModule,
    CustomNdHighchartsModule,
    DragDropModule,
    FilterPipe,
    MatSelectModule,
    CopyDirective,
    MatSnackBarModule,
    HttpClientModule,
    HttpClientJsonpModule,
    MatRadioModule,
    MatCheckboxModule
  ],
  providers: [DatePipe],
})
export class CommonModuleModule { }
