import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EncryptionService } from './encryption.service';
import { SessionStorageService } from './storage.service';
import { environment } from 'src/environments/environments';
import { HttpService } from './http.service';
import { sharedConfig } from './shared-url.config';
//import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SharedServiceService {

  public sessionTimeoutNotification = new BehaviorSubject(undefined);

  public activeToken = new BehaviorSubject(undefined);
  public chartareaclicked = new BehaviorSubject(undefined);
  public initiateSalesBtn = new BehaviorSubject(false);
  public breadcrumName = new BehaviorSubject(undefined);
  public dashboardItems = new BehaviorSubject(undefined);
  public loadOriginalState = new BehaviorSubject(false);
  public dashDelIcon = new BehaviorSubject('false');
  public dashsearch = new BehaviorSubject('false');
  public initiateBtn = new BehaviorSubject(false);
  public rowDetails = new BehaviorSubject(undefined);
  public measureDetailsToEda1 = new BehaviorSubject(undefined);
  public gridHeightForProfilerModal = new BehaviorSubject(false);
  public rowDetailsForParticipant = new BehaviorSubject(undefined);
  public dashboardid = new BehaviorSubject(undefined);
  public excelDownloadStatus = new BehaviorSubject(undefined);
  public workqueueTypeChange = new BehaviorSubject(undefined);
  public appMenuChange = new BehaviorSubject(undefined);
  public backToFormConfig = new BehaviorSubject(undefined);
  public fetchProfileLevels = new BehaviorSubject(undefined); // To Fetch data from dispatch event on every chart click
  public appIdForRegistry = new BehaviorSubject(undefined);
  public chartValue = new BehaviorSubject(undefined);
  public participantDetailData = new BehaviorSubject(undefined);
  public claimDetailData = new BehaviorSubject(undefined);

  userAccessId;
  currentUser;
  //errorMessageConfigData = errorMessageConfig;
  constructor(private http: HttpService, private storage: SessionStorageService, private encryptDecrypt: EncryptionService) {
  }

  public searchFilter = new BehaviorSubject(undefined);
  public claim = new BehaviorSubject<boolean>(false);
  public claimIdSub = new BehaviorSubject(undefined);
  public claimTabActive = new BehaviorSubject(undefined);
  public componentaccess = new BehaviorSubject(undefined);
  public appBreadCrumName = new BehaviorSubject(undefined);
  public appIcon = new BehaviorSubject(undefined);
  public userInactive = new BehaviorSubject(undefined);
  urlSalesForce: string;

  public manageListingHeaderData = new BehaviorSubject(undefined);
  manageListingHeaderData$ = this.manageListingHeaderData.asObservable();
  setManageListingHeaderData(changedValue) {
    this.manageListingHeaderData.next(changedValue);
  }
  getManageListingHeaderData() {
    return this.manageListingHeaderData.asObservable();
  }
  
  getUserAccess() {
    this.currentUser = this.storage.getObj('currentUser');
    this.currentUser.OrgId = this.encryptDecrypt.decrypt(environment.DECRYPTKEY, this.currentUser.OrgId);
    this.currentUser.UserId = this.encryptDecrypt.decrypt(environment.DECRYPTKEY, this.currentUser.UserId);
    return this.http.post(sharedConfig.EndPoint.GetUserAccess);
  }

  GetCaseAllocationAndTempAdminDetails(){
    return this.http.post(sharedConfig.EndPoint.GetCaseAllocationAndTempAdminDetails)
  }

  GetTeamMemberDetails(){
    return this.http.post(sharedConfig.EndPoint.GetTeamMemberDetails)
  }

  SaveCaseAllocationAndTempAdminDetails(reqObj){
    return this.http.post(sharedConfig.EndPoint.SaveCaseAllocationAndTempAdminDetails, reqObj)
  }

  GetAssignedRolesForUser(){
    return this.http.post(sharedConfig.EndPoint.GetAssignedRolesForUser)
  }
  getTaskDetails(reqObj) {
    return this.http.post(sharedConfig.EndPoint.getTaskDetails, reqObj);
  }
  UpdateCaseBulkStatus(reqObj) {
    return this.http.post(sharedConfig.EndPoint.UpdateCaseBulkStatus, reqObj);
  }
  getCaseDetailsValue(reqObj) {
    return this.http.post(sharedConfig.EndPoint.getCaseDetailsValue, reqObj);
  }
  getBatchDetailsValue(reqObj) {
    return this.http.post(sharedConfig.EndPoint.getBatchDetailsValue, reqObj);
  }
  getWorkQueueFilterLookupValues(reqobj) {
    return this.http.post(sharedConfig.EndPoint.getWorkQueueFilterLookupValues, reqobj);
  }
  multipleTaskAssign(reqObject) {
    return this.http.post(sharedConfig.EndPoint.assignMultipleTask, reqObject);
  }
  getLookupsForFilter(reqObj) {
    return this.http.post(sharedConfig.EndPoint.getLookupsForFilter, reqObj);
  }
  getloadWidgetData(dashboardId: string) {
    return this.http.get(sharedConfig.EndPoint.GetloadWidgetData + '/' + dashboardId);
  }
  getUserQueue(reqobj) {
    return this.http.post(sharedConfig.EndPoint.getUserQueue, reqobj);
  }
  verifyVAERSID(reqObj) {
    return this.http.post(sharedConfig.EndPoint.getVerifyVaersId, reqObj);
  }
  bulkSaveDynamicDetail(reqObj) {
    return this.http.post(sharedConfig.EndPoint.bulkSaveDynamicDetail, reqObj);
  }
  GetMatchedVaersData(reqObj) {
    return this.http.post(sharedConfig.EndPoint.GetMatchedVaersData, reqObj);
  }
  UpdateRecordReviewStatus(reqObj) {
    return this.http.post(sharedConfig.EndPoint.UpdateRecordReviewStatus, reqObj);
  }
  GetGridData(reqObj) {
    return this.http.post(sharedConfig.EndPoint.GetGridData, reqObj);
  }
  UploadSplittedFilesToOutputFolder(requestOBJ) {
    return this.http.post(sharedConfig.EndPoint.UploadSplittedFilesToOutputFolder, requestOBJ);
  }
  
  GetSummaryOutputDetails(requestOBJ){
    return this.http.post(sharedConfig.EndPoint.GetSummaryOutputDetails, requestOBJ);
  }
  GenerateSummaryOutputDocument(requestOBJ) {
    return this.http.post(sharedConfig.EndPoint.GenerateSummaryOutputDocument, requestOBJ);
  }  
  getRecordDetails(reqObj){
    return this.http.post(sharedConfig.EndPoint.getRecordDetails, reqObj)
  }
  GetCaseAuditTrailDetails(reqObj){
    return this.http.post(sharedConfig.EndPoint.GetCaseAuditTrailDetails, reqObj)
  }
  DeleteCases(reqObj){
    return this.http.post(sharedConfig.EndPoint.DeleteCases, reqObj)
  }
  GetCaseUntaggedPages(reqObj){
    return this.http.post(sharedConfig.EndPoint.GetCaseUntaggedPages, reqObj)
  }
  GetCaseDislikedTorIdList(reqObj){
    return this.http.post(sharedConfig.EndPoint.GetCaseDislikedTorIdList, reqObj)
  }
  GetDynamicInputFormDetail(reqObj) {
    return this.http.post(sharedConfig.EndPoint.GetDynamicInputFormDetail, reqObj);
  }
  getBatchDetails(reqObj) {
    return this.http.post(sharedConfig.EndPoint.getBatchDetails, reqObj);
  }
  getTORLookups() {
    return this.http.post(sharedConfig.EndPoint.getTORLookups);
  }
  getTiffUrl(reqObj) {
    return this.http.post(sharedConfig.EndPoint.getTiffUrl, reqObj);
  }
  getPresignedTiffUrl(reqObj) {
    return this.http.post(sharedConfig.EndPoint.getPresignedTiffUrl, reqObj);
  }
  completeAudit(reqObj) {
    return this.http.post(sharedConfig.EndPoint.completeAuditForCase, reqObj);
  }
  updateRecordDetails(reqObj) {
    return this.http.post(sharedConfig.EndPoint.updateRecordDetails, reqObj);
  }
  abortBatch(reqObj) {
    return this.http.post(sharedConfig.EndPoint.abortBatch, reqObj);
  }
  archiveBatch(reqObj) {
    return this.http.post(sharedConfig.EndPoint.archiveBatch, reqObj);
  }
  getAllCaseDetails(reqObj) {
    return this.http.post(sharedConfig.EndPoint.getAllCaseDetails, reqObj);
  }
  reprocessBatch(reqObj) {
    return this.http.post(sharedConfig.EndPoint.reprocessBatch, reqObj);
  }
  BulkCompleteAuditForCases(reqObj) {
    return this.http.post(sharedConfig.EndPoint.BulkCompleteAuditForCases, reqObj);
  }
  downloadBatch(reqObj) {
    return this.http.post(sharedConfig.EndPoint.downloadBatch, reqObj);
  }
  SaveDynamicInputFormDetail(reqObj) {
    return this.http.post(sharedConfig.EndPoint.SaveDynamicInputFormDetail, reqObj);
  }
  GetGridMetadata(reqObj) {
    return this.http.post(sharedConfig.EndPoint.GetGridMetadata, reqObj);
  }
  getAssignReassignCasesLookups(reqObj) {
    return this.http.post(sharedConfig.EndPoint.getAssignReassignCasesLookups, reqObj);
  }
  updateBulkCaseAssignee(reqObj) {
    return this.http.post(sharedConfig.EndPoint.updateBulkCaseAssignee, reqObj);
  }
  updateCaseStatus(reqObj) {
    return this.http.post(sharedConfig.EndPoint.updateCaseStatus, reqObj);
  }

  multipleCaseAssign(reqObject) {
    return this.http.post(sharedConfig.EndPoint.assignMultipleCase, reqObject);
  }

  updateBulkCasePriority(reqObject) {
    return this.http.post(sharedConfig.EndPoint.updateBulkCasePriority, reqObject);
  }

  GetCaseAssignee(reqObject) {
    return this.http.post(sharedConfig.EndPoint.GetCaseAssignee, reqObject);
  }

  InitiateFolderIntake() {
    return this.http.post(sharedConfig.EndPoint.InitiateFolderIntake);
  }

  newReprocessBatch(reqObj: any) {
    return this.http.post(sharedConfig.EndPoint.newReprocessBatch, reqObj)
  }

  getDynamicFieldDetailsForTOR(reqObj: any) {
    return this.http.post(sharedConfig.EndPoint.getDynamicFieldDetailsForTOR, reqObj)
  }
}
