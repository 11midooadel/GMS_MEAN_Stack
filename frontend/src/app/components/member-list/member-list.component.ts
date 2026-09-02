import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../core/services/auth.service';
import { UsersService, User } from '../../core/services/users.service';
import { MemberFormComponent } from '../member-form/member-form.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { AttendanceHistoryDialogComponent } from '../attendance-history-dialog/attendance-history-dialog.component';
import { HealthHistoryDialogComponent } from '../health-history-dialog/health-history-dialog.component';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';
  currentRoleFilter = '';
  pageTitle = 'Users List';
  isLoading = false;

  constructor(
    public authService: AuthService,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  get canEdit(): boolean {
    const role = this.authService.role?.toString().toLowerCase().replace(/\s+/g, '_');
    return role === 'super_admin' || role === 'admin';
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.currentRoleFilter = data['role'] || '';
      this.pageTitle = data['title'] || 'Users List';
      this.loadUsers();
    });
  }

  loadUsers(): void {
    this.isLoading = true;
    this.usersService.getUsers(this.currentRoleFilter).subscribe({
      next: (res: any) => {
        const list: User[] = Array.isArray(res) ? res : (res.data || res.users || []);
        this.users = list;
        this.filterList();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
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

  openEditModal(user: User): void {
    if (!this.canEdit) return;

    const dialogRef = this.dialog.open(MemberFormComponent, {
      width: '500px',
      data: {
        user: { ...user },
        role: user.role
      }
    });

    dialogRef.afterClosed().subscribe((updated) => {
      if (updated) {
        this.loadUsers();
      }
    });
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
