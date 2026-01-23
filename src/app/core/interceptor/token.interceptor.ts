import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse
} from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { SessionStorageService } from 'src/app/shared/services/storage.service';
import { EncryptionService } from 'src/app/shared/services/encryption.service';
import { Observable } from 'rxjs';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    
    constructor(private storage: SessionStorageService,private encryptDecrypt: EncryptionService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let modifiedRequest: HttpRequest<any>
        let currentUser = this.storage.getObj('currentUser');
        if (currentUser) {
            /**
             * decrypt
             */
            let orgId = this.encryptDecrypt.decrypt('DecryptRevoKey11', currentUser.OrgId);
            let userId = this.encryptDecrypt.decrypt('DecryptRevoKey11', currentUser.UserId);
            let roleId = this.encryptDecrypt.decrypt('DecryptRevoKey11', currentUser.RoleId);
            /**
            * encrypt
            */
            currentUser.OrgId = this.encryptDecrypt.encrypt(orgId);
            currentUser.UserId = this.encryptDecrypt.encrypt(userId);
            currentUser.RoleId = this.encryptDecrypt.encrypt(roleId);
            modifiedRequest = request.clone({
                setHeaders: {
                    AuthenticationKey: 'rLlXWI/a5qzdF6n/Neu+u/+NDH1l4+GUSobr7ZIh2NDCZo/wsmsnlKRrD4HGNOwxu0tbP3HF5K0GklqWoAGDow==',
                    'userId' : (currentUser !== null) ? currentUser.UserId : "",
                    'RoleId': (currentUser !== null) ? currentUser.RoleId : "",
                    'token': (currentUser !== null) ? currentUser.Token : "",
                    'OrgGuid': (currentUser !== null) ? currentUser.OrgGuid : "",
                    'OrgId': (currentUser !== null) ? currentUser.OrgId : "",
                    'Userid': (currentUser !== null) ? currentUser.UserId : "",
                }
            });
        }
        else {
            modifiedRequest = request;
        }
        return next.handle(modifiedRequest).pipe(tap(
            (event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    const token = event.headers.get('id');
                    if (token !== 'null') {
                        this.storage.setItem('activeToken', token)
                    }
                }
            }
        ));
    }
}
