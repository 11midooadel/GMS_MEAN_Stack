import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WorkoutPlansService } from '../../core/services/workout-plans.service';
import { AuthService } from '../../core/services/auth.service';
import { User, WorkoutPlan } from '../../core/models/models';
import { WorkoutFormComponent } from '../workout-form/workout-form.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-workout-list',
  templateUrl: './workout-list.component.html',
  styleUrls: ['./workout-list.component.css'],
})
export class WorkoutListComponent implements OnInit {
  loading = true;
  plans: WorkoutPlan[] = [];

  constructor(
    private svc: WorkoutPlansService,
    private auth: AuthService,
    private dialog: MatDialog
  ) {}

  /** Admins and Trainers can edit/delete — the backend already scopes the list
   *  a Trainer sees to only their own assigned members' plans. */
  get canManage(): boolean {
    return this.auth.hasRole('Admin', 'Super Admin', 'Trainer');
  }

  get isAdmin(): boolean {
    return this.auth.hasRole('Admin', 'Super Admin');
  }
  get isTrainer(): boolean {
    return this.auth.hasRole('Trainer');
  }
  get isMember(): boolean {
    return this.auth.hasRole('Member');
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    const req = this.auth.hasRole('Member')
      ? this.svc.byMember(this.auth.currentUser!.id)
      : this.svc.getAll();

    req.subscribe({
      next: (data) => { this.plans = data; this.loading = false; },
      error: () => (this.loading = false),
    });
  }

  totalExercises(p: WorkoutPlan): number {
    return (p.days || []).reduce((sum, d) => sum + (d.exercises?.length || 0), 0);
  }

  memberName(p: WorkoutPlan): string {
    return typeof p.memberId === 'object' ? (p.memberId as User).name : 'Member';
  }

  /** Returns null until the backend populates `memberId.assignedTrainer` — safe to show conditionally. */
  trainerName(p: WorkoutPlan): string | null {
    if (typeof p.memberId !== 'object') return null;
    const trainer = (p.memberId as User).assignedTrainer;
    return trainer && typeof trainer === 'object' ? (trainer as User).name : null;
  }

  openForm(p: WorkoutPlan): void {
    this.dialog
      .open(WorkoutFormComponent, {
        width: '540px',
        data: { memberId: this.memberIdOf(p), memberName: this.memberName(p), plan: p },
      })
      .afterClosed()
      .subscribe((changed) => changed && this.load());
  }

  remove(p: WorkoutPlan): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        width: '360px',
        data: {
          title: 'Do you want to delete this workout plan?',
          message: `"${p.name}" for ${this.memberName(p)} will be permanently removed. This can't be undone.`,
          confirmText: 'Delete',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.svc.delete(p._id!).subscribe(() => this.load());
      });
  }

  private memberIdOf(p: WorkoutPlan): string {
    return typeof p.memberId === 'object' ? (p.memberId as User)._id! : p.memberId;
  }
}
