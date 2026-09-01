import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClassesService } from '../../core/services/classes.service';

@Component({
  selector: 'app-class-form',
  templateUrl: './class-form.component.html',
})
export class ClassFormComponent {
  saving = false;
  weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    days: [[] as string[], Validators.required],
    startTime: ['18:00', Validators.required],
    duration: [45, [Validators.required, Validators.min(1)]],
    capacity: [20, [Validators.required, Validators.min(1)]],
    location: [''],
  });

  constructor(
    private fb: FormBuilder,
    private classes: ClassesService,
    private snack: MatSnackBar,
    private ref: MatDialogRef<ClassFormComponent>
  ) {}

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.classes.create(this.form.value as any).subscribe({
      next: () => {
        this.snack.open('Class created', 'OK', { duration: 3000 });
        this.ref.close(true);
      },
      error: () => (this.saving = false),
    });
  }
}
