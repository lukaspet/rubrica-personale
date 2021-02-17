import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Filiale } from './../../mocker/filiale';

@Component({
  selector: 'app-new-filiale-modal',
  templateUrl: './new-filiale-modal.component.html',
  styleUrls: ['./new-filiale-modal.component.css']
})
export class NewFilialeModalComponent implements OnInit {

  newFilialeForm: FormGroup;
  submitted = false;

  constructor(public dialogRef: MatDialogRef<NewFilialeModalComponent>, @Inject(MAT_DIALOG_DATA) public filiale: Filiale,
              private fb: FormBuilder) { }

  get f() { return this.newFilialeForm.controls; }

  ngOnInit() {
    this.newFilialeForm = this.fb.group({
      nomeFiliale: ['', Validators.required],
      indirizzo: [''],
      citta: [''],
      provincia: [''],
      cap: [''],
      email: ['', Validators.email],
      telefono: [''],
      fax: [''],
    });
  }
  onNoClick() {
    this.dialogRef.close();
  }
  save() {
    this.submitted = true;
    if (this.newFilialeForm.invalid) {
      return;
    }
    this.dialogRef.close(this.newFilialeForm.value);
  }

}
