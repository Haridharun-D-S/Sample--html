import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Observable } from 'rxjs';
import { Widget } from 'src/app/shared/modal/widget.modal';
declare let $: any;
@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})

export class WidgetComponent implements OnInit {
 // @ViewChild(EcareGridComponent) EcareGridComponent: EcareGridComponent;
  @Input('widgetConfiguration') widget: Widget;
  @Input('widgetSize') widgetSize;
  @Input() events: Observable<any>;
  @Input('ChartDetails') widgetChartDetails;
  @Output() refreshBaseWidget = new EventEmitter<any>();
  @Output() getbaseWidget = new EventEmitter<any>();
  @Output() floatingIconClickEvent = new EventEmitter<any>();
  @Output() ecareGridCheckBoxEvent = new EventEmitter<any>();
  @Output() versionGridCheckBoxEvent = new EventEmitter<any>();
  @Output() SURSGridEvent = new EventEmitter<any>();
  @Output() widgetEvent = new EventEmitter<any>();
  @Output() widgetGridEvent = new EventEmitter<any>();
  @Output() ecareGridLinkEvent = new EventEmitter<any>();
  @Output() ecareGridviewMeasureEvent = new EventEmitter<any>();
  @Output() ecareGridupdateMeasureEvent = new EventEmitter<any>();
  @Output() ecareGridInfoEvent = new EventEmitter<any>();
  @Output() ecareGridSaveEvent = new EventEmitter<any>();
  @Output() ecareGridProcessEvent = new EventEmitter<any>();
  @Output() ecareGridAddEvent = new EventEmitter<any>();  
  @Output() ecareGridDeleteEvent = new EventEmitter<any>();
  @Output() gridIconData = new EventEmitter<any>();
  @Output() GridFilterData = new EventEmitter<any>();
  @Output() gridDataEmitter = new EventEmitter<any>();
  @Output() editInjuryDataWidget = new EventEmitter<any>();
  @Output() deleteInjuryDataWidget = new EventEmitter<any>();
  @Output() chartClick = new EventEmitter<any>();
  @Output() treeChartDrillDown = new EventEmitter<any>();
  @Output() sendWidgetChanges = new EventEmitter<any>();
 // @ViewChild(EcareGeneralGridComponent) ecareGeneralGridChild: EcareGeneralGridComponent;
  private eventsSubscription: any
  dynamicInformation;
  infoLinkClicked: boolean;
  runtimePeriod;
  keyArray: string[];
  dropdownData = [];
  widgetData;

  constructor() {
    
  }

  ngOnInit() {
    //console.log(this.widget,'widget');
    //if(!this.widget){
    //   this.widget = { 
    //     id:"",
    //     type:"",
    //     settings:{},
    //     data:{}
    //   }
    //   //this.widget.data = barchartData.BarData;
    // }
    // console.log(this.widgetChartDetails);
    this.widgetData = this.widgetChartDetails;
    setTimeout(() => {
    this.dropdownData = this.widgetChartDetails ? this.widgetChartDetails.data ? this.widgetChartDetails.data.chartDetail ? this.widgetChartDetails.data.chartDetail.container.inputs : [] : [] : [];
    }, 1000);
    console.log(this.widgetData);

    if (this.eventsSubscription !== undefined) {

      this.eventsSubscription = this.events.subscribe({
       next: (data) => {
        this.dispatchWidgetEvent(data);
      },
      error:(_err)=>{
        //error
      },
      complete:()=>{
        //complete
      }})
    }
  setTimeout(() => {
    
  }, 500);
    // console.log(this.widget?.data,'widget')

  }

  ngOnDestroy() {
    if (this.eventsSubscription !== undefined) {
      this.eventsSubscription.unsubscribe();
    }
  }

  dispatchWidgetEvent(data) {
    //this.participantLoader = false ;
  }
  dispatchGridCheckBoxEvent(gridEventDetail) {
    this.ecareGridCheckBoxEvent.emit(gridEventDetail)
  }

  versionCheckBoxEvent(gridEventDetail) {
    this.versionGridCheckBoxEvent.emit(gridEventDetail)
  }

