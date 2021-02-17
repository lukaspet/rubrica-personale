import { ContactService } from './../../common/services/contact.service';
import { LoggingService } from './../../common/services/logging.service';
import { AuthService } from './../../common/services/auth.service';
import { LoginModalComponent } from './../../contacts-list/login-modal/login-modal.component';
import { SearchService } from './../../common/services/search.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { FormControl } from '@angular/forms';
import { FILIALE } from '../../mocker/mock-filiale';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();
  currentUser: string;
  isLoggedIn$: Observable<boolean>;
  searchText: string;
  filterText: string;
  myplaceHolder = 'SEARCH';
  filiales = new FormControl();
  filiali = FILIALE;
  constructor( private search: SearchService, private filter: SearchService, public dialog: MatDialog,
               private authservice: AuthService, private loggingservice: LoggingService, private contactService: ContactService) {
    this.authservice.currentUser.subscribe(x => this.currentUser = x);
    this.isLoggedIn$ = this.authservice.isLogged;
   }

  ngOnInit() {
    this.search.currentSearch.subscribe(search => this.searchText = search);
    this.search.currentFilter.subscribe(filter => this.filterText = filter);
  }
  checkPlaceHolder() {
    if (this.myplaceHolder) {
      this.myplaceHolder = null;
      return;
    } else {
      this.myplaceHolder = 'SEARCH';
      return;
    }
  }
  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }
  keyPress(event: KeyboardEvent) {
    this.search.changeSearch(this.searchText);
  }

  changedSearchText(event: KeyboardEvent): void {
    // emit the change so the parent component can see it
    this.search.changeSearch(this.searchText);
  }
  onChangeFiliale(filterText) {
    this.filterText = filterText;
    this.filter.changeFilter(filterText.toLowerCase());
  }
  clear() {
    this.searchText = '';
    this.search.changeSearch(this.searchText);
  }
  loginModal(): void {
      const dialogRef = this.dialog.open(LoginModalComponent, {
        panelClass: 'login-dialog-container', // to hide padding on login form - added padding : 0 on gloabal styles.css
        width: '350px',
        height: '300px'
        });
  }
  logout() {
    this.loggingservice.info('User logged out', '/logout');
    this.authservice.logout();
  }
  settings() {

  }
}
