import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

//import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ChartServiceService {
    public chartareaclicked = new BehaviorSubject(undefined);
    public chartActionEvent = new BehaviorSubject(undefined);
  //errorMessageConfigData = errorMessageConfig;
  constructor() {
  }

}
