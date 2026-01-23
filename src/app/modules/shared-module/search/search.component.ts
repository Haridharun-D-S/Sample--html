import { Component, OnInit } from '@angular/core';
//import { PagesService } from '../_services/pages.service';
import { SharedServiceService } from 'src/app/shared/services/sharedservice.service';
import { SessionStorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchInputs: any;
  searchData: any;
  serachItem: any;
  dashboardId: any;
  searchClose: boolean = false;
  msgContent: boolean = false;
  searchContent: boolean = false;
  objectId: any;
  showSearchList: boolean;
  domainId: any;
  showDelIcon: boolean;
  showSearch: boolean;
  currentUser;
  constructor(
    private userAccess: SharedServiceService,
    private storage: SessionStorageService,
  ) { }

  ngOnInit() {
    this.currentUser = this.storage.getObj('currentUser');
    this.userAccess.dashboardid.subscribe(val => {
      if (val !== undefined) {
        this.dashboardId = val;
        this.searchClose = false;
        this.searchContent = false;
        this.showSearchList = true;
        this.searchInputs = '';
      }
    });

    this.userAccess.dashsearch.subscribe(val => {
      if (val === 'true') {
        // retain back to original dashboard page
        this.showSearch = true;
      } else {
        this.showSearch = false;
      }
    });
  }
  searchFun(_e) {
    this.searchClose = true;
    if (this.searchInputs !== '' && !this.searchInputs.endsWith(" ") && this.searchInputs !== undefined) {
      if(this.currentUser.RoleName == 'Form Admin Role'){
      }else{
      //   this.serchService.getSearch(this.searchInputs, this.dashboardId).subscribe({
      //    next: (response: any) => {
      //       this.searchData = response;
      //       this.searchContent = true;
      //       this.msgContent = false;
      //     },
      //   error:  (error) => {
      //       if (error !== '' && error !== undefined) {
      //         this.alertService.error(error.error.message);
      //       }
      //     },
      //     complete:()=>{
      //       //complete
      //     }
      // });
      }
    
    }
    if (this.searchInputs == '') {
      this.msgContent = true;
      this.searchContent = false;
    }
  }
  searchOpen() {
    this.searchClose = true;
  }
  closeIcon() {
    this.searchClose = false;
    this.searchInputs = '';
  }

  addChartsToDashboard(item, clickedIcon) {
    this.objectId = item.ObjectId;
    this.domainId = item.DomainId;
    let size = '';
    if (clickedIcon === '8' || clickedIcon === '16' || clickedIcon === '15') {
      size = 'col-lg-8';
    } else if (clickedIcon === '1' || clickedIcon === '3') {
      size = 'col-lg-4';
    } else if (clickedIcon === '17') {
      size = 'col-lg-12';
    } else {
      size = 'col-lg-12';
    }
    const asschartobj = {
      HasLoaded: true,
      DashboardId: this.dashboardId,
      WidgetId: '',
      Position: '1',
      Size: size,
      DomainId: this.domainId,
      widgetObjectTypeId: '1',
      ChartTemplateId: clickedIcon,
      ChartTemplateName: '',
      ChartTypeId: '',
      widgetObjectId: item.ObjectId,
      WidgetObjectName: item.ObjectName,
      WidgetTitle: item.ObjectName,
      TimeId: '',
      Information: {
        Name: '',
        Description: '',
        DynamicInfoList: {}
      },
      RunTimeList: [
        {
          'Processes Start Time': '',
          'Pattern Name': '',
          'Pattern Type': '',
          'Measure Name': '',
          'Measure Type': '',
          'Schedule Frequency': '',
          'Processes Run Status': '',
          'Time Period': '',
          p_id: '',
          time_id: '',
          chart_template_id: ''
        }
      ]
    };
    // this.serchService.addSearchedDashboard(asschartobj).subscribe((response: any) => {
    //   this.searchClose = false;
    //   this.searchContent = false;
    //   this.showSearchList = true;
    //   this.searchInputs = '';
    //   response.ObjectId = this.objectId;
    //   response.DomainId = this.domainId;
    //   response.Template = this.dashboardId;
    //   response.MeasureChartTemplateId = clickedIcon;
    //   this.userAccess.dashboardItems.next(response);
    // });
  }
}
