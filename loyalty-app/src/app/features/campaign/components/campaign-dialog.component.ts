import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { Campaign } from '../models/campaign.model';

export interface CampaignDialogData {
  campaign?: Campaign;
  isEdit: boolean;
}

@Component({
  selector: 'app-campaign-dialog',
  templateUrl: './campaign-dialog.component.html',
  styleUrls: ['./campaign-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatCheckboxModule
  ]
})
export class CampaignDialogComponent {
  form: FormGroup;
  isEdit: boolean;
  dialogTitle: string;
  minEndDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CampaignDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CampaignDialogData
  ) {
    this.isEdit = data.isEdit;
    this.dialogTitle = this.isEdit ? 'Edit Campaign' : 'Create New Campaign';

    // Create the form
    this.form = this.fb.group({
      name: [data.campaign?.name || '', [Validators.required, Validators.maxLength(255)]],
      description: [data.campaign?.description || '', [Validators.required, Validators.maxLength(1000)]],
      startDate: [data.campaign?.startDate ? new Date(data.campaign.startDate) : new Date(), [Validators.required]],
      endDate: [data.campaign?.endDate ? new Date(data.campaign.endDate) : new Date(new Date().setDate(new Date().getDate() + 30)), [Validators.required]],
      active: [data.campaign?.active ?? true]
    });

    // Update min end date when start date changes
    this.form.get('startDate')?.valueChanges.subscribe(date => {
      this.minEndDate = new Date(date);
      
      // If the end date is now before the start date, update it
      const currentEndDate = this.form.get('endDate')?.value;
      if (currentEndDate && new Date(currentEndDate) < this.minEndDate) {
        this.form.get('endDate')?.setValue(this.minEndDate);
      }
    });
  }

  save() {
    if (this.form.valid) {
      // Format the dates as ISO strings for the API
      const formValue = this.form.value;
      const result = {
        ...formValue,
        startDate: formValue.startDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        endDate: formValue.endDate.toISOString().split('T')[0]      // Format as YYYY-MM-DD
      };

      if (this.isEdit && this.data.campaign?.id) {
        result.id = this.data.campaign.id;
      }

      this.dialogRef.close(result);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
