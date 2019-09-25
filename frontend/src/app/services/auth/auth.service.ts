import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import * as moment from "moment";
import {not} from "rxjs/internal-compatibility";
import {User} from "../../models/user";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";
import {mapEntry} from "@angular/compiler/src/output/map_util";
import {map, catchError} from "rxjs/operators";
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
 

  login_url = "http://localhost:8080/login";  // http://localhost:4200/backend/login";
  register_url = "http://localhost:8080/register";
  email_check_url = "http://localhost:8080/exists";
  register_email_url = "http://localhost:8080/users/addNewUser";
  send_pwd_url = "http://localhost:8080/confirm/";
  profile_information_url = "http://localhost:8080/profile/information/";
  add_child_url =  "http://localhost:8080/profile/addChild";
  change_profile_information_url =  "http://localhost:8080/profile"

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser$: Observable<User>;
  private isLoggedInSubject: BehaviorSubject<boolean>;
  public isLoggedIn$: Observable<boolean>;

  constructor(private http: HttpClient) {
    // TODO check jwt validity before loading user, if not call logout
    if(this.checkLoginState()){
      this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem("user")));
      this.isLoggedInSubject = new BehaviorSubject<boolean>(true);
    }
    else{
      this.currentUserSubject = new BehaviorSubject<User>(null);
      this.isLoggedInSubject = new BehaviorSubject<boolean>(false);
    }

    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable();
  }

  login(email: string, password: string){
    let self = this;
    return this.http.post<any>(this.login_url, {"email": email, "password": password}).pipe(
      map( user => {
        return self.setSession(user)
      })
    );
    /*return this.http.post<any>(this.login_url, {"email": email, "password": password}).subscribe(
      res => {
        self.setSession(res);
      }, (err) => null );*/
  }

  register(email: string, pass:string, repass:string){
    let self = this;
    return this.http.post<any>(this.register_url, {"email" : email, "pass" : pass, "repass" : repass});
          //.pipe(catchError(this.handleError));
  }

  registerEmail(email:string){
    return this.http.post<any>(this.register_email_url, {"email" : email});
  }

  sendPassword(pass:string, repass:string,token:string){
    console.log("invio pwd to " +this.send_pwd_url+token);
    return this.http.post<any>(this.send_pwd_url+token, { "pass" : pass, "repass" : repass}).pipe(catchError(err=>this.handleError(err)));
  }


  private handleError(error: HttpErrorResponse) {
   // debugger
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}` +
        `message was: ${error.error.message}`);
    }
    // return an observable with a user-facing error message
    return throwError(error.status);
  };

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token_id");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("not_before");
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  // TODO: VERIFY correct functioning
  checkLoginState(){
    return moment().isBefore(this.getExpiration());
  }

  getCurrentUser(): User{
    return this.currentUserSubject.value;
  }

  getExpiration(){
    const expirationDate = localStorage.getItem("expires_at");
    return moment(expirationDate);
  }


  setSession(authResult){
    const arr = authResult["jwt"].split(".");
    const userInfo = JSON.parse(atob(arr[1]));
    const exp = userInfo["exp"];
    const nbf = userInfo["nbf"];

    let user = new User(userInfo["user_id"], userInfo["email"]);

    // add seconds to moment 0 ( 1 Jan 1970 00:00:00)
    const expiresAt = moment(0).add(exp, "second");
    const notBefore = moment(0).add(nbf, "second");
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token_id", authResult["jwt"]);
    localStorage.setItem("expires_at", expiresAt.toISOString());
    localStorage.setItem("not_before", notBefore.toISOString());

    this.currentUserSubject.next(user);
    this.isLoggedInSubject.next(true);
    return this.currentUser$;
  }

  checkExists(email: string){
    return this.http.post<boolean>(this.email_check_url, {"email": email});
  }

  getProfileinformation(current:User) {
    let em = current['_email'];
    console.log("request to : " + this.profile_information_url+ em);

    return this.http.get<any>(this.profile_information_url + em).pipe(catchError(err=>this.handleError(err)));;
  }

  addChild(email:string,name:string,surname:string,birthday:string, gender:string){
    return this.http.post<any>(this.add_child_url,{
      "email":email,
      "name" : name,
      "surname" : surname,
      "birthday" : birthday,
      "gender" : gender
    })
  }
  editProfileInformation(email:string,name:string,surname:string,address:string, telephone:string){
    return this.http.post<any>(this.change_profile_information_url,{
      "email":email,
      "name" : name,
      "surname" : surname,
      "address" : address,
      "telephone" : telephone
    })
  }
}