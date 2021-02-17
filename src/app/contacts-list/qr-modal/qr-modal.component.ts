import { Contact } from './../../mocker/contacts';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';

@Component({
  selector: 'app-qr-modal',
  templateUrl: './qr-modal.component.html',
  styleUrls: ['./qr-modal.component.css']
})
export class QrModalComponent implements OnInit {

  elementType = NgxQrcodeElementTypes.CANVAS;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.MEDIUM;
  vcard = '';

  constructor(public dialogRef: MatDialogRef<QrModalComponent>, @Inject(MAT_DIALOG_DATA) public contact: Contact) {
    this.vcard = contact.vcard;
   }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
