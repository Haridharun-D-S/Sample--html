import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {PiechartService  } from "./piechart.service";
import Highcharts from 'highcharts';
import HighchartsCustomEvents from 'highcharts-custom-events';

// Initialize HighchartsCustomEvents with Highcharts
HighchartsCustomEvents(Highcharts);
import { ChartServiceService } from "src/app/shared/services/chart_service";
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {
  @ViewChild('chartEl') chartElement: ElementRef;
  @Input('widgetSize') widgetSize;
  @ViewChild('contextMenu') contextMenuElement: ElementRef;
  @ViewChild('legend') legendEl: ElementRef;  
  @Output() chartEvent = new EventEmitter<any>();
  //private domRenderer: Renderer2;
  pieChart: Highcharts.Chart | undefined;
  pieChartOptions: any;
  @Input('data') chartData: any;
  toggleLegend: any;
  chartClickCheck: any = '';
  contexMenuControl: boolean = false;
  selectedPieDetails: { factId: any; pieSelectedIndex: any; };
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
    sunbustDimensionName?:any;
    treemapDimensionName?:any;
    Path?:any;
  };
  constructor( private router: Router,  private PiechartService: PiechartService,private ChartSharedService : ChartServiceService ) { }

  ngOnInit() { 
    console.log(this.chartData,'widget');
    
    // this.chartData = piechartData.PieData;
   }
   chartType(Type){
    if(Type == "Pie"){
      //this.chartData = this.chartData;
      this.initPieChart();
    }else if(Type == "Donut"){
      //this.chartData = this.chartData;
      this.initPieChart();
    }
   }
   ngAfterViewInit() {
    this.initPieChart();
  }
  showChart = true;
  initPieChart() {
    const yAxisDataForPie = [];
    this.pointDataOnClick = {}
    let primaryProfilerValueCSV = []
    //const secondaryProfilerValueCSV = []
    let profilerBadgeTextCSV = []
    let factIdCSV = []
    let pieIndexCSV = []
    //const chartTitle = this.chartData.title;
    const units = this.chartData.Units;
    if (this.chartData.UnitDisplayPosition === null || this.chartData.UnitDisplayPosition === '') {
      this.chartData.UnitDisplayPosition = 'Prefix';
    }
    if(this.chartData.data.xAxis.values.length) {
      this.showChart = true;
    } else {
      this.showChart = false;
    }
    let selectedIndex = [];
      selectedIndex = []
   // }

    const shortname = this.chartData.MeasureShortName && this.chartData.MeasureShortName !== '' ? '<b>' + this.chartData.MeasureShortName + ': </b>' : '<b>Value: </b>'

    // if (this.chartData.data.pieData.length > 1) {
      for (let i = 0; i < this.chartData.data.pieData.length; i++) {
        yAxisDataForPie.push({
          name: this.chartData.data.pieData[i].name,
          name1: this.chartData.data.pieData[i].Category,
          y: this.chartData.data.pieData[i].y, //.join()
          color:this.chartData.data.pieData[i].color,
          selected: selectedIndex.length > 0 && selectedIndex.includes(i.toString()) ? true : false,
          sliced: selectedIndex.length > 0 && selectedIndex.includes(i.toString()) ? true : false
        });
      }
      Highcharts.setOptions({
        lang: {
          decimalPoint: '.',
          thousandsSep: ','
        }
      });
      if(this.router.url === '/dashboard' || this.router.url === '/filelistdashboard' || this.router.url === '/insights') {
        this.pieChartOptions = {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            
          },
          title: {
            text: '',
            y: -3,
            x: 2,
            style: {
              fontSize: '14px',
              fontWeight: 'bold'
            }
          },
  
          tooltip: {
            pointFormat:
              '<b>' + units === undefined
                ? ''
                : this.chartData.UnitDisplayPosition === 'Prefix' ? this.formatNumber('{point.y}', shortname) + '</b>' :
                  this.formatNumber('{point.y}', shortname) + '</b>'
          },
          credits: {
            enabled: false
          },
          legend: {
            // layout: 'vertical',
            // align: 'right',
            // x: 5,
            // verticalAlign: 'top',
            // y: 55,
            // floating: true,
            enabled: true
          },
          plotOptions: {
            pie: {
              allowPointSelect: false,
              cursor: 'pointer',
              showInLegend: true,
              slicedOffset: 20,
              // borderColor: '#000000',
              dataLabels: {
                enabled: true,
                format: '{point.y}', 
                distance: -30,
                style: {
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  textOutline: '1px contrast'
                 }
                // borderWidth: 1,
                // borderColor: '#999999',
                // borderRadius: 5,
                // style: {
                //   fontWeight: '600' 
                // },
                // format:
                //   this.chartData.UnitDisplayPosition === 'Prefix' ? (shortname ? '{point.name}' + '<br>' + shortname + this.chartData.Units + ' ' + '{point.y:,.0f}' : '{point.name}' + '<br>' + this.chartData.Units + ' ' + '{point.y:,.0f}') : (shortname ? '{point.name}' + '<br>' + shortname + '{point.y:,.0f}' + ' ' + this.chartData.Units : '{point.name}' + '<br>' + '{point.y:,.0f}' + ' ' + this.chartData.Units)
              },
              states: {
                // select: {
                //   borderColor: 'red',
                //   borderWidth: '4px',
                //   transform: "translate(2,10)"
                // },
                // hover: {
                //   color: '#8ec142',
                //   borderColor: 'gray'
                // }
              }
            },
            series: {
              showInLegend: true,
              pointWidth: 60,
              cursor: 'pointer',
              allowPointSelect: true,
              animation: {
                duration: 2000
              },
  
              point: {
                events: {
                  click: e => {
                    const pointData = e.point;
                    // console.log(pointData);
                    if (e.type === 'click') {
                      // this.onChartClick(e, this.chartData.type, this.chartData);
                      setTimeout(()=>{
                        // const clickedPoint = e.point,
                        // chart = clickedPoint.series.chart;
                      // chart.series.forEach(function (s) {
                      //   s.points.forEach(function (p) {
                      //     if (p.x == clickedPoint.x) {
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
                        const clickedPoint = e.point,
                          chart = clickedPoint.series.chart;

                        chart.series.forEach((series) => {
                          series.points.forEach((point) => {
                            if (point !== clickedPoint && point.select) {
                              point.select(false, true);
                            }
                          });
                        });
                        // Toggle the selection state of the clicked point
                        if (clickedPoint.select) {
                          clickedPoint.select(!clickedPoint.selected, true);
                        }
                      },200)
                    }
                    this.chartClickCheck = pointData.name;
                    if(this.chartData.drilldownActions?.length > 0){
                      //pointData.objectid = (this.chartData.title == 'Active Files by Tasks') ? cid : undefined
                      // this.ChartSharedService.chartareaclicked.next(pointData);
                      // to remove html tags in dimensional pie chart,
                      if (pointData.state == 'select') {
                        // this.ChartSharedService.chartareaclicked.next(pointData);
                             } else if (pointData.state == '') {
                              // this.ChartSharedService.chartareaclicked.next("deselect");
                              }
                      // if (pointData.state == 'select') {
                      //   this.dataGetService.chartareaclicked.next(pointData);
                      //        } else if (pointData.state == '') {
                      //         this.dataGetService.chartareaclicked.next("deselect");
                      //         }
                      //         this.dataGetService.chartValue.next(pointData);
                      //         this.chartClickCheck = pointDataCategory;
                    }else{
                    //pointData.objectid = this.chartData.title == 'File Volume by Speciality Group' ? 13 : this.chartData.title == 'Files Needing Attention by Case Status' ? 16 : this.chartData.title == 'In Progress Files by Tasks' ? 14 : undefined
                    // console.log(pointData.state);
                    if(pointData.state === 'select')  {
                      // this.ChartSharedService.chartareaclicked.next("deselect");
                    } else {
                      // this.ChartSharedService.chartareaclicked.next(pointData);
                    }
  
                    
                    // to remove html tags in dimensional pie chart,
                    let pointDataTag = pointData.name
                    if (pointDataTag != null || pointDataTag != '') {
                      pointDataTag = pointDataTag.replace(/(<([^>]+)>)/ig, '');
                      primaryProfilerValueCSV = []
                    }
                    primaryProfilerValueCSV.push(pointDataTag)
                    const chartEventDetail = {
                      name: e,
                      data: this.chartData,
                      pointdata: this.pointDataOnClick
                    };
                    setTimeout(() => {
                      // if (pointData.state == 'select') {
                        // if (factIdCSV.length > 0) {
                          // factIdCSV.filter(val => {
                            // if (val != pointData.name1) {
                              factIdCSV =pointData.name1
                      let tempBadgeCSV = []
                      tempBadgeCSV = profilerBadgeTextCSV.filter(function (item, pos) {
                        return profilerBadgeTextCSV.indexOf(item) == pos;
                      });
                      profilerBadgeTextCSV = tempBadgeCSV
                      let tempFactValueCSV = []
                      this.pointDataOnClick["factId"] = factIdCSV.toString()
                      this.pointDataOnClick["profilerBadgeText"] = profilerBadgeTextCSV
                      if(this.chartData.Widgettitle != 'Measure Profiler - Primary Peer Group' ||
                                this.chartData.Widgettitle != 'Measure Profiler - Secondary Peer Group' ||
                                this.chartData.Widgettitle != 'Pattern Profiler - Secondary Peer Group') {
                                  this.pointDataOnClick["breadCrumbText"] = profilerBadgeTextCSV
                                }
                      this.pointDataOnClick["pointDataName"] = primaryProfilerValueCSV
                      this.pointDataOnClick['pieSelectedIndex'] = pieIndexCSV.length > 0 ? pieIndexCSV.toString() : 'No'
                      this.PiechartService.setItem('DimensionalWidgetPointData', JSON.stringify(this.pointDataOnClick))
                      if (pointData.selected !== false && pointData.state !== '') {
                        // this.ChartSharedService.chartActionEvent.next(chartEventDetail);
                        this.ChartSharedService.chartareaclicked.next(chartEventDetail);
                        // to set & get pie selected details for eda
                        this.selectedPieDetails = {
                          factId: pointData.name1,
                          pieSelectedIndex: pointData.index
                        }
                        // localStorage.setItem('pieSelectedIndex', JSON.stringify(this.selectedPieDetails))
                      } else {
                        // to set & get pie selected details for eda
                        this.selectedPieDetails = {
                          factId: undefined,
                          pieSelectedIndex: undefined
                        }
                        // localStorage.setItem('pieSelectedIndex', JSON.stringify(this.selectedPieDetails))
                      }
                      if (this.router.url == '/pages/eda') {
                        this.PiechartService.setItem('EDAWidgetPiePointData', JSON.stringify(this.pointDataOnClick))
                      }
                    }, 200)
                  }
                  }
                }
              },
  
            }
          },
          exporting: {
            enabled: false
          },
          series: [
            {
              colorByPoint: true,
              data: yAxisDataForPie,
              type: 'pie'
            },
          ]
        };
      } else {
        this.pieChartOptions = {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            
          },
          title: {
            text: '',
            y: -3,
            x: 2,
            style: {
              fontSize: '14px',
              fontWeight: 'bold'
            }
          },
  
          tooltip: {
            pointFormat:
              '<b>' + units === undefined
                ? ''
                : this.chartData.UnitDisplayPosition === 'Prefix' ? this.formatNumber('{point.y}', shortname) + '</b>' :
                  this.formatNumber('{point.y}', shortname) + '</b>'
          },
          credits: {
            enabled: false
          },
          legend: {
            // layout: 'vertical',
            // align: 'right',
            // x: 5,
            // verticalAlign: 'top',
            // y: 55,
            // floating: true,
            enabled: false
          },
          plotOptions: {
            pie: {
              allowPointSelect: false,
              cursor: 'pointer',
              // borderColor: '#000000',
  
              dataLabels: {
                enabled: this.chartData['Filter'] && this.chartData['Filter'] == true ? false : true,
                borderWidth: 1,
                borderColor: '#999999',
                borderRadius: 5,
                style: {
                  fontWeight: '600' // Change font weight
                },
                format:
                  this.chartData.UnitDisplayPosition === 'Prefix' ? (shortname ? '{point.name}' + '<br>' + shortname + this.chartData.Units + ' ' + '{point.y:,.2f}' : '{point.name}' + '<br>' + this.chartData.Units + ' ' + '{point.y:,.2f}') : (shortname ? '{point.name}' + '<br>' + shortname + '{point.y:,.2f}' + ' ' + this.chartData.Units : '{point.name}' + '<br>' + '{point.y:,.2f}' + ' ' + this.chartData.Units)
              },
              states: {
                select: {
                  borderColor: 'red',
                  borderWidth: '4px',
                  transform: "translate(2,10)"
                },
                hover: {
                  color: '#8ec142',
                  borderColor: 'gray'
                }
              }
            },
            series: {
              showInLegend: false,
              pointWidth: 60,
              cursor: 'pointer',
              allowPointSelect: true,
              animation: {
                duration: 2000
              },
  
              point: {
                events: {
                  click: e => {
                    const pointData = e.point;
                    // console.log(pointData);
                    if (e.type === 'click') {
                      // this.onChartClick(e, this.chartData.type, this.chartData);
                      setTimeout(()=>{
                        const clickedPoint = e.point,
                        chart = clickedPoint.series.chart;
                      chart.series.forEach(function (s) {
                        s.points.forEach(function (p) {
                          if (p.x == clickedPoint.x) {
                            p.select(null, true);
                          }
                        });
                      });
                      },200)
                    }
                    this.chartClickCheck = pointData.name;
                    if(this.chartData.drilldownActions?.length > 0){
                      //pointData.objectid = (this.chartData.title == 'Active Files by Tasks') ? cid : undefined
                      this.ChartSharedService.chartareaclicked.next(pointData);
                      // to remove html tags in dimensional pie chart,
                      if (pointData.state == 'select') {
                        this.ChartSharedService.chartareaclicked.next(pointData);
                             } else if (pointData.state == '') {
                              this.ChartSharedService.chartareaclicked.next("deselect");
                              }
                      // if (pointData.state == 'select') {
                      //   this.dataGetService.chartareaclicked.next(pointData);
                      //        } else if (pointData.state == '') {
                      //         this.dataGetService.chartareaclicked.next("deselect");
                      //         }
                      //         this.dataGetService.chartValue.next(pointData);
                      //         this.chartClickCheck = pointDataCategory;
                    }else{
                    //pointData.objectid = this.chartData.title == 'File Volume by Speciality Group' ? 13 : this.chartData.title == 'Files Needing Attention by Case Status' ? 16 : this.chartData.title == 'In Progress Files by Tasks' ? 14 : undefined
                    // console.log(pointData.state);
                    if(pointData.state === 'select')  {
                      this.ChartSharedService.chartareaclicked.next("deselect");
                    } else {
                      this.ChartSharedService.chartareaclicked.next(pointData);
                    }
  
                    
                    // to remove html tags in dimensional pie chart,
                    let pointDataTag = pointData.name
                    if (pointDataTag != null || pointDataTag != '') {
                      pointDataTag = pointDataTag.replace(/(<([^>]+)>)/ig, '');
                      primaryProfilerValueCSV = []
                    }
                    primaryProfilerValueCSV.push(pointDataTag)
                    const chartEventDetail = {
                      name: e,
                      data: this.chartData,
                      pointdata: this.pointDataOnClick
                    };
                    setTimeout(() => {
                      if (pointData.state == 'select') {
                        if (factIdCSV.length > 0) {
                          factIdCSV.filter(val => {
                            if (val != pointData.name1) {
                              factIdCSV.push(pointData.name1)
                            }
                          })
                        }
                        else {
                          factIdCSV.push(pointData.name1)
                        }
                        if (profilerBadgeTextCSV.length > 0) {
                          profilerBadgeTextCSV.filter(val => {
                            if (val != pointDataTag) {
                              profilerBadgeTextCSV.push(pointDataTag)
                            }
                          })
                        }
                        else {
                          profilerBadgeTextCSV.push(pointDataTag)
                        }
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
                          if (val != pointData.name1) {
                            tempFactValueCSV.push(val)
                          }
                        })
                        factIdCSV = tempFactValueCSV
  
                        const tempPieIndexValueCSV = []
                        pieIndexCSV.filter(val => {
                          if (val != pointData.index) {
                            tempPieIndexValueCSV.push(val)
                          }
                        })
                        pieIndexCSV = tempPieIndexValueCSV
                        const tempBadgeCSV = []
                        profilerBadgeTextCSV.filter(val => {
                          if (val != pointDataTag) {
                            tempBadgeCSV.push(val)
                          }
                        })
                        profilerBadgeTextCSV = tempBadgeCSV
                        const uniquefactIdCsv = Array.from(new Set(factIdCSV));
                        factIdCSV = uniquefactIdCsv
                      }
                      let tempBadgeCSV = []
                      tempBadgeCSV = profilerBadgeTextCSV.filter(function (item, pos) {
                        return profilerBadgeTextCSV.indexOf(item) == pos;
                      });
                      profilerBadgeTextCSV = tempBadgeCSV
                      let tempFactValueCSV = []
                      tempFactValueCSV = factIdCSV.filter(function (item, pos) {
                        return factIdCSV.indexOf(item) == pos;
                      });
                      factIdCSV = tempFactValueCSV
                      let tempIndexCSV = []
                      tempIndexCSV = pieIndexCSV.filter(function (item, pos) {
                        return pieIndexCSV.indexOf(item) == pos;
                      });
                      pieIndexCSV = tempIndexCSV
                      this.pointDataOnClick["factId"] = factIdCSV.toString()
                      this.pointDataOnClick["profilerBadgeText"] = profilerBadgeTextCSV
                      if(this.chartData.Widgettitle != 'Measure Profiler - Primary Peer Group' ||
                                this.chartData.Widgettitle != 'Measure Profiler - Secondary Peer Group' ||
                                this.chartData.Widgettitle != 'Pattern Profiler - Secondary Peer Group') {
                                  this.pointDataOnClick["breadCrumbText"] = profilerBadgeTextCSV
                                }
                      this.pointDataOnClick["pointDataName"] = primaryProfilerValueCSV
                      this.pointDataOnClick['pieSelectedIndex'] = pieIndexCSV.length > 0 ? pieIndexCSV.toString() : 'No'
                      this.PiechartService.setItem('DimensionalWidgetPointData', JSON.stringify(this.pointDataOnClick))
                      if (pointData.selected !== false && pointData.state !== '') {
                        this.ChartSharedService.chartActionEvent.next(chartEventDetail);
                        // to set & get pie selected details for eda
                        this.selectedPieDetails = {
                          factId: pointData.name1,
                          pieSelectedIndex: pointData.index
                        }
                        // localStorage.setItem('pieSelectedIndex', JSON.stringify(this.selectedPieDetails))
                      } else {
                        // to set & get pie selected details for eda
                        this.selectedPieDetails = {
                          factId: undefined,
                          pieSelectedIndex: undefined
                        }
                        // localStorage.setItem('pieSelectedIndex', JSON.stringify(this.selectedPieDetails))
                      }
                      if (this.router.url == '/pages/eda') {
                        this.PiechartService.setItem('EDAWidgetPiePointData', JSON.stringify(this.pointDataOnClick))
                      }
                    }, 200)
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
                    const pointData = e.point;
                    console.log(pointData);
                    if (e.type === 'dblclick' && pointData.state == 'select') {
                      this.onChartClick(e, this.chartData.type, this.chartData);
                    }
                  }
                }
              },
  
            }
          },
          exporting: {
            enabled: false
          },
          series: [
            {
              colorByPoint: true,
              data: yAxisDataForPie,
              type: undefined
            },
          ]
        };
      }
      

    if (this.chartData.type !== 'pie') {
      this.pieChartOptions.plotOptions.pie.innerSize = '';
    }
    

    this.pieChart = Highcharts.chart(this.chartElement.nativeElement, this.pieChartOptions);
    if(this.chartData.type === 'pie') {
      // this.customLegend(this.chartData.ColorList,false);
    }
    Highcharts.Pointer.prototype.reset = function () {
      return undefined;
    };
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
    // console.log(tag)
    // console.log(y)
    return val;
  }
  onChartClick(event, _chartType, _chartData) {
    // if (chartData.title == 'File Volume by SLA' || chartData.title == 'File Volume by Speciality Group' || chartData.title == 'Files Needing Attention by Case Status' || chartData.title == 'In Progress Files by Tasks') {
    //   this.contexMenuControl = false;
    // } else {
      this.contexMenuControl = true;
    //}
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
}
