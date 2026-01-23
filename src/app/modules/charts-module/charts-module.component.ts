import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-charts-module',
  templateUrl: './charts-module.component.html',
  styleUrls: ['./charts-module.component.scss']
})
export class ChartsModuleComponent implements OnInit {

  @Output() chartEvent = new EventEmitter<any>();
  @Input() data;
  @Output() sendWidgetChanges = new EventEmitter<any>();
  ngOnInit(): void {
  //  console.log(this.data,'widget');
   
  }

  dispatchChartEvent(event){
  this.chartEvent.emit(event);
  }

  chartCompwidgetchanges(event) {
    this.sendWidgetChanges.emit(event);
  }
}
