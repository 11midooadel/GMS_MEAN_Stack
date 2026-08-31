import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from '../../core/services/users.service';
import { Role, User } from '../../core/models/models';
import { MemberFormComponent } from '../member-form/member-form.component';

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
    if (!confirm(`Delete ${user.name}?`)) return;
    this.usersSvc.delete(user._id!).subscribe(() => this.load());
  }
}
