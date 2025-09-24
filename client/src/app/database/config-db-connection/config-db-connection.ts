import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TabConfig } from '../models/model';
import { isJsonValidator } from '../../forms/is-json-validator';

@Component({
  selector: 'app-config-db-connection',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatLabel,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './config-db-connection.html',
  styleUrl: './config-db-connection.scss',
})
export class ConfigDbConnection {
  matDialogRef = inject(MatDialogRef<void, TabConfig>);

  form = new FormGroup({
    name: new FormControl('Local', [Validators.required]),
    config: new FormControl(
      '{\n\t"user": "SYSTEM",\n\t"password": "oracle",\n\t"connectionString": "localhost:1521/XEPDB1"\n}',
      [Validators.required, isJsonValidator()]
    ),
  });

  ok() {
    this.matDialogRef.close(this.form.value);
  }
}
