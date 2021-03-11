import { SearchService } from './../common/services/search.service';
import { ExportService } from './../common/services/export.service';
import { ContactService } from './../common/services/contact.service';
import { FilialeService } from './../common/services/filiale.service';
import { RuoloService } from './../common/services/ruolo.service';
import { RepartoService } from './../common/services/reparto.service';
import { MatPaginator } from '@angular/material/paginator';
import { QrModalComponent } from './qr-modal/qr-modal.component';
import { Contact } from '../mocker/contacts';
import { PhoneContact } from '../mocker/phoneContact';
import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Filiale } from '../mocker/filiale';
import { Ruolo } from '../mocker/ruoli';
import { Reparto } from '../mocker/reparto';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { AuthService } from './../common/services/auth.service';
import { NewContactModalComponent } from './../contacts-list/new-contact-modal/new-contact-modal.component';
import { EditContactModalComponent } from './edit-contact-modal/edit-contact-modal.component';
import { ConfirmDialogModel, ConfirmModalComponent } from './../modal/confirm-modal/confirm-modal.component';

export interface DialogData {
  qrcode: string;
}

@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
  styleUrls: ['./contacts-list.component.css']
})
export class ContactsListComponent implements OnInit, OnDestroy {
  @Output() public sidenavToggle = new EventEmitter();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  isLoggedIn$: Observable<boolean>;
  elementType = NgxQrcodeElementTypes.CANVAS;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.LOW;
  margin = '10';

  phoneContacts: PhoneContact[];
  contacts: Contact[];
  filiali: Filiale[];
  ruoli: Ruolo[];
  reparti: Reparto[];
  nameFilter = new FormControl('');
  filialeFilter = new FormControl('');
  roleFilter = new FormControl('');
  myplaceHolder = 'CERCA NOMINATIVO';
  filter = '';