  sursGrid(gridEventDetail) {
    this.SURSGridEvent.emit(gridEventDetail)
  }

  dispatchviewMeasure(gridEventDetail) {
    this.ecareGridviewMeasureEvent.emit(gridEventDetail)
  }
  dispatchDeleteIconEvent(gridEventDetail) {
    this.ecareGridDeleteEvent.emit(gridEventDetail)
  }
  dispatchUpdateMeasure(gridEventDetail) {
    this.ecareGridupdateMeasureEvent.emit(gridEventDetail)
  }
  dispatchInformation(gridEventDetail) {
    this.ecareGridInfoEvent.emit(gridEventDetail)
  }

  dispatchSave(gridEventDetail) {
    this.ecareGridSaveEvent.emit(gridEventDetail)
  }
  dispatchProcess(gridEventDetail) {
    this.ecareGridProcessEvent.emit(gridEventDetail)
  }
  dispatchAdd(gridEventDetail) {
    this.ecareGridAddEvent.emit(gridEventDetail)
  }
  dispatchGridLinkEvent(gridEventDetail) {
    this.ecareGridLinkEvent.emit(gridEventDetail)
  }
  dispatchGridEvent(eventDetail) {
    this.widgetGridEvent.emit(eventDetail)
  }
  emitGridData(eventDetail) {
    this.gridDataEmitter.emit(eventDetail)
  }
  gridFilterData(event) {
    this.GridFilterData.emit(event)
  }
  dispatchChartEvent(eventDetail) {
    const widgetDetail = {
      ...this.widget,
      eventName: eventDetail.name,
      pointDataValue: eventDetail.pointdata
    }
    this.getbaseWidget.emit(widgetDetail);
    console.log(widgetDetail)
    this.widgetEvent.emit(widgetDetail)

  }
  gridIconActionData(data) {
    this.gridIconData.emit(data)
  }
  floatingIconClickMethod(indicatorValue) {
    this.floatingIconClickEvent.emit(indicatorValue)
  }
  editInjuryData(value) {
    this.editInjuryDataWidget.emit(value);
  }
  deleteInjuryData(value) {
    this.deleteInjuryDataWidget.emit(value);
  }


  chartClickFun(event) {
    this.chartClick.emit(event);
  }
  chartDrillDown(event) {
    this.treeChartDrillDown.emit(event);
  }

  refreshChartData(dashboardItem, type, values, target) {
    let obj ={
      dashboardItem : dashboardItem,
      type :type,
      values : values,
      target : target 
    }
    this.widget = null;
    this.refreshBaseWidget.emit(obj);
  }
  setDynamicInforContent(information, fromScreen, domainIdinfo) {
    if (fromScreen === 'dashboardInfo') {
      this.infoLinkClicked = true;
      this.dynamicInformation = information;
      if (this.dynamicInformation.DynamicInfoList) {
        this.keyArray = Object.keys(this.dynamicInformation.DynamicInfoList);
      } else {
        this.keyArray = [];
      }
    }
    
    if ( Object.prototype.hasOwnProperty.call(domainIdinfo, 'domainID')) {
      this.dynamicInformation.DomainId = domainIdinfo.domainID;
    } else if (Object.prototype.hasOwnProperty.call(domainIdinfo, 'DomainId')) {
      this.dynamicInformation.DomainId = domainIdinfo.DomainId;
    } else {
      this.dynamicInformation.DomainId = 1;
    }
    // * Info Modal Positioning - jQuery
    $('#infoModal').on('show.bs.modal', function (event) {
      const btnElem = $(event.relatedTarget),
        infoModal = $(this),
        modalWidth = infoModal.width(),
        btnWidth = btnElem.width();
      const btnPos = btnElem.offset();
      if (btnPos.left > modalWidth) {
        infoModal.css({ left: btnPos.left - modalWidth - btnWidth + 'px' });
      } else {
        infoModal.css({ left: btnPos.left + 2 * btnWidth + 'px' });
      }
    });
  }
  chartCompwidgetchanges(event) {
    this.sendWidgetChanges.emit(event);
  }
}
