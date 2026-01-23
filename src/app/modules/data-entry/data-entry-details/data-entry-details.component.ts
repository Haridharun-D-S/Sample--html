import { Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import * as _ from 'lodash';
import { EncryptionService } from 'src/app/shared/services/encryption.service';
import { SessionStorageService } from 'src/app/shared/services/storage.service';
import { SharedServiceService } from 'src/app/shared/services/sharedservice.service';
import { DynamicEntryPageComponent } from '../../dynamic-entry-page/dynamic-entry-page/dynamic-entry-page.component';
import { IDynamicDialogConfig, PopupErrorComponent } from '../../shared-module/popup-error/popup-error.component';
import { CommonLoaderService } from 'src/app/Standalone/common-loader/common-loader.service';
import { PopupSuccessComponent } from '../../shared-module/popup-success/popup-success.component';
import { PopupTemplateComponent } from '../../shared-module/popup-template/popup-template.component';

/*
    *** DynamicEntryInput declaration ***
*/
interface DynamicEntryInput
{
    torId: string;
    completeJson: InputObj[];

}
/*
    *** Custom Dictionary declaration ***
*/
interface customDictionary {
  [index: string]: string | boolean | number | string[] | number[] | customDictionary | customDictionary[];
}
/*
    *** Custom Overall Input Class declaration ***
*/
interface InputObj 
{ 
  Type: string;
  Class: string;
  FieldId?: string;
  FieldType: string;
  Hide: string;
  Editable: string;
  Label: string;
  Value: string | boolean | number;
  TempValue: string | boolean | number;
  id: string;
  Level: number;
  index: number;
  PlaceHolder: string;
  icon: string;
  Hint: string[];
  Tooltip: string;
  ConfidenceType: string;
  dataType?: string;
  VisibilityFlag?: string;
  Dimensions: customDictionary[];
  IntelliSearchData: IntelliSearchData[];
  ValidationData: ValidationData[];
  AdditionalData: AdditionalData[];
  Attributes: Attributes[];
  Child: InputObj[];
  isUpdated?;
  columnProperties?: customDictionary[];
  GridData?: customDictionary[];
  GridAPIInput?: any;
};

/*
    *** Custom IntelliSearchData Input Class declaration ***
*/
interface IntelliSearchData
{ 
  Label: string;
  id: string;
  searchGroup: string;
  Type: string;
  IntelliSearchAPI: string;
  IntelliSearchInput: customDictionary;
  Data: string[];
};
  
/*
    *** Custom IntelliSearchData Input Class declaration ***
*/
interface ValidationData
{ 
  RuleID: number;
  id: string;
  RuleType: string;
  ValidationInput: string;
  ErrorMessage: string;
};
  
/*
    *** Custom AdditionalData Input Class declaration ***
*/
interface AdditionalData
{ 
  Type: string;
  Class: string;
  FieldType: string;
  Hide: string;
  Editable: string;
  Label: string;
  Value: string | boolean | number;
  TempValue: string | boolean | number;
  id: string;
  Level: number;
  index: number;
  PlaceHolder: string;
  icon: string;
  Hint: string[];
  Tooltip: string;
  ConfidenceType: string;
  dataType?: string;
  VisibilityFlag?: string;
  Dimensions: customDictionary[];
  IntelliSearchData: IntelliSearchData[];
  ValidationData: ValidationData[];
  AdditionalData: AdditionalData[];
  Attributes: Attributes[];
  Child?: InputObj[];
  isUpdated?;
};
  
/*
    *** Custom AdditionalData Input Class declaration ***
*/
interface Attributes
{ 
  Label?: string;
  Value?: string | boolean;
  Version?: string | boolean | number;
  user?: string;
  time?: string;
  id?: string;
  index?: number;
};
  
/*
    *** Output Class declaration ***
*/
interface OutputObj
{ 
	Type: string;
	FieldType: string;
	Label: string;
	Value: string | boolean | number;
	TempValue: string | boolean | number;
	id: string;
	Level: number;
	index: number;
  ConfidenceType: string;
  Dimensions: customDictionary[];
	IntelliSearchData: IntelliSearchData[];
	ValidationData: ValidationData[];
	AdditionalData: AdditionalData[];
	Attributes: Attributes[];
	CompleteJson:  InputObj[];
}
  
/*
    *** Custom Output Class declaration ***
*/
interface CustomOutput
{ 
  CustomEvent: string,
  Value: string | boolean | number;
  Type: string;
  Data: OutputObj[]
}
/*
    *** save Dynamic Output declaration ***
*/
interface saveDynamicOutput
{
    typeOfService: string;
    dateOfService: string;
}

interface idArray
{ 
  id: string,
  originalValue: string;
}

interface LookupCustomEvent
{ 
  Type: string,
  Data;
}

interface bulkSaveOutput
{ 
  Type: string,
  Page: number,
  TOR: string,
  DOS: string,
  PageNumbers,
  torId: string,
  lastPage: number,
  CompleteJson:  InputObj[];
}
interface CustomGenericEvent
{
  Type: string,
  Data
}

@Component({
  selector: 'app-data-entry-details',
  templateUrl: './data-entry-details.component.html',
  styleUrls: ['./data-entry-details.component.scss']
})
export class DataEntryDetailsComponent implements OnInit {
  /*
      *** Input decorator declaration ***
  */
  @Input() bookmarkValuesEmitter: EventEmitter<any>;
  @Input() highlightPopup: EventEmitter<any>;
  @Input() clinicalHighlightReq: EventEmitter<any>;
  @Input() clinicalPdfHighLightArrayValue: EventEmitter<any>; 
  @Input() pageNoEmit: EventEmitter<any>;
  @Input() pageNumber: EventEmitter<any>;
  @Input() filteredPageNo;
  @Input() resetFilterData;
  @Input() ProcessingCardDetails;
  @Input() PageFieldType: string;
  @Input() TemplateName: string;
  @Input() FromPage;
  /*
      *** Output decorator declaration ***
  */
  @Output() pageBunchingEmitter = new EventEmitter<{pageValues: number[]; trigger: string; }>(); 
  @Output() filehighlighter = new EventEmitter<any>();
  @Output() tabIndexEmit = new EventEmitter<any>();
  @Output() GroupviewEmit = new EventEmitter<any>();
  @Output() clearConfidenceTypeBtnSelections = new EventEmitter<any>();
  @Output() PageNumbersForRecordNav = new EventEmitter<number[]>();
  @Output() scrollToFieldEvent = new EventEmitter<string>();
  @Output() RecordNoUpdate = new EventEmitter<any>();
  @Output() closeCompleteEventEmitter = new EventEmitter<string>();
  @Output() multipleRecordPages = new EventEmitter<any>();
  @Output() saveRecordDetailsData = new EventEmitter<any>();
  @Output() bulkSaveCompleteFlag = new EventEmitter<string>();
  @Output() recordDetailsUpdate = new EventEmitter<any>();
  @Output() noTORData = new EventEmitter<any>();
  /*
      *** View Child declaration ***
  */
  @ViewChild(DynamicEntryPageComponent) DynamicEntryPageComponent: DynamicEntryPageComponent;
  /*
      *** Variable declaration ***
  */
  DynamicEntryPageInput = [];
  DynamicEntryPageInputOld: InputObj[];
  DynamicEntryPageInputOldMRR: InputObj[];
  DynamicEntryPageInputOldMRR1: InputObj[];
  DynamicEntryPageType: string;
  DynamicEntryPageCustomInput: customDictionary[];
  oldincludedPages: string;
  currentPageList: string;
  includedPages: number[];
  bookmarkPageValue: number[];
  pageBunchBookmarkValues: string;
  currentUserId: string;
  showMRRMedicaldiv: boolean = false;
  userDetail;
  currentUserName: string;
  pageNo: string | number;
  currentUser: string;
  highlightBoxClick: boolean = false;
  taskDetails;
  defaultLoader: boolean;
  duplicateHighlightArray: string;
  RecordNo: number;
  TotalRecordNo: number;
  isPageBunchSaveCompleted: boolean;
  PageWaitLoader: boolean = true;
  PageType: string;
  idValueArray: idArray[];
  dynamicDataCount: any;
  dynamicDataGroupId: any;
  userId: any;
  screenType: string;
  VaersID: any;
  CaseDetails: any;
  dynamicDataTorId: string;
  lastFocusedIndex: number = 0;

  constructor(
    private sharedServiceService: SharedServiceService,
    public dialog: MatDialog,
    private sessionStorage: SessionStorageService,
    private encryptDecrypt: EncryptionService,
    private loaderService: CommonLoaderService
  ) {
    this.taskDetails = JSON.parse(this.sessionStorage.getItem('selectedCaseDetails'));
    this.VaersID =  this.taskDetails['Case_ID'];
  }
  
  /*
     *** Ng Oninit ***
  */
  ngOnInit(): void{
    this.isPageBunchSaveCompleted = true;
    this.CaseDetails = JSON.parse(this.sessionStorage.getItem('selectedCaseDetails'));
    if(this.CaseDetails['Case ID'] !== null && this.CaseDetails['Case ID'] !== '' && this.CaseDetails['Case ID'] !== undefined){
      this.screenType = 'view';
    }
    else{
      this.screenType = 'edit';
    }
    // this.defaultLoader = true;
    this.userDetail = this.sessionStorage.getObj('currentUser');
    this.userId = this.encryptDecrypt.decrypt('DecryptRevoKey11', this.userDetail.UserId);
    this.currentUserId = this.encryptDecrypt.encrypt(String(this.userDetail.UserId));
    this.currentUserName = this.encryptDecrypt.encrypt(String(this.userDetail.UserId));
    this.pageNoEmit.subscribe((data)=>{
    /*
      *** Pdf Navigation Dynamic Data Event Call ***
    */
      if(this.PageType == 'Record Split'){
        if(data.pageFrom == 'Next'){
          let tempPgNo = data.pageNumber - 1
          this.lastFocusedIndex = this.findIndexByPageNo(this.ProcessingCardDetails, tempPgNo);
        }
        else if (data.pageFrom == 'Previous'){
          let tempPgNo = data.pageNumber + 1
          this.lastFocusedIndex = this.findIndexByPageNo(this.ProcessingCardDetails, tempPgNo);
        }
        else if(data.pageFrom == 'Manual'){
          let tempPgNo = data.PreviousPage
          this.lastFocusedIndex = this.findIndexByPageNo(this.ProcessingCardDetails, tempPgNo);
        }
        else{
          this.lastFocusedIndex = -1
        }
        let bungedOnTrigger = this.sessionStorage.getItem('pageBunging');
        let index = this.findIndexByPageNo(this.ProcessingCardDetails, data['pageNumber']);
        // let index = this.ProcessingCardDetails.findIndex(obj => obj.PageNumbers.includes(data['pageNumber']));
        if(index != -1) { 
          const filteredArray: number[] = this.getPageNumbers(this.ProcessingCardDetails[index].PageNumbers);
          let PageNumbers: number[];
          PageNumbers = filteredArray.map(str => Number(str));
          if (bungedOnTrigger != 'true') {
            this.RecordNoUpdate.emit({
              index : index,
              customNavTotalPages : filteredArray.length,
              CustomInputFieldProperties : "readonly",
              CustomInputFieldValue : this.ProcessingCardDetails[index].typeOfRecord,
              PageNumbers : PageNumbers
            }); 
            if(this.lastFocusedIndex != index){
              this.lastFocusedIndex = index;
              this.RecordNo = index + 1;
              if (data['pageFrom'] === 'Next') {
                this.sessionStorage.setItem('lsLoaded', 'N');
                this.loaderService.showLoader();
                this.pdfNavigateDynamicData();
              }
              else{
                this.sessionStorage.setItem('lsLoaded', 'N');
                this.loaderService.showLoader();
                this.pdfNavigateDynamicData();
              }
            }
          }
        } else {
          this.noTORData.emit(true);
          if(this.isPageBunchSaveCompleted) {
            this.lastFocusedIndex = index;
            this.sessionStorage.setItem('lsLoaded', 'N');
            this.loaderService.showLoader();
            this.pdfNavigateDynamicDataWithoutTOR(data.pageNumber);
          }
        }
      }
    })
     this.bookmarkValuesEmitter.subscribe((data) => {
      this.bookmarkPageValue = data;      
      this.pageBunchBookmarkValues = this.bookmarkPageValue.toString(); 
      let tor: string = '';
      const bunching = (item) => {
        if (item.Child && item.Child.length > 0) {
          item.Child.forEach(bunching)
        }
        if (item.Label && (item.Label  === "Page Numbers" || item.Label  === "PageNumbers")) {
          item.Value =  this.pageBunchBookmarkValues
        }
        if (item.FieldId && (item.FieldId  === "26" || item.FieldId  === "26")) {
          tor = item.Value;
        }
      }
      this.DynamicEntryPageInput.forEach((element) => {
        bunching(element);
      });
      const filteredArray: number[] = this.getPageNumbers(this.pageBunchBookmarkValues);
      let PageNumbers: number[];
      PageNumbers = filteredArray.map(str => Number(str));
      
      this.RecordNoUpdate.emit({
        index : 0,
        customNavTotalPages : filteredArray.length,
        CustomInputFieldProperties : "readonly",
        CustomInputFieldValue : tor,
        PageNumbers : PageNumbers
      }); 
     
    });

    this.highlightPopup.subscribe((data) => {   
        this.highlightBoxClick = true;
        this.DynamicEntryPageComponent.focusFieldByID(data.id);
        this.scrollToFieldEvent.emit(data.id);
    });

    // data capture
    this.currentUser = this.sessionStorage.getObj('currentUser');
  }
  
  findIndexByPageNo(records: any[], pageNo: number): number {
    if(records){
      for (let i = 0; i < records.length; i++) {
        if(records[i].PageNumbers){
          const pageNumbers = records[i].PageNumbers.split(',').map(Number);
          if (pageNumbers.includes(pageNo)) {
              return i;
          }
        }
        else{
          return -1;
        }
      }
    }
    return -1; // Return -1 if no record is found for the given page number
  }
  
  getPageNumbers(pageRange: string): number[] {
    const result: number[] = [];
    if(pageRange){
      // Split the input string by comma to get individual ranges or single page numbers
      const ranges = pageRange.split(',');
  
      // Iterate over each range
      ranges.forEach(range => {
          // Split each range by hyphen to get the start and end page numbers (if applicable)
          const [start, end] = range.split('-').map(Number);
  
          // If end is undefined, it means there's only one page number in the range
          if (end === undefined) {
              result.push(start);
          } else {
              // If both start and end are defined, add all page numbers in the range to the result array
              for (let i = start; i <= end; i++) {
                  result.push(i);
              }
          }
      });
    }

    return result;
  }

  /*
      *** Pdf Navigation Dynamic Data Event Call ***
  */

  pdfNavigateDynamicData(): void {
    this.DynamicEntryPageInput = [];
    if(this.ProcessingCardDetails && this.ProcessingCardDetails.length){
      let index: number = this.RecordNo - 1;
      console.log(index);
      let obj = this.ProcessingCardDetails[index];
      let reqObj: { caseId: string; ex_caseId: string; pageType: string; typeOfService: string; dateOfService: string; orgName: string; pageNo: string; torId: string; typeOfRecord: string;} = {
        "caseId": this.taskDetails['Case_ID'].toString(),
        "ex_caseId": this.taskDetails['External Case ID'] ? this.taskDetails['External Case ID'] : this.taskDetails['External Case Id'],
        "pageType": this.PageType,
        "typeOfService": obj.Typeofservice,
        "dateOfService": obj.DOS,
        "torId": obj.torId,
        "orgName": this.userDetail['OrganizationName'],
        "pageNo": obj.Pageno,
        "typeOfRecord": obj.typeOfRecord
      }
      this.sharedServiceService.GetDynamicInputFormDetail(reqObj).subscribe({
        next: (response: DynamicEntryInput) => {
            // Handle 'next' callback
            if(response){
              if (response[0].torId !== null &&  response[0].torId !== undefined && response[0].torId.trim() !== '') {
                this.ProcessingCardDetails[index].torId = response[0].torId;
                this.dynamicDataTorId = response[0].torId;
              }
              if(response[0].completeJson && response[0].completeJson.length){
                this.DynamicEntryPageInput = response[0].completeJson;
              }
            }
            else{
              this.PageWaitLoader = false;
            }
        },
        error: (error) => {
            // Handle 'error' callback
              this.PageWaitLoader = false;
        },
        complete: () => {
            // Handle 'complete' callback
            if(this.DynamicEntryPageInput && this.DynamicEntryPageInput.length > 0){
              this.idValueArray = [];
              this.showMRRMedicaldiv = true;
              //Get Old Page bunching page numbers
              const bunching = (item) => {
                if (item.Child && item.Child.length > 0) {
                  item.Child.forEach(bunching)
                }
                if (item.Label && (item.Label  === "Page Numbers" || item.Label  === "PageNumbers")) {
                  this.oldincludedPages = item.Value as string;
                  this.currentPageList = item.Value as string;
                }
                if (item.Label) {
                  const Obj = {
                    id: item.id,
                    originalValue: item.originalValue ? item.originalValue : ''
                  }
                  this.idValueArray.push(Obj);
                }
              }
              // bunching(this.DynamicEntryPageInput[0]);
              this.DynamicEntryPageInput.forEach((element) => {
                bunching(element);
              });
              // this.getPageNumbersForRecordNav();
            }
            // this.InitialiseData();
        }
      });
    }
  }

    /*
      *** Pdf Navigation Dynamic Data Event Call without TOR ***
  */

  pdfNavigateDynamicDataWithoutTOR(pageNo): void {
      this.DynamicEntryPageInput = [];
      let reqObj: { caseId: string; pageType: string; typeOfService: string; dateOfService: string; torId: string; orgName: string; pageNo: string } = {
        "caseId": this.taskDetails['Case_ID'].toString(),
        "pageType": this.PageType,
        "typeOfService": "",
        "dateOfService": "",
        "torId": "",
        "orgName": this.userDetail['OrganizationName'],
        "pageNo": pageNo
      }
      this.sharedServiceService.GetDynamicInputFormDetail(reqObj).subscribe({
        next: (response) => {
            // Handle 'next' callback
            if(response){
              if(response[0].completeJson && response[0].completeJson.length){
                this.DynamicEntryPageInput = response[0].completeJson;
                this.dynamicDataGroupId = response[0].torId;
                this.dynamicDataTorId = response[0].torId;
              }
              this.dynamicDataCount = response.length;
                  if(this.dynamicDataCount != 1) {
                    let obj = {
                      'totalCount': this.dynamicDataCount,
                      'currentIndex': 0,
                      'dataCollection': response,
                      'currentPageNoValue': pageNo
                    }
                    this.multipleRecordPages.emit(obj)
                  } else {
                    let obj = {
                      'totalCount': 1,
                      'currentIndex': 0,
                      'dataCollection': response,
                      'currentPageNoValue': pageNo
                    }
                    this.multipleRecordPages.emit(obj)
                  }
            }
            else{
              this.PageWaitLoader = false;
            }
        },
        error: (error) => {
            // Handle 'error' callback
              this.PageWaitLoader = false;
        },
        complete: () => {
            // Handle 'complete' callback
            if(this.DynamicEntryPageInput && this.DynamicEntryPageInput.length > 0){
              this.showMRRMedicaldiv = true;
              //Get Old Page bunching page numbers
              const bunching = (item) => {
                if (item.Child && item.Child.length > 0) {
                  item.Child.forEach(bunching)
                }
                if (item.Label && (item.Label  === "Page Numbers" || item.Label  === "PageNumbers")) {
                  this.oldincludedPages = item.Value as string;
                  this.currentPageList = item.Value as string;
                }
              }
              // bunching(this.DynamicEntryPageInput[0]);
              this.DynamicEntryPageInput.forEach((element) => {
                bunching(element);
              });
              // this.getPageNumbersForRecordNav();
            }
            // this.InitialiseData();
        }
      });
  }

  /*
      *** Dynamic Entry Page Select EventEmitter ***
  */
  getDynamicData(): void{
    // this.loaderService.showLoader();
    this.DynamicEntryPageInput = [];
    let reqObj: { caseId: string; pageType: string; typeOfService: string; dateOfService: string; orgName: string; pageNo: string; VaersId: string; torId: string; typeOfRecord: string; screenType: string; }
    if(this.PageType === 'Record Split'){
    if(this.ProcessingCardDetails && this.ProcessingCardDetails.length){
      let index: number = this.RecordNo - 1;
      let obj = this.ProcessingCardDetails[index];
      reqObj = {
        "caseId": this.taskDetails['Case_ID'],
        "pageType": this.PageType,
        "typeOfService": obj.Typeofservice,
        "dateOfService": obj.DOS,
        "torId": obj.torId,
        "orgName": this.userDetail['OrganizationName'],
        "pageNo": obj.Pageno,
        "VaersId": this.taskDetails['Case ID'],
        "typeOfRecord": obj.typeOfRecord,
        "screenType": ''
      }
      this.sharedServiceService.GetDynamicInputFormDetail(reqObj).subscribe({
        next: (response: DynamicEntryInput) => {
            // Handle 'next' callback
            if(response){
              if (response[0].torId !== null &&  response[0].torId !== undefined && response[0].torId.trim() !== '') {
                this.ProcessingCardDetails[index].torId = response[0].torId;
                this.dynamicDataTorId = response[0].torId;
              }
              if(response[0].completeJson && response[0].completeJson.length){
                this.DynamicEntryPageInput = response[0].completeJson;
              }
            }
            else{
              this.PageWaitLoader = false;
            }
        },
        error: (error) => {
            // Handle 'error' callback
              this.PageWaitLoader = false;
        },
        complete: () => {
          // this.loaderService.hideLoader();
            // Handle 'complete' callback
            if(this.DynamicEntryPageInput && this.DynamicEntryPageInput.length > 0){
              this.idValueArray = [];
              this.showMRRMedicaldiv = true;
              //Get Old Page bunching page numbers
              const bunching = (item) => {
                if (item.Child && item.Child.length > 0) {
                  item.Child.forEach(bunching)
                }
                if (item.Label && (item.Label  === "Page Numbers" || item.Label  === "PageNumbers")) {
                  this.oldincludedPages = item.Value as string;
                  this.currentPageList = item.Value as string;
                }
                if (item.Label) {
                  const Obj = {
                    id: item.id,
                    originalValue: item.originalValue ? item.originalValue : ''
                  }
                  this.idValueArray.push(Obj);
                }
              }
              // bunching(this.DynamicEntryPageInput[0]);
              this.DynamicEntryPageInput.forEach((element) => {
                bunching(element);
              });
              this.getPageNumbersForRecordNav();            
              console.log(this.idValueArray)}
              // this.InitialiseData();
          }
        });
      }
    }
    else if(this.PageType === 'Establish Case') {
      reqObj = {
        "caseId": this.taskDetails['Case_ID'],
        "pageType": this.PageType,
        "screenType": this.screenType,
        "typeOfService": "",
        "dateOfService": "",
        "orgName": this.userDetail['OrganizationName'],
        "pageNo": "",
        "VaersId": this.VaersID,
        "torId": '',
        "typeOfRecord": ''
      }
      this.sharedServiceService.GetDynamicInputFormDetail(reqObj).subscribe({
        next: (response: DynamicEntryInput) => {
            // Handle 'next' callback
            if(response[0]){
              if(response[0].completeJson && response[0].completeJson.length){
                this.DynamicEntryPageInput = response[0].completeJson;
                this.dynamicDataTorId = response[0].torId;
              }
            }
            else{
              this.PageWaitLoader = false;
            }
        },
        error: (error) => {
            // Handle 'error' callback
              this.PageWaitLoader = false;
        },
        complete: () => {
          // Handle 'complete' callback
          this.showMRRMedicaldiv = true;
          this.idValueArray = [];
          //set old new value
          const ChildElement = (item) => {
            if (item.Child && item.Child.length > 0) {
              item.Child.forEach(ChildElement)
            }
            if (item.Label) {
              const Obj = {
                id: item.id,
                originalValue: item.originalValue ? item.originalValue : ''
              }
              this.idValueArray.push(Obj);
            }
          }
          this.DynamicEntryPageInput.forEach((element) => {
            ChildElement(element);
          });
          // this.InitialiseData();
        }
      });
    }
    // this.InitialiseData();
  }

    /*
      *** Dynamic Entry Page Without TOR ***
  */
      getDynamicDataWithoutTOR(pageNo, torId): void{
        // this.loaderService.showLoader();
        this.DynamicEntryPageInput = []; 
        let reqObj: { caseId: string; pageType: string; typeOfService: string; dateOfService: string; orgName: string; pageNo: string; VaersId: string; torId: string; typeOfRecord: string; } = {
          "caseId": this.taskDetails['Case_ID'],
          "pageType": this.PageType,
          "typeOfService": "",
          "dateOfService": "",
          "torId": torId,
          "orgName": this.userDetail['OrganizationName'],
          "pageNo": pageNo,
          VaersId: this.taskDetails['Case_ID'],
          typeOfRecord: ''
        }
          this.sharedServiceService.GetDynamicInputFormDetail(reqObj).subscribe({
            next: (response) => {
                // Handle 'next' callback
                if(response){
                  if(response[0].completeJson && response[0].completeJson.length){
                    this.DynamicEntryPageInput = response[0].completeJson;
                    this.dynamicDataGroupId = response[0].torId;
                    this.dynamicDataTorId = response[0].torId;
                  }
                  this.dynamicDataCount = response.length;
                  if(this.dynamicDataCount != 1) {
                    let obj = {
                      'totalCount': this.dynamicDataCount,
                      'currentIndex': 0,
                      'dataCollection': response,
                      'currentPageNoValue': pageNo
                    }
                    this.multipleRecordPages.emit(obj)
                  } else {
                    let obj = {
                      'totalCount': 1,
                      'currentIndex': 0,
                      'dataCollection': response,
                      'currentPageNoValue': pageNo
                    }
                    this.multipleRecordPages.emit(obj)
                  }
                }
                else{
                  this.PageWaitLoader = false;
                }
            },
            error: (error) => {
                // Handle 'error' callback
                  this.PageWaitLoader = false;
            },
            complete: () => {
              // this.loaderService.hideLoader();
                // Handle 'complete' callback
                if(this.DynamicEntryPageInput && this.DynamicEntryPageInput.length > 0){
                  this.idValueArray = [];
                  this.showMRRMedicaldiv = true;
                  //Get Old Page bunching page numbers
                  const bunching = (item) => {
                    if (item.Child && item.Child.length > 0) {
                      item.Child.forEach(bunching)
                    }
                    if (item.Label && (item.Label  === "Page Numbers" || item.Label  === "PageNumbers")) {
                      this.oldincludedPages = item.Value as string;
                      this.currentPageList = item.Value as string;
                    }
                    if (item.Label) {
                      const Obj = {
                        id: item.id,
                        originalValue: item.originalValue ? item.originalValue : ''
                      }
                      this.idValueArray.push(Obj);
                    }
                  }
                  // bunching(this.DynamicEntryPageInput[0]);
                  this.DynamicEntryPageInput.forEach((element) => {
                    bunching(element);
                  });
                  this.getPageNumbersForRecordNav();            
                  console.log(this.idValueArray)
                }
                // this.InitialiseData();
            }
          });
        }
  
  /*
      *** Input Json Setting ***
  */
  InitialiseData(): void{
  }
  /*
      *** Dynamic Entry Page Select EventEmitter ***
  */
  DynamicEntryPageSelectEventEmitter(event: OutputObj){
    this.clearConfidenceTypeBtnSelections.emit(true);
    if(!this.highlightBoxClick) {
      if(event.Dimensions.length == 0){
        this.filehighlighter.emit(event.Dimensions);
      }else{
        if(event.Dimensions.length) {
          event.Dimensions.map(item=>{
            item.fieldName = event.Label
            item.id = event.id
          })
        }
        let Color;
        if(event.ConfidenceType === 'High') {
          Color ='#3CC47C';
        } else if(event.ConfidenceType === 'Medium') {
          Color ='#e8a837';
        } else if(event.ConfidenceType === 'Low') {
          Color ='#dc3546';
        }
        this.duplicateHighlightArray = JSON.stringify(_.cloneDeep(event.Dimensions));
        let highlightValue = JSON.parse(this.duplicateHighlightArray); 
        highlightValue.map(item=> {
          item.Height += 0.01;
          item.Left -= 0.005;
          item.Top -= 0.005;
          item.Width += 0.01;
          item.color = Color;
        })
        this.filehighlighter.emit(highlightValue);
      }
    } else {
      this.highlightBoxClick = false;
    }
  }

  /*
     *** Dynamic Entry Page Save EventEmitter ***
  */
  DynamicEntryPageSaveEventEmitter(event: OutputObj){
    let oldPageNumbers: number[] = [];
    if(this.oldincludedPages){
      oldPageNumbers = this.getPageNumbers(this.oldincludedPages);

      // let oldincludedPageStringArray: string[] =  this.getPageNumbers(this.oldincludedPages);
      // oldPageNumbers = oldincludedPageStringArray.map(str => Number(str));

    }
    if(this.includedPages === undefined) {
      this.includedPages = [];
    }
    if(this.ProcessingCardDetails && this.ProcessingCardDetails.length){
      let index: number = this.RecordNo - 1;
      let obj = this.ProcessingCardDetails[index];
      let FieldSaveList = [];
      if(event.FieldType === "Checkbox" && event.Attributes && event.Attributes.length){
        event.Attributes.forEach(Attr => {
          let FieldSaveObj: { FieldName: string;  FieldValue: string;  PageBunchedcsv: number[];  oldPageBunchcsv: number[];  primaryPage: string; } = {
            FieldName: Attr.Label,
            FieldValue: Attr.Value.toString(),
            PageBunchedcsv: this.isPageBunchSaveCompleted ? this.includedPages: [],
            oldPageBunchcsv: this.isPageBunchSaveCompleted ? oldPageNumbers: [],
            primaryPage: this.isPageBunchSaveCompleted ? this.includedPages[0].toString(): ''
          };
          FieldSaveList.push(FieldSaveObj);
        });
      }
      else{
        let FieldSaveObj: { FieldName: string;  FieldValue: string;  PageBunchedcsv: number[];  oldPageBunchcsv: number[];  primaryPage: string; } = {
          FieldName: event.Label,
          FieldValue: event.Value.toString(),
          PageBunchedcsv: this.isPageBunchSaveCompleted ? this.includedPages: [],
          oldPageBunchcsv: this.isPageBunchSaveCompleted ? oldPageNumbers: [],
          primaryPage: this.isPageBunchSaveCompleted ? this.includedPages[0].toString(): ''
        };
        FieldSaveList.push(FieldSaveObj);
      }
    }
  }

  /*
      *** Dynamic Entry Page Custom EventEmitter ***
  */
  DynamicEntryPageCustomEventEmitter(event: CustomOutput){
    //Page Bunching Logics
    if(event.CustomEvent === 'SlideToggle'){
      if(event.Type === 'Page Bunching'){
        if(event.Data && event.Data.length){
          event.Data.forEach((element: OutputObj) => {
            if(event.Value){
              this.isPageBunchSaveCompleted = false;
              let obj: {pageValues: number[]; trigger: string; } = {
                    pageValues : this.getPageNumbers(element.Value as string),
                trigger : 'Start'
              };
              this.pageBunchingEmitter.emit(obj);
              // this.getMedicalRecord();
            }
            else{
              this.isPageBunchSaveCompleted = true;
              let obj: {pageValues: number[]; trigger: string; } = {
                "pageValues" : [],
                "trigger" : 'Stop'
              }
              this.pageBunchingEmitter.emit(obj);
              this.includedPages = this.bookmarkPageValue;
              if(this.bookmarkPageValue && this.bookmarkPageValue.length){
                let ranges: string[] = this.getRanges(this.bookmarkPageValue);
                this.pageBunchBookmarkValues = ranges.toString();
              }
              // if(event.Data.length){
              //   event.Data.forEach((outputObj: OutputObj) => {
              //     this.DynamicEntryPageSaveEventEmitter(outputObj);
              //   });
              // }
            };
          });
        }
      }
    }
    if(event.CustomEvent === 'Button'){
      //VAERS ID Verfication
      if(event.Type === 'Verify'){
        if(event.Data.length){
          let OutPut: { isVerified: string; "Patient Demographics": { "Patient Name": any; DOB: any; Age: any; Gender: any; }; } = {
            isVerified: '',
            "Patient Demographics": { 
              "Patient Name": '',
              DOB: '',
              Age: '', 
              Gender: '' 
            }
          };
          let reqObj: { caseId: string; pageType: string; VaersId: string; } = {
            caseId: this.taskDetails['Case_ID'].toString(),
            pageType: this.PageType,
            VaersId: event.Value as string
          }
          this.sharedServiceService.verifyVAERSID(reqObj).subscribe({
            next: (response) => {
              // Handle 'next' callback
              OutPut = response;
            },
            error: (error) => {
              // Handle 'error' callback
            },
            complete: () => {
              this.loaderService.hideLoader();
              // Handle 'complete' callback
              if(OutPut.isVerified === 'Y'){
                
                const dialogRef3 = this.dialog.open(PopupSuccessComponent, {
                  // panelClass: '',
                  data: <IDynamicDialogConfig>{
                    title: 'Success',
                    titleFontSize:'20',
                    type : '',
                    titlePosition: 'left',
                    contentPosition: 'left',
                    dialogContentFontSize: '15',
                    dialogContent: 'VAERS ID Matched and is Tagged with the Document. You can confirm after verifying the details.',
                    additionalButtons: [],
                    showAcceptButton: true,
                    acceptButtonTitle: 'Okay',
                    buttonPosition: 'right',
                    declineButtonTitle: '' ,
                    caseDetail: '',
                    fileDetails: '',
                    showClose: false
                    },
                    height: 'auto',
                    width: '450px'
                });
                dialogRef3.disableClose = true;
            
                dialogRef3.afterClosed().subscribe(result => {
                  let headerObj = {
                    Label: "Case Id",
                    Value: event.Value
                  }
                  this.VaersID = headerObj.Value;
                  this.screenType = 'view';
                  this.getDynamicData();
                  // this.pageHeaderUpdate.emit(headerObj);
                  this.sharedServiceService.setManageListingHeaderData(headerObj);
                });
              }
              else{
                const dialogRef = this.dialog.open(PopupErrorComponent, {
                  width: '450px',
                  panelClass: 'no-results-modal',
                  data: <IDynamicDialogConfig>{
                    title: 'No Results',
                    titleFontSize:'20',
                    dialogContent: 'Entered VAERS ID does not exist. Please try searching with demographics or check the VAERS ID you entered.',
                    dialogContentFontSize: '15',
                    acceptButtonTitle: 'Okay',
                    titlePosition: 'left',
                    contentPosition : 'left',
                    buttonPosition : 'right',
                    showClose : false,
                    showAdditionalButtons: false,
                    showAcceptButton: true,
                    showDeclineButton: false
                  }
                });
                dialogRef.disableClose = true;

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
          });
        }
        else{
          this.loaderService.hideLoader();
        };
      }
      //Back to Search
      if(event.Type === 'Back to Search'){
        this.screenType = 'edit';
        this.getDynamicData();
      }
    }
  }
  /*
      *** Dynamic Entry Page Bulk Save EventEmitter ***
  */
  DynamicEntryPageBulkSaveEventEmitterOld(event: bulkSaveOutput){
    if(this.PageType === 'Record Split'){
      // if(this.ProcessingCardDetails && this.ProcessingCardDetails.length){
        let reqObj: { caseId: string; pageType: string; typeOfService: string; dateOfService: string; pageNo: string; completeJson: InputObj[]; orgName: string; torId: string; task: string; user: string; typeOfRecord: string; } = {
          caseId: this.taskDetails['Case_ID'].toString(),
          pageType: this.PageType,
          completeJson: event.CompleteJson,
          orgName: this.userDetail['OrganizationName'],
          typeOfService: '',
          dateOfService: '',
          pageNo: event.Page.toString(),
          torId: event.torId,
          task: this.TemplateName,
          user: this.userDetail.Name,
          typeOfRecord: event.TOR
        }
        this.sharedServiceService.bulkSaveDynamicDetail(reqObj).subscribe({
        next:  (response) => {
          if(response){
            response.lastPage = event.lastPage;
          }
          this.saveRecordDetailsData.emit(response);
        },
        error:  (error) => {
        },
        complete:()=>{
          this.loaderService.hideLoader();
          if(this.DynamicEntryPageComponent){
            // this.DynamicEntryPageComponent.setOldValue();
          }
          if(this.PageType === 'Record Split'){
            // this.bulkSaveCompleteFlag.emit(event.TOR);
          }
          if(event.Type == 'Complete'){
            this.closeCompleteEventEmitter.emit('Complete');
          }
        }});
      // }
    }
    if(this.PageType === 'Establish Case'){
        let reqObj: { caseId: string; pageType: string; typeOfService: string; dateOfService: string; pageNo: string; completeJson: InputObj[]; orgName: string; torId: string; task: string; user: string; typeOfRecord: string; } = {
          caseId: this.taskDetails['Case_ID'].toString(),
          pageType: this.PageType,
          completeJson: event.CompleteJson,
          orgName: this.userDetail['OrganizationName'],
          typeOfService: '',
          dateOfService: '',
          torId: '',
          pageNo: '',
          task: this.TemplateName,
          user: this.userDetail.Name,
          typeOfRecord: ''
        }
        this.sharedServiceService.bulkSaveDynamicDetail(reqObj).subscribe({
        next:  (response) => {},
        error:  (error) => {
        },
        complete:()=>{
          this.loaderService.hideLoader();
          if(this.DynamicEntryPageComponent){
            // this.DynamicEntryPageComponent.setOldValue();
          }
          if(event.Type == 'Complete'){
            this.closeCompleteEventEmitter.emit('Complete');
          }
        }});
    }
  }
  DynamicEntryPageBulkSaveEventEmitter(event: bulkSaveOutput){
    if(this.PageType === 'Record Split'){
      let lastPage: string = '';
      let resp
      let reqObj: { caseId: any; dateOfService: string; pageCSV: any; torId: string; taskTemplateName: string; typeOfRecord: string; } ={
          caseId: this.taskDetails['Case_ID'].toString(),
          dateOfService  : event.DOS,
          pageCSV : event.PageNumbers,
          torId: event.torId,
          taskTemplateName : this.TemplateName,
          typeOfRecord: event.TOR
        }
        this.sharedServiceService.bulkSaveDynamicDetail(reqObj).subscribe({
        next:  (response) => {
          if(response){
            lastPage = response.LastPage;
            response.lastPage = event.lastPage;
            this.dynamicDataTorId = response.TorId;
            resp = response;
          }
        },
        error:  (error) => {
        },
        complete:()=>{
          this.loaderService.hideLoader();
          if(event.Type != 'Complete'){
            let TotalPage = this.CaseDetails?.Pages?.toString();
            const dialogRef2 = this.dialog.open(PopupSuccessComponent, {
              // panelClass: '',
              data: <IDynamicDialogConfig>{
                title: 'Success',
                titleFontSize:'20',
                type : '',
                titlePosition: 'left',
                contentPosition: 'left',
                dialogContentFontSize: '15',
                dialogContent: (lastPage == TotalPage || this.FromPage == 'popup') ? 'Saved successfully.' : 'Saved successfully. You will now be redirected to the next untagged page.',
                additionalButtons: [],
                showAcceptButton: true,
                acceptButtonTitle: 'Okay',
                buttonPosition: 'right',
                declineButtonTitle: '' ,
                caseDetail: '',
                fileDetails: '',
                showClose: false
                },
                height: 'auto',
                width: '450px',
                // position: {
                //     top: `${ 24 }px`
                //   },
            });
            dialogRef2.disableClose = true;
        
            dialogRef2.afterClosed().subscribe(result => {
              this.saveRecordDetailsData.emit(resp);
              if(this.DynamicEntryPageComponent){
                // this.DynamicEntryPageComponent.setOldValue();
              }
              if(this.PageType === 'Record Split'){
                // this.bulkSaveCompleteFlag.emit(event.TOR);
              }
              if(event.Type == 'Complete'){
                this.closeCompleteEventEmitter.emit('Complete');
              }
            });
          }
          else if (event.Type == 'Complete') {
              let reqObj = {
                CaseId: this.taskDetails['Case_ID']
              }
              let untagged: boolean = true;
              this.sharedServiceService.GetCaseUntaggedPages(reqObj).subscribe({
              next:  (response) => {
                if(response?.length == 0){
                  untagged = false
                }
                else{
                  untagged = true
                }
              },
              error:  (error) => {},
              complete:()=>{
                const dialogRef = this.dialog.open(PopupTemplateComponent, {
                  width: '500px',
                  data: <IDynamicDialogConfig>{
                    title: 'Alert',
                    titleFontSize:'20',
                    dialogContent: untagged ? 'There are untagged Pages in the Document. Would you like to continue.' : 'Are you sure to complete Record Split?',
                    dialogContentFontSize: '15',
                    acceptButtonTitle: 'Okay',
                    declineButtonTitle: 'Cancel',
                    titlePosition: 'left',
                    contentPosition : 'left',
                    buttonPosition : 'right',
                    showClose : false,
                    showDeclineButton: true
                  }
                });
                dialogRef.disableClose = true;
            
                dialogRef.componentInstance.buttonClicked.subscribe(action => {
                  switch (action) {
                    case 'accept':
                      this.loaderService.showLoader();
                        this.closeCompleteEventEmitter.emit("Complete");
                      break;
                    case 'decline':
            
                      break;
                  }
                });
              }})
          }
          else{
            this.saveRecordDetailsData.emit(resp);
            if(this.DynamicEntryPageComponent){
              // this.DynamicEntryPageComponent.setOldValue();
            }
            if(this.PageType === 'Record Split'){
              // this.bulkSaveCompleteFlag.emit(event.TOR);
            }
            if(event.Type == 'Complete'){
              this.closeCompleteEventEmitter.emit('Complete');
            }
          }
        }
      });
    }
  }
  /*
      *** Dynamic Entry Page Close & Complete EventEmitter ***
  */
  DynamicEntryPageCloseCompleteEventEmitter(event: string): void {
    this.closeCompleteEventEmitter.emit(event);
  }

  /*
      *** sequence To Range ***
  */
  getRanges(array: number[]): string[] {
    let ranges: string[] = [], rstart: string, rend: string;
    for (let i = 0; i < array.length; i++) {
      rstart = array[i].toString();
      rend = rstart;
      while (array[i + 1] - array[i] == 1) {
        rend = array[i + 1].toString();
        i++;
      }
      ranges.push(rstart == rend ? rstart+'' : rstart + '-' + rend);
    }
    return ranges;
  }
  /*
      *** get Page Numbers for pdf viewer record navigation ***
  */
  getPageNumbersForRecordNav(): void{
    if(this.oldincludedPages){
      let PageNumbers: number[] = this.getPageNumbers(this.oldincludedPages);
      this.PageNumbersForRecordNav.emit(PageNumbers);
      this.PageWaitLoader = false;
    }
  }
  /*
      ***Close mat auto complete on container close ***
  */
  onContainerScroll(scrollOffset): void{
    if(this.DynamicEntryPageComponent){
      this.DynamicEntryPageComponent.onContainerScroll(scrollOffset)
    }
  }

 /*
      *** Dynamic Entry Page Custom Generic EventEmitter ***
  */
  DynamicEntryPageCustomGenericEventEmitter(event: CustomGenericEvent){
    if(event !== null && event !== undefined){
      if(event.Type === 'PageBunching'){
        let obj: {pageValues: number[]; trigger: string; } = {
          pageValues : this.getPageNumbers(event.Data as string),
          trigger : 'Update'
        };
        this.currentPageList = event.Data as string;
        this.pageBunchingEmitter.emit(obj);
      } else if(event.Type === 'ConfirmVaersId') {
        
        let OutPut: { isVerified: string; "Patient Demographics": { "Patient Name": any; DOB: any; Age: any; Gender: any; }; } = {
          isVerified: '',
          "Patient Demographics": { 
            "Patient Name": '',
            DOB: '',
            Age: '', 
            Gender: '' 
          }
        };
        let reqObj: { caseId: string; pageType: string; VaersId: string; } = {
          caseId: this.taskDetails['Case_ID'].toString(),
          pageType: this.PageType,
          VaersId: event.Data['VAERS ID']
        }
        this.sharedServiceService.verifyVAERSID(reqObj).subscribe({
          next: (response) => {
            // Handle 'next' callback
            OutPut = response;
          },
          error: (error) => {
            // Handle 'error' callback
          },
          complete: () => {
            this.loaderService.hideLoader();
            // Handle 'complete' callback
            if(OutPut.isVerified === 'Y'){
              const dialogRef3 = this.dialog.open(PopupSuccessComponent, {
                // panelClass: '',
                data: <IDynamicDialogConfig>{
                  title: 'Success',
                  titleFontSize:'20',
                  type : '',
                  titlePosition: 'left',
                  contentPosition: 'left',
                  dialogContentFontSize: '15',
                  dialogContent: 'VAERS ID Matched and is Tagged with the Document. You can confirm after verifying the details.',
                  additionalButtons: [],
                  showAcceptButton: true,
                  acceptButtonTitle: 'Okay',
                  buttonPosition: 'right',
                  declineButtonTitle: '' ,
                  caseDetail: '',
                  fileDetails: '',
                  showClose: false
                  },
                  height: 'auto',
                  width: '450px'
              });
              dialogRef3.disableClose = true;
          
              dialogRef3.afterClosed().subscribe(result => {
                let headerObj = {
                  Label: "Case Id",
                  Value: event.Data['VAERS ID']
                }
                this.VaersID = event.Data['VAERS ID'];
                this.sharedServiceService.setManageListingHeaderData(headerObj);
                this.screenType = 'view';
                this.getDynamicData();
              });
            }
          }
        });
        // this.getDynamicData();
      }
    }
  }
  /*
      *** get Unique PageNumbers for page bunching ***
  */
  getUniquePageNumbers(input: string): number[] {
    // Regex pattern to match page numbers and ranges
    const pattern = /\d{1,3}(?:-\d{1,3})?/g;

    // Extract page numbers and ranges from the input string
    const matches = input.match(pattern);

    // Initialize an empty array to store unique page numbers
    const uniquePageNumbers: number[] = [];

    // Iterate over the matches and extract unique page numbers
    if (matches) {
        matches.forEach(match => {
            const [start, end] = match.split("-").map(Number);
            if (end) {
                // If it's a range, add all numbers within the range
                for (let i = start; i <= end; i++) {
                    if (!uniquePageNumbers.includes(i)) {
                        uniquePageNumbers.push(i);
                    }
                }
            } else {
                // If it's a single page number, add it to the array
                if (!uniquePageNumbers.includes(start)) {
                    uniquePageNumbers.push(start);
                }
            }
        });
    }

    // Sort the array of unique page numbers in ascending order
    uniquePageNumbers.sort((a, b) => a - b);

    return uniquePageNumbers;
  }
  
  /*
      *** convert To Range ***
  */
  convertToRange(pageNumbers: number[]): string {
      const uniquePageNumbers = Array.from(new Set(pageNumbers));

      const ranges = [];
      let start = uniquePageNumbers[0];
      for (let i = 1; i < uniquePageNumbers.length; i++) {
          if (uniquePageNumbers[i] !== uniquePageNumbers[i - 1] + 1) {
              ranges.push(start === uniquePageNumbers[i - 1] ? `${start}` : `${start}-${uniquePageNumbers[i - 1]}`);
              start = uniquePageNumbers[i];
          }
      }
      ranges.push(start === uniquePageNumbers[uniquePageNumbers.length - 1] ? `${start}` : `${start}-${uniquePageNumbers[uniquePageNumbers.length - 1]}`);
      return ranges.join(',');
  }
  stopPageBunching(){
    this.isPageBunchSaveCompleted = true;
    let obj: {pageValues: number[]; trigger: string; } = {
      "pageValues" : [],
      "trigger" : 'Stop'
    }
    this.pageBunchingEmitter.emit(obj);
  }
  saveRecordDetailsEmitter(event) {
    this.saveRecordDetailsData.emit(event);
  }

  DynamicEntryPageRecordNoUpdate(value) {
    this.RecordNoUpdate.emit(value);
  }

 }
