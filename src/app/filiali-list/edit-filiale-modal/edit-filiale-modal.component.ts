import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Filiale } from './../../mocker/filiale';

@Component({
  selector: 'app-edit-filiale-modal',
  templateUrl: './edit-filiale-modal.component.html',
  styleUrls: ['./edit-filiale-modal.component.css']
})
export class EditFilialeModalComponent implements OnInit {

  editFilialeForm: FormGroup;
  filiali: Filiale[];
  submitted = false;

  constructor(public dialogRef: MatDialogRef<EditFilialeModalComponent>, @Inject(MAT_DIALOG_DATA) public data: Filiale,
              private fb: FormBuilder) {
    this.editFilialeForm = this.fb.group({
      id: [''],
      nomeFiliale: ['', Validators.required],
      indirizzo: [''],
      citta: [''],
      provincia: [''],
      cap: [''],
      email: ['', Validators.email],
      telefono: [''],
      fax: ['']
    });
  }
  get f() { return this.editFilialeForm.controls; }
  ngOnInit() {
    this.getFiliale();
  }
  getFiliale() {
    this.editFilialeForm.patchValue({
      id: this.data.id,
      nomeFiliale: this.data.nomeFiliale,
      indirizzo: this.data.indirizzo,
      citta: this.data.citta,
      provincia: this.data.provincia,
      cap: this.data.cap,
      email: this.data.email,
      telefono: this.data.telefono,
      fax: this.data.fax,
    });
  }
  onNoClick() {
    // this.dialogRef.close({event: 'Cancel'});
    this.dialogRef.close();
  }
  save() {
    this.submitted = true;
    if (this.editFilialeForm.invalid) {
      return;
    }
    this.dialogRef.close(this.editFilialeForm.value);
  }
  submit() {
    this.submitted = true;
    if (this.editFilialeForm.invalid) {
      return;
    }
    // this.dialogRef.close(this.editContactForm.value);
  }
}
