import { QrImage } from './../../mocker/qr-image';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { EnvironmentUrlService } from './environment-url.service';
import { NotifierService } from 'angular-notifier';

@Injectable({
  providedIn: 'root'
})
export class QrimageService {
  private readonly notifier: NotifierService;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService, notifierService: NotifierService) {
    this.notifier = notifierService;
  }

  private createCompleteRoute( envAddress: string) {
    return `${envAddress}/docfiles`;
  }
  /** POST: add a new file to the server */
  addFile(id: number, file: File): Observable < QrImage > {
    // insert data to docFileAdd that is unnecesary need better solution!
    const docFileAdd: QrImage = { contactId: id, imageName: 'null', imageId: 0};
    const formData: FormData = new FormData();
    // append document attributes
    formData.append('contactId', docFileAdd.contactId.toString());
    // append singleFile
    formData.append('file', file);
    return this.http.post<QrImage>(this.createCompleteRoute(this.envUrl.urlAddress), formData).pipe(
      tap((newDocFile: QrImage) => this.log('added file with id=${newDocFile.imageId}')),
      catchError(this.handleError<QrImage>('addFile'))
    );
  }
  deleteImage(image: QrImage): Observable < QrImage > {
    const id = typeof image === 'number' ? image : image.imageId;
    const url = `${this.createCompleteRoute(this.envUrl.urlAddress)}/${id}`;
    return this.http.delete<QrImage>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted image with id=${id}`)),
      catchError(this.handleError<QrImage>('deleteimage'))
    );
  }

  private handleError<T>(operation = 'operation', result ?: T) {
    return (error: any): Observable<T> => {
      if (error.status === 0) {
        this.notifier.notify('warning', 'No response from server. Check connection!');
      }
      if (error.status === 400) {
        this.notifier.notify('warning', error.error);
      }
      if (error.status === 404) {
        this.notifier.notify('error', error.error);
      }
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  /** Log a DocService message with the MessageService */
  private log(message: string) {
  }
}
