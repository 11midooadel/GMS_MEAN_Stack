import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WorkoutPlansService } from '../../core/services/workout-plans.service';
import { Exercise, WorkoutPlan } from '../../core/models/models';

export interface WorkoutFormData {
  memberId: string;
  memberName: string;
  plan?: WorkoutPlan;
}

interface DayEntry {
  day: string;
  exercises: Exercise[];
  draftName: string;
  draftSets: number;
  draftReps: number;
}

const WEEK_DAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

@Component({
  selector: 'app-workout-form',
  templateUrl: './workout-form.component.html',
  styleUrls: ['./workout-form.component.css'],
})
export class WorkoutFormComponent {
  saving = false;
  isEdit = !!this.data.plan;

  form = this.fb.group({
    name: [this.data.plan?.name ?? '', Validators.required],
    description: [this.data.plan?.description ?? ''],
  });

  /** All 7 days, always shown; pre-filled with existing exercises when editing. */
  days: DayEntry[] = WEEK_DAYS.map((day) => ({
    day,
    exercises: [...(this.data.plan?.days.find((d) => d.day === day)?.exercises ?? [])],
    draftName: '',
    draftSets: 3,
    draftReps: 10,
  }));

  constructor(
    private fb: FormBuilder,
    private svc: WorkoutPlansService,
    private snack: MatSnackBar,
    private ref: MatDialogRef<WorkoutFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WorkoutFormData
  ) {}

  addExercise(day: DayEntry): void {
    if (!day.draftName.trim()) return;
    day.exercises.push({ name: day.draftName.trim(), sets: day.draftSets, reps: day.draftReps });
    day.draftName = '';
    day.draftSets = 3;
    day.draftReps = 10;
  }

  removeExercise(day: DayEntry, index: number): void {
    day.exercises.splice(index, 1);
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;

    const body = {
      memberId: this.data.memberId,
      name: this.form.value.name ?? '',
      description: this.form.value.description ?? '',
      days: this.days
        .filter((d) => d.exercises.length > 0)
        .map((d) => ({ day: d.day, exercises: d.exercises })),
    };

    const req = this.isEdit
      ? this.svc.update(this.data.plan!._id!, body)
      : this.svc.create(body);

    req.subscribe({
      next: () => {
        this.snack.open(`Workout plan ${this.isEdit ? 'updated' : 'created'} successfully.`, 'OK', { duration: 3000 });
        this.ref.close(true);
      },
      error: () => (this.saving = false),
    });
  }
}
