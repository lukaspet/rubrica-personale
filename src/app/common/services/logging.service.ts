import { AuthService } from './auth.service';
import { Log } from './../../mocker/log';
import { Injectable } from '@angular/core';
import { EnvironmentUrlService } from './environment-url.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { formatDate } from '@angular/common';
import { catchError, tap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  private currentUser: string;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService, private authservice: AuthService,
              private datePipe: DatePipe) {
     this.authservice.currentUser.subscribe(x => this.currentUser = x);
   }

  private createCompleteRoute( envAddress: string) {
    return `${envAddress}/logfrontend`;
  }

  debug(message: string, url: string)   {
    const log: Log = {
      message,
      user: this.currentUser,
      // datetime: this.datePipe.transform( new Date(), 'dd-MM-yyyy HH:mm:ss'),
      eventType: 'debug',
      url,
    };
    return this.http.post<any>(this.createCompleteRoute(this.envUrl.urlAddress), log, this.httpOptions);
  }
  errorNoUser(error: any, url: string) {
    const log: Log = {
      message: error.message,
      user: null,
      // datetime: this.datePipe.transform( new Date(), 'dd-MM-yyyy HH:mm:ss'),
      eventType: 'httpError',
      url,
    };
    return this.http.post<any>(this.createCompleteRoute(this.envUrl.urlAddress), log, this.httpOptions);
  }
  httperror(error: any, url: string) {
    const log: Log = {
      message: error.error,
      user: this.currentUser,
      // datetime: this.datePipe.transform( new Date(), 'dd-MM-yyyy HH:mm:ss'),
      eventType: 'httpError',
      url,
    };
    return this.http.post<any>(this.createCompleteRoute(this.envUrl.urlAddress), log, this.httpOptions);
  }

  error(error: any, url: string) {
    const log: Log = {
      message: error.error,
      user: this.currentUser,
      // datetime: this.datePipe.transform( new Date(), 'dd-MM-yyyy HH:mm:ss'),
      eventType: 'error',
      url,
    };
    return this.http.post<any>(this.createCompleteRoute(this.envUrl.urlAddress), log, this.httpOptions);
  }
  warn(message: string, url: string)  {
    const log: Log = {
      message,
      user: this.currentUser,
      // datetime: this.datePipe.transform( new Date(), 'dd-MM-yyyy HH:mm:ss'),
      eventType: 'warning',
      url,
    };
    return this.http.post<any>(this.createCompleteRoute(this.envUrl.urlAddress), log, this.httpOptions);
  }

  info(message: string, url: string) {
    const log: Log = {
      message,
      user: this.currentUser,
      // datetime: this.datePipe.transform( new Date(), 'yyyy-MM-dd HH:mm:ss'),
      eventType: 'info',
      url,
    };
    return this.http.post<any>(this.createCompleteRoute(this.envUrl.urlAddress), log, this.httpOptions);
  }

  createLogStatement(level, message) {
    const SEPARATOR = '';
    const date = this.getCurrentDate();
    return '[' + level + ']' + SEPARATOR + date + SEPARATOR + message;
  }

  getCurrentDate() {
    const now = new Date();
    return '[' + now.toLocaleString() + ']';
  }
  /** POST: log to the server */
  Log(log: any): Observable<any> {
    // this.http.post(this.createCompleteRoute(this.envUrl.urlAddress), log, this.httpOptions);
    return this.http.post<any>(this.createCompleteRoute(this.envUrl.urlAddress), log, this.httpOptions)
    .pipe(
      tap((newLog: Log) => console.log(`added company with id=${newLog}`)),
      catchError(this.handleError<Log>('addLog'))
      );
    }
    private handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
        if (error.status === 0) {
        }
        // if (error.status === 400) {
        //   this.notifier.notify('warning', error.error);
        // }
        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead

        // TODO: better job of transforming error for user consumption
        this.log(`${operation} failed: ${error.message}`);

        // Let the app keep running by returning an empty result.
        return of(result as T);
      };
    }
    /** Log a OfficeService message with the MessageService */
    private log(message: string) {
    }
}
