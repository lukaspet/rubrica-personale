import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  callContactListTel = new EventEmitter();
  callContactListAll = new EventEmitter();
  callContactListLDAP = new EventEmitter();
  callFilialeList = new EventEmitter();
  subsVar: Subscription;

  private searchSource = new BehaviorSubject('');
  currentSearch = this.searchSource.asObservable();
  private filterSource = new BehaviorSubject('');
  currentFilter = this.filterSource.asObservable();

  constructor() { }

  onSidenavClickTel() {
    this.callContactListTel.emit();
  }
  onSidenavClickAll() {
    this.callContactListAll.emit();
  }
  onSidenavClickLDAP() {
    this.callContactListLDAP.emit();
  }
  onSidenavClick() {
    this.callFilialeList.emit();
  }

  changeSearch(search: string) {
    this.searchSource.next(search);
  }
  changeFilter(filter: string) {
    this.filterSource.next(filter);
  }
}
