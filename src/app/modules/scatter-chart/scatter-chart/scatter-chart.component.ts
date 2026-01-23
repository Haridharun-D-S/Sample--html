import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {ScatterchartService  } from "./scatterchart.service";
import Highcharts from 'highcharts';
import HighchartsCustomEvents from 'highcharts-custom-events';

// Initialize HighchartsCustomEvents with Highcharts
HighchartsCustomEvents(Highcharts);
declare let $: any;
@Component({
  selector: 'app-scatter-chart',
  templateUrl: './scatter-chart.component.html',
  styleUrls: ['./scatter-chart.component.scss']
})
export class ScatterChartComponent implements OnInit {
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

  showFilter: boolean = true;
  showLabel: boolean;
  actualData: any;
  IdArrayCopy: any;
  barChart: Highcharts.Chart;
  barChartOptions: any;
  chartClickCheck: any = '';
  refprimarytitle: any;
  refprimaryname: any;
  contexMenuControl: boolean = false;
  temppop: any;
  random: number;
  dimensionNamesRes: any;
  dimensionNames: string[];
  dimensionName: any[];
  dimensionTypeValue: any = [];
  dimensionSearchdropdownSettings: any = {};
  constructor( private router: Router,  private Service: ScatterchartService ) { }

  ngOnInit() {
   }

   ngAfterViewInit() {
    this.initBarOrScatterChart(false, true);
  }
  
