import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {BarchartService  } from "./barchart.service";
import { SharedServiceService } from 'src/app/shared/services/sharedservice.service';
declare let require: any;
import Highcharts from 'highcharts';
import HighchartsCustomEvents from 'highcharts-custom-events';

HighchartsCustomEvents(Highcharts);
import { IDynamicDialogConfig,PopupTemplateComponent } from "src/app/modules/shared-module/popup-template/popup-template.component";
import { MatDialog } from '@angular/material/dialog';
import { ChartServiceService } from "src/app/shared/services/chart_service";

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {
  @ViewChild('chartEl') chartElement: ElementRef;
  @Input('widgetSize') widgetSize;
  @ViewChild('contextMenu') contextMenuElement: ElementRef;
  @ViewChild('legend') legendEl: ElementRef;  
  @Output() chartEvent = new EventEmitter<any>();

  //private domRenderer: Renderer2;
  @Input('data') chartData: any;
  @Input('location') chartLocation: string;
  pointDataOnClick: {
    breadCrumbText?: any;
    factId?: any;
    primaryProfileName?: any;
    primaryProfileValue?: any;
    bandId?: any;
    secondaryProfileName?: any;
    secondaryProfileValue?: any;
    profilerBadgeText?: any;
    secondProfilerBadgeText?: any;
    SecondaryProfileName?: any;
    SecondaryProfileValue?: any;
    factValueEnd?: any;
    DimensionName?: any;
    DimensionValue?: any;
    chartData?: any;
    pointDataName?: any;
    pieSelectedIndex?: any;
    attributeNameCsv?: any;
    attributeValueCsv?: any;
    dimensionStackedValues?: any;
    dimensionStackedValues1?: any;
    dimensionStackedValues2?: any;
    PatternScore?: any;
    nodeSelectedcsv?: any;
    sunburstId?: any;
    measurebandId?: any;
    geoMapData?:any;
    treeMapId?:any;
  };

  showFilter: boolean = false;
  showLabel: boolean;
  actualData: any;
  IdArrayCopy: any;
  barChart: Highcharts.Chart;
  barChartOptions: any;
  chartClickCheck: any = '';
  refprimarytitle: any;
  refprimaryname: any;
  contexMenuControl: boolean = false;

  constructor( private router: Router,  private Service: BarchartService ,   
     private dataGetService: SharedServiceService,public dialog: MatDialog,private ChartSharedService : ChartServiceService 
    ) { }

  ngOnInit() {
  }
   ngAfterViewInit() {
    this.initBarOrScatterChart(false, true);
  }
  
  chartType(Type){
    if(Type == "bar"){
      this.chartData = this.chartData;
      this.initBarOrScatterChart(false, true);
    }else if(Type == "scatter"){
      this.chartData = this.chartData;
      this.initBarOrScatterChart(false, true);
    }
   }
   showChart = true;
  initBarOrScatterChart(val,legend) {
    const yAxisDataForBar = [];
    const filteredValues = []
    const filteredYaxisNames = []
    const filteredNames = [];
    let Position;
    let factIdCSV = []
    let patternBandIdCSV = []
    let measureBandIdCSV = []
    let patternbandCSV = []
    let measurebandCSV = []
    let dimensionValueCSV = []
    let breadCrumTextCSV = []
    let primaryProfilerValueCSV = []
    let secondaryProfilerValueCSV = []
    let profilerBadgeTextCSV = []
    let currentChartLevel = 'L';
    const attributeValueCsv = []
    let pieIndexCSV = []
    let selectedIndexStr;
    let selectedIndex = [];
    let colorList = [];
    selectedIndex = [];

    if (this.chartData.type == undefined) {
      this.chartData = this.chartData[0];
    }

    const trimmedXaxis = []
    const chartType = this.chartData.type

    if(this.chartData.data.xAxis.values.length) {
      this.showChart = true;
    } else {
      this.showChart = false;
    }
    
    if (Object.prototype.hasOwnProperty.call(this.chartData, 'UnitDisplayPosition')) {
      if (this.chartData.UnitDisplayPosition === null || this.chartData.UnitDisplayPosition === '') {
        this.chartData.UnitDisplayPosition = 'Prefix';
        Position = this.chartData.UnitDisplayPosition;
      } else {
        Position = this.chartData.UnitDisplayPosition;
      }
    }
    const xTitle = this.chartData.data.xAxis.title;
    const yTitle = this.chartData.data.yAxis.title;


    if (this.chartData.type === 'bar' || this.chartData.type === 'MeasureBand') {
      // this.chartData.Units = '$'
      if (
        this.chartData.Widgettitle === 'Measure Profiler - Primary Peer Group' ||
        this.chartData.Widgettitle === 'Measure Profiler - Secondary Peer Group' ||
        this.chartData.Widgettitle === 'Pattern Profiler - Secondary Peer Group'
      ) {
        for (let i = 0; i < this.chartData.data.yAxis.values.length; i++) {
          yAxisDataForBar.push({
            name: this.chartData.data.yAxis.values[i].name,
            y: this.chartData.data.yAxis.values[i].data[0],
            selected: selectedIndex.length > 0 && selectedIndex.includes(i.toString()) ? true : false,  //.join()
          });
        }
      } else {
        //const index = 0;

        if (this.chartData.domainID !== undefined) {
          if (this.chartData.domainID === 6 || this.chartData.type === 'MeasureBand') {
            //console.log(this.chartData.data.yAxis.values)
            for (let i = 0; i < this.chartData.data.yAxis.values.length; i++) {
              yAxisDataForBar.push({
                name: this.chartData.data.yAxis.values[i].name,
                y: this.chartData.data.yAxis.values[i].data[0], //.join()
                // color: i === 0 ? 'rgb(223, 83, 83)' : 'rgb(149, 206, 255)',
                color: this.chartData.data.yAxis.values[i].color,
                selected: selectedIndex.length > 0 && selectedIndex.includes(i.toString()) ? true : false,  //.join()

              });
            }
          } else {
            // un-commented for barchart not coming in measures dashboard
            for (let i = 0; i < this.chartData.data.yAxis.values.length; i++) {
              yAxisDataForBar.push({
                name: this.chartData.data.yAxis.values[i].name,
                y: this.chartData.data.yAxis.values[i].data[0], //.join()
                color: this.chartData.data.yAxis.values[i].name === 'Due in 1 Day' ? '#CA7D2F' : this.chartData.data.yAxis.values[i].name === 'Due in 2 Days or More' ? '#00728A' : this.chartData.data.yAxis.values[i].name === 'Due Today' ? '#557D50' : this.chartData.data.yAxis.values[i].name === 'Overdue by 1 Day' ? '#702038' : '#B0483B',
                selected: selectedIndex.length > 0 && selectedIndex.includes(i.toString()) ? true : false,  //.join()

              });
            }
          }
        } else {
          for (let i = 0; i < this.chartData.data.yAxis.values.length; i++) {
            yAxisDataForBar.push({
              name: this.chartData.data.yAxis.values[i].name,
              y: this.chartData.data.yAxis.values[i].data[0],
              color: this.chartData.data.yAxis.values[i].name === 'Due in 1 Day' ? '#CA7D2F' : this.chartData.data.yAxis.values[i].name === 'Due in 2 Days or More' ? '#00728A' : this.chartData.data.yAxis.values[i].name === 'Due Today' ? '#557D50' : this.chartData.data.yAxis.values[i].name === 'Overdue by 1 Day' ? '#702038' : '#B0483B',
              //.join()
              selected: selectedIndex.length > 0 && selectedIndex.includes(i.toString()) ? true : false,  //.join()
            });
          }
        }
      }

      // x-axis formation for category
      for (let i=0;i<this.chartData.data.xAxis.values.length;i++) {
        let tempString = this.chartData.data.xAxis.values[i]
        tempString = tempString.replace(/<[^>]*>?/gm, '');
        trimmedXaxis.push(tempString)
      }
    }
    const yAxisDataForScatter = [];
    //const yAxisDataForScatter1 = [];
    if (this.chartData.type === 'scatter') {
      this.showFilter = true
      if (this.chartData.data.xAxis.values.length <= 1000) {
        this.showLabel = true;
      } else {
        this.showLabel = false;
      }
      // }
      this.actualData = this.chartData.data.yAxis.values[0].data

      if (val && val.action === 'Apply') {
        let name = []
        name = this.chartData.data.yAxis.values[0].name
        this.chartData.data.yAxis.values[0].data.map((item, i) => {
          if (Number(val.lower) <= item && Number(val.upper) >= item) {
            filteredValues.push(item)
            filteredNames.push(this.chartData.data.xAxis.values[i])
            filteredYaxisNames.push(name[i])
          }
        })
        // this.chartData.data.yAxis.values[0].data = filteredValues
        for (let i = 0; i < filteredValues.length; i++) {
          yAxisDataForScatter.push({
            name: '',
            y: Number(filteredValues[i]),
            color: 'rgba(223, 83, 83, 0.5)',
            selected: selectedIndex.length > 0 && selectedIndex.includes(i.toString()) ? true : false,  //.join()
          });
        }
      } else if (val && val.action === 'Search') {
        let name = [];
        const itemValues = [];
        //const sliceValues = [];
        name = this.chartData.data.yAxis.values[0].name
        this.chartData.data.yAxis.values[0].data.map((item, i) => {
          itemValues.push(item);
          const max = itemValues.reduce(function (a, b) {
            return Math.max(a, b);
          });
          if (max === item) {
            //console.log(max)
            filteredValues.push(max);
            filteredNames.push(this.chartData.data.xAxis.values[i])
            filteredYaxisNames.push(name[i])
          }

        })
        for (let i = 0; i < filteredValues.length; i++) {
          yAxisDataForScatter.push({
            name: '',
            y: Number(filteredValues[i]),
            color: 'rgba(223, 83, 83, 0.5)',
            selected: selectedIndex.length > 0 && selectedIndex.includes(i.toString()) ? true : false,  //.join()

          });
        }
      } else {
        for (let i = 0; i < this.chartData.data.yAxis.values[0].data.length; i++) {
          yAxisDataForScatter.push({
            name: '',
            y: Number(this.chartData.data.yAxis.values[0].data[i]),
            color: this.chartData.data.yAxis.values[0].PointColor === null ? '' : this.chartData.data.yAxis.values[0].PointColor[i],
            selected: selectedIndex.length > 0 && selectedIndex.includes(i.toString()) ? true : false,  //.join()
          });
        }
      }
    }
    const shortname = this.chartData.MeasureShortName !== '' && this.chartData.MeasureShortName !== null ? this.chartData.MeasureShortName + ': ' : 'Value: '
    const shortnameForYAxis = this.chartData.MeasureShortName !== '' && this.chartData.MeasureShortName !== null ? this.chartData.MeasureShortName : this.chartData.data.yAxis.title
    const groupname = this.chartData.ProfileName !== '' && this.chartData.ProfileName !== null ? '<b>' + this.chartData.ProfileName + ': </b>' : ''
    let xValues = this.chartData.data.xAxis.values;
    const widgetTitle = this.chartData[0] && this.chartData[0].Widgettitle ? this.chartData[0].Widgettitle : this.chartData.Widgettitle
    const units =
      this.chartData[0] === undefined
        ? this.chartData.Units === null
          ? ''
          : this.chartData.Units
        : this.chartData[0].Units;
    let IdArray = [];
    let EDAIdArray = [];
    let IdArray1 = [];
    const IdArray2 = [];
    if (this.chartData.Widgettitle === 'Pattern Profiler - Secondary Peer Group') {
      IdArray = this.Service.getObj('SecProfilePatternBandId');
      //console.log(this.IdArrayCopy);
    } else {
      if (val && val.action === 'Apply') {
        IdArray = filteredYaxisNames
        for (let i = 0; i < filteredValues.length; i++) {
          // IdArray.push(this.chartData.data.yAxis.values[i].name);
          if (this.chartData.type === 'scatter') {
            IdArray = filteredValues;
          }
        }
      }
      else {
        for (let i = 0; i < this.chartData.data.yAxis.values.length; i++) {
          if(this.chartData.type === 'MeasureBand') {
            IdArray2.push(this.chartData.data.yAxis.values[i].name);
          } else {
            IdArray.push(this.chartData.data.yAxis.values[i].name);
          }
          if (this.chartData.type === 'scatter') {
            if (this.chartData.data.key && this.chartData.data.key == "FactValue") {
              EDAIdArray = this.chartData.data.yAxis.values[0].name != null ? this.chartData.data.yAxis.values[0].name.split(',') : '';
            }
            else {
              IdArray = this.chartData.data.yAxis.values[0].name != null ? this.chartData.data.yAxis.values[0].name.split(',') : '';
            }
          }
          else {
            if (this.chartData.data.key && this.chartData.data.key == "FactValue") {
              EDAIdArray = IdArray
            }
          }
        }
      }
    }
    if (this.chartData.type === 'bar') {
      if (this.chartData.data.FactId !== undefined && this.chartData.data.FactId !== null) {
        IdArray1 = this.chartData.data.FactId.split(',');
        IdArray = IdArray1
      }
    }
    if (this.chartData.type === 'bar' || this.chartData.type === 'MeasureBand' || this.chartData.type === 'scatter') {

      Highcharts.setOptions({
        lang: {
          thousandsSep: ',',
          decimalPoint: '.'
        }
      });
      if(this.router.url === '/dashboard' || this.router.url === '/insights') {
        this.barChartOptions = {
          chart: {
            type: this.chartData.type === 'bar' || this.chartData.type === 'MeasureBand' ? 'column' : this.chartData.type,
            zoomType: 'xy',
            spacingLeft: 0,
            spacingRight: 0,
          },
          title: {
            text: '',
            style: {
              fontSize: 16
            }
          },
          subtitle: {
            text: this.chartData.subtitle
          },
          legend: {
            // enabled: this.chartData.type === 'bar' ? false : true 
            enabled : false
          },
          xAxis: {
            categories: xValues,
            lineWidth: 0.2,
            crosshair: true,
            labels: {
              enabled: true,
            },
            title: {
              text: this.chartData.data.xAxis.title,
              enabled : true,
              // x: this.chartData.type === 'bar' ? 10 : 0,
              // y: this.chartData.type === 'bar' ? 15 : 0
              margin: this.chartData.type === 'bar' || this.chartData.type === 'MeasureBand' ? 40 : 10
            }
          },
          yAxis: {
            // min: this.chartData.type === 'scatter' ? 0 : undefined,
            title: {
              enabled : true,
              text: shortnameForYAxis,
              align: 'middle'
            },
            labels: {
              overflow: 'justify'
            }
          },
          tooltip: {
            enabled: true,
            formatter: function () {
              this.xxx = xValues[this.point.index];
              console.log(this.xxx)
                  return (
                    '<b>' + this.xxx  + '</b>' + '<br>' +
                    '<b>' + shortnameForYAxis + ':' + '</b>' + " " + Highcharts.numberFormat(this.y, 0) + '<br>'
                  );
            }
          },
  
          plotOptions: {
            column: {
              dataLabels: {
                enabled: false,
                formatter: function () {
                  return (units !== '' && units !== null && units !== undefined
                    ? Position === 'Prefix' ? units + ' ' + Highcharts.numberFormat(this.y, 0) : Highcharts.numberFormat(this.y, 0) + ' ' + units
                    : Highcharts.numberFormat(this.y, 0));
                }
  
              }
            },
            series: {
              stickyTracking: false,
              allowPointSelect: false,
              marker: {
                states: {
                  hover: {
                    fillColor: 'orange'
                  },
                }
              },
              turboThreshold: 5000000,
              boostThreshold: 0,
              animation: this.chartData.type === 'bar' || this.chartData.type === 'MeasureBand' ? true : false,
              shadow: false,
              dataLabels: { // labels for scatter chart point
                enabled: true,
                // allowOverlap: true,
                formatter: function () {
                  let xvalue = this.x;
                  // //console.log('x')
                  if (isNaN(this.x) && this.x.split(':') > 0) {
                    xvalue = this.x.split(':')[1];
                  }
  
                  if (this.y > 0) {
                    if (units !== '' && units !== null && units !== undefined) {
                      return Position === 'Prefix' ? '<b>' + xvalue + "</b><br/> Value : " + units + ' ' + Highcharts.numberFormat(this.y, 0) : '<b>' + xvalue + "</b><br/> Value : " + Highcharts.numberFormat(this.y, 1) + ' ' + units
                    } else {
                      return '<b>' + xvalue + "</b><br/> Value : " + Highcharts.numberFormat(this.y, 1)
                    }
                  }else{
                    return this.y;
                  }
                }
              },
              colorByPoint: this.chartData.type === 'bar' || this.chartData.type === 'MeasureBand' ? true : false,
              showInLegend: true,
              pointWidth: 30,
              cursor: 'pointer',
              point: {
                events: {
                  click: e => {
                    const pointData = e.point;
                    // this.onChartClick(e, pointData);
                    if (e.type === 'click') {
                      const clickedPoint = e.point,
                      chart = clickedPoint.series.chart;

                      chart.series.forEach((series) => {
                        series.points.forEach((point) => {
                          if (point !== clickedPoint && point.select) {
                            point.select(false, true);
                          }
                        });
                      });
                      let pointDataCategory
                      if (this.router.url !== '/pages/eda') {
                        if (this.chartData.Widgettitle && !this.chartData.Widgettitle.includes('Measure Profiler') && !this.chartData.Widgettitle.includes('Pattern Profiler')) {
                          pointDataCategory = pointData.category.replace(/(<([^>]+)>)/ig, '');
                        }
                        else {
                          pointDataCategory = pointData.category
                        }
                      }
                      else {
                        pointDataCategory = pointData.category
                      }
                      const pointDataCategory1 = pointData.category;
  
                     // pointData.objectid = (this.chartData.title == 'SLA by Days and Volume' || this.chartData.title == 'In Progress Tasks by SLA') ? cid : undefined
                      
                      if(this.chartData.drilldownActions?.length > 0){
                        if (pointData.state == 'select') {
                          this.ChartSharedService.chartareaclicked.next(pointData);
                               } else if (pointData.state == '') {
                                this.ChartSharedService.chartareaclicked.next("deselect");
                                }
                                this.dataGetService.chartValue.next(pointData);
                                this.chartClickCheck = pointDataCategory;
                      }else{
                      pointData.objectid = this.chartData.title == 'File Volume by SLA' ? 12 : undefined
                      this.ChartSharedService.chartareaclicked.next(pointData);
                      // this.Service.chartValue.next(pointData);
                      this.chartClickCheck = pointDataCategory;
                      if (this.chartData.type === 'scatter' && (this.router.url !== '/pages/eda' && this.router.url != '/pages/add' && this.chartData.Widgettitle != 'Measure Profile' && this.chartData.Widgettitle != 'Pattern Profile')) {
  
                        if (this.chartData.Widgettitle == 'Dimensional Scatter Chart') {
                          const str = pointDataCategory1;
                          const splittedValue = str.split(":</b>");
                          splittedValue[0] = splittedValue[0].replace(/(<([^>]+)>)/ig, '');
                          splittedValue[0] = splittedValue[0].replace(/:/gi, '');
                          this.pointDataOnClick = {
                            breadCrumbText:
                              this.chartData.Widgettitle === 'Measure Profiler - Primary Peer Group' ||
                                this.chartData.Widgettitle === 'Measure Profiler - Secondary Peer Group' ||
                                this.chartData.Widgettitle === 'Pattern Score Summary' ||
                                this.chartData.Widgettitle === 'Pattern Profiler - Secondary Peer Group'
                                ? this.chartData.data.xAxis.title + ': ' + pointDataCategory
                                : '',
                            secondProfilerBadgeText:
                              this.chartData.Widgettitle === 'Measure Profiler - Primary Peer Group'
                                ? this.chartData.data.xAxis.title + ': ' + pointDataCategory
                                : '',
  
                            bandId: IdArray ? IdArray[pointData.index] : '',
                            factId: '',
                            DimensionName: (this.chartData.Widgettitle == 'Dimensional Scatter Chart') ? splittedValue[0] : '',
                            DimensionValue: (this.chartData.Widgettitle == 'Dimensional Scatter Chart') ? splittedValue[1] : '',
                            chartData: this.chartData,
                            pieSelectedIndex: 'No'
                          };
                          // multiple-select scatter point - dimensionvalue as csv start
                          setTimeout(() => {
                            if (pointData.state == 'select') {
                              dimensionValueCSV.push(splittedValue[1])
                            } else if (pointData.state == '') {
                              const tempDimensionValueCSV = []
                              dimensionValueCSV.filter(val => {
                                if (val != splittedValue[1]) {
                                  tempDimensionValueCSV.push(val)
                                }
                              })
                              dimensionValueCSV = tempDimensionValueCSV
                            }
                            const uniquefactIdCsv = Array.from(new Set(dimensionValueCSV));
                            dimensionValueCSV = uniquefactIdCsv
                            this.pointDataOnClick.DimensionValue = dimensionValueCSV.join('|~')
                            const dimensionString = this.pointDataOnClick.DimensionValue
                            // dimensionString = dimensionString.replace(/,/g, '|~')
                            this.pointDataOnClick.DimensionValue = dimensionString
  
                            // multiple-select scatter point - dimensionvalue as csv end
  
                            this.Service.setItem('DimensionData', JSON.stringify(this.pointDataOnClick))
                          }, 100);
  
  
                        }
                        else {
                         // const str = pointDataCategory;
                          //let splittedValue = str.split(":");
                          this.pointDataOnClick = {
                            breadCrumbText: this.chartData.data.xAxis.title ? this.chartData.data.xAxis.title + ': ' + pointDataCategory : pointDataCategory,
                            profilerBadgeText: pointDataCategory,
                            factId: (this.chartData.Widgettitle && !this.chartData.Widgettitle.includes('Profiler') && IdArray) ? IdArray[pointData.index] : '',
                          };
                          // multiple-select scatter point - factId as csv start
                          setTimeout(() => {
                              const pointTag = pointDataCategory.replace(/(<([^>]+)>)/ig, '');
                            if (pointData.state == 'select') {
                              factIdCSV.push(IdArray[pointData.index])
  
                              profilerBadgeTextCSV.push(pointTag)
                              if (pieIndexCSV.length > 0) {
                                pieIndexCSV.filter(val => {
                                  if (val != pointData.index) {
                                    pieIndexCSV.push(pointData.index)
                                  }
                                })
                              }
                              else {
                                pieIndexCSV.push(pointData.index)
                              }
                            } else if (pointData.state == '') {
                              const tempFactValueCSV = []
                              factIdCSV.filter(val => {
                                if (val != IdArray[pointData.index]) {
                                  tempFactValueCSV.push(val)
                                }
                              })
                              factIdCSV = tempFactValueCSV
  
                              const tempBadgeCSV = []
                              profilerBadgeTextCSV.filter(val => {
                                if (val != pointTag) {
                                  tempBadgeCSV.push(val)
                                }
                              })
                              profilerBadgeTextCSV = tempBadgeCSV
  
                              const tempindexCSV = []
                              pieIndexCSV.filter(val => {
                                if (val != pointDataCategory) {
                                  tempindexCSV.push(val)
                                }
                              })
                              pieIndexCSV = tempindexCSV
  
                            }
                            const uniquefactIdCsv = Array.from(new Set(factIdCSV));
                            factIdCSV = uniquefactIdCsv
                            this.pointDataOnClick.factId = factIdCSV.toString()
                            // multiple-select scatter point - factId as csv end
                            this.pointDataOnClick.profilerBadgeText = profilerBadgeTextCSV
                           if(this.chartData.Widgettitle != 'Measure Profiler - Primary Peer Group' ||
                                this.chartData.Widgettitle != 'Measure Profiler - Secondary Peer Group' ||
                                this.chartData.Widgettitle != 'Pattern Profiler - Secondary Peer Group') {
                                  this.pointDataOnClick.breadCrumbText = profilerBadgeTextCSV
                                }
                            let tempIndexCSV = []
                            tempIndexCSV = pieIndexCSV.filter(function (item, pos) {
                              return pieIndexCSV.indexOf(item) == pos;
                            });
                            pieIndexCSV = tempIndexCSV
                            if (this.pointDataOnClick.factId && this.pointDataOnClick.factId != undefined && this.pointDataOnClick.factId != '') {
                              this.pointDataOnClick['pieSelectedIndex'] = pieIndexCSV.length > 0 ? pieIndexCSV.toString() : 'No'
                            }
                            else {
                              this.pointDataOnClick['pieSelectedIndex'] = 'No'
                            }
                            this.Service.setItem('DimensionalWidgetPointData', JSON.stringify(this.pointDataOnClick))
                          }, 100);
                        }
                      } else {
                        if (this.router.url === '/pages/eda' || this.router.url === '/pages/add' || this.chartData.Widgettitle === 'Measure Profile' || this.chartData.Widgettitle === 'Pattern Profile') {
                          this.pointDataOnClick = {
                            breadCrumbText:
                              this.chartData.Widgettitle === 'Measure Profiler - Primary Peer Group' ||
                                this.chartData.Widgettitle === 'Measure Profiler - Secondary Peer Group' ||
                                this.chartData.Widgettitle === 'Pattern Score Summary' ||
                                this.chartData.Widgettitle === 'Pattern Profiler - Secondary Peer Group' || this.chartData.Widgettitle === 'Measure Profile' || this.chartData.Widgettitle === 'Pattern Profile' || this.chartData.Widgettitle === null
                                ?
                                pointDataCategory
                                : '',
                            secondProfilerBadgeText:
                              this.chartData.Widgettitle === 'Measure Profiler - Primary Peer Group'
                                ? this.chartData.data.xAxis.title + ': ' + pointDataCategory
                                : '',
  
                            bandId: IdArray ? IdArray[pointData.index] : '',
                            factId: IdArray1 ? IdArray1[pointData.index] : '',
                          };
                          this.pointDataOnClick['pieSelectedIndex'] = this.pointDataOnClick.factId && this.pointDataOnClick.factId != undefined && this.pointDataOnClick.factId != '' ? pointData.index : 'No'
                          if (this.chartData.chartType && this.chartData.chartType == 'Summary Chart') {
                            pointDataCategory = pointData.category
                          }
                          else {
                            if (this.router.url === '/pages/eda' || this.chartData.Widgettitle === 'Measure Profile' || this.chartData.Widgettitle === 'Pattern Profile') {
                              pointDataCategory = pointData.category ? pointData.category : pointData.name
                            }
                            else {
                              pointDataCategory = pointData.name ? pointData.name : pointData.category
                            }
                          }
                          if (currentChartLevel == this.chartData.ChartLevel) {
                            this.pointDataOnClick.breadCrumbText = pointDataCategory
                          }
                          currentChartLevel = this.chartData.ChartLevel
                          setTimeout(() => {
                            // multiple-select scatter point - breadcrumtext as csv start
                            const breadCrumTextSplit = this.pointDataOnClick.breadCrumbText
                            let concatedBreadCrumTextSplit = '';
                            if (breadCrumTextCSV.length == 0) {
                              concatedBreadCrumTextSplit = this.chartData.ChartLevel +
                                '_' +
                                this.chartData.data.xAxis.title +
                                '&' +
                                this.chartData.ChartLevel +
                                '_'
                              breadCrumTextCSV.push(concatedBreadCrumTextSplit)
                            }
                            if (pointData.state == 'select') {
                              let breadCrumb = []
                              breadCrumTextCSV.push(breadCrumTextSplit)
                              breadCrumb = breadCrumTextCSV.filter(function (item, pos) {
                                return breadCrumTextCSV.indexOf(item) == pos;
                              });
                              breadCrumTextCSV = breadCrumb
  
                              // Dataset Eda summary bar chart - Add
                              attributeValueCsv.push(pointDataCategory)
                              selectedIndexStr = JSON.parse(localStorage.getItem('pieSelectedIndex'))
                              if (selectedIndexStr && selectedIndexStr.factId && selectedIndexStr.factId != "") {
                                const factArray = selectedIndexStr.factId.split(',')
                                factArray.map(item => {
                                  factIdCSV.push(item)
                                })
                              }
                              factIdCSV.push(IdArray[pointData.index])
  
                            } else if (pointData.state == '') {
                              const tempFactValueCSV = []
                              breadCrumTextCSV.filter((val, i) => {
                                if (val == pointDataCategory) {
                                  tempFactValueCSV.splice(i, 1)
                                }
  
                                if (val != breadCrumTextSplit) {
                                  tempFactValueCSV.push(val)
                                }
                              })
                              breadCrumTextCSV = tempFactValueCSV
                              // Dataset Eda summary bar chart - Remove
                              attributeValueCsv.filter((val, i) => {
                                if (val == pointDataCategory) {
                                  attributeValueCsv.splice(i, 1)
                                }
                              })
                              if (IdArray.length > 0) {
                                factIdCSV.filter((val, i) => {
                                  if (Number(val) == Number(IdArray[pointData.index])) {
                                    factIdCSV.splice(i, 1)
                                  }
                                })
  
                              }
                            }
                            let dimensionString = '';
                            let levelStringZero = ''
                            breadCrumTextCSV.map((val, i) => {
                              if (i == 0) {
                                levelStringZero = val
                              }
                              if ((i > 0 && !val.includes(levelStringZero)) || i == 0) {
                                if (i <= 1) {
                                  dimensionString = dimensionString + val
                                } else {
                                  dimensionString = dimensionString + '#^' + val
                                }
                              }
                            })
                            this.pointDataOnClick.breadCrumbText = dimensionString
                            const uniquefactIdCsv = Array.from(new Set(factIdCSV));
                            factIdCSV = uniquefactIdCsv
                            this.pointDataOnClick.factId = factIdCSV.toString()
                            // multiple-select scatter point - factId as csv end
                            if (this.chartData.ChartLevel == undefined) {
                              // Dataset Eda summary bar chart multiple click attribute name & value get start
                              this.pointDataOnClick.attributeNameCsv = this.chartData.data.xAxis.title
                              this.pointDataOnClick.attributeValueCsv = attributeValueCsv.join('|~')
                              // Dataset Eda summary bar chart multiple click attribute name & value get start
                            }
                            if (this.router.url == '/pages/eda' && EDAIdArray.length == 0) {
                              this.Service.setItem('EDAWidgetPiePointData', JSON.stringify(this.pointDataOnClick))
                            }
                            this.Service.setItem('EDAWidgetPointData', JSON.stringify(this.pointDataOnClick))
                          }, 100);
                        } else {
                          this.pointDataOnClick = {
                            breadCrumbText:
                              this.chartData.Widgettitle === 'Measure Profiler - Primary Peer Group' ||
                                this.chartData.Widgettitle === 'Measure Profiler - Secondary Peer Group' ||
                                this.chartData.Widgettitle === 'Pattern Score Summary' ||
                                this.chartData.Widgettitle === 'Pattern Profiler - Secondary Peer Group'
                                ? this.chartData.data.xAxis.title + ': ' + pointDataCategory
                                : '',
                            secondProfilerBadgeText:
                              this.chartData.Widgettitle === 'Measure Profiler - Primary Peer Group'
                                ? this.chartData.data.xAxis.title + ': ' + pointDataCategory
                                : '',
  
                            bandId: IdArray ? IdArray[pointData.index] : '',
                            factId: IdArray1 ? IdArray1[pointData.index] : '',
                            measurebandId: IdArray2 ? IdArray2[pointData.index] : '',
                            pointDataName: pointData.name,
                          };
                          // multiple-select scatter point - factId as csv start
                          if (IdArray1) {
                            setTimeout(() => {
                              factIdCSV = IdArray1[pointData.index]
                              this.pointDataOnClick.factId = factIdCSV.toString();
  
                              const chartEventDetail = {
                                name: e,
                                data: this.chartData,
                                pointdata: this.pointDataOnClick
                              };
                              // this.ChartSharedService.chartActionEvent.next(chartEventDetail);
                              this.ChartSharedService.chartareaclicked.next(chartEventDetail);
                            }, 100);
                          }
                          
                        }
                      }
                      if (this.chartData.Widgettitle === 'Measure Profiler - Primary Peer Group' || this.chartData.Widgettitle === 'Pattern Score Summary' || this.chartData.Widgettitle === 'Pattern Profiler - Secondary Peer Group') {
                        this.refprimarytitle = this.chartData.data.xAxis.title;
                        this.refprimaryname = pointDataCategory;
                      }
  
                      if (this.chartData.Widgettitle === 'Measure Profiler - Primary Peer Group' || this.chartData.Widgettitle === 'Pattern Score Summary' || this.chartData.Widgettitle === 'Pattern Profiler - Secondary Peer Group') {
                        (this.pointDataOnClick.primaryProfileName = this.refprimarytitle),
                          (this.pointDataOnClick.primaryProfileValue = this.refprimaryname);
  
                        
  
                      }
                    }
                    }
  
                  },
                  mouseOver: function () {
                    if (this.series.halo) {
                      this.series.halo.attr({
                        'class': 'highcharts-tracker'
                      }).toFront();
                    }
                  },
                }
              }
            }
          },
          credits: {
            enabled: false
          },
          exporting: {
            enabled: false
          },
          series:
            this.chartData.type === 'bar' || this.chartData.type === 'MeasureBand'
              ? new Array({ data: yAxisDataForBar })
              // : pointLegendForScatter.length >= 1 ? pointLegendForScatter : new Array({ data: yAxisDataForScatter })
              : new Array({ data: yAxisDataForScatter })
        };
      } else {
        this.barChartOptions = {
          chart: {
            type: this.chartData.type === 'bar' || this.chartData.type === 'MeasureBand' ? 'column' : this.chartData.type,
            zoomType: 'xy',
            spacingLeft: 0,
            spacingRight: 0,
          },
          title: {
            text: '',
            style: {
              fontSize: 16
            }
          },
          subtitle: {
            text: this.chartData.subtitle
          },
          legend: {
            // enabled: this.chartData.type === 'bar' ? false : true 
            enabled : false
          },
          xAxis: {
            categories: this.chartData.type === 'bar' || this.chartData.type === 'MeasureBand' ? trimmedXaxis : val && val.action === 'Apply' ? filteredNames : this.chartData.data.xAxis.values,
            crosshair: true,
            labels: {
              enabled: this.chartData.type === 'bar' || this.chartData.type === 'MeasureBand' ? true : false,
              // staggerLines: 0
              // overflow: 'justify'
              autoRotation:[0],
              //autoRotationLimit:15,
              reserveSpace:false
            },
            title: {
              text: this.chartData.data.xAxis.title,
              // enabled : this.chartData.type === 'bar' ? true : false,
              // x: this.chartData.type === 'bar' ? 10 : 0,
              // y: this.chartData.type === 'bar' ? 15 : 0
              margin: this.chartData.type === 'bar' || this.chartData.type === 'MeasureBand' ? 40 : 10
            }
          },
          yAxis: {
            // min: this.chartData.type === 'scatter' ? 0 : undefined,
            title: {
              text: shortnameForYAxis,
              align: 'middle'
            },
            labels: {
              overflow: 'justify'
              // formatter: function() {
              //   return this.value / 1000 + ' K';
              // }
            }
          },
  
          // tooltip : {
          //   valueSuffix: " "+this.chartData.measureBy
          // },
          tooltip: {
            formatter: function () {
              this.y = this.chartData ? this.chartData.data.yAxis.title === 'Count' ? this.y.toFixed(0).replace(/\d(?=(\d{3})+\.)/g, '$&,') : this.y : this.y;
              if (chartType === 'bar' || chartType === 'MeasureBand') {
                if (!this.x.includes('<b>')) {
                  this.key = groupname + this.key;
                } 
                if (widgetTitle == "Pattern Score Summary") {
                  return (
                    yTitle +
                    ' :  <b>' +
                    this.y + '</b> <br> ' + xTitle + ' : <b> ' + (units !== '' && units !== null && units !== undefined ? Position === 'Prefix' ?
                      units + ' ' + this.x : this.x + ' ' + units : this.x +
                      '</b>')
                  );
                } else if( chartType === 'MeasureBand') {
                  return (
                     (units !== '' && units !== null && units !== undefined ? Position === 'Prefix' ?
                      units + ' ' + this.x : this.x + ' ' + units : this.x +
                      '</b>') + '<br>' + yTitle +
                      ' :  <b>' +
                      this.y + '</b>'
  
                  );
                } else {
                  return (
                    this.key + '<br>' + '<b>' + shortname + '</b>' +
                    (units !== '' && units !== null && units !== undefined
                      ? Position === 'Prefix' ? units + ' ' + Highcharts.numberFormat(this.y, 1) : Highcharts.numberFormat(this.y, 1) + ' ' + units
                      : Highcharts.numberFormat(this.y, 1))
                  );
                }
  
              } else {
                if (!this.x.includes('<b>')) {
                  this.x = groupname + this.x
                }
                return (
                  this.x + '<br>' + '<b>' + shortname + '</b>' +
                  (units !== '' && units !== null && units !== undefined
                    ? Position === 'Prefix' ? units + ' ' + Highcharts.numberFormat(this.y, 1) : Highcharts.numberFormat(this.y, 1) + ' ' + units
                    : Highcharts.numberFormat(this.y, 1))
                );
              }
            }
          },
  
          plotOptions: {
            column: {
              dataLabels: {
                enabled: this.router.url !== '/pages/docReviewTool' ? false : true,
                formatter: function () {
                  return (units !== '' && units !== null && units !== undefined
                    ? Position === 'Prefix' ? units + ' ' + Highcharts.numberFormat(this.y, 0) : Highcharts.numberFormat(this.y, 0) + ' ' + units
                    : Highcharts.numberFormat(this.y, 1));
                }
  
              }
            },
            series: {
              stickyTracking: false,
              allowPointSelect: false,
              marker: {
                states: {
                  hover: {
                    fillColor: 'orange'
                  },
                  // select: {
                  //   fillColor: 'green',
                  //   radius: 8
                  // }
                }
              },
              turboThreshold: 5000000,
              boostThreshold: 0,
              animation: this.chartData.type === 'bar' || this.chartData.type === 'MeasureBand' ? true : false,
              shadow: false,
              dataLabels: { // labels for scatter chart point
                enabled: (this.router.url !== '/pages/docReviewTool') ? false : true,
                // allowOverlap: true,
                formatter: function () {
                  let xvalue = this.x;
                  // //console.log('x')
                  if (isNaN(this.x) && this.x.split(':') > 0) {
                    xvalue = this.x.split(':')[1];
                  }
  
                  if (this.y > 0) {
                    if (units !== '' && units !== null && units !== undefined) {
                      return Position === 'Prefix' ? '<b>' + xvalue + "</b><br/> Value : " + units + ' ' + Highcharts.numberFormat(this.y, 0) : '<b>' + xvalue + "</b><br/> Value : " + Highcharts.numberFormat(this.y, 1) + ' ' + units
                    } else {
                      return '<b>' + xvalue + "</b><br/> Value : " + Highcharts.numberFormat(this.y, 1)
                    }
                  }else{
                    return this.y;
                  }
                }
              },
              colorByPoint: this.chartData.type === 'bar' || this.chartData.type === 'MeasureBand' ? true : false,
              showInLegend: true,
              pointWidth: 30,
              cursor: 'pointer',
              point: {
                events: {
                  click: e => {
                    const pointData = e.point;
                    // this.onChartClick(e, pointData);
                    if (e.type === 'click') {
                      const clickedPoint = e.point,
                        chart = clickedPoint.series.chart;
                      chart.series.forEach(function (s) {
                        s.points.forEach(function (p) {
                          if (p.x == clickedPoint.x && p.y == clickedPoint.y) {
                            p.select(null, true);
                          }
                        });
                      });
                      let pointDataCategory
                      if (this.router.url !== '/pages/eda') {
                        if (this.chartData.Widgettitle && !this.chartData.Widgettitle.includes('Measure Profiler') && !this.chartData.Widgettitle.includes('Pattern Profiler')) {
                          pointDataCategory = pointData.category.replace(/(<([^>]+)>)/ig, '');
                        }
                        else {
                          pointDataCategory = pointData.category
                        }
                      }
                      else {
                        pointDataCategory = pointData.category
                      }
                      const pointDataCategory1 = pointData.category;
  
                     // pointData.objectid = (this.chartData.title == 'SLA by Days and Volume' || this.chartData.title == 'In Progress Tasks by SLA') ? cid : undefined
                      
                      if(this.chartData.drilldownActions?.length > 0){
                        if (pointData.state == 'select') {
                          this.ChartSharedService.chartareaclicked.next(pointData);
                               } else if (pointData.state == '') {
                                this.ChartSharedService.chartareaclicked.next("deselect");
                                }
                                this.dataGetService.chartValue.next(pointData);
                                this.chartClickCheck = pointDataCategory;
                      }else{
                      pointData.objectid = this.chartData.title == 'File Volume by SLA' ? 12 : undefined
                      this.ChartSharedService.chartareaclicked.next(pointData);
                      this.Service.chartValue.next(pointData);
                      this.chartClickCheck = pointDataCategory;
                      if (this.chartData.type === 'scatter' && (this.router.url !== '/pages/eda' && this.router.url != '/pages/add' && this.chartData.Widgettitle != 'Measure Profile' && this.chartData.Widgettitle != 'Pattern Profile')) {
  
                        if (this.chartData.Widgettitle == 'Dimensional Scatter Chart') {
                          const str = pointDataCategory1;
                          const splittedValue = str.split(":</b>");
                          splittedValue[0] = splittedValue[0].replace(/(<([^>]+)>)/ig, '');
                          splittedValue[0] = splittedValue[0].replace(/:/gi, '');
                          this.pointDataOnClick = {
                            breadCrumbText:
                              this.chartData.Widgettitle === 'Measure Profiler - Primary Peer Group' ||
                                this.chartData.Widgettitle === 'Measure Profiler - Secondary Peer Group' ||
                                this.chartData.Widgettitle === 'Pattern Score Summary' ||
                                this.chartData.Widgettitle === 'Pattern Profiler - Secondary Peer Group'
                                ? this.chartData.data.xAxis.title + ': ' + pointDataCategory
                                : '',
                            secondProfilerBadgeText:
                              this.chartData.Widgettitle === 'Measure Profiler - Primary Peer Group'
                                ? this.chartData.data.xAxis.title + ': ' + pointDataCategory
                                : '',
  
                            bandId: IdArray ? IdArray[pointData.index] : '',
                            factId: '',
                            DimensionName: (this.chartData.Widgettitle == 'Dimensional Scatter Chart') ? splittedValue[0] : '',
                            DimensionValue: (this.chartData.Widgettitle == 'Dimensional Scatter Chart') ? splittedValue[1] : '',
                            chartData: this.chartData,
                            pieSelectedIndex: 'No'
                          };
                          // multiple-select scatter point - dimensionvalue as csv start
                          setTimeout(() => {
                            if (pointData.state == 'select') {
                              dimensionValueCSV.push(splittedValue[1])
                            } else if (pointData.state == '') {
                              const tempDimensionValueCSV = []
                              dimensionValueCSV.filter(val => {
                                if (val != splittedValue[1]) {
                                  tempDimensionValueCSV.push(val)
                                }
                              })
                              dimensionValueCSV = tempDimensionValueCSV
                            }
                            const uniquefactIdCsv = Array.from(new Set(dimensionValueCSV));
                            dimensionValueCSV = uniquefactIdCsv
                            this.pointDataOnClick.DimensionValue = dimensionValueCSV.join('|~')
                            const dimensionString = this.pointDataOnClick.DimensionValue
                            // dimensionString = dimensionString.replace(/,/g, '|~')
                            this.pointDataOnClick.DimensionValue = dimensionString
  
                            // multiple-select scatter point - dimensionvalue as csv end
  
                            this.Service.setItem('DimensionData', JSON.stringify(this.pointDataOnClick))
                          }, 100);
  
  
                        }
                        else {
                         // const str = pointDataCategory;
                          //let splittedValue = str.split(":");
                          this.pointDataOnClick = {
                            breadCrumbText: this.chartData.data.xAxis.title ? this.chartData.data.xAxis.title + ': ' + pointDataCategory : pointDataCategory,
                            profilerBadgeText: pointDataCategory,
                            factId: (this.chartData.Widgettitle && !this.chartData.Widgettitle.includes('Profiler') && IdArray) ? IdArray[pointData.index] : '',
                          };
                          // multiple-select scatter point - factId as csv start
                          setTimeout(() => {
                              const pointTag = pointDataCategory.replace(/(<([^>]+)>)/ig, '');
                            if (pointData.state == 'select') {
                              factIdCSV.push(IdArray[pointData.index])
  
                              profilerBadgeTextCSV.push(pointTag)
                              if (pieIndexCSV.length > 0) {
                                pieIndexCSV.filter(val => {
                                  if (val != pointData.index) {
                                    pieIndexCSV.push(pointData.index)
                                  }
                                })
                              }
                              else {
                                pieIndexCSV.push(pointData.index)
                              }
                            } else if (pointData.state == '') {
                              const tempFactValueCSV = []
                              factIdCSV.filter(val => {
                                if (val != IdArray[pointData.index]) {
                                  tempFactValueCSV.push(val)
                                }
                              })
                              factIdCSV = tempFactValueCSV
  
                              const tempBadgeCSV = []
                              profilerBadgeTextCSV.filter(val => {
                                if (val != pointTag) {
                                  tempBadgeCSV.push(val)
                                }
                              })
                              profilerBadgeTextCSV = tempBadgeCSV
  
                              const tempindexCSV = []
                              pieIndexCSV.filter(val => {
                                if (val != pointDataCategory) {
                                  tempindexCSV.push(val)
                                }
                              })
                              pieIndexCSV = tempindexCSV
  
                            }
                            const uniquefactIdCsv = Array.from(new Set(factIdCSV));
                            factIdCSV = uniquefactIdCsv
                            this.pointDataOnClick.factId = factIdCSV.toString()
                            // multiple-select scatter point - factId as csv end
                            this.pointDataOnClick.profilerBadgeText = profilerBadgeTextCSV
                           if(this.chartData.Widgettitle != 'Measure Profiler - Primary Peer Group' ||
                                this.chartData.Widgettitle != 'Measure Profiler - Secondary Peer Group' ||
                                this.chartData.Widgettitle != 'Pattern Profiler - Secondary Peer Group') {
                                  this.pointDataOnClick.breadCrumbText = profilerBadgeTextCSV
                                }
                            let tempIndexCSV = []
                            tempIndexCSV = pieIndexCSV.filter(function (item, pos) {
                              return pieIndexCSV.indexOf(item) == pos;
                            });
                            pieIndexCSV = tempIndexCSV
                            if (this.pointDataOnClick.factId && this.pointDataOnClick.factId != undefined && this.pointDataOnClick.factId != '') {
                              this.pointDataOnClick['pieSelectedIndex'] = pieIndexCSV.length > 0 ? pieIndexCSV.toString() : 'No'
                            }
                            else {
                              this.pointDataOnClick['pieSelectedIndex'] = 'No'
                            }
                            this.Service.setItem('DimensionalWidgetPointData', JSON.stringify(this.pointDataOnClick))
                          }, 100);
                        }
                      } else {
                        if (this.router.url === '/pages/eda' || this.router.url === '/pages/add' || this.chartData.Widgettitle === 'Measure Profile' || this.chartData.Widgettitle === 'Pattern Profile') {
                          this.pointDataOnClick = {
                            breadCrumbText:
                              this.chartData.Widgettitle === 'Measure Profiler - Primary Peer Group' ||
                                this.chartData.Widgettitle === 'Measure Profiler - Secondary Peer Group' ||
                                this.chartData.Widgettitle === 'Pattern Score Summary' ||
                                this.chartData.Widgettitle === 'Pattern Profiler - Secondary Peer Group' || this.chartData.Widgettitle === 'Measure Profile' || this.chartData.Widgettitle === 'Pattern Profile' || this.chartData.Widgettitle === null
                                ?
                                pointDataCategory
                                : '',
                            secondProfilerBadgeText:
                              this.chartData.Widgettitle === 'Measure Profiler - Primary Peer Group'
                                ? this.chartData.data.xAxis.title + ': ' + pointDataCategory
                                : '',
  
                            bandId: IdArray ? IdArray[pointData.index] : '',
                            factId: IdArray1 ? IdArray1[pointData.index] : '',
                          };
                          this.pointDataOnClick['pieSelectedIndex'] = this.pointDataOnClick.factId && this.pointDataOnClick.factId != undefined && this.pointDataOnClick.factId != '' ? pointData.index : 'No'
                          if (this.chartData.chartType && this.chartData.chartType == 'Summary Chart') {
                            pointDataCategory = pointData.category
                          }
                          else {
                            if (this.router.url === '/pages/eda' || this.chartData.Widgettitle === 'Measure Profile' || this.chartData.Widgettitle === 'Pattern Profile') {
                              pointDataCategory = pointData.category ? pointData.category : pointData.name
                            }
                            else {
                              pointDataCategory = pointData.name ? pointData.name : pointData.category
                            }
                          }
                          if (currentChartLevel == this.chartData.ChartLevel) {
                            this.pointDataOnClick.breadCrumbText = pointDataCategory
                          }
                          currentChartLevel = this.chartData.ChartLevel
                          setTimeout(() => {
                            // multiple-select scatter point - breadcrumtext as csv start
                            const breadCrumTextSplit = this.pointDataOnClick.breadCrumbText
                            let concatedBreadCrumTextSplit = '';
                            if (breadCrumTextCSV.length == 0) {
                              concatedBreadCrumTextSplit = this.chartData.ChartLevel +
                                '_' +
                                this.chartData.data.xAxis.title +
                                '&' +
                                this.chartData.ChartLevel +
                                '_'
                              breadCrumTextCSV.push(concatedBreadCrumTextSplit)
                            }
                            if (pointData.state == 'select') {
                              let breadCrumb = []
                              breadCrumTextCSV.push(breadCrumTextSplit)
                              breadCrumb = breadCrumTextCSV.filter(function (item, pos) {
                                return breadCrumTextCSV.indexOf(item) == pos;
                              });
                              breadCrumTextCSV = breadCrumb
  
                              // Dataset Eda summary bar chart - Add
                              attributeValueCsv.push(pointDataCategory)
                              selectedIndexStr = JSON.parse(localStorage.getItem('pieSelectedIndex'))
                              if (selectedIndexStr && selectedIndexStr.factId && selectedIndexStr.factId != "") {
                                const factArray = selectedIndexStr.factId.split(',')
                                factArray.map(item => {
                                  factIdCSV.push(item)
                                })
                              }
                              factIdCSV.push(IdArray[pointData.index])
  
                            } else if (pointData.state == '') {
                              const tempFactValueCSV = []
                              breadCrumTextCSV.filter((val, i) => {
                                if (val == pointDataCategory) {
                                  tempFactValueCSV.splice(i, 1)
                                }
  
                                if (val != breadCrumTextSplit) {
                                  tempFactValueCSV.push(val)
                                }
                              })
                              breadCrumTextCSV = tempFactValueCSV
                              // Dataset Eda summary bar chart - Remove
                              attributeValueCsv.filter((val, i) => {
                                if (val == pointDataCategory) {
                                  attributeValueCsv.splice(i, 1)
                                }
                              })
                              if (IdArray.length > 0) {
                                factIdCSV.filter((val, i) => {
                                  if (Number(val) == Number(IdArray[pointData.index])) {
                                    factIdCSV.splice(i, 1)
                                  }
                                })
  
                              }
                            }
                            let dimensionString = '';
                            let levelStringZero = ''
                            breadCrumTextCSV.map((val, i) => {
                              if (i == 0) {
                                levelStringZero = val
                              }
                              if ((i > 0 && !val.includes(levelStringZero)) || i == 0) {
                                if (i <= 1) {
                                  dimensionString = dimensionString + val
                                } else {
                                  dimensionString = dimensionString + '#^' + val
                                }
                              }
                            })
                            this.pointDataOnClick.breadCrumbText = dimensionString
                            const uniquefactIdCsv = Array.from(new Set(factIdCSV));
                            factIdCSV = uniquefactIdCsv
                            this.pointDataOnClick.factId = factIdCSV.toString()
                            // multiple-select scatter point - factId as csv end
                            if (this.chartData.ChartLevel == undefined) {
                              // Dataset Eda summary bar chart multiple click attribute name & value get start
                              this.pointDataOnClick.attributeNameCsv = this.chartData.data.xAxis.title
                              this.pointDataOnClick.attributeValueCsv = attributeValueCsv.join('|~')
                              // Dataset Eda summary bar chart multiple click attribute name & value get start
                            }
                            if (this.router.url == '/pages/eda' && EDAIdArray.length == 0) {
                              this.Service.setItem('EDAWidgetPiePointData', JSON.stringify(this.pointDataOnClick))
                            }
                            this.Service.setItem('EDAWidgetPointData', JSON.stringify(this.pointDataOnClick))
                          }, 100);
                        } else {
                          this.pointDataOnClick = {
                            breadCrumbText:
                              this.chartData.Widgettitle === 'Measure Profiler - Primary Peer Group' ||
                                this.chartData.Widgettitle === 'Measure Profiler - Secondary Peer Group' ||
                                this.chartData.Widgettitle === 'Pattern Score Summary' ||
                                this.chartData.Widgettitle === 'Pattern Profiler - Secondary Peer Group'
                                ? this.chartData.data.xAxis.title + ': ' + pointDataCategory
                                : '',
                            secondProfilerBadgeText:
                              this.chartData.Widgettitle === 'Measure Profiler - Primary Peer Group'
                                ? this.chartData.data.xAxis.title + ': ' + pointDataCategory
                                : '',
  
                            bandId: IdArray ? IdArray[pointData.index] : '',
                            factId: IdArray1 ? IdArray1[pointData.index] : '',
                            measurebandId: IdArray2 ? IdArray2[pointData.index] : '',
                            pointDataName: pointData.name,
                          };
                          // multiple-select scatter point - factId as csv start
                          if (IdArray1) {
                            setTimeout(() => {
                              if (pointData.state == 'select') {
                                factIdCSV.push(IdArray1[pointData.index])
                                profilerBadgeTextCSV.push(pointData.category.replace(/(<([^>]+)>)/ig, ''))
  
                                if (pieIndexCSV.length > 0) {
                                  pieIndexCSV.filter(val => {
                                    if (val != pointData.index) {
                                      pieIndexCSV.push(pointData.index)
                                    }
                                  })
                                }
                                else {
                                  pieIndexCSV.push(pointData.index)
                                }
                              } else if (pointData.state == '') {
                                const tempFactValueCSV = []
                                factIdCSV.filter(val => {
                                  if (val != IdArray1[pointData.index]) {
                                    tempFactValueCSV.push(val)
                                  }
                                })
                                factIdCSV = tempFactValueCSV
                                const tempBadgeCSV = []
                                profilerBadgeTextCSV.filter(val => {
                                  if (val != pointData.category.replace(/(<([^>]+)>)/ig, '')) {
                                    tempBadgeCSV.push(val)
                                  }
                                })
                                profilerBadgeTextCSV = tempBadgeCSV
  
                                const tempindexCSV = []
                                pieIndexCSV.filter(val => {
                                  if (val != pointDataCategory) {
                                    tempindexCSV.push(val)
                                  }
                                })
                                pieIndexCSV = tempindexCSV
                              }
  
                              let tempIndexCSV = []
                              tempIndexCSV = pieIndexCSV.filter(function (item, pos) {
                                return pieIndexCSV.indexOf(item) == pos;
                              });
                              pieIndexCSV = tempIndexCSV
                              if (this.pointDataOnClick.factId && this.pointDataOnClick.factId != undefined && this.pointDataOnClick.factId != '') {
                                this.pointDataOnClick['pieSelectedIndex'] = pieIndexCSV.length > 0 ? pieIndexCSV.toString() : 'No'
                              }
                              else {
                                this.pointDataOnClick['pieSelectedIndex'] = 'No'
                              }
                              const uniquefactIdCsv = Array.from(new Set(factIdCSV));
                              factIdCSV = uniquefactIdCsv
                              this.pointDataOnClick.factId = factIdCSV.toString()
                              profilerBadgeTextCSV = profilerBadgeTextCSV.filter(function (item, pos) {
                                return profilerBadgeTextCSV.indexOf(item) == pos;
                              });
                              this.Service.setItem('DimensionalWidgetPointData', JSON.stringify(this.pointDataOnClick))
                              this.pointDataOnClick.breadCrumbText = profilerBadgeTextCSV
  
                              const chartEventDetail = {
                                name: e,
                                data: this.chartData,
                                pointdata: this.pointDataOnClick
                              };
                              this.ChartSharedService.chartActionEvent.next(chartEventDetail);
                            }, 100);
                          }
                          // multiple-select scatter point - factId as csv end
  
                          // mulitple-select pattern bandId csv start
                          if (IdArray && this.chartData.domainID === 6) {
                            setTimeout(() => {
                              if (pointData.state == 'select') {
                                //console.log(pointData);
                                patternBandIdCSV.push(IdArray[pointData.index])
                                //console.log(patternBandIdCSV);
                                if (patternbandCSV.length > 0) {
                                  patternbandCSV.filter(val => {
                                    if (val != IdArray[pointData.index]) {
                                      patternbandCSV.push(IdArray[pointData.index])
                                    }
                                  })
                                }
                                else {
                                  patternbandCSV.push(IdArray[pointData.index])
                                }
                              } else if (pointData.state == '') {
                                //console.log(pointData);
                                const tempFactValueCSV = []
                                patternBandIdCSV.filter(val => {
                                  if (val != IdArray[pointData.index]) {
                                    tempFactValueCSV.push(val)
                                  }
                                })
                                patternBandIdCSV = tempFactValueCSV
                                const tempindexCSV = []
                                patternbandCSV.filter(val => {
                                  if (val != IdArray[pointData.index]) {
                                    tempindexCSV.push(val)
                                  }
                                })
                                patternbandCSV = tempindexCSV
                              }
  
                              let tempIndexCSV = []
                              tempIndexCSV = patternbandCSV.filter(function (item, pos) {
                                return patternbandCSV.indexOf(item) == pos;
                              });
                              patternbandCSV = tempIndexCSV
                              if (this.pointDataOnClick.bandId && this.pointDataOnClick.bandId != undefined && this.pointDataOnClick.bandId != '') {
                                this.pointDataOnClick['pieSelectedIndex'] = patternbandCSV.length > 0 ? patternbandCSV.toString() : 'No'
                              }
                              else {
                                this.pointDataOnClick['pieSelectedIndex'] = 'No'
                              }
                              const uniquefactIdCsv = Array.from(new Set(patternbandCSV));
                              patternbandCSV = uniquefactIdCsv
                              this.pointDataOnClick.bandId = patternbandCSV.toString()
                              // profilerBadgeTextCSV = profilerBadgeTextCSV.filter(function (item, pos) {
                              //   return profilerBadgeTextCSV.indexOf(item) == pos;
                              // });
                              this.Service.setItem('DimensionalWidgetPointData', JSON.stringify(this.pointDataOnClick))
                              // this.pointDataOnClick.breadCrumbText = profilerBadgeTextCSV
                              if (this.chartData.Widgettitle === 'Pattern Score Summary') {
                                this.Service.setObj('SecProfilePatternBandId', patternbandCSV.toString());
                              }
                              const chartEventDetail = {
                                name: e,
                                data: this.chartData,
                                pointdata: this.pointDataOnClick
                              };
                              this.ChartSharedService.chartActionEvent.next(chartEventDetail);
                            }, 100);
                          }
                          // mulitple-select pattern bandId csv end
  
                          // mulitple-select measure bandId csv start
                          if (IdArray2 && this.chartData.type === 'MeasureBand') {
                            setTimeout(() => {
                              if (pointData.state == 'select') {
                                //console.log(pointData);
                                measureBandIdCSV.push(IdArray2[pointData.index])
                                //console.log(measureBandIdCSV);
                                if (measurebandCSV.length > 0) {
                                  measurebandCSV.filter(val => {
                                    if (val != IdArray2[pointData.index]) {
                                      measurebandCSV.push(IdArray2[pointData.index])
                                    }
                                  })
                                }
                                else {
                                  measurebandCSV.push(IdArray2[pointData.index])
                                }
                              } else if (pointData.state == '') {
                                //console.log(pointData);
                                const tempFactValueCSV = []
                                measureBandIdCSV.filter(val => {
                                  if (val != IdArray2[pointData.index]) {
                                    tempFactValueCSV.push(val)
                                  }
                                })
                                measureBandIdCSV = tempFactValueCSV
                                const tempindexCSV = []
                                measurebandCSV.filter(val => {
                                  if (val != IdArray2[pointData.index]) {
                                    tempindexCSV.push(val)
                                  }
                                })
                                measurebandCSV = tempindexCSV
                              }
  
                              let tempIndexCSV = []
                              tempIndexCSV = measurebandCSV.filter(function (item, pos) {
                                return measurebandCSV.indexOf(item) == pos;
                              });
                              measurebandCSV = tempIndexCSV
                              if (this.pointDataOnClick.bandId && this.pointDataOnClick.bandId != undefined && this.pointDataOnClick.bandId != '') {
                                this.pointDataOnClick['pieSelectedIndex'] = measurebandCSV.length > 0 ? measurebandCSV.toString() : 'No'
                              }
                              else {
                                this.pointDataOnClick['pieSelectedIndex'] = 'No'
                              }
                              const uniquefactIdCsv = Array.from(new Set(measurebandCSV));
                              measurebandCSV = uniquefactIdCsv
                              this.pointDataOnClick.measurebandId = measurebandCSV.toString()
                              // profilerBadgeTextCSV = profilerBadgeTextCSV.filter(function (item, pos) {
                              //   return profilerBadgeTextCSV.indexOf(item) == pos;
                              // });
                              this.Service.setItem('DimensionalWidgetPointData', JSON.stringify(this.pointDataOnClick))
                              // this.pointDataOnClick.breadCrumbText = profilerBadgeTextCSV
                              if (this.chartData.Widgettitle === 'Pattern Score Summary') {
                                this.Service.setObj('SecProfileMeasureBandId', measurebandCSV.toString());
                              }
                              const chartEventDetail = {
                                name: e,
                                data: this.chartData,
                                pointdata: this.pointDataOnClick
                              };
                              this.ChartSharedService.chartActionEvent.next(chartEventDetail);
                            }, 100);
                          }
                          // mulitple-select measure bandId csv end
  
                        }
                      }
                      if (this.chartData.Widgettitle === 'Measure Profiler - Primary Peer Group' || this.chartData.Widgettitle === 'Pattern Score Summary' || this.chartData.Widgettitle === 'Pattern Profiler - Secondary Peer Group') {
                        this.refprimarytitle = this.chartData.data.xAxis.title;
                        this.refprimaryname = pointDataCategory;
                      }
  
                      if (this.chartData.Widgettitle === 'Measure Profiler - Primary Peer Group' || this.chartData.Widgettitle === 'Pattern Score Summary' || this.chartData.Widgettitle === 'Pattern Profiler - Secondary Peer Group') {
                        (this.pointDataOnClick.primaryProfileName = this.refprimarytitle),
                          (this.pointDataOnClick.primaryProfileValue = this.refprimaryname);
  
                        // multiple-select scatter point - dimensionvalue as csv start
                        setTimeout(() => {
                          if (pointData.state == 'select') {
                            primaryProfilerValueCSV.push(this.refprimaryname)
                          } else if (pointData.state == '') {
                            const tempDimensionValueCSV = []
                            primaryProfilerValueCSV.filter(val => {
                              if (val != this.refprimaryname) {
                                tempDimensionValueCSV.push(val)
                              }
                            })
                            primaryProfilerValueCSV = tempDimensionValueCSV
                          }
                          const uniquefactIdCsv = Array.from(new Set(primaryProfilerValueCSV));
                          primaryProfilerValueCSV = uniquefactIdCsv
                          if (this.router.url !== '/pages/eda') {
                            const breadCrumbText = []
                            primaryProfilerValueCSV.map(item => {
                              let str = ''
                              str = this.refprimarytitle + ':' + item
                              breadCrumbText.push(str)
                            })
                            this.pointDataOnClick.breadCrumbText = breadCrumbText
                          }
                          this.pointDataOnClick.primaryProfileValue = primaryProfilerValueCSV.join('|~')
                          const dimensionString = this.pointDataOnClick.primaryProfileValue
                          this.pointDataOnClick.primaryProfileValue = dimensionString
                          // multiple-select scatter point - dimensionvalue as csv end
  
                          localStorage.setItem('PrimaryRef', JSON.stringify(this.pointDataOnClick));
                        }, 100);
  
                      }
                      if (
                        this.chartData.Widgettitle === 'Measure Profiler - Secondary Peer Group' ||
                        this.chartData.Widgettitle === 'Pattern Profiler - Secondary Peer Group'
                      ) {
                        this.pointDataOnClick.SecondaryProfileName = this.chartData.data.xAxis.title;
                        this.pointDataOnClick.SecondaryProfileValue = pointDataCategory;
  
                        // multiple-select scatter point - dimensionvalue as csv start
                        setTimeout(() => {
                          if (pointData.state == 'select') {
                            secondaryProfilerValueCSV.push(pointDataCategory)
                          } else if (pointData.state == '') {
                            const tempDimensionValueCSV = []
                            secondaryProfilerValueCSV.filter(val => {
                              if (val != pointDataCategory) {
                                tempDimensionValueCSV.push(val)
                              }
                            })
                            secondaryProfilerValueCSV = tempDimensionValueCSV
                          }
                          const uniquefactIdCsv = Array.from(new Set(secondaryProfilerValueCSV));
                          secondaryProfilerValueCSV = uniquefactIdCsv
                          this.pointDataOnClick.SecondaryProfileValue = secondaryProfilerValueCSV.join('|~')
                          const dimensionString = this.pointDataOnClick.SecondaryProfileValue
                          // dimensionString = dimensionString.replace(/,/g, '|~')
                          this.pointDataOnClick.SecondaryProfileValue = dimensionString
                          // multiple-select scatter point - dimensionvalue as csv end
  
                          const primarydata = JSON.parse(localStorage.getItem('PrimaryRef'));
                          this.pointDataOnClick.primaryProfileName = primarydata.primaryProfileName;
                          this.pointDataOnClick.primaryProfileValue = primarydata.primaryProfileValue;
                        }, 100);
  
  
                      }
                    }
                    }
                  },
                  dblclick: e => {
                    if(this.chartData.drilldownActions?.length > 0){
                     
                    }else{
                      const pointData = e.point;
                      if (e.type === 'dblclick' && pointData.state == 'select') {
                        this.onChartClick(e, this.chartData.type, this.chartData);
                      }
                    }
                  
                  },
                  mouseOver: function () {
                    if (this.series.halo) {
                      this.series.halo.attr({
                        'class': 'highcharts-tracker'
                      }).toFront();
                    }
                  },
                  // mouseOut: function () {
                  //   Highcharts.charts[0].tooltip.hide(0);
                  // }
                }
              }
            }
          },
          credits: {
            enabled: false
          },
          exporting: {
            enabled: false
          },
          series:
            this.chartData.type === 'bar' || this.chartData.type === 'MeasureBand'
              ? new Array({ data: yAxisDataForBar })
              // : pointLegendForScatter.length >= 1 ? pointLegendForScatter : new Array({ data: yAxisDataForScatter })
              : new Array({ data: yAxisDataForScatter })
        };
      }
      this.barChart = Highcharts.chart(this.chartElement.nativeElement, this.barChartOptions);
      if(this.chartData.type === 'scatter' && legend === true) {
        colorList = this.chartData.ColorList;
        this.customLegend(colorList,false);
      }
    }
    
  }
  customLegend(color,_val): void {
    if(color != null) {
    color.forEach((_data, index) => {
      const legend1 =
      '<div class="custom-legend-resp-4" style="max-width:16.6663%;flex:0 0 16.6663%;display:inline-flex;padding-right:8px;padding-left:8px;"><span style="color:' +
      color[index].bandColor +
      ';background-color:' +
      color[index].bandColor +
      ';width:14px;height:14px;display:inline-block;border:1px solid #0000;border-radius:13px;padding-right:7px;font-size:12px;"></span><span style="padding-left:6px;font-size:13px;display:inline-block;vertical-align:text-top;font-weight:600;line-height:normal;">' +
      color[index].bandName +
      '</span></div>';
      // //console.log(legend1);

      // if(val == true){
      // this.legendElNetwork.nativeElement.insertAdjacentHTML('beforeend', legend1);
      // }
      // else{
      this.legendEl.nativeElement.insertAdjacentHTML('beforeend', legend1);
      // }
      
      });
    }
  }
  formatNumber(titleText, tag) {
    titleText += '';
    const x = titleText.split('.');
    let x1 = x[0];
    const x2 = x.length > 1 ? '.' + x[1] : '';
    const rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    // x1 = x1.replace(/^0+/, '');
    // x2 = x2.replace(/^0+/, '');

    let y = x1 + x2
    y = y.replace(/^0+/, '')

    let val;
    if (this.chartData.Units != undefined && this.chartData.Units != '' && this.chartData.Units != null && this.chartData.UnitDisplayPosition != '') {
      if (this.chartData.UnitDisplayPosition === 'Prefix') {
        val = tag ? tag + this.chartData.Units + ' ' + y : this.chartData.Units + ' ' + y
      } else {
        val = tag ? tag + y + ' ' + this.chartData.Units : y + ' ' + this.chartData.Units
      }
    } else {
      val = tag ? tag + y : y
    }
    // let val = tag ? tag + y : y
    // //console.log(tag)
    // //console.log(y)
    return val;
  }
  onChartClick(event, _chartType, _chartData) {
    // for filtered workqueues tab - AI demo
   // if (chartData.title == 'File Volume by SLA' || chartData.title == 'File Volume by Speciality Group' || chartData.title == 'Files Needing Attention by Case Status' || chartData.title == 'In Progress Files by Tasks') {
     // this.contexMenuControl = false;
   // } else {
      this.contexMenuControl = true;
   // }
    //console.log(this.chartLocation);
    let timeout;
    if (
      (this.contexMenuControl === true && this.chartLocation === 'dashboard') ||
      (this.contexMenuControl === true && this.chartLocation !== 'dashboard')
    ) {
      this.chartData.showActions = true;
      this.setContextMenu(event);
      // Context Menu should Display only 5 Seconds
     timeout =  setTimeout(() => {
        this.setContextMenu(event);
        this.chartData.showActions = false;
        this.contexMenuControl = false;
        this.chartClickCheck = '';
      }, 5000);
    } else {
      clearTimeout(timeout);
      this.contexMenuControl = false;
      this.chartClickCheck = '';
    }
    // }
  }
  showContextMenu:boolean =false;
  setContextMenu(_event) {
    if(this.showContextMenu){
      this.showContextMenu = false;
    }else{
      this.showContextMenu = true;
    }
  }
  ContextMenuEmitter(event){
    //console.log(event,'context menu');
    this.onChartActionClicked(event);
  }
  onChartActionClicked(actionName) {
    // //console.log(actionName);
    //console.log(actionName);
    if (this.pointDataOnClick.pieSelectedIndex != 'No') {
      if (this.pointDataOnClick.pieSelectedIndex != undefined) {
        const obj = {
          chartIndex: this.pointDataOnClick.pieSelectedIndex
        }
        localStorage.setItem('chartIndex', JSON.stringify(obj))
        //console.log(obj)
      }
    }
    if (this.pointDataOnClick.breadCrumbText == '') {
      const breadCrumbArray = []
      if (this.pointDataOnClick.DimensionName && this.pointDataOnClick.DimensionName != '' && this.pointDataOnClick.DimensionValue && this.pointDataOnClick.DimensionValue != '') {
        let breadCrumb = []
        breadCrumb = this.pointDataOnClick.DimensionValue.split('|~')
        breadCrumb.map(item => {
          let str = ''
          str = this.pointDataOnClick.DimensionName + ':' + item
          breadCrumbArray.push(str)
        })
      }
      this.pointDataOnClick.breadCrumbText = breadCrumbArray
    }
    if (this.pointDataOnClick.SecondaryProfileName && this.pointDataOnClick.SecondaryProfileName != '' && this.pointDataOnClick.SecondaryProfileValue && this.pointDataOnClick.SecondaryProfileValue != '') {
      const breadCrumbArray = []
      let breadCrumb = []
      breadCrumb = this.pointDataOnClick.SecondaryProfileValue.split('|~')
      breadCrumb.map(item => {
        let str = ''
        str = this.pointDataOnClick.SecondaryProfileName + ':' + item
        breadCrumbArray.push(str)
      })
      this.pointDataOnClick.breadCrumbText = breadCrumbArray
    }
    if (this.pointDataOnClick.profilerBadgeText && typeof (this.pointDataOnClick.profilerBadgeText) !== 'string' && this.pointDataOnClick.profilerBadgeText.length > 0) {
      let breadCrumb = []
      this.pointDataOnClick.profilerBadgeText.map((item, index) => {
        if(typeof (item) == 'string'){
          this.pointDataOnClick.profilerBadgeText[index] = item.replace(/(<([^>]+)>)/ig, '');
        }
        else{
          this.pointDataOnClick.profilerBadgeText[index] = item;
        }
        
      })
      const breadCrumbArray = this.pointDataOnClick.profilerBadgeText
      breadCrumb = breadCrumbArray.filter(function (item, pos) {
        return breadCrumbArray.indexOf(item) == pos;
      });
      this.pointDataOnClick.profilerBadgeText = breadCrumb
    }

    if (this.chartData.Widgettitle && this.chartData.Widgettitle.includes('Profiler')) {
      this.pointDataOnClick.factId = ''
    }
    const chartEventDetail = {
      name: actionName,
      data: this.chartData,
      pointdata: this.pointDataOnClick
    };
    if(this.pointDataOnClick.PatternScore&&this.pointDataOnClick.PatternScore!=null&&this.pointDataOnClick.PatternScore!=''&&(actionName == 'scatter'||actionName == 'showSecondaryProfiler')){
      this.pointDataOnClick.breadCrumbText = this.pointDataOnClick.profilerBadgeText
    }
    if(this.pointDataOnClick.PatternScore&&this.pointDataOnClick.PatternScore!=null&&typeof (this.pointDataOnClick.breadCrumbText) == 'string'){
      // let array = []
      // array.push(this.pointDataOnClick.breadCrumbText)
      this.pointDataOnClick.breadCrumbText = this.pointDataOnClick.profilerBadgeText
    }
    // //console.log(chartEventDetail);
    this.chartEvent.emit(chartEventDetail);
    this.chartData.showActions = false;
    this.contexMenuControl = false;
    
    if(Object.prototype.hasOwnProperty.call(this.pointDataOnClick, 'breadCrumbText')) {
      if (this.pointDataOnClick.breadCrumbText.length > 0 && typeof (this.pointDataOnClick.breadCrumbText) !== 'string') {
        this.pointDataOnClick.breadCrumbText.map((item, index) => {
          this.pointDataOnClick.breadCrumbText[index] = item.replace(/(<([^>]+)>)/ig, '');
        })
      }
    }
    if(Object.prototype.hasOwnProperty.call(this.pointDataOnClick, 'breadCrumbText')) { 
    if (this.pointDataOnClick.breadCrumbText != null && typeof (this.pointDataOnClick.breadCrumbText) == 'string') {
      this.pointDataOnClick.breadCrumbText = this.pointDataOnClick.breadCrumbText.replace(/(<([^>]+)>)/ig, '');
    }
    }
  }

  //popup click event
  openDialog() {
    const dialogRef = this.dialog.open(PopupTemplateComponent, {
      width: '500px',
      data: <IDynamicDialogConfig>{
        title: 'Confirmation',
        titleFontSize:'20',
        dialogContent: 'Are you really sure want to close this.',
        dialogContentFontSize: '15',
        acceptButtonTitle: 'Yes',
        declineButtonTitle: 'No',
        deleteButtonColor : 'green',
        acceptButtonColor : 'green',
        additionalButtons: [
          { label: 'Later', action: 'later', color: 'blue' },
          { label: 'Save', action: 'save' ,color:'red'}
        ],
        titlePosition: 'left',
        contentPosition : 'left',
        buttonPosition : 'center',
        showClose : false,
        // position: { right: '0' }
        // position: { left: '0' }
      }
    });

    dialogRef.componentInstance.buttonClicked.subscribe(action => {
      switch (action) {
        case 'accept':
          //console.log('User clicked "Yes"');
          // Handle "Yes" button click
          break;
        case 'decline':
          //console.log('User clicked "No"');
          // Handle "No" button click
          break;
        case 'later':
          //console.log('User clicked "later"');
          break;
          case 'save':
            //console.log('User clicked "save"');
          // Handle additional button click
          break;
      }
    });
  }
}
