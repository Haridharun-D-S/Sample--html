import { NgModule, Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({ name: 'DateConvertPipe' })

export class DateConvertPipe implements PipeTransform {

  transform(InputDate: string | Date, format: string = 'MM/dd/yyyy'): Date | string {
    if(typeof InputDate === 'string' || InputDate instanceof String){
      // Split the date string into parts
      if(moment(InputDate, 'MM/DD/YYYY', true).isValid()){let Dates: number[] = (InputDate as string).split('/').map(Number);
        if(Dates.length && Dates.length == 3){
            let month: number = Dates[0];
            let date: number = Dates[1];
            let year: number = Dates[2];
            // If the year is in the range 00-69, assume it's 2000-2069; otherwise, assume it's 1970-1999
            if (year >= 0 && year <= 69) {
                year += 2000;
            } else if (year >= 70 && year <= 99) {
                year += 1900;
            }
            //Get month index
            let monthIndex = Number(month - 1);
            return new Date(year, monthIndex, date);
        }
        else{
            return InputDate;
        }
      }
      else{
        return InputDate;
      }
    }
    else{
        return InputDate;
    }
  };

}

@NgModule({
  declarations: [DateConvertPipe],
  exports: [DateConvertPipe]
})
export class DateConvertPipeModule {}
