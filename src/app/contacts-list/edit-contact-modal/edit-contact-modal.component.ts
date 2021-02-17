import { ContactService } from './../../common/services/contact.service';
import { Contact } from './../../mocker/contacts';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilialeService } from './../../common/services/filiale.service';
import { RuoloService } from './../../common/services/ruolo.service';
import { RepartoService } from '../../common/services/reparto.service';
import { Filiale } from '../../mocker/filiale';
import { Ruolo } from '../../mocker/ruoli';
import { Reparto } from '../../mocker/reparto';

@Component({
  selector: 'app-edit-contact-modal',
  templateUrl: './edit-contact-modal.component.html',
  styleUrls: ['./edit-contact-modal.component.css']
})
export class EditContactModalComponent implements OnInit {

  editContactForm: FormGroup;
  filiali: Filiale[];
  ruoli: Ruolo[];
  reparti: Reparto[];
  submitted = false;

  constructor(public dialogRef: MatDialogRef<EditContactModalComponent>, @Inject(MAT_DIALOG_DATA) public data: Contact,
              private fb: FormBuilder, private filialeService: FilialeService, private ruoloService: RuoloService,
              private repartoService: RepartoService, private contactService: ContactService ) {
    this.editContactForm = this.fb.group({
      id: [''],
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      telefonoFisso: [''],
      cellulare: [''],
      filialeId: [''],
      email: ['', Validators.email],
      ruoloId: [''],
      repartoId: [''],
    });
  }
  get f() { return this.editContactForm.controls; }
  ngOnInit() {
    this.getFiliale();
    this.getRuolo();
    this.getReparto();
    this.getContact();
  }
  getContact() {
    this.editContactForm.patchValue({
      id: this.data.id,
      nome: this.data.nome,
      cognome: this.data.cognome,
      telefonoFisso: this.data.telefonoFisso,
      cellulare: this.data.cellulare,
      filialeId: this.data.filialeId,
      ruoloId: this.data.ruoloId,
      repartoId: this.data.repartoId,
      email: this.data.email,
    });
  }
  getFiliale(): void {
    this.filialeService.getFiliali()
    .subscribe(filiali => this.filiali = filiali);
  }
  getRuolo(): void {
    this.ruoloService.getRuoli()
    .subscribe(ruoli => this.ruoli = ruoli);
  }
  getReparto(): void {
    this.repartoService.getReparto()
    .subscribe(reparti => this.reparti = reparti);
  }
  onNoClick() {
    // this.dialogRef.close({event: 'Cancel'});
    this.dialogRef.close();
  }
  save() {
    this.submitted = true;
    if (this.editContactForm.invalid) {
      return;
    }
    this.dialogRef.close(this.editContactForm.value);
  }
  submit() {
    this.submitted = true;
    if (this.editContactForm.invalid) {
      return;
    }
    // this.dialogRef.close(this.editContactForm.value);
  }

}
