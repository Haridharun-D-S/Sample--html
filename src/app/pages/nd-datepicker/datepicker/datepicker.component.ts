import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  
}