  dataSource: MatTableDataSource<Contact>;
  // dataSource = new MatTableDataSource<Contact>();
  obs: Observable<any>;
  filterValues = {
    nome: '',
    filiale: '',
    ruolo: ''
  };
  constructor(public dialog: MatDialog, private contactService: ContactService, private authservice: AuthService,
              private filialeService: FilialeService, private ruoloService: RuoloService, private repartoService: RepartoService,
              private exportService: ExportService, private callFromSidenav: SearchService) {
    this.isLoggedIn$ = this.authservice.isLogged;

  }
  ngOnInit() {
    this.getFiliale();
    this.getRuolo();
    this.getReparto();
    this.getContact();

    this.nameFilter.valueChanges
      .subscribe(
        name => {
          this.filter = name;
          this.filterValues.nome = name;
          this.dataSource.filter = JSON.stringify(this.filterValues).toLowerCase();
          if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
          }
        }
      );
    this.filialeFilter.valueChanges
      .subscribe(
        filiale => {
          this.filterValues.filiale = filiale;
          this.dataSource.filter = JSON.stringify(this.filterValues).toLowerCase();
          if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
          }
        }
      );
    this.roleFilter.valueChanges
      .subscribe(
        ruolo => {
          this.filterValues.ruolo = ruolo;
          this.dataSource.filter = JSON.stringify(this.filterValues).toLowerCase();
          if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
          }
        }
      );
    if (this.callFromSidenav.subsVar === undefined) {
        this.callFromSidenav.subsVar = this.callFromSidenav.callContactListTel.subscribe(_ => {
          this.exportToCsvPhone();
        });
        this.callFromSidenav.subsVar = this.callFromSidenav.callContactListAll.subscribe(_ => {
          this.exportToCsvAll();
        });
        this.callFromSidenav.subsVar = this.callFromSidenav.callContactListLDAP.subscribe(_ => {
          this.exportToCsvLDAP();
        });
      }
  }
  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }
  modalQrCode(contact: Contact): void {
    const dialogRef = this.dialog.open(QrModalComponent, {
      data: { vcard: contact.vcard },
      width: '500px',
      height: '500px'
     });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  getContact(): void {
    this.contactService.getContacts()
    .subscribe(contacts => {
      this.contacts = contacts;
      this.contacts.map(
        cont => {
          cont.filiale = undefined ? '' : this.filiali.find(filiale => filiale.id === cont.filialeId).nomeFiliale,
          cont.ruolo = undefined ? '' : this.ruoli.find(ruolo => ruolo.id === cont.ruoloId).nomeRuolo;
          }
        );
      this.contacts.every(row => this.getVcard(row)); // for every element in array execute function to fill qrcode data
      this.dataSource = new MatTableDataSource<Contact>(this.contacts);
      // this.dataSource.data = this.contacts;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = this.tableFilter();
      this.obs = this.dataSource.connect();
    });
  }
  getVcard(contact: Contact) {
    contact.vcard = `BEGIN:VCARD
VERSION:3.0
N:${contact.nome}; ${contact.cognome}
FN:${contact.nome} ${contact.cognome}
TEL;TYPE=voce,work,pref:${contact.cellulare}
TEL;TYPE=HOME,VOICE:${contact.telefonoFisso}
ADR;TYPE=WORK,PREF:${this.filiali.find(fil => fil.id === contact.filialeId).indirizzo};${this.filiali.find(fil => fil.id === contact.filialeId).citta};${this.filiali.find(fil => fil.id === contact.filialeId).provincia};${this.filiali.find(fil => fil.id === contact.filialeId).cap}
EMAIL:${contact.email}
END:VCARD
`;
    return contact;
  }
  getFiliale(): void {
    this.filialeService.getFiliali()
    .subscribe(filiali => this.filiali = filiali);
  }
  getRuolo() {
    this.ruoloService.getRuoli()
    .subscribe(ruoli => this.ruoli = ruoli);
  }
  getReparto() {
    this.repartoService.getReparto()
    .subscribe(reparti => this.reparti = reparti);
  }
  deleteContact(contact: Contact) {
    this.contactService.deleteContact(contact).subscribe( con => {
      if (con) {
        this.contacts = this.contacts.filter(h => h !== contact);
        this.dataSource.data = this.dataSource.data.filter(h => h !== contact);
      }
    });
  }
  newContact(contact: Contact): void {
    this.contactService.addContact(contact).subscribe(cont => {
      cont.filiale = this.filiali.find(filiale => filiale.id === cont.filialeId).nomeFiliale,
      cont.ruolo = this.ruoli.find(ruolo => ruolo.id === cont.ruoloId).nomeRuolo;
      cont.reparto = this.reparti.find(reparto => reparto.id === cont.repartoId).nomeReparto;
      this.getVcard(cont);
      this.contacts.push(cont);
    });
  }
  updateContact(contact: Contact): void {
    this.contactService.updateContact(contact).subscribe(cont => {
      const index = this.dataSource.data.findIndex(c => c.id === contact.id);

      contact.filiale = this.filiali.find(filiale => filiale.id === contact.filialeId).nomeFiliale,
      contact.ruolo = this.ruoli.find(ruolo => ruolo.id === contact.ruoloId).nomeRuolo;
      contact.reparto = this.reparti.find(reparto => reparto.id === contact.repartoId).nomeReparto;
      this.getVcard(contact);

      this.contacts[index] = contact;
      this.dataSource.data = this.contacts;
    });
  }
  tableFilter(): (data: any, filter: string) => boolean { // function for filtering through search term or dropdown
    this.dataSource.paginator.firstPage(); // paginator to first page

    const filterFunction = (data: any, filter: string): boolean => {
        const searchTerms = JSON.parse(filter);
        const nomecognome = data.nome + ' ' + data.cognome;
        const cognomenome = data.cognome + ' ' + data.nome;
        return  (nomecognome.toLowerCase().indexOf(searchTerms.nome) !== -1
          || cognomenome.toLowerCase().indexOf(searchTerms.nome) !== -1
          || data.filiale.toLowerCase().indexOf(searchTerms.nome) !== -1
          || data.ruolo.toLowerCase().indexOf(searchTerms.nome) !== -1
          || data.telefonoFisso.toLowerCase().indexOf(searchTerms.nome) !== -1
          || data.cellulare.toLowerCase().indexOf(searchTerms.nome) !== -1
          || data.email.toLowerCase().indexOf(searchTerms.nome) !== -1)
          && data.filiale.toLowerCase().indexOf(searchTerms.filiale) !== -1
          && data.ruolo.toLowerCase().indexOf(searchTerms.ruolo) !== -1;
      };
    return filterFunction;
  }
  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }
  checkPlaceHolder() {
    if (this.myplaceHolder) {
      this.myplaceHolder = null;
      return;
    } else {
      this.myplaceHolder = 'CERCA NOMINATIVO';
      return;
    }
  }
  clear() {
    this.nameFilter.reset('');
    this.filter = '';
  }
  onAllUserPaginateChange(event: any) {
    const matTable = document.getElementById('card-grid');
    matTable.scrollIntoView({behavior: 'smooth' });
  }
  newContactModal() {
    const dialogRef = this.dialog.open(NewContactModalComponent, {
      // panelClass: 'login-dialog-container', // to hide padding on login form - added padding : 0 on gloabal styles.css
      width: '500px',
      height: '440px'
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.filialeId === undefined || result.filialeId === '') {
          result.filialeId = 0;
        }
        if (result.ruoloId === undefined || result.ruoloId === '') {
          result.ruoloId = 0;
        }
        if (result.repartoId === undefined || result.repartoId === '') {
          result.repartoId = 0;
        }
        this.newContact(result);
      }
    });
  }
  editContactModal(contact: Contact) {
    const dialogRef = this.dialog.open(EditContactModalComponent, {
      // disableClose: true,
      // panelClass: 'login-dialog-container', // to hide padding on login form - added padding : 0 on gloabal styles.css
      width: '500px',
      height: '440px',
      data: {id: contact.id, nome: contact.nome, cognome: contact.cognome, email: contact.email, telefonoFisso: contact.telefonoFisso,
             cellulare: contact.cellulare, filialeId: contact.filialeId, ruoloId: contact.ruoloId,
             repartoId: contact.repartoId, event: String }
    });
    dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.updateContact(result);
        }
    });
  }
  deleteContactModal(contact: Contact) {
    const message = `Sei sicuro di voler cancellare contatto ` + contact.nome + ` ` + contact.cognome + `?`;

    const dialogData = new ConfirmDialogModel('Elimina Contatto', message);

    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      maxWidth: '400px',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          console.log(result);
          this.deleteContact(contact);
        }
    });
  }
  exportToCsvPhone(): void {
    this.phoneContacts = this.contacts.map(row => {
      return { name: row.nome + ' ' + row.cognome, work: '', mobile: row.cellulare, other: '', ring: '0'};
    });
    this.exportService.exportToCsv(this.phoneContacts, 'contattiTel', ['name', 'work', 'mobile', 'other', 'ring']);
  }
  exportToCsvAll(): void {
   const contatti = this.contacts.map(row => {
    return { nome: row.nome, cognome: row.cognome, telefonoFisso: row.telefonoFisso,
             cellulare: row.cellulare, email: row.email, filiale: row.filiale, ruolo: row.ruolo};
    });
   this.exportService.exportToCsv(contatti, 'contatti',
   ['nome', 'cognome', 'telefono_fisso', 'cellulare', 'email', 'filiale', 'ruolo']);
  }
  exportToCsvLDAP(): void {
    const contatti = this.contacts.map(row => {
      return {
        phonebook: 'Cellulari', extension: '', nickname: row.nome + ' ' + row.cognome, firstname: row.nome,
        lastname: row.cognome, email: row.email, mobileNumber: row.cellulare, officeNumber: row.telefonoFisso,
        homeNumber: '', department: ''
      };
    });
    this.exportService.exportToCsvLDAP(contatti, 'contattiLDAP',
    [
      'Phonebook Node', 'Extension', 'Nickname', 'First Name', 'Last Name', 'Email', 'Mobile Number',
      'Office Number', 'Home Number', 'Department'
    ],
    [
      'phonebook', 'extension', 'nickname', 'firstname',
      'lastName', 'email', 'mobileNumber', 'officeNumber', 'homeNumber', 'department'
    ]);
  }
}
