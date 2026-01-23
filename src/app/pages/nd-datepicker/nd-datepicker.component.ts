import { Component } from '@angular/core';
import { cssdatepickerCode, htmldatepickerCode, tsdatepickerCode } from './datepickerCode';
import { JsonService } from 'src/app/shared/service/service.service';

@Component({
  selector: 'app-nd-datepicker',
  templateUrl: './nd-datepicker.component.html',
  styleUrls: ['./nd-datepicker.component.scss']
})
export class NdDatepickerComponent {
  htmldatepickerCode = htmldatepickerCode;
  cssdatepickerCode = cssdatepickerCode;
  tsdatepickerCode = tsdatepickerCode;
  initialDate: Date | null = null;
  minDate = new Date(2020, 0, 1);
  maxDate = new Date(2030, 11, 31);

  selectedDateOutput: Date | null = null;
  dateRangeOutput: any = null;
  monthOutput: Date | null = null;
  yearOutput: Date | null = null;
  datepickerConfigurationOptions: any[] = [];
  datepickerOutputEvents: any[] = [];
  constructor( readonly service : JsonService){}
  ngOnInit (): void {    
    this.service.datepickerConfig().subscribe({
      next:(res: any)=>{
        this.datepickerConfigurationOptions = res.datepickerConfigurationOptions;
        this.datepickerOutputEvents = res.datepickerOutputEvents;
      },
      error:(error: any)=>{
      },
    })}

  onSelectedDate(date: Date | null) {
    this.selectedDateOutput = date;
  }

  onRangeChanged(range: { start: Date | null; end: Date | null }) {
    this.dateRangeOutput = range;
  }

  onMonthSelected(date: Date) {
    this.monthOutput = date;
  }

  onYearSelected(date: Date) {
    this.yearOutput = date;
  }

  copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}
}
