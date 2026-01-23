import { Injectable, inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/modules/auth/auth.service';
import { SessionStorageService } from 'src/app/shared/services/storage.service';
@Injectable({
  providedIn: 'root'
})
class PermissionsService {

  constructor(private router: Router, 
    private authService: AuthenticationService, private storage: SessionStorageService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.isLoggedIn.pipe(
      take(1),
      map((_isLoggedIn: boolean) => {
        const aa = this.storage.getObj('currentUser');
        if(aa !== null) {
        if (aa.length == 0) {
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
          return false;
        }
      }
      else if(aa === null)
        {
          this.router.navigate(['/login']);
          return false;
        }
      
        return true;
      })
    );
  }
}
export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(PermissionsService).canActivate(next, state);
}