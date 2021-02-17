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
  selector: 'app-new-contact-modal',
  templateUrl: './new-contact-modal.component.html',
  styleUrls: ['./new-contact-modal.component.css']
})
export class NewContactModalComponent implements OnInit {

  newContactForm: FormGroup;
  filiali: Filiale[];
  ruoli: Ruolo[];
  reparti: Reparto[];
  submitted = false;

  constructor(public dialogRef: MatDialogRef<NewContactModalComponent>, @Inject(MAT_DIALOG_DATA) public contact: Contact,
              private fb: FormBuilder, private filialeService: FilialeService, private ruoloService: RuoloService,
              private repartoService: RepartoService ) { }

  get f() { return this.newContactForm.controls; }

  ngOnInit() {
    this.getFiliale();
    this.getRuolo();
    this.getReparto();
    this.newContactForm = this.fb.group({
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
    this.dialogRef.close();
  }
  save() {
    this.submitted = true;
    if (this.newContactForm.invalid) {
      return;
    }
    this.dialogRef.close(this.newContactForm.value);
  }
}
