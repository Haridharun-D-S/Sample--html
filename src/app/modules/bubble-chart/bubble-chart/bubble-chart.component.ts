import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BubbleChartService  } from "./bubble-chart.service";
import Highcharts from 'highcharts';
import HighchartsCustomEvents from 'highcharts-custom-events';
import { SharedServiceService } from 'src/app/shared/services/sharedservice.service';
import { SessionStorageService } from 'src/app/shared/services/storage.service';
import { ChartServiceService } from 'src/app/shared/services/chart_service';
HighchartsCustomEvents(Highcharts);
import More from 'highcharts/highcharts-more';
More(Highcharts)
declare let $: any;
@Component({
  selector: 'app-bubble-chart',
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.scss']
})
export class BubbleChartComponent implements OnInit {
  @ViewChild('chartEl') chartElement: ElementRef;
  @Input('widgetSize') widgetSize;
  @ViewChild('contextMenu') contextMenuElement: ElementRef;
  @ViewChild('legend') legendEl: ElementRef;  
  @Output() chartEvent = new EventEmitter<any>();

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

  bubbleChart: Highcharts.Chart;
  bubbleChartOptions: any;
  showLabel: boolean;
  contexMenuControl: boolean = false;
  chartClickCheck: any = '';
  refprimarytitle: any;
  refprimaryname: any;
  toggleLegend: any;

  constructor(private router: Router,  private Service: BubbleChartService,private ChartSharedService : ChartServiceService,private dataGetService: SharedServiceService,private storage: SessionStorageService) { }

  ngOnInit(): void {

    if (this.chartData.type.toLowerCase() === 'bubble') {
      if (this.chartData.data.series.length <= 1000) {
        this.showLabel = true;
      } else {
        this.showLabel = false;
      }
    }
    
  }

