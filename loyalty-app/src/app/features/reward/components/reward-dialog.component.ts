import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Reward } from '../models/reward.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface RewardDialogData {
  reward?: Reward;
  isEdit: boolean;
}

@Component({
  selector: 'app-reward-dialog',
  templateUrl: './reward-dialog.component.html',
  styleUrls: ['./reward-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class RewardDialogComponent {
  form: FormGroup;
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RewardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RewardDialogData
  ) {
    this.isEdit = data.isEdit;
    this.form = this.fb.group({
      name: [data.reward?.name || '', [Validators.required, Validators.maxLength(255)]],
      description: [data.reward?.description || '', [Validators.required]],
      pointsCost: [data.reward?.pointsCost || '', [Validators.required, Validators.min(1)]],
      exclusive: [data.reward?.exclusive || false],
      expiryDate: [data.reward?.expiryDate || '', [Validators.required]]
    });
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close({ ...this.data.reward, ...this.form.value });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
