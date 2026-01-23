import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SharedServiceService } from 'src/app/shared/services/sharedservice.service';
import { CommonLoaderService } from 'src/app/Standalone/common-loader/common-loader.service';
import { MatDialog } from '@angular/material/dialog';
import { IDynamicDialogConfig, PopupErrorComponent } from 'src/app/modules/shared-module/popup-error/popup-error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    public notification: BehaviorSubject<string> = new BehaviorSubject(null);
    public sessionTimeoutNotification = new BehaviorSubject(undefined);
    constructor(private sharedService: SharedServiceService, 
        private loaderService: CommonLoaderService,
        public dialog: MatDialog
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            this.loaderService.hideLoader();
            this.notification.next(err);
            if(!request.url.match( 'api/authentication/validate')) {
                const dialogRef = this.dialog.open(PopupErrorComponent, {
                    width: '450px',
                    data: <IDynamicDialogConfig>{
                    title: 'Error',
                    titleFontSize:'20',
                    dialogContent : 'Temporary unavailable. Contact hosting administrator',
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
                        break;
                    case 'decline':
                        break;
                    case 'later':
                        break;
                        case 'save':
                        break;
                    }
                });
            }
            if (err.error.Code === 'ND100') {
                this.sharedService.sessionTimeoutNotification.next(err);
            }
            const error = err;
            return throwError(error);
        }))
    }

    notify() {
        return this.notification;
    }
}
