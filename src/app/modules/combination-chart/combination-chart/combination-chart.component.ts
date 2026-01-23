import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ɵbypassSanitizationTrustStyle  } from '@angular/core';
import { Router } from '@angular/router';
import { CombinationChartService  } from './combination-chart.service'
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
  selector: 'app-combination-chart',
  templateUrl: './combination-chart.component.html',
  styleUrls: ['./combination-chart.component.scss']
})
export class CombinationChartComponent implements OnInit {
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

  combinationChart: Highcharts.Chart;
  combinedSeriesChartOptions: any;
  showLabel: boolean;
  contexMenuControl: boolean = false;
  chartClickCheck: any = '';
  refprimarytitle: any;
  refprimaryname: any;
  toggleLegend: any;
  constructor(private router: Router,  private Service: CombinationChartService,private ChartSharedService : ChartServiceService,private dataGetService: SharedServiceService,private storage: SessionStorageService) { }

  ngOnInit(): void {
    // this.chartData = chartData.combination;
  }

  ngAfterViewInit() {
    this.initCombinedSeriesChart();
  }
  showChart = true;
  initCombinedSeriesChart() {
    // const values declarations
    let factIdCSV = []
    let IdArray = []
    let IdArray1 = []
    let breadCrumTextCSV = []
    let profilerBadgeTextCSV = []
    let currentChartLevel = 'L';
    let attributeValueCsv = []
    let pieIndexCSV = []
    let tempChartData = this.chartData
    let yaxisTitle;
    let trimmedXaxis = []
    let unit;
    let unitDisplayPosition;
    this.toggleLegend = this.chartData.dataLabel === 'true' ? true : false;
    let seriesData = [];
    if(this.chartData.combinationdata.Factid.length) {
      this.showChart = true;
    } else {
      this.showChart = false;
    }
    // fact id formation 
    if (this.chartData.combinationdata.Factid !== undefined && this.chartData.combinationdata.Factid !== null) {
      IdArray1 = this.chartData.combinationdata.Factid; // .split(',')
    }

    // yAxis title formation
    if (this.chartData.combinationdata.CombinationSeries[0].MeasureShortName != '' && this.chartData.combinationdata.CombinationSeries[0].MeasureShortName != null) {
      yaxisTitle = this.chartData.combinationdata.CombinationSeries[0].MeasureShortName
    } else {
      yaxisTitle = this.chartData.combinationdata.CombinationSeries[0].name
    }

    for (let i = 0; i < this.chartData.combinationdata.CombinationSeries.length; i++) {
      if (i === 0) {
        // this.chartData.combinationdata.CombinationSeries[i].colorByPoint = true
      } else {
        // this.chartData.combinationdata.CombinationSeries[i].colorByPoint = false
        // this.chartData.combinationdata.CombinationSeries[i].color = Highcharts.getOptions().colors[i]
      }
    }

    // x-axis formation for category
    for (let i = 0; i < this.chartData.combinationdata.xAxis.length; i++) {
      let tempString = this.chartData.combinationdata.xAxis[i]
      tempString = tempString.replace(/<[^>]*>?/gm, '');
      trimmedXaxis.push(tempString)
    }

    this.chartData.combinationdata.CombinationSeries.forEach(element => {
      seriesData.push({
        MeasureShortName : element.MeasureShortName,
        data : element.data,
        name : element.name,
        type : element.type,
        showInLegend: element.type === 'column' ? false : true,
        color : element.name === 'Team Productivity Trend' ? '#7cb5ec' : element.name === 'Completed' ? '#557D50' : element.name === 'In Progress' ? '#CA7D2F'  : element.name === 'Not Started' ? '#702038' : element.name === 'Deleted' ? '#00728A' : element.name === 'Processing Efficiency Trend by Priority Status' ? '#7cb5ec' : element.name === 'Normal' ? '#557D50' : '#702038'
      })
    });

    // unit & unit position formation
    unit = this.chartData.Units && this.chartData.Units !== '' ? this.chartData.Units : undefined
    unitDisplayPosition = this.chartData.UnitDisplayPosition && this.chartData.UnitDisplayPosition !== '' ? this.chartData.UnitDisplayPosition : undefined
    seriesData[0].MeasureShortName = null;
    if(this.router.url === '/dashboard' || this.router.url === '/filelistdashboard' || this.router.url === '/insights') {
      this.combinedSeriesChartOptions = {
        chart: {
          zoomType: 'xy',
          // height: 293
          // height: this.widgetSize === undefined ? 293 : '30%'
        },
        boost: {
          useGPUTranslations: true
        },
        title: {
          text: ''
        },
        xAxis: {
          // categories: this.chartData.combinationdata.xAxis,
          categories: trimmedXaxis,
          crosshair: true,
          labels: {
            // autoRotation: [0],
            // autoRotationLimit: 15,
            // allowOverlap: false
          }
        },
        yAxis: {
          title: {
            text: yaxisTitle,
            style: {
              color: '#7cb5ec' // '#f7a35c'
            }
          },
          labels: {
            style: {
              color: '#7cb5ec' // '#f7a35c'
            }
          }
        },
        tooltip: {
          shared: false,
          formatter: function () {
                  let tooltipFormatedValue: any = [];
              let xAxisFormatedValue: any = ''
              var series = this.series.chart.series
              for (let i = 0; i < series.length; i++) {
    
                // for shortname check
                let pointName = series[i].userOptions.MeasureShortName != '' && series[i].userOptions.MeasureShortName != null ? series[i].userOptions.MeasureShortName : series[i].name
    
                let pointValue = Highcharts.numberFormat(series[i].yData[this.point.index], 0,'.',',')
    
                let formattedString = ''
                if (unit && unitDisplayPosition && unitDisplayPosition === 'Prefix') {
                  formattedString = `<b>${pointName}</b> : ${unit} ${pointValue}<br>`
                } else if (unit && unitDisplayPosition && unitDisplayPosition === 'Suffix') {
                  formattedString = `<b>${pointName}</b> : ${pointValue} ${unit}<br>`
                } else {
                  if(pointName === 'Team Productivity Trend' || pointName === 'Processing Efficiency Trend by Priority Status' ||  pointName === 'Pages' || pointName === 'Pages per Hour') {

                  } else {
                    formattedString = `<b>${pointName}</b> : ${pointValue}<br>`
                  }
                  
                }
                // formattedString = `<b>${pointName}</b> : ${pointValue}<br>`
                tooltipFormatedValue.push(formattedString)
              }
              tooltipFormatedValue = tooltipFormatedValue.join('')
              // xAxisFormatedValue = tempChartData.data.xAxis[this.points[0].point.index]
              xAxisFormatedValue = tempChartData.combinationdata.xAxis[this.point.index]
              return `${xAxisFormatedValue} <br> ${tooltipFormatedValue}`
                
            // if (this.series.type === 'line') {
              
            //   // return `${this.points[0].point.category} <br> ${tooltipFormatedValue}`
            // } else {
            //   return false; // Hide tooltip for column series
            // }
           
  
  
  
            // return (
            //   '<b>' + this.points[0].series.name + '</b> :' + Highcharts.numberFormat(this.points[0].y, 1) + '<br>' +
            //   '<b>' + this.points[1].series.name + '</b> :' + Highcharts.numberFormat(this.points[1].y, 1)
            // )
          }
        },
        plotOptions: {
          series: {
            // pointWidth: 30,
            // cursor: 'pointer',
            stickyTracking: false,
            dataLabels: {
              enabled: this.chartData.dataLabel === 'true' ? true : false,
              formatter : function() {
                  let tooltipFormatedValue: any = [];
                  let xAxisFormatedValue: any = ''
                  var series = this.series.chart.series;
                  for (let i = 0; i < series.length; i++) {
        
                    // for shortname check
                    let pointName = series[i].userOptions['MeasureShortName'] != '' && series[i].userOptions['MeasureShortName'] != null ? series[i].userOptions['MeasureShortName'] : series[i].name
        
                    // let pointValue = Highcharts.numberFormat(series[i]['yData'][this.point.index], 2,'.',',')
  
                    let pointValue;
                    if (series[i]['yData'][this.point.index] > 1000000) {
                      pointValue = Highcharts.numberFormat(series[i]['yData'][this.point.index] / 1000000, 0) + "M"
                    } else if (series[i]['yData'][this.point.index] > 1000) {
                      pointValue = Highcharts.numberFormat(series[i]['yData'][this.point.index] / 1000, 0) + "K"
                    } else {
                      pointValue = series[i]['yData'][this.point.index]
                    }
        
                    let formattedString = ''
                    if (unit && unitDisplayPosition && unitDisplayPosition === 'Prefix') {
                      formattedString = `<b>${pointName}</b> : ${unit} ${pointValue}<br>`
                    } else if (unit && unitDisplayPosition && unitDisplayPosition === 'Suffix') {
                      formattedString = `<b>${pointName}</b> : ${pointValue} ${unit}<br>`
                    } else {
                      formattedString = `<b>${pointName}</b> : ${pointValue}<br>`
                    }
                    // formattedString = `<b>${pointName}</b> : ${pointValue}<br>`
                    tooltipFormatedValue.push(formattedString)
                  }
                  tooltipFormatedValue = tooltipFormatedValue.join('')
                  // xAxisFormatedValue = tempChartData.data.xAxis[this.points[0].point.index]
                  xAxisFormatedValue = tempChartData.combinationdata.xAxis[this.point.index]
                  return `${xAxisFormatedValue} <br> ${tooltipFormatedValue}`;
              }
            },
            point: {
              events: {
                click: e => {
                  const pointData = e.point;
                  console.log(pointData);
                  if (e.type === 'click') {
                    // var clickedPoint = e.point,
                    //   chart = clickedPoint.series.chart;
                    // chart.series.forEach(function (s) {
                    //   s.points.forEach(function (p) {
                    //     if (p.x == clickedPoint.x) {
                    //       p.select(null, true);
                    //     }
                    //   });
                    // });
                    const clickedPoint = e.point,
                      chart = clickedPoint.series.chart;

                      chart.series.forEach((series) => {
                        series.points.forEach((point) => {
                          if (point !== clickedPoint && point.select) {
                            point.select(false, true);
                          }
                        });
                      });
                    // values formation & getter's
                    let pointDataCategory = pointData.category.toString().replace(/(<([^>]+)>)/ig, '');
                    pointData.objectid = this.chartData.title == 'File Volume by SLA' ? 12 : undefined
                    // this.ChartSharedService.chartareaclicked.next(pointData);
                    // this.ChartSharedService.chartValue.next(pointData);
                    this.chartClickCheck = pointDataCategory;
  
                    if (this.router.url === '/pages/eda' || this.router.url === '/pages/add') {
                      this.pointDataOnClick = {
                        // profilerBadgeText: this.chartData.data.xAxis.title + ': ' + pointData.category,
                        breadCrumbText:
                          this.chartData.Widgettitle === 'Measure Profiler - Primary Peer Group' ||
                            this.chartData.Widgettitle === 'Measure Profiler - Secondary Peer Group' ||
                            this.chartData.Widgettitle === 'Pattern Score Summary' ||
                            this.chartData.Widgettitle === 'Pattern Profiler - Secondary Peer Group' || this.chartData.Widgettitle === null
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
  
                      // setTimeout(() => {
                      if (currentChartLevel == this.chartData.ChartLevel) {
                        // if (!this.pointDataOnClick.breadCrumbText.includes(pointData.category)) {
                        this.pointDataOnClick.breadCrumbText = pointDataCategory
                        // }
                        // console.log(this.chartData.ChartLevel) 
                      }
                      currentChartLevel = this.chartData.ChartLevel
  
                      // }, 1000);
  
  
                      setTimeout(() => {
                        // multiple-select scatter point - breadcrumtext as csv start
                        let breadCrumTextSplit = this.pointDataOnClick.breadCrumbText
  
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
  
  
                        } else if (pointData.state == '') {
                          // console.log(dimensionValueCSV)
                          // console.log(splittedValue[1])
                          let tempFactValueCSV = []
                          breadCrumTextCSV.filter((val, i) => {
                            if (val == pointDataCategory) {
                              tempFactValueCSV.splice(i, 1)
                            }
  
                            if (val != breadCrumTextSplit) {
                              tempFactValueCSV.push(val)
                            }
                          })
                          breadCrumTextCSV = tempFactValueCSV
                          // console.log(dimensionValueCSV)
  
                          // Dataset Eda summary bar chart - Remove
                          attributeValueCsv.filter((val, i) => {
                            if (val == pointDataCategory) {
                              attributeValueCsv.splice(i, 1)
                            }
                          })
  
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
  
                        // breadCrumTextCSV.push(breadCrumTextSplit)
                        // let uniquebreadcrumtextCsv = Array.from(new Set(breadCrumTextCSV));
                        // breadCrumTextCSV = uniquebreadcrumtextCsv
                        // this.pointDataOnClick.breadCrumbText = breadCrumTextCSV.toString()
  
                        // let dimensionString = this.pointDataOnClick.breadCrumbText
                        // dimensionString = dimensionString.replace(/,/g, '#^')
                        // this.pointDataOnClick.breadCrumbText = dimensionString
  
  
  
                        // console.log(this.pointDataOnClick.breadCrumbText)
  
                        // multiple-select scatter point - breadcrumtext as csv end
  
                        // multiple-select scatter point - factId as csv start
                        if (IdArray) {
                          factIdCSV.push(IdArray[pointData.index])
                        }
                        let uniquefactIdCsv = Array.from(new Set(factIdCSV));
                        factIdCSV = uniquefactIdCsv
                        this.pointDataOnClick.factId = factIdCSV.toString()
                        // multiple-select scatter point - factId as csv end
  
  
                        if (this.chartData.ChartLevel == undefined) {
                          // Dataset Eda summary bar chart multiple click attribute name & value get start
                          this.pointDataOnClick.attributeNameCsv = this.chartData.data.xAxis.title
                          this.pointDataOnClick.attributeValueCsv = attributeValueCsv.join('|~')
                          // Dataset Eda summary bar chart multiple click attribute name & value get start
                        }
  
                        this.storage.setItem('EDAWidgetPointData', JSON.stringify(this.pointDataOnClick))
                      }, 100);
                    } else {
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
                        pointDataName: pointData.category,
                        // pieSelectedIndex: this.pointDataOnClick.factId!=''? pointData.index:''
                      };

                      const dimensionValues = {
                        StackedDimensionValues1: pointData.category,
                        StackedDimensionValues2: pointData.series.name
                      }

                      this.pointDataOnClick.dimensionStackedValues = dimensionValues
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
                },
                // dblclick: e => {
                //   const pointData = e.point;
                //   if (e.type === 'dblclick' && pointData.state == 'select') {
                //     this.onChartClick(e, this.chartData.type, this.chartData);
                //   }
                // },
                mouseOver: function () {
                  if (this.series.halo) {
                    this.series.halo.attr({
                      'class': 'highcharts-tracker'
                    }).toFront();
                  }
                }
              }
            }
            // colorByPoint: this.chartData.data.multiAxialData[0].yAxis == 1 ? true : false,
          },
        },
        // series: this.chartData.combinationdata.CombinationSeries,
        series : seriesData,
        legend: {
          enabled: true
        },
        exporting: {
          enabled: false
        },
        credits: {
          enabled: false
        }
      };
    } else {
      this.combinedSeriesChartOptions = {
        chart: {
          zoomType: 'xy',
          // height: 293
          // height: this.widgetSize === undefined ? 293 : '30%'
        },
        boost: {
          useGPUTranslations: true
        },
        title: {
          text: ''
        },
        xAxis: {
          // categories: this.chartData.combinationdata.xAxis,
          categories: trimmedXaxis,
          crosshair: true,
          labels: {
            autoRotation: [0],
            // autoRotationLimit: 15,
            allowOverlap: false
          }
        },
        yAxis: {
          title: {
            text: yaxisTitle,
            style: {
              color: '#7cb5ec' // '#f7a35c'
            }
          },
          labels: {
            style: {
              color: '#7cb5ec' // '#f7a35c'
            }
          }
        },
        tooltip: {
          shared: false,
          formatter: function () {
            let tooltipFormatedValue: any = [];
            let xAxisFormatedValue: any = ''
            var series = this.series.chart.series
            for (let i = 0; i < series.length; i++) {
  
              // for shortname check
              let pointName = series[i].userOptions.MeasureShortName != '' && series[i].userOptions.MeasureShortName != null ? series[i].userOptions.MeasureShortName : series[i].name
  
              let pointValue = Highcharts.numberFormat(series[i].yData[this.point.index], 2,'.',',')
  
              let formattedString = ''
              if (unit && unitDisplayPosition && unitDisplayPosition === 'Prefix') {
                formattedString = `<b>${pointName}</b> : ${unit} ${pointValue}<br>`
              } else if (unit && unitDisplayPosition && unitDisplayPosition === 'Suffix') {
                formattedString = `<b>${pointName}</b> : ${pointValue} ${unit}<br>`
              } else {
                formattedString = `<b>${pointName}</b> : ${pointValue}<br>`
              }
              // formattedString = `<b>${pointName}</b> : ${pointValue}<br>`
              tooltipFormatedValue.push(formattedString)
            }
            tooltipFormatedValue = tooltipFormatedValue.join('')
            // xAxisFormatedValue = tempChartData.data.xAxis[this.points[0].point.index]
            xAxisFormatedValue = tempChartData.combinationdata.xAxis[this.point.index]
            return `${xAxisFormatedValue} <br> ${tooltipFormatedValue}`
            // return `${this.points[0].point.category} <br> ${tooltipFormatedValue}`
  
  
  
            // return (
            //   '<b>' + this.points[0].series.name + '</b> :' + Highcharts.numberFormat(this.points[0].y, 1) + '<br>' +
            //   '<b>' + this.points[1].series.name + '</b> :' + Highcharts.numberFormat(this.points[1].y, 1)
            // )
          }
        },
        plotOptions: {
          series: {
            // pointWidth: 30,
            // cursor: 'pointer',
            stickyTracking: false,
            dataLabels: {
              enabled: this.chartData.dataLabel === 'true' ? true : false,
              formatter : function() {
                  let tooltipFormatedValue: any = [];
                  let xAxisFormatedValue: any = ''
                  var series = this.series.chart.series;
                  for (let i = 0; i < series.length; i++) {
        
                    // for shortname check
                    let pointName = series[i].userOptions['MeasureShortName'] != '' && series[i].userOptions['MeasureShortName'] != null ? series[i].userOptions['MeasureShortName'] : series[i].name
        
                    // let pointValue = Highcharts.numberFormat(series[i]['yData'][this.point.index], 2,'.',',')
  
                    let pointValue;
                    if (series[i]['yData'][this.point.index] > 1000000) {
                      pointValue = Highcharts.numberFormat(series[i]['yData'][this.point.index] / 1000000, 0) + "M"
                    } else if (series[i]['yData'][this.point.index] > 1000) {
                      pointValue = Highcharts.numberFormat(series[i]['yData'][this.point.index] / 1000, 0) + "K"
                    } else {
                      pointValue = series[i]['yData'][this.point.index]
                    }
        
                    let formattedString = ''
                    if (unit && unitDisplayPosition && unitDisplayPosition === 'Prefix') {
                      formattedString = `<b>${pointName}</b> : ${unit} ${pointValue}<br>`
                    } else if (unit && unitDisplayPosition && unitDisplayPosition === 'Suffix') {
                      formattedString = `<b>${pointName}</b> : ${pointValue} ${unit}<br>`
                    } else {
                      formattedString = `<b>${pointName}</b> : ${pointValue}<br>`
                    }
                    // formattedString = `<b>${pointName}</b> : ${pointValue}<br>`
                    tooltipFormatedValue.push(formattedString)
                  }
                  tooltipFormatedValue = tooltipFormatedValue.join('')
                  // xAxisFormatedValue = tempChartData.data.xAxis[this.points[0].point.index]
                  xAxisFormatedValue = tempChartData.combinationdata.xAxis[this.point.index]
                  return `${xAxisFormatedValue} <br> ${tooltipFormatedValue}`;
              }
            }
            // colorByPoint: this.chartData.data.multiAxialData[0].yAxis == 1 ? true : false,
          },
          column: {
            point: {
              events: {
                click: e => {
                  const pointData = e.point;
                  console.log(pointData);
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
                    let pointDataCategory = pointData.category.toString().replace(/(<([^>]+)>)/ig, '');
                    pointData.objectid = this.chartData.title == 'File Volume by SLA' ? 12 : undefined
                    this.dataGetService.chartareaclicked.next(pointData);
                    this.dataGetService.chartValue.next(pointData);
                    this.chartClickCheck = pointDataCategory;
  
                    if (this.router.url === '/pages/eda' || this.router.url === '/pages/add') {
                      this.pointDataOnClick = {
                        // profilerBadgeText: this.chartData.data.xAxis.title + ': ' + pointData.category,
                        breadCrumbText:
                          this.chartData.Widgettitle === 'Measure Profiler - Primary Peer Group' ||
                            this.chartData.Widgettitle === 'Measure Profiler - Secondary Peer Group' ||
                            this.chartData.Widgettitle === 'Pattern Score Summary' ||
                            this.chartData.Widgettitle === 'Pattern Profiler - Secondary Peer Group' || this.chartData.Widgettitle === null
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
  
                      // setTimeout(() => {
                      if (currentChartLevel == this.chartData.ChartLevel) {
                        // if (!this.pointDataOnClick.breadCrumbText.includes(pointData.category)) {
                        this.pointDataOnClick.breadCrumbText = pointDataCategory
                        // }
                        // console.log(this.chartData.ChartLevel) 
                      }
                      currentChartLevel = this.chartData.ChartLevel
  
                      // }, 1000);
  
  
                      setTimeout(() => {
                        // multiple-select scatter point - breadcrumtext as csv start
                        let breadCrumTextSplit = this.pointDataOnClick.breadCrumbText
  
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
  
  
                        } else if (pointData.state == '') {
                          // console.log(dimensionValueCSV)
                          // console.log(splittedValue[1])
                          let tempFactValueCSV = []
                          breadCrumTextCSV.filter((val, i) => {
                            if (val == pointDataCategory) {
                              tempFactValueCSV.splice(i, 1)
                            }
  
                            if (val != breadCrumTextSplit) {
                              tempFactValueCSV.push(val)
                            }
                          })
                          breadCrumTextCSV = tempFactValueCSV
                          // console.log(dimensionValueCSV)
  
                          // Dataset Eda summary bar chart - Remove
                          attributeValueCsv.filter((val, i) => {
                            if (val == pointDataCategory) {
                              attributeValueCsv.splice(i, 1)
                            }
                          })
  
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
  
                        // breadCrumTextCSV.push(breadCrumTextSplit)
                        // let uniquebreadcrumtextCsv = Array.from(new Set(breadCrumTextCSV));
                        // breadCrumTextCSV = uniquebreadcrumtextCsv
                        // this.pointDataOnClick.breadCrumbText = breadCrumTextCSV.toString()
  
                        // let dimensionString = this.pointDataOnClick.breadCrumbText
                        // dimensionString = dimensionString.replace(/,/g, '#^')
                        // this.pointDataOnClick.breadCrumbText = dimensionString
  
  
  
                        // console.log(this.pointDataOnClick.breadCrumbText)
  
                        // multiple-select scatter point - breadcrumtext as csv end
  
                        // multiple-select scatter point - factId as csv start
                        if (IdArray) {
                          factIdCSV.push(IdArray[pointData.index])
                        }
                        let uniquefactIdCsv = Array.from(new Set(factIdCSV));
                        factIdCSV = uniquefactIdCsv
                        this.pointDataOnClick.factId = factIdCSV.toString()
                        // multiple-select scatter point - factId as csv end
  
  
                        if (this.chartData.ChartLevel == undefined) {
                          // Dataset Eda summary bar chart multiple click attribute name & value get start
                          this.pointDataOnClick.attributeNameCsv = this.chartData.data.xAxis.title
                          this.pointDataOnClick.attributeValueCsv = attributeValueCsv.join('|~')
                          // Dataset Eda summary bar chart multiple click attribute name & value get start
                        }
  
                        this.storage.setItem('EDAWidgetPointData', JSON.stringify(this.pointDataOnClick))
                      }, 100);
                    } else {
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
                          if (pointData.state == 'select') {
                            factIdCSV.push(IdArray1[pointData.index])
  
                            profilerBadgeTextCSV.push(pointData.category.toString().replace(/(<([^>]+)>)/ig, ''))
  
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
                              if (val != pointData.category.toString().replace(/(<([^>]+)>)/ig, '')) {
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
                        }, 100);
                      }
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
                  const pointData = e.point;
                  if (e.type === 'dblclick' && pointData.state == 'select') {
                    this.onChartClick(e, this.chartData.type, this.chartData);
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
            }
          }
        },
        series: this.chartData.combinationdata.CombinationSeries,
        legend: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        credits: {
          enabled: false
        }
      };
    }
    this.combinationChart = Highcharts.chart(this.chartElement.nativeElement, this.combinedSeriesChartOptions);
    if(this.chartData.type === 'combinedSeries') {
      let colorList = this.chartData.ColorList;
      this.customLegend(colorList,false);
    }
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
      // console.log(legend1);

      // if(val == true){
      // this.legendElNetwork.nativeElement.insertAdjacentHTML('beforeend', legend1);
      // }
      // else{
      this.legendEl.nativeElement.insertAdjacentHTML('beforeend', legend1);
      // }
      
      });
    }
  }

  onChartClick(event, _chartType, _chartData) {
    // for filtered workqueues tab - AI demo
   // if (chartData.title == 'File Volume by SLA' || chartData.title == 'File Volume by Speciality Group' || chartData.title == 'Files Needing Attention by Case Status' || chartData.title == 'In Progress Files by Tasks') {
     // this.contexMenuControl = false;
   // } else {
      this.contexMenuControl = true;
   // }
    console.log(this.chartLocation);
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
    //this.contextMenuElement.nativeElement.style.left = event.chartX - 20 + 'px';
    //this.contextMenuElement.nativeElement.style.top = event.chartY + 20 + 'px'; 
    if(this.showContextMenu){
      this.showContextMenu = false;
    }else{
      this.showContextMenu = true;
    }
    // if (this.contextMenuElement.nativeElement.className.indexOf('visible') > 0) {
    //   this.contextMenuElement.nativeElement.classList.remove('context-menu-visible');
    //   this.contextMenuElement.nativeElement.classList.add('context-menu-hidden');
      
    // } else {
    //   this.contextMenuElement.nativeElement.classList.remove('context-menu-hidden');
    //   this.contextMenuElement.nativeElement.classList.add('context-menu-visible');
    // }
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

    // console.log(this.chartData)
    // console.log(this.pointDataOnClick.factId)

    // condition for removing factid for enterprise chart
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
    // console.log(chartEventDetail);
    this.chartEvent.emit(chartEventDetail);
    this.chartData.showActions = false;
    this.contexMenuControl = false;

    // if (this.router.url === '/pages/casedetail') {
    //   this.dataGetService.chartActionEvent1.next(chartEventDetail);
    // }
    

    // to set and get pieChartSelectIndex for eda
    // if (this.chartData.type == 'pie') {
    //   if (actionName == 'additionalProfiles' || actionName == 'participantsList1') {
    //     localStorage.setItem('pieSelectedIndex', JSON.stringify(this.selectedPieDetails))
    //   } else if (actionName != 'eda') {
    //     localStorage.removeItem('pieSelectedIndex')
    //   }
    // }
    
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
    if (chartData.type.toLowerCase() == 'combinedSeries') {
      this.toggleLegend = !this.toggleLegend;
      this.combinationChart.update({
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
