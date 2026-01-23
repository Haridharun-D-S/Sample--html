import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../auth.service';
import { SessionStorageService } from 'src/app/shared/services/storage.service';
import { SharedServiceService } from 'src/app/shared/services/sharedservice.service';
import { EncryptionService } from 'src/app//shared/services/encryption.service';
import { CommonLoaderService } from 'src/app/Standalone/common-loader/common-loader.service';
import { IDynamicDialogConfig, PopupTemplateComponent } from '../../shared-module/popup-template/popup-template.component';
import { MatDialog } from '@angular/material/dialog';
import { PopupCustomComponent } from '../../shared-module/popup-custom/popup-custom.component';
import { PopupSuccessComponent } from '../../shared-module/popup-success/popup-success.component';
declare let $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  forgetPasswordform: FormGroup;
  resetPasswordform: FormGroup;
  @ViewChild('totalpage')
  totalpage: ElementRef;
  @ViewChild('checkboxes')
  checkboxes: ElementRef;
  signUpOrgid: number;
  public submitted: boolean = false;
  public submitted1: boolean = false;
  @ViewChild('login') login: ElementRef;
  @ViewChild('forgetpassword') forgetpassword: ElementRef;
  public userLogin: boolean;
  loginLoader = false;
  sendClicked: boolean;
  invalidSignup: any;
  sharedmodel: any;
  loginCredentials: any;
  invalidMessage: any;
  passwordShow: boolean;
  pagesObj:any;
  analyticsObj:any
  analyticsObj1:any
  orgPage:any
  orgDashboard:any
  existingUser: boolean = false;
  userForgetPassword: boolean;
  passwordResetShow: boolean;
  passwordResetConfirmShow: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private storage: SessionStorageService,
    private userAccess: SharedServiceService,
    private encryptDecrypt: EncryptionService,
    private loaderService: CommonLoaderService,
    private dialog: MatDialog
  ) {
    $(document).keydown(function (event:any) {
      if (event.keyCode === 27) {
        document.getElementById("userNameFocus").focus();
      }
    });
  }

  ngOnInit() {
    this.loaderService.showLoader();
    this.userAccess.setManageListingHeaderData(null);
    document.getElementById("userNameFocus").focus();
    this.userLogin = true;
    this.userForgetPassword = false;
    // * Login
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    // Forget Password
    this.forgetPasswordform = this.formBuilder.group({
      userNameForget: ['', [Validators.required, Validators.minLength(2)]],
      passwordForget: ['', [Validators.required, Validators.minLength(4)]],
      reEnterPasswordForget: ['', [Validators.required]],
    }, { validators: this.MustMatch('passwordForget', 'reEnterPasswordForget') });
    // * Show Login
    this.loaderService.hideLoader();
    this.showLogin();
    this.loginForm.reset();
    this.userAccess.sessionTimeoutNotification.subscribe((err) => {
      if (err) {
        (<any>$('#sessionExpiredPop')).modal('show');
      }
    })
  }


  onSubmit(loginval: any, overRide:any) {
    this.loaderService.showLoader();
    this.submitted = true;
    this.loginLoader = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      this.loaderService.hideLoader();
      this.loginLoader = false;
      return;
    }
    this.loginCredentials = loginval

    if (overRide == 'N') {
      // encrypt user credentials
      loginval.username = this.encryptDecrypt.encrypt(loginval.username);
      loginval.password = this.encryptDecrypt.encrypt(loginval.password);
    }

    this.storage.setItem('unameEncrypt',loginval.username);
    this.storage.setItem('passEncrypt',loginval.password);

    if (loginval.username && loginval.password) {
      this.authenticationService.
        login(loginval.username, loginval.password, overRide).subscribe(
         {
          next : (response:any) => {
            this.storage.setItem('OtherRoles', 'N');
            this.userAccess.activeToken.next(response.Token)
            const sessionCaseIds:any = [];
            this.storage.setObj('currentUser', response);
            this.storage.setObj('sessionCaseIds', sessionCaseIds);
            this.userAccess.getUserAccess().subscribe(
              {
                next : (ress:any) => {
                  this.sharedmodel = ress;
                  this.storage.setObj('sharedModel', JSON.stringify(this.sharedmodel));
                  this.storage.setItem('WrokQueue_From','login');
                  this.router.navigate(['/dashboard'])
                },
                error : (err) =>{
                },
                complete :()=>{
                }
              }            
            )
            this.authenticationService.userInactive.next(undefined)
            this.userAccess.sessionTimeoutNotification.next(undefined)

          },
          error : (error:any) => {
 
             if (error.error.message === 'Your account has been locked due to 5 unsuccessful login attempts. Please contact your system administrator to activate the account.' || error.error.message === 'Invalid Credentials' || error.error.message === 'Invalid Login Credentials.' || error.error.message === 'Account locked out due to invalid attempts' || error.error.message === 'Your account is not activated yet. Please contact your system administrator.') {
               this.loginLoader = false;
               this.storage.setItem('OtherRoles', 'N');
               this.invalidMessage = error.error.message
               this.openDialog(error.error.message, error.error.Code, 'Ok')
             }
             if (error.error.message !== 'Invalid Credentials' && error.error.Code === 'VF101') {
              this.storage.setItem('OtherRoles', 'N');
               this.loginLoader = false;
               this.invalidMessage = error.error.message
               this.openDialog(error.error.message, error.error.Code, 'Ok')
             }
             if (error.error.Code === 'ND101') {
              this.storage.setItem('OtherRoles', 'N');
               this.loginLoader = false;
               let message: string ='An existing session has been detected using the same login credentials. Please click Cancel Login to cancel this login, or Continue to keep this session active.'
               this.openExistingDialog(message, error.error.Code,'Continue', 'Cancel Login')
             }
             if (error.error.Code === 'ND007') {
              this.storage.setItem('OtherRoles', 'Y');
              this.loginLoader = false;         
              this.openCustomDialog(error.error.UserDetails)
            }
           },
           complete : ()=>{
             // completed
           } 
         });
     } else {
       document.getElementById("invalidLoginFocus").focus();
       this.loginLoader = false;
     }
   }
 
   /*****Popup for Error Msg*****/
 
   openExistingDialog(errorMsg, errorCode, acceptBtnName, declineBtnName) {
     const dialogRef = this.dialog.open(PopupTemplateComponent, {
       width: '500px',
       data: <IDynamicDialogConfig>{
         title: 'Alert',
         titleFontSize:'20',
         dialogContent: errorMsg,
         dialogContentFontSize: '15',
         acceptButtonTitle: acceptBtnName,
         declineButtonTitle: declineBtnName,
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
           console.log('User clicked "Yes"');
           this.overrideLogin();
           break;
         case 'decline':
           console.log('User clicked "No"');
           break;
       }
     });
   }
 
   openDialog(errorMsg, errorCode, acceptBtnName) {
     const dialogRef = this.dialog.open(PopupTemplateComponent, {
       width: '500px',
       data: <IDynamicDialogConfig>{
         title: 'Alert',
         titleFontSize:'20',
         dialogContent: errorMsg,
         dialogContentFontSize: '15',
         acceptButtonTitle: acceptBtnName,
         titlePosition: 'left',
         contentPosition : 'left',
         buttonPosition : 'right',
         showClose : false,
         showDeclineButton: false
       }
     });
     dialogRef.disableClose = true;
 
     dialogRef.componentInstance.buttonClicked.subscribe(action => {
       switch (action) {
           case 'Ok':
             console.log('User clicked "Ok"');
             break;
       }
     });
   }
   openCustomDialog(UserDetails) {
    this.storage.setObj('currentUserMyself', UserDetails);
    this.storage.setObj('currentUser', UserDetails);
    let assignedRoles = [];
    this.userAccess.GetAssignedRolesForUser().subscribe({
      next: (val) => {
        assignedRoles = val;
        this.storage.setObj('currentUserAdmin', assignedRoles);
      },
      error: (_error) => {
        this.loginForm.reset();},
      complete:()=>{
        let currentUser = this.storage.getObj('currentUser');
        if (currentUser && assignedRoles && assignedRoles.length > 0) {
          const stringsArray: string[] = assignedRoles.map(obj => obj.userName);
          const dialogRef = this.dialog.open(PopupCustomComponent, {
            data: <IDynamicDialogConfig>{
              title: 'Select Role',
              type: 'SelectRole',
              titleFontSize: '20',
              showClose: true,
              additionalButtons: [
                {
                  label: 'As Admin (' + stringsArray[0] + ')',
                  action: 'Admin'
                },
                {
                  label: 'As Myself (' + currentUser.Name + ')',
                  action: 'Myself'
                }
              ],
              titlePosition: 'left',
              contentPosition: 'center',
              buttonPosition: 'right',
              showAdditionalButtons: true,
              showAcceptButton: false,
              showDeclineButton: false
            },
            height: 'auto',
            width: '500px'
          });
          dialogRef.disableClose = true;
  
          dialogRef.componentInstance.buttonClicked.subscribe(action => {
            switch (action) {
                case 'Admin':
                  const userNameArray: string[] = assignedRoles.map(obj => obj.userName);
                  const roleNameArray: string[] = assignedRoles.map(obj => obj.roleName);
                  const roleIdArray: string[] = assignedRoles.map(obj => obj.roleId);
                  UserDetails.RoleId = roleIdArray[0];
                  UserDetails.RoleName = roleNameArray[0];
                  this.proceedLogin(UserDetails);
                  break;
                case 'Myself':
                  this.proceedLogin(UserDetails);
                  break;
            }
          });
        }
      }
    });
   }
   proceedLogin(response){
    this.userAccess.activeToken.next(response.Token)
            const sessionCaseIds:any = [];
            this.storage.setObj('currentUser', response);
            this.storage.setObj('sessionCaseIds', sessionCaseIds);
            this.userAccess.getUserAccess().subscribe(
              {
                next : (ress:any) => {
                  this.sharedmodel = ress;
                  this.storage.setObj('sharedModel', JSON.stringify(this.sharedmodel));
                  this.storage.setItem('WrokQueue_From','login');
                  this.router.navigate(['/dashboard'])
                },
                error : (err) =>{
                },
                complete :()=>{
                }
              }            
            )
            this.authenticationService.userInactive.next(undefined)
            this.userAccess.sessionTimeoutNotification.next(undefined)
   }

  get loginF() {
    return this.loginForm.controls;
  }

  togglePassLogin() {
    const password = document.getElementById('password') as HTMLInputElement;
    if (password.type === 'password') {
      password.type = 'text';
      this.passwordShow = true;
    } else {
      password.type = 'password';
      this.passwordShow = false;
    }
  }  

  showLogin() {
    setTimeout(() => {
      if(this.login){
        this.login.nativeElement.style.display = 'block';
      }
      if(this.forgetpassword){
        this.forgetpassword.nativeElement.style.display = 'none';
      }
    }, 100);
  }
  loginFocusOnCancel() {
    document.getElementById("userNameFocus").focus();
    this.loginForm.reset()
  }
  overrideLogin() {
    const loginValue = this.loginCredentials
    this.onSubmit(loginValue, 'Y')
    this.existingUser = false;
  }

  forgetPassword() {
    this.sendClicked = false;
    this.forgetPasswordform.enable();
    this.forgetPasswordform.reset(); 
    const usernameValue = this.loginForm.get('username').value;
    this.forgetPasswordform.patchValue({
        userNameForget: usernameValue
    });
    this.userForgetPassword = true;
    this.userLogin = false;
    this.passwordShow = false;
    if (this.userForgetPassword === true) {
      this.login.nativeElement.style.display = 'none';
      this.forgetpassword.nativeElement.style.display = 'block';
    }
  }
  resetPassword() {
    this.loaderService.showLoader();
    if (this.forgetPasswordform.valid) {
      let reqObj = {
        "UserName": this.forgetPasswordform.value.userNameForget,
        "Password": this.forgetPasswordform.value.passwordForget,
        "ConfirmPassword": this.forgetPasswordform.value.reEnterPasswordForget
      }

      this.authenticationService.resetPasswordDetails(reqObj).subscribe(
        {
          next : (value:any) => {
          },
          error : (error) =>{
            if (error.code === "RC500") {
              this.openDialog("Session timed out, Please contact Administrator", error.Code, 'Okay')
            }
            else {
              this.invalidSignup = error.message;
              this.openDialog(error.message, error.Code, 'Okay');
            }
          },
          complete :()=>{
            this.loaderService.hideLoader();
            const dialogRef2 = this.dialog.open(PopupSuccessComponent, {
              // panelClass: '',
              data: <IDynamicDialogConfig>{
                title: 'Success',
                titleFontSize:'20',
                type : '',
                titlePosition: 'left',
                contentPosition: 'left',
                dialogContentFontSize: '15',
                dialogContent: 'Password reset successfully. You can now login with your new password.',
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
            dialogRef2.disableClose = true;
        
            dialogRef2.afterClosed().subscribe(result => {
              this.loginForm.patchValue({
                password: ''
              });
              this.showLogin();
            });
          }
        });
    }
  }
  MustMatch(controlName: string, matchingControlName: string) {
    return (control: AbstractControl): ValidationErrors | null  => {
      const input = control.get(controlName);
      const matchingInput = control.get(matchingControlName);
  
      if (matchingInput.errors && !matchingInput.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return null;
      }
  
      // set error on matchingControl if validation fails
      if (input.value !== matchingInput.value) {
        matchingInput.setErrors({ mustMatch: true });
        return ({ mustMatch: true });
      } else {
        matchingInput.setErrors(null);
        return null;
      }
    }
  }
  togglePassReset() {
    var passwordReset = document.getElementById('passwordReset') as HTMLInputElement;
    if (passwordReset.type === 'password') {
      passwordReset.type = 'text';
      this.passwordResetShow = true;
    } else {
      passwordReset.type = 'password';
      this.passwordResetShow = false;
    }
  }

  togglePassResetConfirm() {
    var passwordResetConfirm = document.getElementById('passwordResetConfirm') as HTMLInputElement;
    if (passwordResetConfirm.type === 'password') {
      passwordResetConfirm.type = 'text';
      this.passwordResetConfirmShow = true;
    } else {
      passwordResetConfirm.type = 'password';
      this.passwordResetConfirmShow = false;
    }
  }

}
