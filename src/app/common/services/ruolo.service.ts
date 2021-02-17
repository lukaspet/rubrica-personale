import { Injectable } from '@angular/core';
import { Ruolo } from './../../mocker/ruoli';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { EnvironmentUrlService } from './environment-url.service';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root'
})
export class RuoloService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService,  private loggingservice: LoggingService) {}

  private createCompleteRoute( envAddress: string) {
    return `${envAddress}/ruolo`;
  }
  /** GET: get ruoli from server */
  getRuoli(): Observable<Ruolo[]> {
    return this.http.get<Ruolo[]>(this.createCompleteRoute(this.envUrl.urlAddress))
    .pipe(
      tap(),
      catchError(this.handleError<Ruolo[]>('getFiliale', []))
      );
  }
  /** POST: add a new ruolo to the server */
  addFiliale(ruolo: Ruolo): Observable<Ruolo> {
  return this.http.post<Ruolo>(this.createCompleteRoute(this.envUrl.urlAddress), ruolo, this.httpOptions).pipe(
      tap((newRuolo: Ruolo) => this.loggingservice.info(`added ruolo with id=${newRuolo.id}`,
      this.createCompleteRoute(this.envUrl.urlAddress)).subscribe()));
  }
     /** PUT: update the ruolo on the server */
  editFiliale(ruolo: Ruolo): Observable<any> {
    const id = ruolo.id;
    const url = `${this.createCompleteRoute(this.envUrl.urlAddress)}/${id}`;
    return this.http.put(url, ruolo, this.httpOptions).pipe(
      tap(_ => this.loggingservice.info(`updated ruolo with id=${ruolo.id}`,
      this.createCompleteRoute(this.envUrl.urlAddress)).subscribe()));
  }
  /** DELETE: delete ruolo from server */
  deletePart2(ruolo: Ruolo | number): Observable<Ruolo> {
    const id = typeof ruolo === 'number' ? ruolo : ruolo.id;
    const url = `${this.createCompleteRoute(this.envUrl.urlAddress)}/${id}`;

    return this.http.delete<Ruolo>(url, this.httpOptions).pipe(
      tap(_ => this.loggingservice.info(`deleted ruolo with id=${id}`,
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
