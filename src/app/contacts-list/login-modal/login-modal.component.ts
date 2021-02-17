import { AuthService } from './../../common/services/auth.service';
import { User } from './../../mocker/user';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoggingService } from './../../common/services/logging.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit {

  loginForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<LoginModalComponent>, @Inject(MAT_DIALOG_DATA) public user: User,
              private fb: FormBuilder, private auth: AuthService, private loggingservice: LoggingService) {
   }
  get f() { return this.loginForm.controls; }
  onNoClick(): void {
    this.dialogRef.close();
  }
  submit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.auth.login(this.loginForm.value).subscribe(
      (user) =>
        this.loggingservice.info(`logged in user=${user}`, '/login modal').subscribe()
    );
    this.dialogRef.close(this.loginForm.value);
  }
  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
}
