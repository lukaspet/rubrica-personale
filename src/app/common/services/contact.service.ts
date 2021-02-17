import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Contact } from '../../mocker/contacts';
import { catchError, tap } from 'rxjs/operators';
import { EnvironmentUrlService } from './environment-url.service';
import { NotifierService } from 'angular-notifier';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly notifier: NotifierService;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService, notifierService: NotifierService,
              private loggingservice: LoggingService) {
    this.notifier = notifierService;
   }
  private createCompleteRoute( envAddress: string) {
    return `${envAddress}/contact`;
  }
  /** GET all contacts. Will 404 if id not found */
  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.createCompleteRoute(this.envUrl.urlAddress))
    .pipe(
      tap(),
      catchError(this.handleError<Contact[]>('getContacts'))
    );
  }
   /** POST: add a new contact to the server */
  addContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.createCompleteRoute(this.envUrl.urlAddress), contact, this.httpOptions).pipe(
      tap((newContact: Contact) => {
      this.loggingservice.info(`added contact ${newContact.nome} ${newContact.cognome}`,
      this.createCompleteRoute(this.envUrl.urlAddress)).subscribe();
      this.notifier.notify('success', `Contatto ${newContact.nome} inserito correnttamente!`);
    }));
  }
  /** PUT: update the contact on the server */
  updateContact(contact: Contact): Observable<any> {
    const id = contact.id;
    const url = `${this.createCompleteRoute(this.envUrl.urlAddress)}/${id}`;
    return this.http.put(url, contact, this.httpOptions).pipe(
      tap(_ => {
        this.loggingservice.info(`updated contact with id=${contact.id}`,
        this.createCompleteRoute(this.envUrl.urlAddress)).subscribe();
        this.notifier.notify('success', `Contatto ${contact.nome} ${contact.cognome} modificato!`);
      }),
      catchError(this.handleError<Contact>('updateContact'))
    );
  }
  deleteContact(contact: Contact): Observable<Contact> {
    // const id = typeof contact === 'number' ? contact : contact.id;
    const id = contact.id;
    const url = `${this.createCompleteRoute(this.envUrl.urlAddress)}/${id}`;

    return this.http.delete<Contact>(url, this.httpOptions).pipe(
      tap(_ => {
        this.loggingservice.info(`contact ${contact.nome} deleted with id=${id}`,
        this.createCompleteRoute(this.envUrl.urlAddress)).subscribe();
        this.notifier.notify('success', `Contatto ${contact.nome} ${contact.cognome} eliminato!`);
      })
    );
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error.status === 0) {
        this.notifier.hideOldest();
        this.notifier.notify('warning', 'No response from server. Check connection!');
      }
      // if (error.status === 400) {
      //   this.notifier.notify('warning', error.error);
      // }
      this.loggingservice.error(`error contact=${error.message}`, this.createCompleteRoute(this.envUrl.urlAddress)).subscribe();
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  /** Log a DocumentService message with the MessageService */
  private log(message: string) {
    console.log(message);
  }
}
