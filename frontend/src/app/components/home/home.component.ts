import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UsersService } from '../../core/services/users.service';
import { User } from '../../core/models/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  totalUsers = 0;
  totalMembers = 0;
  totalTrainers = 0;
  totalAdmins = 0;
  recentUsers: User[] = [];
  isLoading = true;

  constructor(
    public authService: AuthService,
    private usersService: UsersService,
    private router: Router
  ) {}

  get isSuperAdmin(): boolean {
    const r = this.authService.role?.toString().toLowerCase().replace(/\s+/g, '_');
    return r === 'super_admin';
  }

  ngOnInit(): void {
    const role = this.authService.role?.toString().toLowerCase().replace(/\s+/g, '_');

    // Restrict access so only Super Admin and Admin can view the dashboard
    if (role !== 'super_admin' && role !== 'admin') {
      this.router.navigate(['/workouts']);
      return;
    }

    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.usersService.getAll().subscribe({
      next: (res: any) => {
        const users: User[] = Array.isArray(res) ? res : (res.data || res.users || []);

        this.totalUsers = users.length;
        this.totalMembers = users.filter((u) => u.role?.toLowerCase() === 'member').length;
        this.totalTrainers = users.filter((u) => u.role?.toLowerCase() === 'trainer').length;
        this.totalAdmins = users.filter((u) => {
          const r = u.role?.toLowerCase().replace(/\s+/g, '_');
          return r === 'admin' || r === 'super_admin';
        }).length;

        this.recentUsers = [...users].slice(-5).reverse();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load dashboard data:', err);
        this.isLoading = false;
      }
    });
  }
}