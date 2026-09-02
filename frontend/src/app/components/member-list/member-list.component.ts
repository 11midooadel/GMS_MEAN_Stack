import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../core/services/auth.service';
import { UsersService, User } from '../../core/services/users.service';
import { MemberFormComponent } from '../member-form/member-form.component';

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

  openAddModal(): void {
    if (!this.canEdit) return;

    const dialogRef = this.dialog.open(MemberFormComponent, {
      width: '500px',
      data: {
        role: this.currentRoleFilter || 'trainer',
        user: null
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers();
      }
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

  onRoleSelectChange(user: User, newRole: string): void {
    if (!this.canEdit) return;

    const previousRole = user.role;
    user.role = newRole as any;

    this.usersService.update(user._id, { role: newRole }).subscribe({
      next: () => {
        console.log(`Role for ${user.name} successfully updated to ${newRole}`);
      },
      error: (err) => {
        console.error('Failed to update user role:', err);
        user.role = previousRole;
      }
    });
  }

  filterList(): void {
    const query = this.searchTerm.trim().toLowerCase();
    if (!query) {
      this.filteredUsers = [...this.users];
      return;
    }
    this.filteredUsers = this.users.filter(
      (u) =>
        u.name?.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query) ||
        u.role?.toLowerCase().includes(query)
    );
  }

  deleteUser(id: string): void {
    if (!this.canEdit) return;

    if (confirm('Are you sure you want to delete this record?')) {
      this.usersService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter((u) => u._id !== id);
          this.filterList();
        }
      });
    }
  }
}