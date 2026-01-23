import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonLoaderService } from 'src/app/Standalone/common-loader/common-loader.service';
import { EcareGridSettings } from 'src/app/shared/modal/ecareGridSetting';
import { EncryptionService } from 'src/app/shared/services/encryption.service';
import { SharedServiceService } from 'src/app/shared/services/sharedservice.service';
import { SessionStorageService } from 'src/app/shared/services/storage.service';
import { environment } from 'src/environments/environments';
import { PopupCustomComponent } from '../../shared-module/popup-custom/popup-custom.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  gridWidget: EcareGridSettings;
  isLoading: boolean;
  recordSelected: boolean;
  gridWidgetPopup: EcareGridSettings;
  selectedRecord: any;
  
  constructor(
    public dialog: MatDialog
    ) { }

  ngOnInit(): void {
    this.recordSelected = false;
    this.gridApiTrigger();
  }
  gridApiTrigger(){
    let reqObj = {
    }
    this.gridWidget = new EcareGridSettings();
    this.gridWidget = {
      id: 'reports',
      checklocaljson : false,
      apiMethod: 'post',
      apiUrl: `${environment.apiService}Cases/GetVaersReportDetails`,
      apiRequest: reqObj,
      rowSelection: 'single',
      gridname: 'reportsGrid',
    };
    setTimeout(() => {
      this.isLoading = false;
    }, 200);

  }
  handleCheckBoxEvent(event){
    if (event['selectedRowCount'] == 1) {
        this.recordSelected = true;
        this.selectedRecord = event?.selectedRowDetails?.Report_ID;
    } 
    else {
        this.recordSelected = false;
    }
  }
  downloadReport(): void {
    let reqObj = {
      "ReportId": this.selectedRecord
    }
    this.gridWidgetPopup = new EcareGridSettings();
    this.gridWidgetPopup = {
      id: 'reportsPopup',
      checklocaljson : false,
      apiMethod: 'post',
      apiUrl: `${environment.apiService}Cases/GetVaersReportDateDetails`,
      apiRequest: reqObj,
      rowSelection: 'single',
      gridname: 'reportsGrid',
    };
    const dialogRef = this.dialog.open(PopupCustomComponent, {
      panelClass: 'reports-modal',
      data: {
        type : 'reportsGrid',
        title: 'Reports',
        titlePosition: 'left',
        // contentPosition: 'center',
        buttonPosition: 'right',
        showDeclineButton: false,
        showAcceptButton: false,
        showClose: true,
        gridWidget: this.gridWidgetPopup
      },
      height: 'auto',
      width: '600px'
    });


    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
