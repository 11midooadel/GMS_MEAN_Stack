import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from '../../core/services/users.service';
import { Role, User } from '../../core/models/models';
import { MemberFormComponent } from '../member-form/member-form.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { AttendanceHistoryDialogComponent } from '../attendance-history-dialog/attendance-history-dialog.component';
import { HealthHistoryDialogComponent } from '../health-history-dialog/health-history-dialog.component';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  loading = true;
  users: User[] = [];
  filtered: User[] = [];
  search = '';
  columns = ['name', 'email', 'role', 'actions'];

  // Set from route data: 'Trainer' for the Trainers page, undefined for all.
  roleFilter?: Role;

  constructor(
    private usersSvc: UsersService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.roleFilter = this.route.snapshot.data['roleFilter'];
    this.load();
  }

  get title(): string {
    return this.roleFilter === 'Trainer' ? 'Trainers' : 'Members';
  }

  load(): void {
    this.loading = true;
    this.usersSvc.getAll().subscribe({
      next: (data) => {
        this.users = this.roleFilter
          ? data.filter((u) => u.role === this.roleFilter)
          : data;
        this.applySearch();
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  applySearch(): void {
    const q = this.search.toLowerCase().trim();
    this.filtered = !q
      ? this.users
      : this.users.filter(
          (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
        );
  }

  viewAttendance(user: User): void {
    this.dialog.open(AttendanceHistoryDialogComponent, {
      width: '420px',
      data: { userId: user._id!, userName: user.name },
    });
  }

  viewHealth(user: User): void {
    this.dialog.open(HealthHistoryDialogComponent, {
      width: '440px',
      data: { memberId: user._id!, memberName: user.name },
    });
  }

  openForm(user?: User): void {
    this.dialog
      .open(MemberFormComponent, {
        width: '460px',
        data: { user, defaultRole: this.roleFilter },
      })
      .afterClosed()
      .subscribe((changed) => changed && this.load());
  }

  remove(user: User): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        width: '360px',
        data: {
          title: 'Delete user?',
          message: `This will permanently delete ${user.name}'s account. This can't be undone.`,
          confirmText: 'Delete',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.usersSvc.delete(user._id!).subscribe(() => this.load());
      });
  }
}
