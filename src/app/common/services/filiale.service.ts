import { Injectable } from '@angular/core';
import { Filiale } from './../../mocker/filiale';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { EnvironmentUrlService } from './environment-url.service';
import { NotifierService } from 'angular-notifier';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root'
})
export class FilialeService {
  private readonly notifier: NotifierService;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService, notifierService: NotifierService,
              private loggingservice: LoggingService) {
    this.notifier = notifierService;
  }

  private createCompleteRoute( envAddress: string) {
    return `${envAddress}/filiale`;
  }
  /** GET: get filiales from server */
  getFiliali(): Observable<Filiale[]> {
    return this.http.get<Filiale[]>(this.createCompleteRoute(this.envUrl.urlAddress))
    .pipe(
      tap(),
      catchError(this.handleError<Filiale[]>('getFiliale', []))
    );
  }
  /** POST: add a new filiale to the server */
  addFiliale(filiale: Filiale): Observable<Filiale> {
  return this.http.post<Filiale>(this.createCompleteRoute(this.envUrl.urlAddress), filiale, this.httpOptions).pipe(
      tap((newFiliale: Filiale) => this.loggingservice.info(`added filiale with id=${newFiliale.id}`,
      this.createCompleteRoute(this.envUrl.urlAddress)).subscribe()));
  }
     /** PUT: update the filiale on the server */
  updateFiliale(filiale: Filiale): Observable<any> {
    const id = filiale.id;
    const url = `${this.createCompleteRoute(this.envUrl.urlAddress)}/${id}`;
    return this.http.put(url, filiale, this.httpOptions).pipe(
      tap(_ => {
        this.loggingservice.info(`updated filiale with id=${filiale.id}`,
        this.createCompleteRoute(this.envUrl.urlAddress)).subscribe();
        this.notifier.notify('success', `Filiale ${filiale.nomeFiliale} modificato!`);
    }));
  }
  /** DELETE: delete filiale from server */
  deleteFiliale(filiale: Filiale): Observable<Filiale> {
    // const id = typeof contact === 'number' ? contact : contact.id;
    const id = filiale.id;
    const url = `${this.createCompleteRoute(this.envUrl.urlAddress)}/${id}`;

    return this.http.delete<Filiale>(url, this.httpOptions).pipe(
      tap(_ => {
        this.loggingservice.info(`filiale ${filiale.nomeFiliale} deleted with id=${id}`,
        this.createCompleteRoute(this.envUrl.urlAddress)).subscribe();
        this.notifier.notify('success', `Filiale ${filiale.nomeFiliale} eliminato!`);
      })
    );
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.loggingservice.error(`error filiale=${error.message}`, this.createCompleteRoute(this.envUrl.urlAddress)).subscribe();
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
