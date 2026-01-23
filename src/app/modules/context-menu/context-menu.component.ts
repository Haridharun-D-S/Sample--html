import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit {

  @Input() chartData: any;
  @Input() drilldownActions;
  @Output() contextMenuEmit = new EventEmitter<any>();
  onChartActionClicked(type){
    this.contextMenuEmit.emit(type);
  }

  ngOnInit(): void {
   }
}
