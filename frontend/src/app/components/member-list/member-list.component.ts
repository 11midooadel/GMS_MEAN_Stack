import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../core/services/auth.service';
import { UsersService } from '../../core/services/users.service';
import { Role, User } from '../../core/models/models';
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
  searchTerm: string = '';
  currentRoleFilter: Role | '' = '';
  pageTitle = 'Members';
  isLoading = false;
  cols = ['name', 'email', 'role', 'actions'];

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
    // 1. Listen for route data (role filters)
    this.route.data.subscribe((data) => {
      this.currentRoleFilter = data['roleFilter'] || '';
      this.pageTitle = this.currentRoleFilter === 'Trainer' ? 'Trainers' : 'Members';
      this.loadUsers();
    });

    // 2. Listen to query params from the top Navbar search bar (?q=...)
    this.route.queryParams.subscribe((params) => {
      if (params['q'] !== undefined) {
        this.searchTerm = params['q'] || '';
        this.applySearch();
      }
    });
  }

  loadUsers(): void {
    this.isLoading = true;
    this.usersService.getAll().subscribe({
      next: (all: User[]) => {
        const list = Array.isArray(all) ? all : ((all as any).data || (all as any).users || []);

        if (this.currentRoleFilter) {
          this.users = list.filter(
            (u: any) => (u.role || '').toLowerCase() === this.currentRoleFilter.toLowerCase()
          );
        } else {
          // Strictly show only users with 'member' role
          this.users = list.filter(
            (u: any) => (u.role || '').toLowerCase() === 'member'
          );
        }
        this.applySearch();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  applySearch(): void {
    const q = (this.searchTerm || '').toLowerCase().trim();
    if (!q) {
      this.filteredUsers = [...this.users];
      return;
    }

    this.filteredUsers = this.users.filter((u) => {
      const nameMatch = (u.name || (u as any).username || '').toLowerCase().includes(q);
      const emailMatch = (u.email || '').toLowerCase().includes(q);
      return nameMatch || emailMatch;
    });
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

  openAddModal(): void {
    if (!this.canEdit) return;

    const dialogRef = this.dialog.open(MemberFormComponent, {
      width: '500px',
      data: { defaultRole: this.currentRoleFilter || 'member' },
    });

    dialogRef.afterClosed().subscribe((updated) => {
      if (updated) {
        this.loadUsers();
      }
    });
  }

  openEditModal(user: User): void {
    if (!this.canEdit) return;

    const dialogRef = this.dialog.open(MemberFormComponent, {
      width: '500px',
      data: { user: { ...user } },
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
        this.usersService.delete(user._id!).subscribe(() => this.loadUsers());
      });
  }
}