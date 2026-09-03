import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../core/services/auth.service';
import { UsersService } from '../../core/services/users.service';
import { Role, User } from '../../core/models/models';
import { MemberFormComponent } from '../member-form/member-form.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';
  currentRoleFilter: Role | '' = '';
  pageTitle = 'Members';
  isLoading = false;
  cols = ['name', 'email', 'role', 'actions'];

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  get canEdit(): boolean {
    return this.authService.hasRole('admin', 'super_admin');
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.currentRoleFilter = data['roleFilter'] || '';
      this.pageTitle = this.currentRoleFilter === 'trainer' ? 'Trainers' : 'Members';
      this.loadUsers();
    });

    // Syncs with the top navbar's global search box (?q=...)
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
      next: (all) => {
        // No route filter (the base /members page) shows Members only.
        this.users = all.filter((u) => u.role === (this.currentRoleFilter || 'member'));
        this.applySearch();
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  applySearch(): void {
    const q = this.searchTerm.toLowerCase().trim();
    this.filteredUsers = !q
      ? this.users
      : this.users.filter(
          (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
        );
  }

  initials(name: string): string {
    return name.split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  }

  openAddModal(): void {
    if (!this.canEdit) return;
    const dialogRef = this.dialog.open(MemberFormComponent, {
      width: '500px',
      data: { defaultRole: this.currentRoleFilter || 'member' },
    });
    dialogRef.afterClosed().subscribe((updated) => {
      if (updated) this.loadUsers();
    });
  }

  openEditModal(user: User): void {
    if (!this.canEdit) return;
    const dialogRef = this.dialog.open(MemberFormComponent, {
      width: '500px',
      data: { user: { ...user } },
    });
    dialogRef.afterClosed().subscribe((updated) => {
      if (updated) this.loadUsers();
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
