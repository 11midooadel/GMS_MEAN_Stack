import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClassesService } from '../../core/services/classes.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { AuthService } from '../../core/services/auth.service';
import { GymClass, User } from '../../core/models/models';
import { ClassFormComponent } from '../class-form/class-form.component';

@Component({
  selector: 'app-class-list',
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.css'],
})
export class ClassListComponent implements OnInit {
  loading = true;
  classes: GymClass[] = [];
  enrolledIds = new Set<string>();

  constructor(
    private classesSvc: ClassesService,
    private enrollment: EnrollmentService,
    private auth: AuthService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  get isMember() { return this.auth.hasRole('Member'); }
  get isTrainer() { return this.auth.hasRole('Trainer'); }
  get canManage() { return this.auth.hasRole('Admin', 'Super Admin', 'Trainer'); }

  ngOnInit(): void {
    this.load();
    if (this.isMember) {
      this.enrollment.myClasses().subscribe((list) =>
        list.forEach((c) => this.enrolledIds.add(c._id!))
      );
    }
  }

  load(): void {
    this.loading = true;
    this.classesSvc.getAll().subscribe({
      next: (data) => { this.classes = data; this.loading = false; },
      error: () => (this.loading = false),
    });
  }

  trainerName(c: GymClass): string {
    return typeof c.trainer === 'object' ? (c.trainer as User).name : 'Trainer';
  }

  enroll(c: GymClass): void {
    this.enrollment.enroll(c._id!).subscribe(() => {
      this.enrolledIds.add(c._id!);
      this.snack.open(`Enrolled in ${c.name}`, 'OK', { duration: 3000 });
    });
  }

  leave(c: GymClass): void {
    this.enrollment.leave(c._id!).subscribe(() => {
      this.enrolledIds.delete(c._id!);
      this.snack.open(`Left ${c.name}`, 'OK', { duration: 3000 });
    });
  }

  create(): void {
    this.dialog.open(ClassFormComponent, { width: '520px' })
      .afterClosed().subscribe((changed) => changed && this.load());
  }

  remove(c: GymClass): void {
    if (!confirm(`Delete class "${c.name}"?`)) return;
    this.classesSvc.delete(c._id!).subscribe(() => this.load());
  }
}