  ngAfterViewInit() {
    this.initBubbleChart();
  }

 
  showChart = true;
  initBubbleChart() {
    let factIdCSV = []
    let IdArray = []
    let IdArray1 = []
    let profilerBadgeTextCSV = []
    let pieIndexCSV = []
    let tempChartData = this.chartData
    if(this.chartData.data.Factid.length) {
      this.showChart = true;
    } else {
      this.showChart = false;
    }
    if (this.chartData.data.Factid !== undefined && this.chartData.data.Factid !== null) {
      IdArray1 = this.chartData.data.Factid;
    }
    let shortname = this.chartData.MeasureShortName !== '' && this.chartData.MeasureShortName !== null ? this.chartData.MeasureShortName + ': ' : 'Value: '
    let groupname = this.chartData.ProfileName !== '' && this.chartData.ProfileName !== null ? '<b>' + this.chartData.ProfileName + ': </b>' : ''
    let titlename = this.chartData.title;
    let xTitle = this.chartData.xTitle;
    let yTitle = this.chartData.yTitle;
    
 



      this.chartData.data.series.forEach(element => {
          element.marker = {
              fillColor: this.hexToRGB(element.color,0.3)
          }
      });
var gapPercentage = 0.2;

var filterData = this.filterBubble(this.chartData.data.series, gapPercentage);
    let units =
      this.chartData[0] === undefined
        ? this.chartData.Units === null
          ? ''
          : this.chartData.Units
        : this.chartData[0].Units;
    let Position;
    if(this.chartData.UnitDisplayPosition != '' && this.chartData.UnitDisplayPosition != null) {
      Position = this.chartData.UnitDisplayPosition;
    } else {
      Position = 'Prefix';
    }
    this.toggleLegend = this.chartData.dataLabel === 'true' ? true : false;
    let eda;
    if (this.router.url == '/pages/eda') {
      eda = true
    }
    if(this.router.url === '/dashboard' || this.router.url === '/insights') {
      // console.log(this.chartData);
      this.bubbleChartOptions = {
        chart: {
          type: 'bubble',
          plotBorderWidth: 0.5,
          zoomType: 'null'
        },
        boost: {
          useGPUTranslations: true
        },
        title: {
          text: ''
        },
        xAxis: {
          gridLineWidth: 1,
          lineWidth: 0.2,
          tickWidth: 0,
          min: 0,
          tickInterval: 1,
          startOnTick: false,
          endOnTick: false,
  
          crosshair: true,
          title: {
            text: this.chartData.xTitle
          },
          labels: {
            enabled: true,
            overflow: 'justify'
          },
           plotLines: [{
            color: 'black',
            dashStyle: 'dot',
            width: 2,
            zIndex: 3
        }],
          // zIndex: 3
        },
        legend: {
          enabled: false
        },
        tooltip: {
          formatter: function () {
            // this.xx = tempChartData.data.series[this.point.index].FullName
            // this.xz = tempChartData.data.series[this.point.index].docId
            var pointData = this.point.options;
            console.log(pointData);
            var fullName = pointData.FullName;
            var docId = pointData.docId;
            // return (
            //   this.x + '<br>' + '<b>' + shortname + '</b>' +
            //   (units !== '' && units !== null && units !== undefined
            //   ? Position === 'Prefix' ? units + ' ' + this.y : this.y + ' ' + units
            //   : this.y)
            // );
            return (
               '<b>' +  docId + '</b>' + '<br>' +
              '<b>' +'Owner:' + '</b>' + " "  +  fullName + '<br>' +
              '<b>' + yTitle + ':' + '</b>' + " " + Highcharts.numberFormat(this.y, 0) + '<br>' +
              '<b>' + xTitle + ':' + '</b>' + " " + Highcharts.numberFormat(this.x, 0) + '<br>' 
            )
  
          }
        },
        plotOptions: {
          bubble: {
            tooltip: {
              headerFormat: '<b>{point.FullName}</b><br>',
              pointFormat: '<b>{point.FullName}</b><br> Value :{point.y}'
            }
          },
          series: {
            stickyTracking: false,
            cursor: 'pointer',
            fillOpacity : 0,
            point: {
              events: {
                click: e => {
                  const pointData = e.point;
                  console.log(e, pointData);
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

                    let pointDataCategory = pointData.FullName.toString().replace(/(<([^>]+)>)/ig, '');
                    pointData.objectid = this.chartData.title == 'File Volume by SLA' ? 12 : undefined
                    this.chartClickCheck = pointDataCategory;
  
  
                    this.pointDataOnClick = {
                      // profilerBadgeText: this.chartData.data.xAxis.title + ': ' + pointData.category,
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
                      pointDataName: pointData.name,
                      // pieSelectedIndex: this.pointDataOnClick.factId!=''? pointData.index:''
                    };
  
                    if (IdArray1) {
                      setTimeout(() => {
                            // factIdCSV = IdArray1[pointData.index]
                            factIdCSV = pointData.docId.substr(-4);
                            // console.log(factIdCSV);
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
  
  
                    if (this.chartData.Widgettitle === 'Measure Profiler - Primary Peer Group' || this.chartData.Widgettitle === 'Pattern Score Summary') {
                      this.refprimarytitle = this.chartData.data.xAxis.title;
                      this.refprimaryname = pointDataCategory;
                    }
  
  
  
                    if (this.chartData.Widgettitle === 'Pattern Score Summary') {
                      this.storage.setObj('SecProfilePatternBandId', this.pointDataOnClick.bandId);
                    }
                    if (this.chartData.Widgettitle === 'Measure Profiler - Primary Peer Group' || this.chartData.Widgettitle === 'Pattern Score Summary') {
                      (this.pointDataOnClick.primaryProfileName = this.refprimarytitle),
                        (this.pointDataOnClick.primaryProfileValue = this.refprimaryname);
  
                    }
                    if (
                      this.chartData.Widgettitle === 'Measure Profiler - Secondary Peer Group' ||
                      this.chartData.Widgettitle === 'Pattern Profiler - Secondary Peer Group'
                    ) {
                      this.pointDataOnClick.SecondaryProfileName = this.chartData.data.xAxis.title;
                      this.pointDataOnClick.SecondaryProfileValue = pointDataCategory;
  
                    }
                  }
                },
                mouseOver: function () {
                  if (this.series.halo) {
                    this.series.halo.attr({
                      'class': 'highcharts-tracker'
                    }).toFront();
                  }
                }
              }
            },
            dataLabels: {
              // enabled: this.chartData.data.series.length <= 1000 ? this.chartData.dataLabel === 'true' ? true : false : false,
              enabled : true,
              // formatter : function () {
              //   return (units !== '' && units !== null && units !== undefined
              //      ? Position === 'Prefix' ? units + ' ' + Highcharts.numberFormat(this.y,2,'.',',') : Highcharts.numberFormat(this.y,2,'.',',') + ' ' + units
              //      : Highcharts.numberFormat(this.y,2,'.',','))
              //  }
  
              formatter : function() {
                this.xxx = tempChartData.data.series[this.point.index].ShortName
                return (
                  this.xxx
                )
              }
  
  
            }
          }
        },
  
        yAxis: {
          startOnTick: false,
          endOnTick: false,
          // tickInterval:1000,
          maxPadding: 0,
          title: {
            text: yTitle
          },
          labels: {
            // format: '{value} '
          }
        },
  
        series: [
          {
            data: filterData
            // data: this.chartData.data.series
          }
        ],
        responsive: {
          rules: [
            {
              // condition: {
              //   maxWidth: 500
              // },
              chartOptions: {
                legend: {
                  align: 'center',
                  verticalAlign: 'bottom',
                  layout: 'horizontal'
                },
                yAxis: {
                  labels: {
                    align: 'left',
                    x: 0,
                    y: -5
                  },
                  title: {
                    text: null
                  }
                },
                subtitle: {
                  text: null
                },
                credits: {
                  enabled: false
                }
              }
            }
          ]
        },
        credits: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
  
  
      };
    } else {
      this.bubbleChartOptions = {
        chart: {
          type: 'bubble',
          plotBorderWidth: 1,
          zoomType: 'xy'
        },
        boost: {
          useGPUTranslations: true
        },
        title: {
          text: ''
        },
        xAxis: {
          gridLineWidth: 0,
          min: 0,
          startOnTick: false,
          endOnTick: false,
  
          crosshair: true,
          title: {
            text: this.chartData.xTitle
          },
          labels: {
            enabled: false
          },
        },
        legend: {
          enabled: false
        },
        tooltip: {
          formatter: function () {
            // if (this.x.includes('<b>')) {
            // }
            // else {
            //   this.x = groupname + this.x
            // }
            this.x = tempChartData.data.series[this.point.index].FullName
            return (
              this.x + '<br>' + '<b>' + shortname + '</b>' +
              (units !== '' && units !== null && units !== undefined
              ? Position === 'Prefix' ? units + ' ' + this.y : this.y + ' ' + units
              : this.y)
            );
            // }
  
          }
        },
        plotOptions: {
          bubble: {
            tooltip: {
              headerFormat: '<b>{point.FullName}</b><br>',
              pointFormat: '<b>{point.FullName}</b><br> Value :{point.y}'
            }
          },
          series: {
            stickyTracking: false,
            cursor: 'pointer',
            fillOpacity : 0,
            point: {
              events: {
                click: e => {
                  const pointData = e.point;
                  console.log(e, pointData);
                  if (e.type === 'click') {
                    var clickedPoint = e.point,
                      chart = clickedPoint.series.chart;
                    chart.series.forEach(function (s) {
                      s.points.forEach(function (p) {
                        if (p.x == clickedPoint.x) {
                          p.select(null, true);
                        }
                      });
                    });
                    // values formation & getter's
                    let pointDataCategory = pointData.FullName.toString().replace(/(<([^>]+)>)/ig, '');
                    pointData.objectid = this.chartData.title == 'File Volume by SLA' ? 12 : undefined
                    this.ChartSharedService.chartareaclicked.next(pointData);
                    this.dataGetService.chartValue.next(pointData);
                    this.chartClickCheck = pointDataCategory;
  
  
                    this.pointDataOnClick = {
                      // profilerBadgeText: this.chartData.data.xAxis.title + ': ' + pointData.category,
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
                      pointDataName: pointData.name,
                      // pieSelectedIndex: this.pointDataOnClick.factId!=''? pointData.index:''
                    };
  
                    // multiple-select scatter point - factId as csv start
                    if (IdArray1) {
                      setTimeout(() => {
                        if(this.chartData.drilldownActions?.length > 0){ 
                          if (pointData.state == 'select') {
                            factIdCSV.push(IdArray1[pointData.index])
    
                            profilerBadgeTextCSV.push(pointData.FullName.toString().replace(/(<([^>]+)>)/ig, ''))
    
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
                            // console.log(dimensionValueCSV)
                            // console.log(splittedValue[1])
                            let tempFactValueCSV = []
                            factIdCSV.filter(val => {
                              if (val != IdArray1[pointData.index]) {
                                tempFactValueCSV.push(val)
                              }
                            })
                            factIdCSV = tempFactValueCSV
                            // console.log(dimensionValueCSV)
    
                            let tempBadgeCSV = []
                            profilerBadgeTextCSV.filter(val => {
                              if (val != pointData.FullName.toString().replace(/(<([^>]+)>)/ig, '')) {
                                tempBadgeCSV.push(val)
                              }
                            })
                            profilerBadgeTextCSV = tempBadgeCSV
    
                            let tempindexCSV = []
                            pieIndexCSV.filter(val => {
                              if (val != pointDataCategory) {
                                tempindexCSV.push(val)
                              }
                            })
                            pieIndexCSV = tempindexCSV
                          }
    
                        }else {
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
                          let uniquefactIdCsv = Array.from(new Set(factIdCSV));
                          factIdCSV = uniquefactIdCsv
                          this.pointDataOnClick.factId = factIdCSV.toString()
                          profilerBadgeTextCSV = profilerBadgeTextCSV.filter(function (item, pos) {
                            return profilerBadgeTextCSV.indexOf(item) == pos;
                          });
                          this.storage.setItem('DimensionalWidgetPointData', JSON.stringify(this.pointDataOnClick))
                          this.pointDataOnClick.breadCrumbText = profilerBadgeTextCSV
    
                          const chartEventDetail = {
                            name: e,
                            data: this.chartData,
                            pointdata: this.pointDataOnClick
                          };
                          this.ChartSharedService.chartActionEvent.next(chartEventDetail);
                        }
  
                      }, 100);
                    }
  
  
                    if (this.chartData.Widgettitle === 'Measure Profiler - Primary Peer Group' || this.chartData.Widgettitle === 'Pattern Score Summary') {
                      this.refprimarytitle = this.chartData.data.xAxis.title;
                      this.refprimaryname = pointDataCategory;
                    }
  
  
  
                    if (this.chartData.Widgettitle === 'Pattern Score Summary') {
                      this.storage.setObj('SecProfilePatternBandId', this.pointDataOnClick.bandId);
                    }
                    if (this.chartData.Widgettitle === 'Measure Profiler - Primary Peer Group' || this.chartData.Widgettitle === 'Pattern Score Summary') {
                      (this.pointDataOnClick.primaryProfileName = this.refprimarytitle),
                        (this.pointDataOnClick.primaryProfileValue = this.refprimaryname);
  
                    }
                    if (
                      this.chartData.Widgettitle === 'Measure Profiler - Secondary Peer Group' ||
                      this.chartData.Widgettitle === 'Pattern Profiler - Secondary Peer Group'
                    ) {
                      this.pointDataOnClick.SecondaryProfileName = this.chartData.data.xAxis.title;
                      this.pointDataOnClick.SecondaryProfileValue = pointDataCategory;
  
                    }
                  }
                },
                dblclick: e => {
                  // const pointData = e.point;
                  // if (e.type === 'dblclick' && pointData.state == 'select') {
                  //   this.onChartClick(e, this.chartData.type, this.chartData);
                  // }
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
                }
              }
            },
            dataLabels: {
              enabled: this.chartData.data.series.length <= 1000 ? this.chartData.dataLabel === 'true' ? true : false : false,
              // formatter : function () {
              //   return (units !== '' && units !== null && units !== undefined
              //      ? Position === 'Prefix' ? units + ' ' + Highcharts.numberFormat(this.y,2,'.',',') : Highcharts.numberFormat(this.y,2,'.',',') + ' ' + units
              //      : Highcharts.numberFormat(this.y,2,'.',','))
              //  }
  
              formatter : function() {
                if(units !== '' && units !== null && units !== undefined) {
                  if(Position === 'Prefix') {
                    if (this.y > 1000000) {
                      return units + ' ' + Highcharts.numberFormat(this.y / 1000000, 0) + "M"
                    } else if (this.y > 1000) {
                      return units + ' ' + Highcharts.numberFormat(this.y / 1000, 0) + "K";
                    } else {
                      return units + ' ' + this.y
                    }
                  } else {
                    if (this.y > 1000000) {
                      return Highcharts.numberFormat(this.y / 1000000, 0) + "M" + ' ' + units;
                    } else if (this.y > 1000) {
                      return Highcharts.numberFormat(this.y / 1000, 0) + "K" + ' ' + units;
                    } else {
                      return this.y + ' ' + units;
                    }
                  }
                } else {
                  if (this.y > 1000000) {
                    return Highcharts.numberFormat(this.y / 1000000, 0) + "M"
                  } else if (this.y > 1000) {
                    return Highcharts.numberFormat(this.y / 1000, 0) + "K";
                  } else {
                    return this.y
                  }
                }
              }
  
              // formatter : function () {
              //   return (units !== '' && units !== null && units !== undefined
              //   ? Position === 'Prefix' ? units + ' ' +  this.y
              //   : this.y  + ' ' + units
              //   : this.y)
              //  }
  
            }
          }
        },
  
        yAxis: {
          startOnTick: false,
          endOnTick: false,
          title: {
            text: this.chartData.MeasureShortName != "" ? this.chartData.MeasureShortName : this.chartData.yTitle
          },
          labels: {
            // format: '{value} '
          }
        },
  
        series: [
          {
            data: this.chartData.data.series
          }
        ],
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500
              },
              chartOptions: {
                legend: {
                  align: 'center',
                  verticalAlign: 'bottom',
                  layout: 'horizontal'
                },
                yAxis: {
                  labels: {
                    align: 'left',
                    x: 0,
                    y: -5
                  },
                  title: {
                    text: null
                  }
                },
                subtitle: {
                  text: null
                },
                credits: {
                  enabled: false
                }
              }
            }
          ]
        },
        credits: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
  
  
      };
    }
    
    this.bubbleChart = Highcharts.chart(this.chartElement.nativeElement, this.bubbleChartOptions);
    if(this.chartData.type === 'bubble') {
      this.customLegend(this.chartData.ColorList,false);
    }
  }

  filterBubble(series, radius) {
    series.sort((a, b) => a.x - b.x);

    var positions = [];

    series.forEach(point => {
        var collision = true;
        var attempts = 0;
        var newX, newY;

        while (collision && attempts < 100) {
            newX = point.x + (Math.random() - 0.5) * 2 * radius;
            newY = point.y + (Math.random() - 0.5) * 2 * radius;
            newY = Math.round(newY);

            collision = false;

            // Check for collisions with existing bubbles
            for (var i = 0; i < positions.length; i++) {
                var dist = Math.sqrt(Math.pow(newX - positions[i].x, 2) + Math.pow(newY - positions[i].y, 2));
                if (dist < 2 * radius) { 
                    collision = true;
                    break;
                }
            }

            attempts++;
        }

        positions.push({ x: newX, y: newY });
    });

    for (var i = 0; i < series.length; i++) {
        series[i].x = positions[i].x;
        series[i].y = positions[i].y;
    }

    return series;
}
  
  customLegend(color,val): void {
    if(color != null) {
    color.forEach((data, index) => {
      const legend1 =
      '<div class="custom-legend-resp-4" style="width:auto;display:inline-flex;padding-right:8px;padding-left:8px;"><span style="color:' +
      color[index].bandColor +
      ';background-color:' +
      color[index].bandColor +
      ';width:14px;height:14px;display:inline-block;border:1px solid #0000;border-radius:13px;padding-right:7px;font-size:12px;"></span><span style="padding-left:6px;font-size:13px;display:inline-block;vertical-align:text-top;font-weight:500;line-height:normal;">' +
      color[index].bandName +
      '</span></div>';
      this.legendEl.nativeElement.insertAdjacentHTML('beforeend', legend1);
      
      });
    }
  }

  onChartClick(event, _chartType, _chartData) {
      this.contexMenuControl = true;
    console.log(this.chartLocation);
    let timeout;
    if (
      (this.contexMenuControl === true && this.chartLocation === 'dashboard') ||
      (this.contexMenuControl === true && this.chartLocation !== 'dashboard')
    ) {
      this.chartData.showActions = true;
      this.setContextMenu(event);
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
    console.log(event,'context menu');
    this.onChartActionClicked(event);
  }
  onChartActionClicked(actionName) {
    // console.log(actionName);
    console.log(actionName);
    if (this.pointDataOnClick.pieSelectedIndex != 'No') {
      if (this.pointDataOnClick.pieSelectedIndex != undefined) {
        const obj = {
          chartIndex: this.pointDataOnClick.pieSelectedIndex
        }
        localStorage.setItem('chartIndex', JSON.stringify(obj))
        console.log(obj)
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
      this.pointDataOnClick.breadCrumbText = this.pointDataOnClick.profilerBadgeText
    }
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
  @Output() sendWidgetChanges  = new EventEmitter<any>();
  scatterLabel(chartData) {
    if (chartData.type.toLowerCase() == 'bubble') {
      this.toggleLegend = !this.toggleLegend;
      this.bubbleChart.update({
        plotOptions: {
          series: {
            dataLabels: {
              enabled: this.toggleLegend ? true : false,
            }
          }
        }
      });
      chartData.toggleLegend = this.toggleLegend
      chartData.dataLabel = chartData.toggleLegend === true ? 'true' : 'false'
      this.sendWidgetChanges.emit(chartData);
    }
  }
  hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}


}
