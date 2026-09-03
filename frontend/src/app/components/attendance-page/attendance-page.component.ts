import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, of, map, catchError } from 'rxjs';
import { AttendanceService } from '../../core/services/attendance.service';
import { UsersService } from '../../core/services/users.service';
import { AuthService } from '../../core/services/auth.service';
import { Attendance, User } from '../../core/models/models';

interface AdminAttendanceRow {
  user: User;
  record: Attendance;
}

@Component({
  selector: 'app-attendance-page',
  templateUrl: './attendance-page.component.html',
  styleUrls: ['./attendance-page.component.css'],
})
export class AttendancePageComponent implements OnInit {
  loading = true;
  cols = ['checkIn', 'checkOut'];

  /** Member: their own check-in/out history. */
  records: Attendance[] = [];

  /** Admin/Super Admin: everyone's history for the selected role, newest first. */
  roleView: 'member' | 'trainer' = 'member';
  adminRows: AdminAttendanceRow[] = [];
  adminCols = ['name', 'checkIn', 'checkOut'];

  constructor(
    private svc: AttendanceService,
    private usersSvc: UsersService,
    private auth: AuthService,
    private snack: MatSnackBar
  ) {}

  get isAdmin(): boolean {
    return this.auth.hasRole('admin', 'super_admin');
  }

  ngOnInit(): void {
    this.isAdmin ? this.loadAdminView() : this.load();
  }

  setRoleView(role: 'member' | 'trainer'): void {
    if (this.roleView === role) return;
    this.roleView = role;
    this.loadAdminView();
  }

  loadAdminView(): void {
    this.loading = true;
    this.usersSvc.getAll().subscribe({
      next: (all) => {
        const candidates = all.filter((u) => u.role === this.roleView);
        if (!candidates.length) {
          this.adminRows = [];
          this.loading = false;
          return;
        }
        forkJoin(
          candidates.map((u) =>
            this.svc.byUser(u._id!).pipe(
              map((records) => records.map((record) => ({ user: u, record }))),
              catchError(() => of([] as AdminAttendanceRow[]))
            )
          )
        ).subscribe((groups) => {
          this.adminRows = groups
            .flat()
            .sort((a, b) => new Date(b.record.checkIn).getTime() - new Date(a.record.checkIn).getTime());
          this.loading = false;
        });
      },
      error: () => (this.loading = false),
    });
  }

  /** Member/Trainer: their own history. */
  load(): void {
    this.loading = true;
    this.svc.myAttendance().subscribe({
      next: (r) => { this.records = r; this.loading = false; },
      error: () => (this.loading = false),
    });
  }

  checkIn(): void {
    this.svc.checkIn().subscribe(() => {
      this.snack.open('You have checked in successfully.', 'OK', { duration: 3000 });
      this.load();
    });
  }
  checkOut(): void {
    this.svc.checkOut().subscribe(() => {
      this.snack.open('You have checked out successfully.', 'OK', { duration: 3000 });
      this.load();
    });
  }
}
