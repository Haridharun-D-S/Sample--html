import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {GroupedandStackedchartService} from "./GroupedandStackedchart.service";
import Highcharts from 'highcharts';
import HighchartsCustomEvents from 'highcharts-custom-events';
import { ChartServiceService } from 'src/app/shared/services/chart_service';

// Initialize HighchartsCustomEvents with Highcharts
HighchartsCustomEvents(Highcharts);

// const Highcharts = require('highcharts'),
// HighchartsCustomEvents = require('highcharts-custom-events')(Highcharts);
@Component({
  selector: 'app-GroupedandStacked-chart',
  templateUrl: './GroupedandStacked-chart.component.html',
  styleUrls: ['./GroupedandStacked-chart.component.scss']
})
export class GroupedandStackedChartComponent implements OnInit {
  @ViewChild('chartEl') chartElement: ElementRef;
  @Input('widgetSize') widgetSize;
  @ViewChild('contextMenu') contextMenuElement: ElementRef;
  @Input('data') chartData: any;
  @Output() chartEvent = new EventEmitter<any>();

  toggleLegend: any;
  chartClickCheck: any = '';
  contexMenuControl: boolean = false;
  selectedPieDetails: { factId: any; pieSelectedIndex: any; };
  @Input('location') chartLocation: string;
  stackedbarChartOptions: any;
  stackedbarChart: Highcharts.Chart;

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
    sunbustDimensionName?:any;
    treemapDimensionName?:any;
    Path?:any;
  };
  constructor( private router: Router,  private Service: GroupedandStackedchartService,private ChartSharedService : ChartServiceService ) { }

  ngOnInit() { 
    // this.chartData = chartData.StackedColumnData;
   }

   ngAfterViewInit() {
    this.initstackedBarChart();
  }
  // chartType(Type){
  //   if(Type == "G"){
  //     this.chartData = chartData.GroupedData;
  //     this.initstackedBarChart();
  //   }else if(Type == "SC"){
  //     this.chartData = chartData.StackedColumnData;
  //     this.initstackedBarChart();
  //   }
  //  }
   showChart = true;
  initstackedBarChart() {
    const yAxisforStackedColumn = [];
    let factIdCSV = []
    let breadCrumTextCSV = []
    let currentChartLevel = 'L';
    const attributeValueCsv = []
    let overallSelectedSeries;
    let pointDataNameCsv = []
    let pointDataFactIdCsv = []
    let pointDataDimensionValues: any = []
    const IdArray = [];
    const IdArray1 = [];
    if (this.chartData.type == undefined) {
      this.chartData = this.chartData[0];
    }
    if(this.chartData.data.xAxis.values.length) {
      this.showChart = true;
    } else {
      this.showChart = false;
    }
    const tempChartData = this.chartData

    const trimmedXaxis = []
    // x-axis formation for category
    for (let i = 0; i < this.chartData.data.xAxis.values.length; i++) {
      let tempString = this.chartData.data.xAxis.values[i]
      tempString = tempString.replace(/<[^>]*>?/gm, '');
      trimmedXaxis.push(tempString)
    }

    if (this.chartData.data.yAxis.values.length > 0) {
      if (Object.prototype.hasOwnProperty.call(this.chartData.data, 'GroupedBar') && this.chartData.data.GroupedBar == "true") {
        for (let i = 0; i < this.chartData.data.yAxis.values.length; i++) {


          yAxisforStackedColumn.push({
            name: this.chartData.data.yAxis.values[i].name,
            data: this.chartData.data.yAxis.values[i].data,
            displaydata: this.chartData.data.yAxis.values[i].displaydata,
            color: i === 0 ? 'rgb(204, 204, 0)' : i === 1 ? 'rgb(204,102,1)' : '',
            stack: this.chartData.data.yAxis.values[i].name,
            displayIndex: i,
            GroupedBar: this.chartData.data.GroupedBar
          });
        }
      }
      else {
        for (let i = 0; i < this.chartData.data.yAxis.values.length; i++) {
          yAxisforStackedColumn.push({
            name: this.chartData.data.yAxis.values[i].name,
            data: this.chartData.data.yAxis.values[i].data,
            displaydata: this.chartData.data.yAxis.values[i].displaydata, 
            color: this.chartData.data.yAxis.values[i].name == 'Completed' ?  '#557D50' : this.chartData.data.yAxis.values[i].name == 'Fully Completed' ? '#557D50' : this.chartData.data.yAxis.values[i].name == 'Not Started' ? '#702038' : this.chartData.data.yAxis.values[i].name == 'Archived' ? '#2E8DCB' : this.chartData.data.yAxis.values[i].name == 'Aborted' ? '#434348' : this.chartData.data.yAxis.values[i].name == 'In Progress' ? '#CA7D2F' :  this.chartData.data.yAxis.values[i].name == 'Partially Completed' ? '#00728A' : this.chartData.data.yAxis.values[i].name == 'Failed' ? '#B0483B' : this.chartData.data.yAxis.values[i].name == 'Invalid' ? '#999999' : this.chartData.data.yAxis.values[i].name == 'Audit Completed' ? '#557D50' : this.chartData.data.yAxis.values[i].name == 'Pending Audit' ? '#CA7D2F' : this.chartData.data.yAxis.values[i].name == 'File not classified' ? '#2E8DCB' : this.chartData.data.yAxis.values[i].name == 'Unassigned' ?  '#2E8DCB' : this.chartData.data.yAxis.values[i].name == 'Re-assigned' ?  '#2E8DCB' : this.chartData.data.yAxis.values[i].name == 'Pending'? '#CA7D2F' : this.chartData.data.yAxis.values[i].name == 'Green'? '#557D50' : this.chartData.data.yAxis.values[i].name == 'Amber'? '#CA7D2F': this.chartData.data.yAxis.values[i].name == 'Red' ? '#B0483B' : this.chartData.data.yAxis.values[i].name == 'Amber - Pending Audit'? '#CA7D2F' : this.chartData.data.yAxis.values[i].name == 'Red - Pending Audit' ? '#B0483B' : this.chartData.data.yAxis.values[i].name == 'Not Extracted' ? '#702038' : this.chartData.data.yAxis.values[i].name == 'File not classified' ? '#2E8DCB' : this.chartData.data.yAxis.values[i].name == 'File not processed' ? '#8266A6' : this.chartData.data.yAxis.values[i].name == 'Missing or incorrect data' ? '#702038' : this.chartData.data.yAxis.values[i].name == 'Missing Score' ? '#B0483B' : this.chartData.data.yAxis.values[i].name == 'Member ID' ? '#702038' : this.chartData.data.yAxis.values[i].name == 'Letter Date' ? '#00728A' : this.chartData.data.yAxis.values[i].name == 'Member Name' ? '#2E8DCB' : this.chartData.data.yAxis.values[i].name == 'Normal' ? '#557D50' : '#702038' ,
            displayIndex: i,
            GroupedBar: this.chartData.data.GroupedBar
          });
        }
      }
    }
    let factIdArray = [];
    if (this.chartData.data.FactId !== undefined && this.chartData.data.FactId !== null) {
      factIdArray = this.chartData.data.FactId.split(',');
    }
    let eda = false
    if (this.router.url == '/pages/eda') {
      eda = true
    }
    // Toooltips, shortName formation
    let shortname = this.chartData.MeasureShortName !== '' && this.chartData.MeasureShortName !== null ? this.chartData.MeasureShortName  : 'Value: '
    if(shortname == 'Files') {
      shortname = 'Files: '
    }
    if(shortname == 'Percentage') {
      shortname = 'Percentage: '
    }
    if(shortname == 'Error Category Files') {
      shortname = 'Error Category Files: '
    }
    //const groupname = this.chartData.ProfileName !== '' && this.chartData.ProfileName !== null ? '<b>' + this.chartData.ProfileName + ': </b>' : ''
    //const titlename = this.chartData.title;
    const xAxis = this.chartData.data.xAxis.title + ': ';
    const yAxis = this.chartData.data.yAxis.title + ': ';
    let yAxisLabel = this.chartData.MeasureShortName ;
    const units =
      this.chartData[0] === undefined
        ? this.chartData.Units === null
          ? ''
          : this.chartData.Units
        : this.chartData[0].Units;
    let Position;
    if (Object.prototype.hasOwnProperty.call(this.chartData, 'UnitDisplayPosition')) {
      if (this.chartData.UnitDisplayPosition === null || this.chartData.UnitDisplayPosition === '') {
        this.chartData.UnitDisplayPosition = 'Prefix';
        Position = this.chartData.UnitDisplayPosition;
      } else {
        Position = this.chartData.UnitDisplayPosition;
      }
    }
    let accuracyChart = false;
    if(this.chartData.title == 'Accuracy of Audited Batches') {
      accuracyChart = true;
    }
    let batchesAttentionChart = false;
    if(this.chartData.title == 'Batches Requiring Attention') {
      batchesAttentionChart = true;
    }
      if(this.router.url === '/dashboard' || this.router.url === '/filelistdashboard' || this.router.url === '/insights') {
        this.stackedbarChartOptions = {
          chart: {
            type: 'column',
            zoomType: 'xy',
            spacingLeft: 0,
            spacingRight: 0,
          },
          title: {
            text: '' // this.chartData.title
          },
          xAxis: {
            categories: trimmedXaxis,
            lineWidth: 0.2,
            // title: {
            //   text: this.chartData.data.xAxis.title,
            // },
            labels: {
              // enabled: false
              autoRotation: [0],
              allowOverlap: false
            },
          },
          yAxis: {
            min: 0,
            title: {
              text: yAxisLabel // Nullify the title
            },
            // stackLabels: {
            //   enabled: this.chartData.data.GroupedBar === "true" ? false : true,
            //   style: {
            //     fontWeight: 'bold',
            //     color: (Highcharts.theme && Highcharts.theme.colors) || 'gray'
            //   },
            //   formatter: function () {
            //     return units !== '' && units !== null && units !== undefined ? Position === 'Prefix' ? units + ' ' + Highcharts.numberFormat(this.total, 2,'.',',') : Highcharts.numberFormat(this.total, 2,'.',',') + ' ' + units : Highcharts.numberFormat(this.total,2,'.',',')
            // }
    
            // }
          },
          tooltip: {
            positioner: function(boxWidth, boxHeight, point) {
              const chart = this.chart;
              let x = point.plotX + chart.plotLeft,
                  y = point.plotY + chart.plotTop;
      
              // Adjust x position if tooltip overflows on the right side
              if (x + boxWidth > chart.plotWidth + chart.plotLeft) {
                x -= (boxWidth + 10); // 10 pixels spacing
              }
      
              // Adjust y position if tooltip overflows at the bottom
              if (y + boxHeight > chart.plotHeight + chart.plotTop) {
                y -= (boxHeight + 10); // 10 pixels spacing
              }
      
              // Adjust y position if tooltip overflows at the top
              if (y < chart.plotTop) {
                y = chart.plotTop;
              }
      
              return {
                x: x,
                y: y
              };
            },
            formatter: function () {
              this.x = tempChartData.data.xAxis.values[this.point.index]
              if (eda) {
                let index
                if (this.series.userOptions.data.length > 0) {
                  this.series.userOptions.data.map((item, index1) => {
                    if (item.y != undefined) {
                      if (item.y == this.y) {
                        index = index1
                        return;
                      }
                    }
                    else {
                      if (item == this.y) {
                        index = index1
                        return;
                      }
                    }
                  })
    
                }
                return (
                  '<b>' + xAxis + '</b>' + this.x + '<br>' + '<b>' + yAxis + '</b>' + this.series.userOptions.displaydata[index] + '<br>' + '<b>' + shortname + '</b>' +
                  (units !== '' && units !== null && units !== undefined
                    ? Position === 'Prefix' ? units + ' ' + Highcharts.numberFormat(this.y,2,'.',',') : Highcharts.numberFormat(this.y, 1) + ' ' + units
                    : Highcharts.numberFormat(this.y, 2,'.',',')) + '<br>' + (this.series.userOptions.GroupedBar === "true" ? '' : units !== '' && units !== null && units !== undefined ? Position === 'Prefix' ? '<b>' + 'Total: ' + '</b>' + units + ' ' + Highcharts.numberFormat(this.total, 2,'.',',') : '<b>' + 'Total: ' + '</b>' + Highcharts.numberFormat(this.total, 2,'.',',') + ' ' + units :
                    '<b>' + 'Total: ' + '</b>' + Highcharts.numberFormat(this.total,2,'.',','))
    
                );
              }
              else {
                if(accuracyChart) {
                  return (               
                    '<b>' + xAxis + '</b>' + this.x + '<br>' + '<b>' + yAxis + '</b>' + this.series.name + '<br>' + '<b>' + shortname + '</b>' +
                    (units !== '' && units !== null && units !== undefined
                      ? Position === 'Prefix' ? units + ' ' + Highcharts.numberFormat(this.y,0,'.',',') : Highcharts.numberFormat(this.y, 0) + '' + units
                      : Highcharts.numberFormat(this.y,0,'.',',')) + '<br>' + (this.series.userOptions.GroupedBar === "true" ? '' : units !== '' && units !== null && units !== undefined ? Position === 'Prefix' ? '' : '' : '')
                  );  
                }  else if (batchesAttentionChart) {
                  return (               
                    '<b>' + xAxis + '</b>' + this.x + '<br>' + '<b>' + yAxis + '</b>' + this.series.name + '<br>' + '<b>' + shortname + '</b>' +
                    (units !== '' && units !== null && units !== undefined
                      ? Position === 'Prefix' ? units + ' ' + Highcharts.numberFormat(this.y,0,'.',',') : Highcharts.numberFormat(this.y, 0) + '' + units
                      : Highcharts.numberFormat(this.y,0,'.',',')) + '<br>' + (this.series.userOptions.GroupedBar === "true" ? '' : units !== '' && units !== null && units !== undefined ? Position === 'Prefix' ? '<b>' + 'Error Files: ' + '</b>' + units + ' ' + Highcharts.numberFormat(this.total,0,'.',',') : '<b>' + 'Error Files: ' + '</b>' + Highcharts.numberFormat(this.total,0,'.',',') + '' + units :
                      '<b>' + 'Error Files: ' + '</b>' + Highcharts.numberFormat(this.total,0,'.',','))
                  ); 
                } else {
                  return (               
                    '<b>' + xAxis + '</b>' + this.x + '<br>' + '<b>' + yAxis + '</b>' + this.series.name + '<br>' + '<b>' + shortname + ': </b>' +
                    (units !== '' && units !== null && units !== undefined
                      ? Position === 'Prefix' ? units + ' ' + Highcharts.numberFormat(this.y,0,'.',',') : Highcharts.numberFormat(this.y, 0) + '' + units
                      : Highcharts.numberFormat(this.y,0,'.',',')) + '<br>' + (this.series.userOptions.GroupedBar === "true" ? '' : units !== '' && units !== null && units !== undefined ? Position === 'Prefix' ? '<b>' + 'Total: ' + '</b>' + units + ' ' + Highcharts.numberFormat(this.total,0,'.',',') : '<b>' + 'Total: ' + '</b>' + Highcharts.numberFormat(this.total,0,'.',',') + '' + units :
                      '<b>' + 'Total: ' + '</b>' + Highcharts.numberFormat(this.total,0,'.',','))
                  );  
                }
                        
              }
    
            }
          },
          legend: {
            enabled: true,
            reversed: false,
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            // itemMarginTop: 10,
            // itemMarginBottom: 10
          },
          credits: {
            enabled: false
          },
          plotOptions: {
            column: {
              stacking: this.chartData.data.GroupedBar === "true" ? '' : 'normal',
              // pointWidth: 30,
              // colorByPoint: true,
              maxPointWidth: this.chartData.data.GroupedBar === "true" ? 18 : 30,
              dataLabels: {
                enabled: true,
                format: '{point.y}', // Show the count for each segment
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#FFFFFF', // Use white for better contrast
                    textOutline: '1px contrast'
                }
              },
              point: {
                events: {
                  click: e => {
                    const pointData = e.point;
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
                      // chart.series.forEach(function (s) {
                      //   s.points.forEach(function (p) {
                      //     if ((p.category == clickedPoint.category) && (p.y == clickedPoint.y) && (p.series.userOptions.displayIndex == clickedPoint.series.userOptions.displayIndex)) {
    
                      //       p.select(null, true);
    
                      //     }
                      //   });
                      // });

                      // Check if the clicked point is already selected
                      // const isSelected = clickedPoint.state === 'select';

                      // Deselect all points in all series except the clicked one
                      // chart.series.forEach((series) => {
                      //   series.points.forEach((point) => {
                      //     if (point !== clickedPoint && point.select) {
                      //       point.select(false, true);
                      //     }
                      //   });
                      // });

                      // Toggle the selection state of the clicked point
                      // clickedPoint.select(!isSelected, true);
    
                      // PointDataClick values formation
                      let pointDataCategory = pointData.category
                      pointDataCategory = pointData.name ? pointData.name : pointData.category
                      pointDataCategory = this.chartData.data.xAxis.values[pointData.index]
    
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
    
                        bandId: '',
                        // factId:  factIdArray ?  factIdArray[pointData.index] : '',
                        factId: '', // pointData.y,
                        // factId: factIdSingle,
                        pointDataName: pointData.series.name,
                        pieSelectedIndex: 'No',
                      };
    
                      setTimeout(() => {
                          // if (pointData.state == 'select') {
                            // console.log(pointData);
                            const seriesPointName = xAxis + pointDataCategory + ', ' + yAxis + pointData.series.name
                            pointDataNameCsv.push(seriesPointName.replace(/(<([^>]+)>)/ig, ''))
    
                            // Dimension value formation
                            const dimensionValues = {
                              StackedDimensionValues1: pointData.category,
                              StackedDimensionValues2: pointData.series.name
                            }
    
                            pointDataDimensionValues = dimensionValues
                            // console.log(pointDataDimensionValues)
                          // } 
                          // else if (pointData.state == '') {
                          //   // factId
                          //   const tempFactValueCSV = []
                          //   pointDataFactIdCsv.filter(val => {
                          //     if (val != pointData.y) {
                          //       tempFactValueCSV.push(val)
                          //     }
                          //   })
                          //   pointDataFactIdCsv = tempFactValueCSV
                          //   // Breadcrumtext
                          //   const tempBadgeCSV = []
                          //   pointDataNameCsv.filter(val => {
                          //     const seriesPointName = xAxis + pointDataCategory + ', ' + yAxis + pointData.series.name
                          //     if (val != seriesPointName.replace(/(<([^>]+)>)/ig, '')) {
                          //       tempBadgeCSV.push(val)
                          //     }
                          //   })
                          //   pointDataNameCsv = tempBadgeCSV
    
                          //   // Dimension value formation
                          //   const dimensionValues = {
                          //     StackedDimensionValues1: pointData.category,
                          //     StackedDimensionValues2: pointData.series.name
                          //   }
                          //   const dimensionValuesToRemove = [];
                          //   pointDataDimensionValues.filter(item => {
                          //     if (!(item.StackedDimensionValues1 == dimensionValues.StackedDimensionValues1 && item.StackedDimensionValues2 == dimensionValues.StackedDimensionValues2)) {
                          //       dimensionValuesToRemove.push(item)
                          //     }
                          //   });
    
                          //   pointDataDimensionValues = dimensionValuesToRemove
                          //   // console.log(pointDataDimensionValues)
                          // }
                          if (factIdArray) {
                            factIdCSV = factIdArray[pointData.index]
                          }
                          // console.log(factIdCSV);
                          // unique breadcrumbtext
                          // const uniquefactIdCsv = Array.from(new Set(pointDataFactIdCsv));
                          // pointDataFactIdCsv = uniquefactIdCsv
                          // console.log(pointDataFactIdCsv);
                          this.pointDataOnClick.factId = factIdCSV.toString()
                          // pointDataNameCsv = pointDataNameCsv.filter(function (item, pos) {
                          //   return pointDataNameCsv.indexOf(item) == pos;
                          // });
    
                          // remove duplicates in the badge for overall select
                          const tempPointDataNameCsv = []
                          pointDataNameCsv.map(item => {
    
                            if (!(item.includes(overallSelectedSeries) && item.includes(yAxis)) && item != undefined) {
                              // console.log(item)
                              tempPointDataNameCsv.push(item)
                            }
                            else if (overallSelectedSeries == '') {
                              tempPointDataNameCsv.push(item)
                            }
                          })
                          pointDataNameCsv = tempPointDataNameCsv
    
                          this.pointDataOnClick.breadCrumbText = pointDataNameCsv
    
    
                          // remove duplicates 
                          // const tempValues: any = pointDataDimensionValues;
                          // pointDataDimensionValues = Array.from(new Set(tempValues.map(JSON.stringify)));
                          // pointDataDimensionValues = pointDataDimensionValues.map(val => JSON.parse(val))
    
                          // remove duplicates for overall selection
                          // let overallSelectedDimensionKey = '';
                          // const filteredPointDataDimensionValues = []
                          // pointDataDimensionValues.filter(item => {
                          //   if (item.StackedDimensionValues2 == null) {
                          //     overallSelectedDimensionKey = item.StackedDimensionValues1
                          //   }
                          // })
    
                          // pointDataDimensionValues.map(item => {
                          //   if (!(item.StackedDimensionValues1 == overallSelectedDimensionKey && item.StackedDimensionValues2 != null)) {
                          //     filteredPointDataDimensionValues.push(item)
                          //   }
                          // })
                          // pointDataDimensionValues = filteredPointDataDimensionValues
                          // console.log(pointDataDimensionValues)
    
                          this.pointDataOnClick.dimensionStackedValues = pointDataDimensionValues
                          this.pointDataOnClick.dimensionStackedValues1 = this.chartData.data.xAxis.title
                          this.pointDataOnClick.dimensionStackedValues2 = this.chartData.data.yAxis.title
    
                          const chartEventDetail = {
                            name: e,
                            data: this.chartData,
                            pointdata: this.pointDataOnClick
                          };
                          // this.Service.chartActionEvent.next(chartEventDetail);
                          this.ChartSharedService.chartareaclicked.next(chartEventDetail);
                      }, 100);
                    }
                  }
                }
              }
            },
          },
          exporting: {
            enabled: false
          },
          series: yAxisforStackedColumn,
        };
      } else {
        this.stackedbarChartOptions = {
          chart: {
            type: 'column',
            zoomType: 'xy',
            spacingLeft: 0,
            spacingRight: 0,
          },
          title: {
            text: '' // this.chartData.title
          },
          xAxis: {
            categories: trimmedXaxis,
            // title: {
            //   text: this.chartData.data.xAxis.title,
            // },
            labels: {
              // enabled: false
              autoRotation: [0],
              allowOverlap: false
            },
          },
          yAxis: {
            min: 0,
            title: {
              text: null // Nullify the title
            },
            // stackLabels: {
            //   enabled: this.chartData.data.GroupedBar === "true" ? false : true,
            //   style: {
            //     fontWeight: 'bold',
            //     color: (Highcharts.theme && Highcharts.theme.colors) || 'gray'
            //   },
            //   formatter: function () {
            //     return units !== '' && units !== null && units !== undefined ? Position === 'Prefix' ? units + ' ' + Highcharts.numberFormat(this.total, 2,'.',',') : Highcharts.numberFormat(this.total, 2,'.',',') + ' ' + units : Highcharts.numberFormat(this.total,2,'.',',')
            // }
    
            // }
          },
          tooltip: {
            formatter: function () {
              this.x = tempChartData.data.xAxis.values[this.point.index]
              if (eda) {
                let index
                if (this.series.userOptions.data.length > 0) {
                  this.series.userOptions.data.map((item, index1) => {
                    if (item.y != undefined) {
                      if (item.y == this.y) {
                        index = index1
                        return;
                      }
                    }
                    else {
                      if (item == this.y) {
                        index = index1
                        return;
                      }
                    }
                  })
    
                }
                return (
                  '<b>' + xAxis + '</b>' + this.x + '<br>' + '<b>' + yAxis + '</b>' + this.series.userOptions.displaydata[index] + '<br>' + '<b>' + shortname + '</b>' +
                  (units !== '' && units !== null && units !== undefined
                    ? Position === 'Prefix' ? units + ' ' + Highcharts.numberFormat(this.y,2,'.',',') : Highcharts.numberFormat(this.y, 1) + ' ' + units
                    : Highcharts.numberFormat(this.y, 2,'.',',')) + '<br>' + (this.series.userOptions.GroupedBar === "true" ? '' : units !== '' && units !== null && units !== undefined ? Position === 'Prefix' ? '<b>' + 'Total: ' + '</b>' + units + ' ' + Highcharts.numberFormat(this.total, 2,'.',',') : '<b>' + 'Total: ' + '</b>' + Highcharts.numberFormat(this.total, 2,'.',',') + ' ' + units :
                    '<b>' + 'Total: ' + '</b>' + Highcharts.numberFormat(this.total,2,'.',','))
    
                );
              }
              else {
                return (
                  '<b>' + xAxis + '</b>' + this.x + '<br>' + '<b>' + yAxis + '</b>' + this.series.name + '<br>' + '<b>' + shortname + '</b>' +
                  (units !== '' && units !== null && units !== undefined
                    ? Position === 'Prefix' ? units + ' ' + Highcharts.numberFormat(this.y,2,'.',',') : Highcharts.numberFormat(this.y, 1) + ' ' + units
                    : Highcharts.numberFormat(this.y,2,'.',',')) + '<br>' + (this.series.userOptions.GroupedBar === "true" ? '' : units !== '' && units !== null && units !== undefined ? Position === 'Prefix' ? '<b>' + 'Total: ' + '</b>' + units + ' ' + Highcharts.numberFormat(this.total,2,'.',',') : '<b>' + 'Total: ' + '</b>' + Highcharts.numberFormat(this.total,2,'.',',') + ' ' + units :
                    '<b>' + 'Total: ' + '</b>' + Highcharts.numberFormat(this.total,2,'.',','))
                );
              }
    
            }
          },
          legend: {
            enabled: true,
            reversed: false,
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            // itemMarginTop: 10,
            // itemMarginBottom: 10
          },
          credits: {
            enabled: false
          },
          plotOptions: {
            column: {
              stacking: this.chartData.data.GroupedBar === "true" ? '' : 'normal',
              // pointWidth: 30,
              // colorByPoint: true,
              maxPointWidth: this.chartData.data.GroupedBar === "true" ? 18 : 30,
              dataLabels: {
                enabled: false
              },
              point: {
                events: {
                  click: e => {
                    const pointData = e.point;
                    let pushVal = true
                    if (this.router.url == '/pages/eda') {
    
                      if (attributeValueCsv.length > 0) {
                        for (let i = 0; i < attributeValueCsv.length; i++) {
                          if (attributeValueCsv[i] == pointData.category) {
                            pushVal = false
                            return
                          }
                          else {
                            pushVal = true
                          }
                        }
                      }
                    }
                    else {
                      if (pointDataDimensionValues.length > 0) {
                        for (let i = 0; i < pointDataDimensionValues.length; i++) {
                          if (pointDataDimensionValues[i].StackedDimensionValues2 == null && pointDataDimensionValues[i].StackedDimensionValues1 == pointData.category) {
                            pushVal = false
                            return
                          }
                          else {
                            pushVal = true
                          }
                        }
                      }
                    }
                    if (!pushVal) {
                      return
                    }
                    // this.onChartClick(e, pointData);
                    // console.log(pointData);
                    if (e.type === 'click') {
                      const clickedPoint = e.point,
                        chart = clickedPoint.series.chart;
                      chart.series.forEach(function (s) {
                        s.points.forEach(function (p) {
                          if ((p.category == clickedPoint.category) && (p.y == clickedPoint.y) && (p.series.userOptions.displayIndex == clickedPoint.series.userOptions.displayIndex)) {
    
                            p.select(null, true);
    
                          }
                        });
                      });
    
                      // PointDataClick values formation
                      let pointDataCategory = pointData.category
                      pointDataCategory = pointData.name ? pointData.name : pointData.category
                      pointDataCategory = this.chartData.data.xAxis.values[pointData.index]
    
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
    
                        bandId: '',
                        // factId:  factIdArray ?  factIdArray[pointData.index] : '',
                        factId: '', // pointData.y,
                        // factId: factIdSingle,
                        pointDataName: pointData.series.name,
                        pieSelectedIndex: 'No',
                      };
    
                      setTimeout(() => {
                        if (this.router.url === '/pages/eda' || this.router.url === '/pages/add') {
                          this.pointDataOnClick = {
                            // profilerBadgeText: this.chartData.data.xAxis.title + ': ' + pointData.category,
                            breadCrumbText:
                              this.chartData.Widgettitle === 'Measure Profiler - Primary Peer Group' ||
                                this.chartData.Widgettitle === 'Measure Profiler - Secondary Peer Group' ||
                                this.chartData.Widgettitle === 'Pattern Score Summary' ||
                                this.chartData.Widgettitle === 'Pattern Profiler - Secondary Peer Group'
                                ?
                                pointDataCategory
                                : '',
                            secondProfilerBadgeText:
                              this.chartData.Widgettitle === 'Measure Profiler - Primary Peer Group'
                                ? this.chartData.data.xAxis.title + ': ' + pointDataCategory
                                : '',
    
                            bandId: IdArray ? IdArray[pointData.index] : '',
                            factId: IdArray1 ? IdArray1[pointData.index] : '',
                            // pieSelectedIndex: this.pointDataOnClick.factId!=''? pointData.index:''
                          };
                          this.pointDataOnClick['pieSelectedIndex'] = this.pointDataOnClick.factId && this.pointDataOnClick.factId != undefined && this.pointDataOnClick.factId != '' ? pointData.index : 'No'
                          if (currentChartLevel == this.chartData.ChartLevel) {
                            this.pointDataOnClick.breadCrumbText = pointDataCategory
                          }
                          currentChartLevel = this.chartData.ChartLevel
    
                          setTimeout(() => {
                            // multiple-select scatter point - breadcrumtext as csv start
                            let breadCrumTextSplit = this.pointDataOnClick.breadCrumbText
    
                            let concatedBreadCrumTextSplit = '';
                            if (breadCrumTextCSV.length == 0) {
                              concatedBreadCrumTextSplit = this.chartData.ChartLevel +
                                '_' +
                                this.chartData.data.xAxis.title + ':' +
                                this.chartData.data.yAxis.title +
                                '&' +
                                this.chartData.ChartLevel +
                                '_'
                              breadCrumTextCSV.push(concatedBreadCrumTextSplit)
                            }
                            pointDataCategory = pointDataCategory + ':' + pointData.series.name
                            // pointDataCategory = pointDataCategory.replace(/(<([^>]+)>)/ig, '')
                            if (pointData.state == 'select') {
                              breadCrumTextSplit = pointDataCategory
                              let breadCrumb = []
                              let duplicateVal = false
                              breadCrumTextCSV.map(item => {
                                if (breadCrumTextSplit.includes(item)) {
                                  duplicateVal = true
                                }
                              })
                              if (!duplicateVal) {
                                breadCrumTextCSV.push(breadCrumTextSplit)
                              }
                              breadCrumb = []
                              breadCrumb = breadCrumTextCSV.filter(function (item, pos) {
                                return breadCrumTextCSV.indexOf(item) == pos;
                              });
                              breadCrumTextCSV = breadCrumb
    
                              // Dataset Eda summary bar chart - Add
                              attributeValueCsv.push(pointDataCategory)
    
    
                            } else if (pointData.state == '') {
                              const tempFactValueCSV = []
                              breadCrumTextCSV.filter((val, i) => {
                                if (val == pointDataCategory) {
                                  tempFactValueCSV.splice(i, 1)
                                }
    
                                if (val != pointDataCategory) {
                                  tempFactValueCSV.push(val)
                                }
                              })
                              breadCrumTextCSV = tempFactValueCSV
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
    
                            if (IdArray) {
                              factIdCSV.push(IdArray[pointData.index])
                            }
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
    
                            this.Service.setItem('EDAWidgetPointData', JSON.stringify(this.pointDataOnClick))
                          }, 100);
                        }
                        else {
                          if (pointData.state == 'select') {
                            const seriesPointName = xAxis + pointDataCategory + ', ' + yAxis + pointData.series.name
                            pointDataNameCsv.push(seriesPointName.replace(/(<([^>]+)>)/ig, ''))
    
                            // Dimension value formation
                            const dimensionValues = {
                              StackedDimensionValues1: pointData.category,
                              StackedDimensionValues2: pointData.series.name
                            }
    
                            pointDataDimensionValues.push(dimensionValues)
                            // console.log(pointDataDimensionValues)
                          } else if (pointData.state == '') {
                            // factId
                            const tempFactValueCSV = []
                            pointDataFactIdCsv.filter(val => {
                              if (val != pointData.y) {
                                tempFactValueCSV.push(val)
                              }
                            })
                            pointDataFactIdCsv = tempFactValueCSV
                            // Breadcrumtext
                            const tempBadgeCSV = []
                            pointDataNameCsv.filter(val => {
                              const seriesPointName = xAxis + pointDataCategory + ', ' + yAxis + pointData.series.name
                              if (val != seriesPointName.replace(/(<([^>]+)>)/ig, '')) {
                                tempBadgeCSV.push(val)
                              }
                            })
                            pointDataNameCsv = tempBadgeCSV
    
                            // Dimension value formation
                            const dimensionValues = {
                              StackedDimensionValues1: pointData.category,
                              StackedDimensionValues2: pointData.series.name
                            }
                            const dimensionValuesToRemove = [];
                            pointDataDimensionValues.filter(item => {
                              if (!(item.StackedDimensionValues1 == dimensionValues.StackedDimensionValues1 && item.StackedDimensionValues2 == dimensionValues.StackedDimensionValues2)) {
                                dimensionValuesToRemove.push(item)
                              }
                            });
    
                            pointDataDimensionValues = dimensionValuesToRemove
                            // console.log(pointDataDimensionValues)
                          }
    
                          // unique breadcrumbtext
                          const uniquefactIdCsv = Array.from(new Set(pointDataFactIdCsv));
                          pointDataFactIdCsv = uniquefactIdCsv
                          this.pointDataOnClick.factId = pointDataFactIdCsv.toString()
                          pointDataNameCsv = pointDataNameCsv.filter(function (item, pos) {
                            return pointDataNameCsv.indexOf(item) == pos;
                          });
    
                          // remove duplicates in the badge for overall select
                          const tempPointDataNameCsv = []
                          pointDataNameCsv.map(item => {
    
                            if (!(item.includes(overallSelectedSeries) && item.includes(yAxis)) && item != undefined) {
                              // console.log(item)
                              tempPointDataNameCsv.push(item)
                            }
                            else if (overallSelectedSeries == '') {
                              tempPointDataNameCsv.push(item)
                            }
                          })
                          pointDataNameCsv = tempPointDataNameCsv
    
                          this.pointDataOnClick.breadCrumbText = pointDataNameCsv
    
    
                          // remove duplicates 
                          const tempValues: any = pointDataDimensionValues;
                          pointDataDimensionValues = Array.from(new Set(tempValues.map(JSON.stringify)));
                          pointDataDimensionValues = pointDataDimensionValues.map(val => JSON.parse(val))
    
                          // remove duplicates for overall selection
                          let overallSelectedDimensionKey = '';
                          const filteredPointDataDimensionValues = []
                          pointDataDimensionValues.filter(item => {
                            if (item.StackedDimensionValues2 == null) {
                              overallSelectedDimensionKey = item.StackedDimensionValues1
                            }
                          })
    
                          pointDataDimensionValues.map(item => {
                            if (!(item.StackedDimensionValues1 == overallSelectedDimensionKey && item.StackedDimensionValues2 != null)) {
                              filteredPointDataDimensionValues.push(item)
                            }
                          })
                          pointDataDimensionValues = filteredPointDataDimensionValues
                          // console.log(pointDataDimensionValues)
    
                          this.pointDataOnClick.dimensionStackedValues = pointDataDimensionValues
                          this.pointDataOnClick.dimensionStackedValues1 = this.chartData.data.xAxis.title
                          this.pointDataOnClick.dimensionStackedValues2 = this.chartData.data.yAxis.title
    
                          const chartEventDetail = {
                            name: e,
                            data: this.chartData,
                            pointdata: this.pointDataOnClick
                          };
                          this.Service.chartActionEvent.next(chartEventDetail);
                        }
                      }, 100);
                    }
                  },
                  contextmenu: e => {
                    const pointData = e.point;
                    // console.log(pointData, e.type);
                    let pushVal = true
                    if (this.router.url == '/pages/eda') {
    
                      if (attributeValueCsv.length > 0) {
                        for (let i = 0; i < attributeValueCsv.length; i++) {
                          if (attributeValueCsv[i].includes(':')) {
                            const tempArr = attributeValueCsv[i].split(':')
                            if (tempArr[0] == pointData.category) {
                              pushVal = false
                              return pushVal
                            }
                          }
                          else {
                            pushVal = true
                          }
                        }
                      }
                    }
                    else {
    
                      if (pointDataDimensionValues.length > 0) {
                        for (let i = 0; i < pointDataDimensionValues.length; i++) {
                          if (pointDataDimensionValues[i].StackedDimensionValues2 != null && pointDataDimensionValues[i].StackedDimensionValues1 == pointData.category) {
                            pushVal = false
                            return pushVal
                          }
                          else {
                            pushVal = true
                          }
                        }
                      }
                      if (!pushVal) {
                        return pushVal
                      }
                    }
                    if (e.type === 'contextmenu') {
                      e.visible = false
                      const clickedPoint = e.point,
                        chart = clickedPoint.series.chart;
                      // console.log(clickedPoint)
                      chart.series.forEach(function (s) {
                        s.points.forEach(function (p) {
                          if (p.x == clickedPoint.x) {
                            p.select(null, true);
                          }
                        });
                      });
    
                      // PointDataClick values formation
                      let pointDataCategory = pointData.category
    
                      // for column selection
                      const pointFactValue = []
                      const pointValue = []
    
                      for (let i = 0; i < this.chartData.data.yAxis.values.length; i++) {
                        if (yAxisforStackedColumn[i].data[clickedPoint.x].selected == true && yAxisforStackedColumn[i].data[clickedPoint.x].y > 0) {
                          // pointFactValue.push(yAxisforStackedColumn[i].data[clickedPoint.x].y)
                          pointValue.push(yAxisforStackedColumn[i].name)
                        }
                      }
    
                      setTimeout(() => {
                        if (this.router.url === '/pages/eda' || this.router.url === '/pages/add') {
                          this.pointDataOnClick = {
                            // profilerBadgeText: this.chartData.data.xAxis.title + ': ' + pointData.category,
                            breadCrumbText:
                              this.chartData.Widgettitle === 'Measure Profiler - Primary Peer Group' ||
                                this.chartData.Widgettitle === 'Measure Profiler - Secondary Peer Group' ||
                                this.chartData.Widgettitle === 'Pattern Score Summary' ||
                                this.chartData.Widgettitle === 'Pattern Profiler - Secondary Peer Group'
                                ?
                                pointDataCategory
                                : '',
                            secondProfilerBadgeText:
                              this.chartData.Widgettitle === 'Measure Profiler - Primary Peer Group'
                                ? this.chartData.data.xAxis.title + ': ' + pointDataCategory
                                : '',
    
                            bandId: IdArray ? IdArray[pointData.index] : '',
                            factId: IdArray1 ? IdArray1[pointData.index] : '',
                            // pieSelectedIndex: this.pointDataOnClick.factId!=''? pointData.index:''
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
                                this.chartData.data.xAxis.title + ':' +
                                this.chartData.data.yAxis.title +
                                '&' +
                                this.chartData.ChartLevel +
                                '_'
                              breadCrumTextCSV.push(concatedBreadCrumTextSplit)
                            }
                            pointValue.map(item => {
                              pointDataNameCsv.push(pointDataCategory + ': ' + item)
                            })
                            // pointDataCategory = pointDataCategory + ': ' + pointData.series.name
                            pointDataCategory = pointDataCategory.replace(/(<([^>]+)>)/ig, '')
                            if (pointData.state == 'select') {
                              breadCrumTextSplit = pointDataCategory
                              let breadCrumb = []
                              breadCrumTextCSV.push(breadCrumTextSplit)
                              breadCrumb = breadCrumTextCSV.filter(function (item, pos) {
                                return breadCrumTextCSV.indexOf(item) == pos;
                              });
                              breadCrumTextCSV = breadCrumb
    
                              // Dataset Eda summary bar chart - Add
                              attributeValueCsv.push(pointDataCategory)
    
    
                            } else if (pointData.state == '') {
                              const tempFactValueCSV = []
                              if (breadCrumTextCSV.length > 0) {
                                breadCrumTextCSV.map((item, index) => {
                                  if (item.includes(pointDataCategory)) {
                                    breadCrumTextCSV.splice(index, 1)
                                  }
                                })
                              }
                              breadCrumTextCSV.filter((val, i) => {
                                if (val == pointDataCategory) {
                                  tempFactValueCSV.splice(i, 1)
                                }
    
                                if (val != breadCrumTextSplit) {
                                  tempFactValueCSV.push(val)
                                }
                              })
                              breadCrumTextCSV = tempFactValueCSV
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
    
                            if (IdArray) {
                              factIdCSV.push(IdArray[pointData.index])
                            }
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
    
                            this.Service.setItem('EDAWidgetPointData', JSON.stringify(this.pointDataOnClick))
                          }, 100);
                        }
                        else {
                          if (pointData.state == 'select') {
                            pointDataFactIdCsv = pointFactValue
                            pointValue.map(_item => {
                              // pointDataNameCsv.push(xAxis + ': ' + pointDataCategory + ', ' + yAxis + ': ' + item)
                              pointDataNameCsv.push(xAxis + pointDataCategory)
                            })
                            overallSelectedSeries = pointDataCategory
                            // pointDataNameCsv = pointValue
    
                            // Dimension value formation
                            const dimensionValues = {
                              StackedDimensionValues1: pointData.category,
                              StackedDimensionValues2: null
                            }
                            pointDataDimensionValues.push(dimensionValues)
                            // console.log(pointDataDimensionValues)
                          } else if (pointData.state == '') {
                            // factId
                            overallSelectedSeries = ''
                            const tempFactValueCSV = []
                            pointDataFactIdCsv.filter(val => {
                              pointFactValue.map(item => {
                                if (val != item) {
                                  tempFactValueCSV.push(val)
                                }
                              })
                            })
                            pointDataFactIdCsv = tempFactValueCSV
                            // Breadcrumtext
                            const tempBadgeCSV = []
                            pointDataNameCsv.filter(val => {
                              // pointValue.map(item => {
                              //   item = pointDataCategory + ': ' + item
                              //   if (val != item) {
                              if (!val.includes(pointDataCategory)) {
                                tempBadgeCSV.push(val)
                              }
                              // })
                            })
                            pointDataNameCsv = tempBadgeCSV
    
                            // Dimension value formation
                            const dimensionValues = {
                              StackedDimensionValues1: pointData.category,
                              StackedDimensionValues2: null
                            }
                            const dimensionValuesToRemove = [];
                            pointDataDimensionValues.filter(item => {
                              if (!(item.StackedDimensionValues1 == dimensionValues.StackedDimensionValues1)) {
                                // console.log(item)
                                dimensionValuesToRemove.push(item)
                              }
                            });
    
                            pointDataDimensionValues = dimensionValuesToRemove
                            // console.log(pointDataDimensionValues)
                          }
                          const uniquefactIdCsv = Array.from(new Set(pointDataFactIdCsv));
                          pointDataFactIdCsv = uniquefactIdCsv
                          if (this.pointDataOnClick != undefined) {
                            this.pointDataOnClick.factId = pointDataFactIdCsv.toString()
                          }
                          pointDataNameCsv = pointDataNameCsv.filter(function (item, pos) {
                            return pointDataNameCsv.indexOf(item) == pos;
                          });
                          if (this.pointDataOnClick != undefined) {
                            this.pointDataOnClick.breadCrumbText = pointDataNameCsv
                            this.pointDataOnClick.dimensionStackedValues = pointDataDimensionValues
                            this.pointDataOnClick.dimensionStackedValues1 = this.chartData.data.xAxis.title
                            this.pointDataOnClick.dimensionStackedValues2 = this.chartData.data.yAxis.title
                          }
    
                          const chartEventDetail = {
                            name: e,
                            data: this.chartData,
                            pointdata: this.pointDataOnClick
                          };
                          this.Service.chartActionEvent.next(chartEventDetail);
                        }
                        // console.log(chartEventDetail.pointdata)
                      }, 100);
                      // console.log(pointDataFilteredValues)
                      // console.log(pointFactValue)
                      // console.log(pointValue)
                      // console.log(yAxisforStackedColumn)
                    }
                    return false
                  },
                  dblclick: e => {
                    const pointData = e.point;
                    // console.log(e.type, pointData);
                    if (e.type === 'dblclick' && pointData.state == 'select') {
                      this.onChartClick(e,this.chartData);
                    }
                  },
                }
              }
            },
          },
          exporting: {
            enabled: false
          },
          series: yAxisforStackedColumn,
        };
      }
    this.stackedbarChart = Highcharts.chart(this.chartElement.nativeElement, this.stackedbarChartOptions);
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
    return val;
  } 
  onChartClick(event, _chartData) {

    // for filtered workqueues tab - AI demo
   // if (chartData.title == 'File Volume by SLA' || chartData.title == 'File Volume by Speciality Group' || chartData.title == 'Files Needing Attention by Case Status' || chartData.title == 'In Progress Files by Tasks') {
   //   this.contexMenuControl = false;
   // } else {
      this.contexMenuControl = true;
  //  }
    // console.log(this.contexMenuControl);
  //  console.log(this.chartLocation);
  let timeout;
    if (
      (this.contexMenuControl === true && this.chartLocation === 'dashboard') ||
      (this.contexMenuControl === true && this.chartLocation !== 'dashboard')
    ) {
      this.chartData.showActions = true;
      this.setContextMenu(event);
      // console.log(event);
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
    // console.log(actionName);
    if (this.pointDataOnClick.pieSelectedIndex != 'No') {
      if (this.pointDataOnClick.pieSelectedIndex != undefined) {
        const obj = {
          chartIndex: this.pointDataOnClick.pieSelectedIndex
        }
        localStorage.setItem('chartIndex', JSON.stringify(obj))
        // console.log(obj)
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
}
