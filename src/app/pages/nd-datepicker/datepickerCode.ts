export const htmldatepickerCode = `<div class="container mt-3">
  <div class="row">
    <!-- Basic Datepicker -->
    <div class="col-md-4 col-sm-12 mb-4">
      <h4><b>Basic Datepicker</b></h4>
      <mat-form-field class="addFromDate col-lg-12 col-md-12 col-sm-12 pl-0 pr-0">
        <mat-label>Choose a date</mat-label>
        <input matInput [matDatepicker]="picker1" [min]="minDate" [max]="maxDate" [(ngModel)]="selectedDate"
          (dateChange)="onBasicDateChange($event.value)" />
        <mat-datepicker-toggle matIconSuffix [for]="picker1"></mat-datepicker-toggle>
        <mat-datepicker #picker1 (monthSelected)="onMonthSelected($event)"
          (yearSelected)="onYearSelected($event)"></mat-datepicker>
      </mat-form-field>
    </div>

    <!-- Date Range Picker -->
    <div class="col-md-4 col-sm-12 mb-4 ">
      <h4><b>Date Range Picker</b></h4>
      <mat-form-field class="addFromDate col-lg-12 col-md-12 col-sm-12 pl-0 pr-0">
        <mat-label>Enter a date range</mat-label>
        <mat-date-range-input [formGroup]="range" [rangePicker]="picker2" (dateChange)="onRangeDateChange()">
          <input matStartDate formControlName="start" placeholder="Start date" />
          <input matEndDate formControlName="end" placeholder="End date" />
        </mat-date-range-input>
        <mat-datepicker-toggle matIconSuffix [for]="picker2"></mat-datepicker-toggle>
        <mat-date-range-picker #picker2></mat-date-range-picker>
        <mat-error *ngIf="range.controls.start.hasError('matStartDateInvalid')">Invalid start date</mat-error>
        <mat-error *ngIf="range.controls.end.hasError('matEndDateInvalid')">Invalid end date</mat-error>
      </mat-form-field>
    </div>

    <!-- Datepicker with filter validation -->
    <div class="col-md-4 col-sm-12 mb-4 ">
      <h4><b>Datepicker with filter validation</b></h4>
      <mat-form-field class="example-full-width">
        <mat-label>Choose a date</mat-label>
        <input matInput [matDatepickerFilter]="myFilter" [matDatepicker]="picker">
        <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>
    </div>

    <!-- Datepicker action buttons -->
    <div class="col-md-4 col-sm-12 mb-4 ">
      <h4><b> Datepicker action buttons</b></h4>
      <mat-form-field class="example-form-field">
        <mat-label>Choose a date</mat-label>
        <input matInput [matDatepicker]="datepicker">
        <mat-datepicker-toggle matIconSuffix [for]="datepicker"></mat-datepicker-toggle>
        <mat-datepicker #datepicker>
          <mat-datepicker-actions>
            <button mat-button matDatepickerCancel>Cancel</button>
            <button mat-raised-button color="primary" matDatepickerApply>Apply</button>
          </mat-datepicker-actions>
        </mat-datepicker>
      </mat-form-field>

      <mat-form-field class="example-form-field">
        <mat-label>Enter a date range</mat-label>
        <mat-date-range-input [rangePicker]="rangePicker">
          <input matStartDate placeholder="Start date">
          <input matEndDate placeholder="End date">
        </mat-date-range-input>
        <mat-datepicker-toggle matIconSuffix [for]="rangePicker"></mat-datepicker-toggle>
        <mat-date-range-picker #rangePicker>
          <mat-date-range-picker-actions>
            <button mat-button matDateRangePickerCancel>Cancel</button>
            <button mat-raised-button color="primary" matDateRangePickerApply>Apply</button>
          </mat-date-range-picker-actions>
        </mat-date-range-picker>
      </mat-form-field>
    </div>


    <!-- Datepicker Range -->
    <div class="col-md-4 col-sm-12 mb-4">
      <h4><b>Datepicker Range</b></h4>

      <!-- From Date -->
      <mat-form-field appearance="fill" class="underline-only w-100">
        <mat-label>From Date</mat-label>
        <input matInput [matDatepicker]="pickerFrom" placeholder="MM/DD/YYYY" formControlName="fromDate" />
        <mat-datepicker-toggle matSuffix [for]="pickerFrom"></mat-datepicker-toggle>
        <mat-datepicker #pickerFrom>
        </mat-datepicker>
      </mat-form-field>

      <!-- To Date -->
      <mat-form-field appearance="fill" class="underline-only w-100">
        <mat-label>To Date</mat-label>
        <input matInput [matDatepicker]="pickerTo" placeholder="MM/DD/YYYY" formControlName="toDate" />
        <mat-datepicker-toggle matSuffix [for]="pickerTo"></mat-datepicker-toggle>
        <mat-datepicker #pickerTo>
        </mat-datepicker>
      </mat-form-field>
    </div>
  </div>
</div>`;
export const tsdatepickerCode = `import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
})
export class DatepickerComponent {
  @Input() selectedDate: Date | null = null;
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() enableFilter: boolean = true;
  @Input() rangeStart: Date | null = null;
  @Input() rangeEnd: Date | null = null;
  
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  @Input() myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    return day !== 0 && day !== 6; // Disable Sunday (0) and Saturday (6)
  };

  @Output() selectedChange = new EventEmitter<Date | null>();
  @Output() rangeChange = new EventEmitter<{ start: Date | null; end: Date | null }>();
  @Output() monthSelected = new EventEmitter<Date>();
  @Output() yearSelected = new EventEmitter<Date>();

 
  onBasicDateChange(date: Date | null): void {
    this.selectedDate = date;
    this.selectedChange.emit(date);
  }

  onRangeDateChange(): void {
    const start = this.range.get('start')?.value ?? null;
    const end = this.range.get('end')?.value ?? null;
    this.rangeChange.emit({ start, end });
  }

  onMonthSelected(date: Date): void {
    this.monthSelected.emit(date);
  }

  onYearSelected(date: Date): void {
    this.yearSelected.emit(date);
  }
  
}`;
export const cssdatepickerCode = ``