import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { EnvironmentUrlService } from './environment-url.service';
import { map } from 'rxjs/operators';
import { User } from '../../mocker/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // tslint:disable-next-line: no-unused-expression
  private currentUserSubject: BehaviorSubject<string>;
  public currentUser: Observable<string>;
  private loggedIn = new BehaviorSubject<boolean>(this.hasUser());
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) {
    this.currentUserSubject = new BehaviorSubject<string>(sessionStorage.getItem('user'));
    this.currentUser = this.currentUserSubject.asObservable();
   }

  private createCompleteRoute( envAddress: string) {
    return `${envAddress}/user`;
  }
  get isLogged(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }
  hasUser() {
    return !!sessionStorage.getItem('user');
  }
  login(user: User) {
    const username = user.username;
    const password = user.password;
    return this.http.post<any>(this.createCompleteRoute(this.envUrl.urlAddress), {username, password}, this.httpOptions).pipe(
    map((returnUser) => {
        this.currentUserSubject.next(returnUser.username);
        sessionStorage.setItem('user', returnUser.username);
        this.loggedIn.next(true);
        return returnUser.username;
       })); // ,

    }
    logout() {
      sessionStorage.clear();
      this.currentUserSubject.next(null);
      this.loggedIn.next(false);
    }
}
