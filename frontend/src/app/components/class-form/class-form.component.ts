import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClassesService } from '../../core/services/classes.service';
import { UsersService } from '../../core/services/users.service';
import { AuthService } from '../../core/services/auth.service';
import { GymClass, User } from '../../core/models/models';

@Component({
  selector: 'app-class-form',
  templateUrl: './class-form.component.html',
})
export class ClassFormComponent implements OnInit {
  saving = false;
  isEdit = !!this.data?.gymClass;
  weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  /** Admin/Super Admin picks who teaches the class; a Trainer always creates their own. */
  trainers: User[] = [];

  form = this.fb.group({
    name: [this.data?.gymClass?.name ?? '', Validators.required],
    description: [this.data?.gymClass?.description ?? ''],
    days: [this.data?.gymClass?.days ?? ([] as string[]), Validators.required],
    startTime: [this.data?.gymClass?.startTime ?? '18:00', Validators.required],
    duration: [this.data?.gymClass?.duration ?? 45, [Validators.required, Validators.min(1)]],
    capacity: [this.data?.gymClass?.capacity ?? 20, [Validators.required, Validators.min(1)]],
    location: [this.data?.gymClass?.location ?? ''],
    trainer: [this.currentTrainerId()],
  });

  constructor(
    private fb: FormBuilder,
    private classes: ClassesService,
    private usersSvc: UsersService,
    private auth: AuthService,
    private snack: MatSnackBar,
    private ref: MatDialogRef<ClassFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { gymClass?: GymClass } | null
  ) {}

  get isAdmin(): boolean {
    return this.auth.hasRole('Admin', 'Super Admin');
  }

  ngOnInit(): void {
    if (!this.isAdmin) return;
    this.form.controls.trainer.setValidators(Validators.required);
    this.form.controls.trainer.updateValueAndValidity();
    this.usersSvc.getAll().subscribe((all) => {
      this.trainers = all.filter((u) => u.role === 'Trainer');
    });
  }

  private currentTrainerId(): string {
    const t = this.data?.gymClass?.trainer;
    if (!t) return '';
    return typeof t === 'object' ? ((t as User)._id ?? '') : t;
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;

    const req = this.isEdit
      ? this.classes.update(this.data!.gymClass!._id!, this.form.value as any)
      : this.classes.create(this.form.value as any);

    req.subscribe({
      next: () => {
        this.snack.open(`Class ${this.isEdit ? 'updated' : 'created'} successfully.`, 'OK', { duration: 3000 });
        this.ref.close(true);
      },
      error: () => (this.saving = false),
    });
  }
}
