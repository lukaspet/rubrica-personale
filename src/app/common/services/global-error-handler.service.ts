import { NotifierService } from 'angular-notifier';
import { LoggingService } from './logging.service';
import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {

  private readonly notifier: NotifierService;

  constructor(private injector: Injector, private loggingservice: LoggingService, notifierService: NotifierService) {
    this.notifier = notifierService;
   }

  handleError(error: Error | HttpErrorResponse) {

    const logger = this.injector.get(LoggingService);
    const router = this.injector.get(Router);
    // console.log('URL: ' + router.url);
    console.log(error);

    if (error instanceof HttpErrorResponse) {
        // Backend returns unsuccessful response codes such as 404, 500 etc.
        // console.error('Backend returned status code: ', error.status);
        // console.error('Response body:', error.message);
        if (!localStorage.getItem('user')) {
          console.log(error.error);
          this.notifier.notify('error', error.error);
          this.loggingservice.errorNoUser(error, router.url).subscribe();
          // logger.errorNoUser(error, router.url);
        } else {
          this.notifier.notify('error', error.error);
          this.loggingservice.httperror(error, router.url).subscribe();
          // logger.httperror(error, router.url);
        }
    } else {
        // A client-side or network error occurred.
        // console.error('An error occurred:', error.message);
        this.notifier.notify('error', error.message);
        this.loggingservice.error(error, router.url).subscribe();
        logger.error(error, router.url);
    }
    // router.navigate(['/error']);
  }
}

