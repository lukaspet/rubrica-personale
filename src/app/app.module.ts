import { GlobalErrorHandlerService } from './common/services/global-error-handler.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID, ErrorHandler } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ContactsListComponent } from './contacts-list/contacts-list.component';
import { TopNavComponent } from './nav-menu/top-nav/top-nav.component';
import { SideNavComponent } from './nav-menu/side-nav/side-nav.component';
import { BaseLayerComponent } from './base-layer/base-layer.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatPaginatorModule } from '@angular/material/paginator';
import { QrModalComponent } from './contacts-list/qr-modal/qr-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchPipePipe } from './pipes/search-pipe.pipe';
import { FilterPipePipe } from './pipes/filter-pipe.pipe';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { HttpClientModule } from '@angular/common/http';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { LoginModalComponent } from './contacts-list/login-modal/login-modal.component';
import { NewContactModalComponent } from './contacts-list/new-contact-modal/new-contact-modal.component';
import { EditContactModalComponent } from './contacts-list/edit-contact-modal/edit-contact-modal.component';
import { FilialiListComponent } from './filiali-list/filiali-list.component';
import { EditFilialeModalComponent } from './filiali-list/edit-filiale-modal/edit-filiale-modal.component';
import { NewFilialeModalComponent } from './filiali-list/new-filiale-modal/new-filiale-modal.component';
import { HelpModalComponent } from './contacts-list/help-modal/help-modal.component';
registerLocaleData(localeIt);

const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
    position: 'right',
    distance: 12
  },
  vertical: {
    position: 'top',
    distance: 12,
    gap: 10
  }
  },
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: false,
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

@NgModule({
  declarations: [
    AppComponent,
    ContactsListComponent,
    TopNavComponent,
    SideNavComponent,
    BaseLayerComponent,
    QrModalComponent,
    SearchPipePipe,
    FilterPipePipe,
    LoginModalComponent,
    NewContactModalComponent,
    EditContactModalComponent,
    FilialiListComponent,
    EditFilialeModalComponent,
    NewFilialeModalComponent,
    HelpModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    FlexLayoutModule,
    MatButtonModule,
    MatToolbarModule,
    MatDividerModule,
    MatIconModule,
    MatGridListModule,
    MatMenuModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatListModule,
    MatSidenavModule,
    MatPaginatorModule,
    MatTooltipModule,
    ReactiveFormsModule,
    FormsModule,
    NotifierModule.withConfig(customNotifierOptions),
    HttpClientModule,
    NgxQRCodeModule,
  ],
  exports: [
    MatSidenavModule
  ],
  entryComponents: [
    QrModalComponent,
    LoginModalComponent,
    NewContactModalComponent,
    EditContactModalComponent,
    NewFilialeModalComponent,
    EditFilialeModalComponent
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'it-It'
    },
    GlobalErrorHandlerService,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService
    },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
