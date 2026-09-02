import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlansService } from '../../core/services/plans.service';
import { Plan } from '../../core/models/models';

@Component({
  selector: 'app-plan-form',
  templateUrl: './plan-form.component.html',
})
export class PlanFormComponent {
  isEdit = !!this.data.plan;
  saving = false;

  // Convert the array of features to a comma-separated string for easy editing
  form = this.fb.group({
    name: [this.data.plan?.name ?? '', Validators.required],
    description: [this.data.plan?.description ?? '', Validators.required],
    price: [this.data.plan?.price ?? 0, [Validators.required, Validators.min(0)]],
    durationInDays: [this.data.plan?.durationInDays ?? 30, [Validators.required, Validators.min(1)]],
    features: [this.data.plan?.features?.join(', ') ?? '', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private plansSvc: PlansService, // Uses the provided PlansService[cite: 24]
    private snack: MatSnackBar,
    private dialogRef: MatDialogRef<PlanFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { plan?: Plan }
  ) {}

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    
    const v = this.form.value;
    // Split the comma-separated string back into an array for the backend
    const body: Partial<Plan> = {
      name: v.name!,
      description: v.description!,
      price: Number(v.price),
      durationInDays: Number(v.durationInDays),
      features: v.features!.split(',').map(f => f.trim()).filter(f => f.length > 0)
    };

    const request = this.isEdit
      ? this.plansSvc.update(this.data.plan!._id!, body) // Uses update endpoint[cite: 24]
      : this.plansSvc.create(body); // Uses create endpoint[cite: 24]

    request.subscribe({
      next: () => {
        this.snack.open(`Plan ${this.isEdit ? 'updated' : 'created'} successfully`, 'OK', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.saving = false;
        this.snack.open(err.error?.message || 'An error occurred', 'OK', { duration: 3000 });
      },
    });
  }
}