  initBarOrScatterChart(val,legend) {
    //const yAxisDataForBar = [];
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
      selectedIndex = []
    if (this.chartData.type == undefined) {
      this.chartData = this.chartData[0];
    }

    //const trimmedXaxis = []
    //const chartType = this.chartData.type
    if (Object.prototype.hasOwnProperty.call(this.chartData, 'UnitDisplayPosition')) {
      if (this.chartData.UnitDisplayPosition === null || this.chartData.UnitDisplayPosition === '') {
        this.chartData.UnitDisplayPosition = 'Prefix';
        Position = this.chartData.UnitDisplayPosition;
      } else {
        Position = this.chartData.UnitDisplayPosition;
      }
    }
   // const xTitle = this.chartData.data.xAxis.title;
  //  const yTitle = this.chartData.data.yAxis.title;
  
    const yAxisDataForScatter = [];
   // const yAxisDataForScatter1 = [];
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
    //const titlename = this.chartData.title;
    //const widgetTitle = this.chartData[0] && this.chartData[0].Widgettitle ? this.chartData[0].Widgettitle : this.chartData.Widgettitle
    const units =
      this.chartData[0] === undefined
        ? this.chartData.Units === null
          ? ''
          : this.chartData.Units
        : this.chartData[0].Units;
    let IdArray = [];
    let EDAIdArray = [];
    const IdArray1 = [];
    const IdArray2 = [];
    if (this.chartData.Widgettitle === 'Pattern Profiler - Secondary Peer Group') {
      IdArray = this.Service.getObj('SecProfilePatternBandId');
      //console.log(this.IdArrayCopy);
    } else {
      if (val && val.action === 'Apply') {
        IdArray = filteredYaxisNames
        for (let i = 0; i < filteredValues.length; i++) {
          if (this.chartData.type === 'scatter') {
            IdArray = filteredValues;
          }
        }
      }
      else {
        for (let i = 0; i < this.chartData.data.yAxis.values.length; i++) {
            IdArray.push(this.chartData.data.yAxis.values[i].name);
          if (this.chartData.type === 'scatter') {
            if (this.chartData.data.key && this.chartData.data.key == "FactValue") {
              EDAIdArray = this.chartData.data.yAxis.values[0].name != null ? this.chartData.data.yAxis.values[0].name.split(',') : '';
            }
            else {
              IdArray = this.chartData.data.yAxis.values[0].name != null ? this.chartData.data.yAxis.values[0].name.split(',') : '';
            }
          }
        }
      }
    }
    if (this.chartData.type === 'scatter') {

      Highcharts.setOptions({
        lang: {
          thousandsSep: ',',
          decimalPoint: '.'
        }
      });
      this.barChartOptions = {
        chart: {
          type: this.chartData.type,
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
          categories: this.chartData.data.xAxis.values,
          crosshair: true,
          labels: {
            enabled: false,
            // staggerLines: 0
            // overflow: 'justify'
            autoRotation: [0],
            // autoRotationLimit: 15,
            reserveSpace: false
          },
          title: {
            text: this.chartData.data.xAxis.title,
            // enabled : this.chartData.type === 'bar' ? true : false,
            // x: this.chartData.type === 'bar' ? 10 : 0,
            // y: this.chartData.type === 'bar' ? 15 : 0
            margin: 10
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
            animation: false,
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
                    pointData.objectid = this.chartData.title == 'File Volume by SLA' ? 12 : undefined
                    this.Service.chartareaclicked.next(pointData);
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
                        const str = pointDataCategory;
                        const splittedValue = str.split(":");
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
                            this.Service.chartActionEvent.next(chartEventDetail);
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
                            this.Service.chartActionEvent.next(chartEventDetail);
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
                            this.Service.chartActionEvent.next(chartEventDetail);
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

                  // }
                  //  this.setContextMenu(e, '');
                  // this.onChartClick(e,'');
                },
                // dblclick: e => {
                //   // //console.log(e);
                //   if(e.type === 'dblclick') {
                //     const pointData = e.point;
                //   this.onChartClick(e, this.chartData.type, this.chartData);
                //   }
                // },
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
        series: new Array({ data: yAxisDataForScatter })
      };
      this.barChart = Highcharts.chart(this.chartElement.nativeElement, this.barChartOptions);
      if(this.chartData.type === 'scatter' && legend === true) {
        colorList = this.chartData.ColorList;
        this.customLegend(colorList,false);
      }
    }
    
  }
  customLegend(color,val): void {
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
      this.legendEl.nativeElement.insertAdjacentHTML('beforeend', legend1);      
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
  setContextMenu1(event) {
    this.contextMenuElement.nativeElement.style.left = event.chartX - 20 + 'px';
    this.contextMenuElement.nativeElement.style.top = event.chartY + 20 + 'px';  
    if (this.contextMenuElement.nativeElement.className.indexOf('visible') > 0) {
      this.contextMenuElement.nativeElement.classList.remove('context-menu-visible');
      this.contextMenuElement.nativeElement.classList.add('context-menu-hidden');
    } else {
      this.contextMenuElement.nativeElement.classList.remove('context-menu-hidden');
      this.contextMenuElement.nativeElement.classList.add('context-menu-visible');
    }
  }
  closeFilterPop() {
    $(this.temppop).modal('hide');
  }
  activeFilterTabVal: any;
  searchText: any;
  maxRange: any;
  minRange: any;
  dimensionSearchList = [];
  dimensionSearchListSelected: any = [];
  factIdCSV: any[];

  activeFilterTab(val) {
    this.activeFilterTabVal = val
  }
  searchFun(event) {
    //console.log(this.searchText);
  }
  applyRangeFilter(type) {
    // //console.log(this.clickedChartData)
    if (type === 'Range') {
      const range = {
        upper: this.maxRange,
        lower: this.minRange,
        action: 'Apply'
      }
      if (this.maxRange != undefined && this.minRange != undefined) {
        // this.initBarOrScatterChart(range)
        this.scatterFilter(range)
      }
      this.maxRange = range.upper
      this.minRange = range.lower
      this.searchText = undefined
      //this.dimensionTypeValue = []
    } else if (type === 'searchDimension') {
      // //console.log(this.dimensionSearchList)

      // to get unique selected id's
      //const selectedListids: any = [];
      const selectedList: any = []
      // if (!this.dimensionMetaData[0]['DatasetMetadata']) {
      //   this.dimensionSearchList.map(item => selectedListids.push(item.id))
      //   selectedListids = Array.from(new Set(selectedListids));
      //   // //console.log(selectedListids)

      //   // to get all selected values against unique id's

      //   selectedListids.map(item1 => {
      //     let selectedListObj = {
      //       dimensionid: undefined,
      //       csvvalue: []
      //     }
      //     this.dimensionSearchList.map(item2 => {
      //       if (item1 == item2.id) {
      //         selectedListObj = {
      //           dimensionid: item1,
      //           csvvalue: selectedListObj.csvvalue
      //         }
      //         selectedListObj.csvvalue.push(item2.value)
      //       }
      //     })
      //     selectedList.push(selectedListObj)
      //   })
      //   selectedList.map(item => {
      //     item.csvvalue = item.csvvalue.toString()
      //   })
      //   this.dimensionSearchListSelected = selectedList;
      // }
      // //console.log(this.dimensionSearchListSelected)

      const range = {
        searchedItem: selectedList,
        action: 'searchDimension'
      }

      // if (this.dimensionSearchListSelected.length > 0) {
      this.scatterFilter(range)
      // }
      this.searchText = undefined
      this.maxRange = undefined
      this.minRange = undefined
    } else {
      // this.searchFun(event);
      const range = {
        search: this.searchText,
        action: 'Search'
      }
      if (this.searchText !== '') {
        // this.initBarOrScatterChart(range);
        this.scatterFilter(range)
      }
      this.maxRange = undefined
      this.minRange = undefined
      //this.dimensionTypeValue = []
      this.searchText = range.search;
    }

  }
  resetRangeFilter(type) {
    this.dimensionSearchList = []
    if (type === 'Range') {
      this.maxRange = undefined
      this.minRange = undefined
      const range = {
        upper: this.maxRange,
        lower: this.minRange,
        action: 'Reset'
      }
      // this.userAccess.rangeForScatter.next(range);
      // this.initBarOrScatterChart(range);
      this.scatterFilter(range)

    }  else {
      this.searchText = undefined;
      const range = {
        action: 'Reset'
      }
      // this.initBarOrScatterChart(range);
      this.scatterFilter(range)
    }

  }
  grossChartLoader: boolean;
  clickedChartData: any;

  scatterFilter(range) {
    let charttype = "";
    //let dashboardItem = JSON.parse(localStorage.getItem('scatterWidgetItem'));

    //dashboardItem = this.clickedChartData

   // if (dashboardItem == null) {
     const dashboardItem = {}
   // }
   // let dimensionDetail = JSON.parse(localStorage.getItem('currentActiveDimensionTab'));
    // if (this.chartData.Widgettitle) {
    //   if (this.chartData.Widgettitle.includes("dimensional") || this.chartData.Widgettitle.includes("Dimensional")) {
    //     charttype = "dimension"
    //   } else if (this.chartData.Widgettitle.includes("scatter") || this.chartData.Widgettitle.includes("Scatter")) {
    //     charttype = "scatter"
    //   } else if (this.chartData.Widgettitle.includes("profiler") || this.chartData.Widgettitle.includes("Profiler")) {
    //     charttype = "profiler"
    //   }
    // }

    //console.log(this.clickedChartData);

    if (dashboardItem) {
      // if (dashboardItem.type == 'analyzer'&&dashboardItem.DomainId == 6)  {
      //   charttype = "profiler"
      // } 
      // else 
      // if(this.dashboardItems.type == 'analyzer'){
      //   charttype = "scatter"
      // }
      // else if (this.dashboardItems.type == 'profiler') {
      //   charttype = "profiler"
      // } else if (this.dashboardItems.type == 'dimension' && this.clickedChartData.chartTemplateId != 7) {
      //   charttype = "dimension"
      // } else {
        charttype = "scatter"
      //}
    }
    const filterCSV = ''
    // if (this.dimensionSearchList.length > 0) {
    //   filterCSV = this.dimensionSearchList.join('|~')
    // }
    const requestObject = {
      //"ObjectId": this.clickedChartData.ObjectId == 'null' || this.clickedChartData.ObjectId == null ? dashboardItem && dashboardItem.ObjectId : this.clickedChartData.ObjectId, // dashboardItem.ObjectId,
      //"DomainId": this.clickedChartData.domainID == null ? dashboardItem && dashboardItem.DomainId : this.clickedChartData.domainID, // dashboardItem.DomainId,
      "MeasureScoreId": "2",
      "MeasureChartTemplateId": '7', //this.clickedChartData.chartTemplateId // dashboardItem.MeasureChartTemplateId
      "TimeId":  '',
      "selectedorgid":  '',
      "PatternThreshold": "0",
      "RunId": "",
      "TimeTypeId": "",
      "DimensionalId":'',
      "FactValueStart": "",
      "FactValueEnd": "0",
      "DimensionName":  '',
      "PatternBandId": "",
      "FactId":  '',
      "FactValue": "",
      "DimensionValue": "",
      "primaryProfileName": "",
      "primaryProfileValue": "",
      "SecondaryProfileName": "",
      "SecondaryProfileValue": "",
     // "DashboardId": dashboardItem && dashboardItem.DashboardId,
      "ExplorationMeasure": "",
      "ProfileArray": "",
      "ProfileString": "",
      // "OrgId": "",
      "MeasureScoreStart": range.lower,
      "MeasureScoreEnd": range.upper,
      "TopValue": range.search,
      "ProfileGroupName":  '',
      "dynamicfiltervalues": range.searchedItem,// this.dimensionSearchListSelected
      // "ProfileGroupName":,
      "FilterValueCSV": filterCSV,
      NormalizationValue : undefined
    };

    const filterReqObj = {
      "MeasureScoreStart": requestObject.MeasureScoreStart,
      "MeasureScoreEnd": requestObject.MeasureScoreEnd,
      "TopValue": requestObject.TopValue,
      "dynamicfiltervalues": requestObject.dynamicfiltervalues
    }

    localStorage.setItem('filterItems', JSON.stringify(filterReqObj))

   // let requestUrl;

    if (charttype == "scatter") {
      // requestObject = JSON.parse(localStorage.getItem('scatterWidgetItem'))
      if (this.clickedChartData.domainID == '6' || this.clickedChartData.DomainId == '6' || this.clickedChartData.DomainId == 6 || this.clickedChartData.domainID == 6) {
        requestObject["MeasureChartTemplateId"] = this.clickedChartData.chartTemplateId ? this.clickedChartData.chartTemplateId : this.clickedChartData.MeasureChartTemplateId
        requestObject["WidgetId"] = this.clickedChartData.id
        requestObject["PatternBandId"] = this.clickedChartData.PatternBandId
      }

      //requestUrl = `${environment.apiService}Charts/GetChartForDashBoard`;
    } 
   

    this.grossChartLoader = true;
   // const widgetResponse: any = {};
    // delete dashboardItem.data;
    //console.log(requestObject);
    // this.http.post(requestUrl, requestObject).subscribe(
    //   (data: any) => {
    //     this.closeFilterPop()
    //     if (data.ChartData && data.ChartData[0]) {
    //       data.ChartData[0]['Filter'] = true
    //     }
    //     else if (data.ChartData) {
    //       data.ChartData['Filter'] = true
    //     }
        
    //     widgetResponse.chartDetail = data;
    //     if (data.ChartData) {
    //       widgetResponse.chartDetail.ChartData.drilldownActions = data.drilldownActions;
    //     }
    //     widgetResponse.refresh = true;
    //     widgetResponse.chartDetail.ChartData.widgetId = dashboardItem.WidgetId ? dashboardItem.WidgetId  : dashboardItem.id;
    //     widgetResponse.isSuccess = true;
    //     widgetResponse.isCompleted = true;
    //     widgetResponse.chartDetail.ChartData.DomainId = dashboardItem.DomainId ? dashboardItem.DomainId : dashboardItem.domainID;
    //     widgetResponse.chartDetail.ChartData.ObjectId = dashboardItem.ObjectId;

    //     widgetResponse.chartDetail.ChartData.chartTemplateId = dashboardItem.MeasureChartTemplateId ? dashboardItem.MeasureChartTemplateId : dashboardItem.chartTemplateId
    //     widgetResponse.chartDetail.ChartData.PatternBandId  = this.clickedChartData.PatternBandId
    //     // this.setWidgetData(widgetResponse, dashboardItem, 'dashboard');
    //     // //console.log(data)
    //     let tempWidgetTitle = this.chartData.Widgettitle
    //     this.chartData = data.ChartData
    //     if (charttype == "dimension" || charttype == "profiler") {
    //       this.chartData[0].Widgettitle = tempWidgetTitle
    //     }

    //     if (data.ChartData[0] && data.ChartData[0].type == 'Stacked Column') {
    //       this.initstackedBarChart();
    //     }
    //     else {
    //       if (data.ChartData.type && data.ChartData.type == 'pie') {
    //         this.initPieChart()
    //         this.legendEl.nativeElement.style.setProperty('display', 'none');
    //       }
    //       else {
    //         this.initBarOrScatterChart(false, false);
    //         if(data.ChartData.type === 'bar') {
    //           this.legendEl.nativeElement.style.setProperty('display', 'none');
    //         } else if(data.ChartData.type === 'scatter') {
    //           this.legendEl.nativeElement.style.setProperty('display', '');
    //         }
    //       }

    //     }
    //     this.grossChartLoader = false;
    //     // this.initPieChart();
    //     if(data.ChartData && data.ChartData[0]) {
    //       if (data.ChartData[0].type.toLowerCase() === 'scatter') {
    //         // this.showFilter = this.routerUrl != '/pages/eda' ? true : false
    //         if (data.ChartData[0].data.xAxis.values.length <= 1000) {
    //           this.showLabel = true;
    //         } else {
    //           this.showLabel = false;
    //         }
    //       }
    //       else {
    //         this.showLabel = false;
    //       }
    //     } else {
    //       if (data.ChartData.type.toLowerCase() === 'scatter') {
    //         // this.showFilter = this.routerUrl != '/pages/eda' ? true : false
    //         if (data.ChartData.data.xAxis.values.length <= 1000) {
    //           this.showLabel = true;
    //         } else {
    //           this.showLabel = false;
    //         }
    //       }
    //       else {
    //         this.showLabel = false;
    //       }
    //     }

    //   },
    //   (error: any) => {
    //     //console.log('API failed at Init Widget');
    //     widgetResponse.isSuccess = false;
    //     widgetResponse.isCompleted = true;
    //     // this.setWidgetData(widgetResponse, dashboardItem, 'dashboard');
    //   },
    //   () => {
    //     widgetResponse.isCompleted = true;
    //     // this.setWidgetData(widgetResponse, dashboardItem, 'dashboard');
    //   }
    // );
  }
  toggleLegend: any;

  scatterLabel(chartData) {
    this.toggleLegend = !this.toggleLegend;
    if (chartData.type == 'scatter') {

     // const units = chartData.Units
     // const Position = chartData.UnitDisplayPosition

      this.barChart.update({
        // tooltip: {
        //   style: {
        //     display: "none",
        //   }
        // },
        plotOptions: {
          series: {
            dataLabels: {
              enabled: this.toggleLegend ? true : false,
            }
          }
        },
        // legend: {
        //   enabled: this.toggleLegend ? true : false
        // }
      });
    }
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

    // //console.log(this.chartData)
    // //console.log(this.pointDataOnClick.factId)

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
    // //console.log(chartEventDetail);
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
}

