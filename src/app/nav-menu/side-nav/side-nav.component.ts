import { FilialeService } from './../../common/services/filiale.service';
import { SearchService } from './../../common/services/search.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Filiale } from 'src/app/mocker/filiale';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();
  nameFilter = new FormControl('');
  filialeFilter = new FormControl('');
  roleFilter = new FormControl('');
  filiali: Filiale[];
  isExpanded = true;
  showSubmenu = false;
  isShowing = false;

  constructor(private callContactListFunct: SearchService, private filialeService: FilialeService) { }

  ngOnInit() {
    this.getFiliale();
  }
  getFiliale(): void {
    this.filialeService.getFiliali()
    .subscribe(filiali => this.filiali = filiali);
  }
  exportToCsvPhone = () => {
    this.showSubmenu = false;
    this.sidenavClose.emit();
    this.callContactListFunct.onSidenavClickTel();
  }
  exportToCsvAll = () => {
    this.showSubmenu = false;
    this.sidenavClose.emit();
    this.callContactListFunct.onSidenavClickAll();
  }
  exportToCsvLDAP = () => {
    this.showSubmenu = false;
    this.sidenavClose.emit();
    this.callContactListFunct.onSidenavClickLDAP();
  }
  exportToCsvFiliali = () => {
    this.showSubmenu = false;
    this.sidenavClose.emit();
    this.callContactListFunct.onSidenavClick();
  }
  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }
  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }
}
