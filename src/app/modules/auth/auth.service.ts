import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environments';
import { SessionStorageService } from 'src/app/shared/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  currentUser: string;
  private formData: FormData = new FormData();
  public userInactive = new BehaviorSubject(undefined);
  
  constructor(private http: HttpClient, private router: Router,
    private location: Location, private storage: SessionStorageService) { }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }


  //  * Login Service
  login(username: string, password: string, overRide: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<any>(
      `${environment.api}authentication/validate`,
      {
        UserId: username,
        Password: password,
        overrideExistingUser: overRide
      },
      httpOptions
    )
      .pipe(
        map(user => {
          if (user) {
            this.loggedIn.next(true);
            // this.storage.setObj('currentUser', user);
            // localStorage.setItem('currentUser', JSON.stringify(user));
          }
          return user;
        })
      );
  }

  //  * SignUp Service
  // * To Save User Details
  register(userdata) {
    const httpOptions = {
      headers: new HttpHeaders({
        //'Content-Type':  'application/json'
      })
    };

    return this.http
      .post<any>(`${environment.apiService}/SaveUser`, userdata, httpOptions)
      .pipe(
        map(Saveuser => {
          return Saveuser;
        })
      );
  }
  generateOtpDetails(reqObj) {
    const httpOptions = {
      headers: new HttpHeaders({
        //'Content-Type':  'application/json'
      })
    };

    return this.http
      .post<any>(`${environment.api}authentication/IsValidUser`, reqObj, httpOptions)
      .pipe(
        map(OTPdetails => {
          return OTPdetails;
        })
      );
  }
  resetPasswordDetails(reqObj) {
    const httpOptions = {
      headers: new HttpHeaders({
        //'Content-Type':  'application/json'
      })
    };

    return this.http
      .post<any>(`${environment.api}authentication/ResetPassword`, reqObj, httpOptions)
      .pipe(
        map(resetpassword => {
          return resetpassword;
        })
      );
  }
}