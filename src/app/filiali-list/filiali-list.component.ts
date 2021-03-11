import { ConfirmDialogModel, ConfirmModalComponent } from './../modal/confirm-modal/confirm-modal.component';
import { NewFilialeModalComponent } from './new-filiale-modal/new-filiale-modal.component';
import { EditFilialeModalComponent } from './edit-filiale-modal/edit-filiale-modal.component';
import { SearchService } from './../common/services/search.service';
import { ExportService } from './../common/services/export.service';
import { FilialeService } from './../common/services/filiale.service';
import { RuoloService } from './../common/services/ruolo.service';
import { RepartoService } from '../common/services/reparto.service';
import { MatPaginator } from '@angular/material/paginator';
import { QrModalComponent } from '../contacts-list/qr-modal/qr-modal.component';
import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Filiale } from '../mocker/filiale';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { AuthService } from './../common/services/auth.service';
export interface DialogData {
  qrcode: string;
}

@Component({
  selector: 'app-filiali-list',
  templateUrl: './filiali-list.component.html',
  styleUrls: ['./filiali-list.component.css']
})
export class FilialiListComponent implements OnInit, OnDestroy {

  @Output() public sidenavToggle = new EventEmitter();
  isLoggedIn$: Observable<boolean>;
  elementType = NgxQrcodeElementTypes.CANVAS;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.LOW;
  margin = '10';

  filiali: Filiale[];
  nameFilter = new FormControl('');
  indirizzoFilter = new FormControl('');
  cittaFilter = new FormControl('');
  myplaceHolder = 'CERCA FILIALE';
  filter = '';

  dataSource: MatTableDataSource<Filiale>;
  // dataSource = new MatTableDataSource<Filiale>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  obs: Observable<any>;
  filterValues = {
    nomeFiliale: '',
    indirizzo: '',
    citta: ''
  };

  constructor(public dialog: MatDialog, private authservice: AuthService,
              private filialeService: FilialeService, private ruoloService: RuoloService, private repartoService: RepartoService,
              private exportService: ExportService, private callFromSidenav: SearchService) {
    this.isLoggedIn$ = this.authservice.isLogged;
  }

  ngOnInit() {
    this.getFiliale();
    if (this.callFromSidenav.subsVar === undefined) {
        this.callFromSidenav.subsVar = this.callFromSidenav.callFilialeList.subscribe(_ => {
          this.exportToCsvFiliali();
        });
      }
  }
  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  modalQrCode(filiale: Filiale): void {
    const dialogRef = this.dialog.open(QrModalComponent, {
      data: { vcard: filiale.vcard },
      width: '500px',
      height: '500px'
     });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  getVcard(filiale: Filiale) {
    filiale.vcard = `BEGIN:VCARD
VERSION:3.0
N:${filiale.nomeFiliale}
FN:${filiale.nomeFiliale}
TEL;TYPE=voce,work,pref:${filiale.telefono}
TEL;TYPE=HOME,VOICE:${filiale.fax}
ADR;TYPE=WORK,PREF:${filiale.indirizzo};${filiale.citta};${filiale.provincia};${filiale.cap}
EMAIL:${filiale.email}
END:VCARD
`;
    return filiale;
  }
  getFiliale(): void {
    this.filialeService.getFiliali()
    .subscribe(filiali => {
      this.filiali = filiali;
      this.filiali.shift(); // remove first item from array which is SENZA FILIALE

      this.filiali.every(row => this.getVcard(row)); // for every element in array execute function to fill qrcode data
      // tslint:disable-next-line: prefer-for-of
      // for (let i = 0; i < this.filiali.length; i++) {
      //   this.getVcard(this.filiali[i]);
      // }


      this.dataSource = new MatTableDataSource<Filiale>(this.filiali);

      // this.dataSource.data = this.filiali;
      // this.dataSource.filterPredicate = this.tableFilter();

      this.dataSource.paginator = this.paginator;
      this.obs = this.dataSource.connect();
    });
  }
  deleteFiliale(filiale: Filiale) {
    this.filialeService.deleteFiliale(filiale).subscribe( con => {
      if (con) {
        this.filiali = this.filiali.filter(h => h !== filiale);
        this.dataSource.data = this.dataSource.data.filter(h => h !== filiale);
      }
    });
  }
  newFiliale(filiale: Filiale): void {
    this.filialeService.addFiliale(filiale).subscribe(cont => {
      this.getVcard(cont);
      this.filiali.push(cont);
    });
  }
  updateFiliale(filiale: Filiale): void {
    this.dataSource.data = this.dataSource.data.filter((value, key) => {
      if (value.id === filiale.id) {
        value.nomeFiliale = filiale.nomeFiliale,
        value.indirizzo = filiale.indirizzo,
        value.telefono = filiale.telefono,
        value.email = filiale.email,
        value.fax = filiale.fax,
        value.provincia = filiale.provincia,
        value.citta = filiale.citta;
        value.cap = filiale.cap;
      }
      return true;
    });
    this.filialeService.updateFiliale(filiale).subscribe();
  }
  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }
  checkPlaceHolder() {
    if (this.myplaceHolder) {
      this.myplaceHolder = null;
      return;
    } else {
      this.myplaceHolder = 'CERCA FILIALE';
      return;
    }
  }
  clear() {
    this.dataSource.filter = '';
    this.filter = '';
    // this.nameFilter.reset('');
  }
  onAllUserPaginateChange(event: any) {
    const matTable = document.getElementById('card-grid');
    matTable.scrollIntoView();
  }
  newFilialeModal() {
    const dialogRef = this.dialog.open(NewFilialeModalComponent, {
      // panelClass: 'login-dialog-container', // to hide padding on login form - added padding : 0 on gloabal styles.css
      width: '500px',
      height: '440px'
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.newFiliale(result);
      }
    });
  }
  updateFilialeModal(filiale: Filiale) {
    const dialogRef = this.dialog.open(EditFilialeModalComponent, {
      // disableClose: true,
      // panelClass: 'login-dialog-container', // to hide padding on login form - added padding : 0 on gloabal styles.css
      width: '500px',
      height: '440px',
      data: {id: filiale.id, nomeFiliale: filiale.nomeFiliale, indirizzo: filiale.indirizzo, email: filiale.email, fax: filiale.fax,
             telefono: filiale.telefono, provincia: filiale.provincia, cap: filiale.cap, citta: filiale.citta, event: String }
    });
    dialogRef.afterClosed().subscribe(result => {
      // if (result.event !== 'Cancel') {
        if (result) {
          this.updateFiliale(result);
        }
    });
  }
  deleteFilialeModal(filiale: Filiale) {
    const message = `Sei sicuro di voler cancellare filiale ` + filiale.nomeFiliale + `?`;

    const dialogData = new ConfirmDialogModel('Elimina Contatto', message);

    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      maxWidth: '400px',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          console.log(result);
          this.deleteFiliale(filiale);
        }
    });
  }
  exportToCsvFiliali(): void {
    const filiali = this.filiali.map(row => {
     return { nome: row.nomeFiliale, indirizzo: row.indirizzo, citta: row.citta, provincia: row.provincia,
               cap: row.cap, email: row.email, telefono: row.telefono, fax: row.fax};
     });
    this.exportService.exportToCsv(filiali, 'filiali',
    ['nome', 'indirizzo', 'citta', 'provincia', 'cap', 'email', 'telefono', 'fax']);
   }
}
