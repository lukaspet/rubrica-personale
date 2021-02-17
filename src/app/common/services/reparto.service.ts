import { Reparto } from './../../mocker/reparto';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { EnvironmentUrlService } from './environment-url.service';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root'
})
export class RepartoService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService,  private loggingservice: LoggingService) {}

  private createCompleteRoute( envAddress: string) {
    return `${envAddress}/reparto`;
  }
  /** GET: get reparto from server */
  getReparto(): Observable<Reparto[]> {
    return this.http.get<Reparto[]>(this.createCompleteRoute(this.envUrl.urlAddress))
    .pipe(
      tap(),
      catchError(this.handleError<Reparto[]>('getReparto', []))
    );
  }
  /** POST: add a new reparto to the server */
  addReparto(reparto: Reparto): Observable<Reparto> {
  return this.http.post<Reparto>(this.createCompleteRoute(this.envUrl.urlAddress), reparto, this.httpOptions).pipe(
      tap((newReparto: Reparto) => this.loggingservice.info(`added reparto with id=${newReparto.id}`,
      this.createCompleteRoute(this.envUrl.urlAddress)).subscribe()));
  }
     /** PUT: update the reparto on the server */
  editReparto(reparto: Reparto): Observable<any> {
    const id = reparto.id;
    const url = `${this.createCompleteRoute(this.envUrl.urlAddress)}/${id}`;
    return this.http.put(url, reparto, this.httpOptions).pipe(
      tap(_ => this.loggingservice.info(`updated reparto with id=${reparto.id}`,
      this.createCompleteRoute(this.envUrl.urlAddress)).subscribe()));
  }
  /** DELETE: delete reparto from server */
  deleteReparto(reparto: Reparto | number): Observable<Reparto> {
    const id = typeof reparto === 'number' ? reparto : reparto.id;
    const url = `${this.createCompleteRoute(this.envUrl.urlAddress)}/${id}`;

    return this.http.delete<Reparto>(url, this.httpOptions).pipe(
      tap(_ => this.loggingservice.info(`deleted reparto with id=${id}`,
      this.createCompleteRoute(this.envUrl.urlAddress)).subscribe()));
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
