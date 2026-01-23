import { Directive, Input, Output, EventEmitter, OnChanges, SimpleChanges, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { Router } from '@angular/router';
import { SessionStorageService } from 'src/app/shared/services/storage.service';
import { CommonLoaderService } from 'src/app/Standalone/common-loader/common-loader.service';

@Directive({
  selector: '[init-widget]'
})
export class InitWidgetDirective implements OnChanges {

  @Input('widget') widget: any
 @Input('frompage') frompage: any;
  @Input('refreshData') refreshData: any
  @Output('loadWidget') loadWidget: EventEmitter<any> = new EventEmitter()

  requestObject: any
  requestUrl: string
  selectedCaseDetails: any;

  constructor(private http: HttpClient, private router: Router, private storage: SessionStorageService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (this.isWidgetDataNeeded() || (changes.refreshData && changes.refreshData.currentValue)) {
      this.getWidgetData()
    }
  }

  isWidgetDataNeeded() {
    if (this.widget.data) {
      return false
    } else if (this.widget.Tabs && this.widget.Tabs.length > 0) {
      const tabNames = this.widget.Tabs.map(tab => tab.DimensionName)
      let tabDataRequired = false
      for (let i = 0; tabNames.length < i ; i++) {
     // for (let i = 0; i > tabNames.length; i++) {
        if (!this.widget[tabNames[i]]) {
          tabDataRequired = true
          break
        }
      }
      return tabDataRequired
    } else {
      return true
    }
  }
  currentUser;
  getWidgetData() {
    this.currentUser = this.storage.getObj('currentUser');
    if (this.widget.name === 'dimensionScatter') {
      this.requestObject = this.getDimensionalScatterRequest()
      if(this.currentUser.RoleName == 'Form Admin Role'){
        this.requestUrl = `${environment.apiService}Insights/GetDimensionalScatterChartList`;
      }else{
        this.requestUrl = `${environment.apiService}Insights/GetDimensionalScatterChartList`;
      }
    } else if (this.widget.name === 'profiler') {
      this.requestObject = this.getProfilerRequest()
      if(this.currentUser.RoleName == 'Form Admin Role'){
        this.requestUrl = `${environment.apiService}Insights/GetProfileChartHeader`;
      }else{
        this.requestUrl = `${environment.apiService}Insights/GetProfileChartHeader`;
      }
      // this.requestUrl = `${environment.apiService}Charts/GetProfileCharts`;
    }else if(this.frompage == "business"){
      //console.log(this.frompage,'business');
      
      this.requestObject = this.getNewSapphireReq()
      this.requestUrl = `${environment.apiService}Insights/GetChartForDashBoard`;
    }else if(this.widget.widgetTitle == "SLA by Days and Volume" || this.widget.widgetTitle == "Active Files by Tasks"){
      this.requestObject = this.getAnalyzerRequest()
      this.requestUrl = `${environment.apiService}Charts/GetChartForDashBoard`;

    }  else {

      this.requestObject = this.getNewSapphireReq()
    
      this.requestUrl = `${environment.apiService}Insights/GetChartForDashBoard`;
    }
    if (this.widget.ChartTemplateId === 11 || this.widget.ChartTemplateId === 17 || this.widget.ChartTemplateId === 27) {
      this.widget.name = 'participantsList';
    }
    if (this.widget.ChartTemplateId === 28) {
      this.widget.name = 'sparklineWidget';
    }
    const widgetResponse: any = {}
    if (this.widget.name === 'participantsList') {
      widgetResponse.widgetId = this.widget.widgetId
      widgetResponse.ObjectId = this.widget.ObjectId
      widgetResponse.TimeId = this.widget.TimeId
      widgetResponse.DomainId = this.widget.DomainId
      widgetResponse.ParticipantList = true
      widgetResponse.isSuccess = true
      widgetResponse.isCompleted = true
      this.loadWidget.emit(widgetResponse)
    } else if (this.widget.name === 'sparklineWidget') {
      widgetResponse.widgetId = this.widget.widgetId
      widgetResponse.ObjectId = this.widget.ObjectId
      widgetResponse.TimeId = this.widget.TimeId
      widgetResponse.orgId = this.widget.orgId
      widgetResponse.DomainId = this.widget.DomainId
      widgetResponse.isSuccess = true
      widgetResponse.isCompleted = true
      this.loadWidget.emit(widgetResponse)
    } else if (this.widget.ChartType == "WorkQueue_List") {
      widgetResponse.widgetId = this.widget.widgetId
      widgetResponse.ObjectId = this.widget.ObjectId
      widgetResponse.TimeId = this.widget.TimeId
      widgetResponse.DomainId = this.widget.DomainId
      // widgetResponse.ParticipantList = true
      widgetResponse.isSuccess = true
      widgetResponse.isCompleted = true
      this.loadWidget.emit(widgetResponse)
    }
    else {
     // let data1;
      this.http.post(this.requestUrl, this.requestObject).subscribe(
        {
          next : (data:any) =>{
           // data = dataJson;

            widgetResponse.chartDetail = data;
            widgetResponse.Widgettitle = data.ChartData[0];
            if (data['ChartData'].title == 'Anamalous Billing in Hospitalizations') {
              data['ChartData'][0].type = 'map'
            } else if (data['ChartData'].title == 'Sample Pattern') {
              data['ChartData'].type = 'graph'
            }
            widgetResponse.DomainId = this.widget.DomainId;
            widgetResponse.Template = this.widget.Template;
            widgetResponse.ObjectId = this.widget.ObjectId;
            widgetResponse.timeId = this.widget.timeId;
            widgetResponse.Data_Label = this.widget.Data_Label
            widgetResponse.profilerWidgettitle = this.widget.widgetTitle;
  
            if (data.ChartData) {
              widgetResponse.chartDetail.ChartData.drilldownActions = data.drilldownActions
            }
            widgetResponse.widgetId = this.widget.widgetId
            widgetResponse.isSuccess = true
            widgetResponse.isCompleted = true
            this.loadWidget.emit(widgetResponse)
            // widgetResponse.widgetId = this.widget.widgetId
            // if(widgetResponse.chartDetail.ChartData.data.pieData.length == 0) {
            //   widgetResponse.isSuccess = false
            // } else {
            //   widgetResponse.isSuccess = true
            // }          
            // widgetResponse.isCompleted = true
            // this.loadWidget.emit(widgetResponse)
          },
          error : (err) =>{
            widgetResponse.isSuccess = false
            widgetResponse.isCompleted = true
            this.loadWidget.emit(widgetResponse)
          },
          complete :()=>{
            widgetResponse.isCompleted = true;
            this.loadWidget.emit(widgetResponse);
            // this.storage.setItem('dashboardLoaded', 'Y');
            // let loaderStatus = this.storage.getItem('workqueueLoaded');
            // if(loaderStatus == 'Y'){
            //   this.loaderService.hideLoader();
            // }
          }
        }
      )
    }
  }

  getNewSapphireReq(){
    const analyzerReObj = {
      "type": 'analyzer',
      "ObjectId": this.widget.ObjectId,
      "DomainId": this.widget.DomainId,
      "WidgetId": this.widget.widgetId,
      "MeasureScoreId": "2",
      "MeasureChartTemplateId": this.widget.ChartTemplateId,
      "TimeId": this.widget.timeId ? this.widget.timeId : "",
      // "OrgId": this.widget.orgId ? this.widget.orgId : "",
      "PatternThreshold": this.widget.DomainId === 6 && this.widget.PatternThreshold ? this.widget.PatternThreshold : "0",
      "RunId": "",
      "TimeTypeId": "",
      "DimensionalId": "",
      "FactValueStart": "",
      "FactValueEnd": this.widget.DomainId === 6 && this.widget.FactValueEnd ? this.widget.FactValueEnd : "0",
      "DimensionName": "",
      "PatternBandId": this.widget.DomainId === 6 && this.widget.BandId ? this.widget.BandId : "",
      "FactId": "",
      "FactValue": "",
      "DimensionValue": "",
      "primaryProfileName": "",
      "primaryProfileValue": "",
      "SecondaryProfileName": "",
      "SecondaryProfileValue": "",
      "DashboardId": this.widget.Template,
      "ExplorationMeasure": "",
      "ProfileArray": "",
      "ProfileString": "",
      "DefaultChartType" : this.widget.DefaultChartType,
      "SelectedChartType" : this.widget.selectedChart,
      "NodeIdCSV" : this.widget.NodeIdCSV,
      "NormalizationValue": this.widget.NormalizationValue
      // "OrgId": ""
    }
    localStorage.setItem('scatterWidgetItem', JSON.stringify(analyzerReObj))
    this.selectedCaseDetails = this.storage.getObj('selectedCaseDetails')

    //const filterObj = JSON.parse(localStorage.getItem('filterItems'))
   // const selectedorg;
    // if(this.router.url =='/pages/eda'){
    // selectedorg = this.widget.orgId!=''&&this.widget.orgId!=null ? this.encryptDecrypt.decrypt('DecryptRevoKey11', this.widget.orgId):''
    // // //console.log(this.encryptDecrypt.decrypt('DecryptRevoKey11', this.widget.orgId))
    // selectedorg = selectedorg!=''?this.encryptDecrypt.encrypt(selectedorg):''
    // }
    // else{
    // const selectedorg = this.widget.orgId
    // }
    //= this.widget.orgId!=''&&this.widget.orgId!=null ? this.encryptDecrypt.decrypt('DecryptRevoKey11', this.widget.orgId):''
    // //console.log(this.encryptDecrypt.decrypt('DecryptRevoKey11', this.widget.orgId))
    return {
      // "OrgId": "9",
      // "UserId": 248,
      "ObjectId": this.widget.ObjectId,
      "DomainId": this.widget.DomainId,
      "WidgetId": this.widget.widgetId,
      "MeasureScoreId": "2",
      "MeasureChartTemplateId": this.widget.ChartTemplateId,
      "TimeId": this.widget.timeId ? this.widget.timeId : "",
      "selectedorgid": "",
      // "OrgId": "4jF/YNyyjD/HMODV9n7LHjpgzNa0CJ983ByBNxe/iPpntVHqkBWmwl1iPeu89t3V",
      "PatternThreshold": this.widget.DomainId === 6 && this.widget.PatternThreshold ? this.widget.PatternThreshold : "0",
      "RunId": "",
      "TimeTypeId": "",
      "DimensionalId": "",
      "FactValueStart": "",
      "FactValueEnd": this.widget.DomainId === 6 && this.widget.FactValueEnd ? this.widget.FactValueEnd : "0",
      "DimensionName": "",
      "PatternBandId": this.widget.DomainId === 6 && this.widget.BandId ? this.widget.BandId : "",
      PatternScore:this.widget.DomainId === 6 && this.widget.PatternScore ? this.widget.PatternScore : "",
      "FactId": "",
      "FactValue": "",
      "DimensionValue": "",
      "primaryProfileName": "",
      "primaryProfileValue": "",
      "SecondaryProfileName": "",
      "SecondaryProfileValue": "",
      "DashboardId": this.widget.Template,
      "ExplorationMeasure": "",
      "ProfileArray": "",
      "ProfileString": "",
      // "OrgId": "",
      OldFileId: "",
      NewFileId: this.router.url == '/pages/docReviewTool' ? this.selectedCaseDetails['File ID'] : "",
      // "MeasureScoreStart": filterObj ? filterObj.MeasureScoreStart : '',
      // "MeasureScoreEnd": filterObj ? filterObj.MeasureScoreEnd : '',
      // "TopValue": filterObj ? filterObj.TopValue : '',
      // "dynamicfiltervalues": filterObj ? filterObj.dynamicfiltervalues : ''
      "DefaultChartType" : this.widget.DefaultChartType,
      "SelectedChartType" : this.widget.selectedChart,
      "NodeIdCSV" : this.widget.NodeIdCSV,
      "NormalizationValue": this.widget.NormalizationValue
    }


}
  getSapphireRequest(){
    return {
      
        // "OrgId": "9",
        // "UserId": 248,
        "ObjectId": 1084,
        "DomainId": 1,
        "WidgetId": 10583,
        "MeasureScoreId": "2",
        "MeasureChartTemplateId": 1,
        "TimeId": "",
        "PatternThreshold": "0",
        "RunId": "",
        "TimeTypeId": "",
        "DimensionalId": "",
        "FactValueStart": "",
        "FactValueEnd": "0",
        "DimensionName": "",
        "PatternBandId": "",
        "PatternScore": "",
        "FactId": "",
        "FactValue": "",
        "DimensionValue": "",
        "primaryProfileName": "",
        "primaryProfileValue": "",
        "SecondaryProfileName": "",
        "SecondaryProfileValue": "",
        "DashboardId": 5338,
        "ExplorationMeasure": "",
        "ProfileArray": "",
        "ProfileString": "",
        "OldFileId": "",
        "NewFileId": "",
        "DefaultChartType": null
    
  }
  }

  getAnalyzerRequest() {

    const analyzerReObj = {
      "type": 'analyzer',
      "ObjectId": this.widget.ObjectId,
      "DomainId": this.widget.DomainId,
      "MeasureScoreId": "2",
      "MeasureChartTemplateId": this.widget.ChartTemplateId,
      "TimeId": this.widget.timeId ? this.widget.timeId : "",
      "PatternThreshold": this.widget.DomainId === 6 && this.widget.PatternThreshold ? this.widget.PatternThreshold : "0",
      "RunId": "",
      "TimeTypeId": "",
      "DimensionalId": "",
      "FactValueStart": "",
      "FactValueEnd": this.widget.DomainId === 6 && this.widget.FactValueEnd ? this.widget.FactValueEnd : "0",
      "DimensionName": "",
      "PatternBandId": this.widget.DomainId === 6 && this.widget.BandId ? this.widget.BandId : "",
      "FactId": "",
      "FactValue": "",
      "DimensionValue": "",
      "primaryProfileName": "",
      "primaryProfileValue": "",
      "SecondaryProfileName": "",
      "SecondaryProfileValue": "",
      "DashboardId": this.widget.Template,
      "ExplorationMeasure": "",
      "ProfileArray": "",
      "ProfileString": "",
      // "OrgId": ""
    }

    localStorage.setItem('scatterWidgetItem', JSON.stringify(analyzerReObj))
    this.selectedCaseDetails = this.storage.getObj('selectedCaseDetails')
    return {
      "ObjectId": this.widget.ObjectId,
      "DomainId": this.widget.DomainId,
      "MeasureScoreId": "2",
      "MeasureChartTemplateId": this.widget.ChartTemplateId,
      "TimeId": this.widget.timeId ? this.widget.timeId : "",
      "PatternThreshold": this.widget.DomainId === 6 && this.widget.PatternThreshold ? this.widget.PatternThreshold : "0",
      "RunId": "",
      "TimeTypeId": "",
      "DimensionalId": "",
      "FactValueStart": "",
      "FactValueEnd": this.widget.DomainId === 6 && this.widget.FactValueEnd ? this.widget.FactValueEnd : "0",
      "DimensionName": "",
      "PatternBandId": this.widget.DomainId === 6 && this.widget.BandId ? this.widget.BandId : "",
      "FactId": "",
      "FactValue": "",
      "DimensionValue": "",
      "primaryProfileName": "",
      "primaryProfileValue": "",
      "SecondaryProfileName": "",
      "SecondaryProfileValue": "",
      "DashboardId": this.widget.Template,
      "ExplorationMeasure": "",
      "ProfileArray": "",
      "ProfileString": "",
      // "OrgId": "",
      OldFileId: "",
      NewFileId: this.router.url == '/pages/docReviewTool' ? this.selectedCaseDetails['File ID'] : "",

    }
  }

  getProfilerRequest() {

    const pointData = this.storage.getObj('DimensionData')

    const profilerObject = {
      "type": 'profiler',
      "ObjectId": this.widget.ObjectId,
      "DomainId": this.widget.DomainId,
      "BandId": "",
      "PatternThreshold": this.widget.DomainId === 6 && this.widget.PatternThreshold ? this.widget.PatternThreshold : "0",
      "MeasureChartTemplateId": "",
      "TimeId": this.widget.timeId ? this.widget.timeId : "",
      "PatternBandId": this.widget.DomainId === 6 && this.widget.BandId ? this.widget.BandId : "",
      "OutlierIndicator": "",
      "RunId": "",
      "TimeTypeId": "",
      "DimensionalId": "",
      "FactValueStart": "",
      "FactValueEnd": this.widget.DomainId === 6 && this.widget.FactValueEnd ? this.widget.FactValueEnd : "0",
      "DimensionName": pointData ? pointData.DimensionName : (this.widget.DimensionName) ? this.widget.DimensionName : '',
      "FactId": this.widget.DomainId === 1 ? this.widget.FactId : '',
      "FactValue": "",
      "DimensionValue": pointData ? pointData.DimensionValue : (this.widget.DimensionValue) ? this.widget.DimensionValue : '',
      "primaryProfileName": this.widget.primaryProfileName,
      "primaryProfileValue": this.widget.primaryProfileValue,
      "SecondaryProfileName": "",
      "SecondaryProfileValue": "",
      "DashboardId": this.widget.Template,
      "ExplorationMeasure": "",
      "ProfileArray": "",
      "ProfileString": "",
      // "OrgId": ""
    }

    this.storage.setObj('profilerIPObject', profilerObject)
    localStorage.setItem('scatterWidgetItem', JSON.stringify(profilerObject))

    return {
      "ObjectId": this.widget.ObjectId,
      "DomainId": this.widget.DomainId,
      "BandId": "",
      "PatternThreshold": this.widget.DomainId === 6 && this.widget.PatternThreshold ? this.widget.PatternThreshold : "0",
      "MeasureChartTemplateId": "",
      "TimeId": this.widget.timeId ? this.widget.timeId : "",
      "PatternBandId": this.widget.DomainId === 6 && this.widget.BandId ? this.widget.BandId : "",
      "OutlierIndicator": "",
      "RunId": "",
      "TimeTypeId": "",
      "DimensionalId": "",
      "FactValueStart": "",
      "FactValueEnd": this.widget.DomainId === 6 && this.widget.FactValueEnd ? this.widget.FactValueEnd : "0",
      "DimensionName": pointData ? pointData.DimensionName : (this.widget.DimensionName) ? this.widget.DimensionName : '',
      "FactId": this.widget.DomainId === 1 ? this.widget.FactId : '',
      "FactValue": "",
      "DimensionValue": pointData ? pointData.DimensionValue : (this.widget.DimensionValue) ? this.widget.DimensionValue : '',
      "primaryProfileName": this.widget.primaryProfileName,
      "primaryProfileValue": this.widget.primaryProfileValue,
      "SecondaryProfileName": "",
      "SecondaryProfileValue": "",
      "DashboardId": this.widget.Template,
      "ExplorationMeasure": "",
      "ProfileArray": "",
      "ProfileString": "",
      // "OrgId": ""
    }


  }

  getDimensionalScatterRequest() {
    return {

      "InstanceId": 0,
      "ChartType": "",
      "ObjectId": this.widget.ObjectId,
      "DomainId": this.widget.DomainId,
      "BandId": "",
      "PatternThreshold": this.widget.DomainId === 6 && this.widget.PatternThreshold ? this.widget.PatternThreshold : "0",
      "MeasureChartTemplateId": "4",
      "TimeId": this.widget.timeId ? this.widget.timeId : "",
      "PatternBandId": this.widget.DomainId === 6 && this.widget.BandId ? this.widget.BandId : "",
      "OutlierIndicator": "",
      "RunId": "",
      "TimeTypeId": "",
      "DimensionalId": "",
      "FactValueStart": "",
      "FactValueEnd": this.widget.DomainId === 6 && this.widget.FactValueEnd ? this.widget.FactValueEnd : "0",
      "DimensionName": "",
      "FactId": this.widget.DomainId === 1 ? this.widget.FactId : '',
      "FactValue": "",
      "DimensionValue": "",
      "primaryProfileName": this.widget.primaryProfileName,
      "primaryProfileValue": this.widget.primaryProfileValue,
      "SecondaryProfileName": "",
      "SecondaryProfileValue": "",
      "DashboardId": this.widget.Template,
      "ExplorationMeasure": "",
      "ProfileArray": "",
      "ProfileString": "",
      // "OrgId": ""
    }
  }

}


@NgModule({
  declarations: [InitWidgetDirective],
  exports: [InitWidgetDirective]
})
export class InitWidgetDirectiveModule {}