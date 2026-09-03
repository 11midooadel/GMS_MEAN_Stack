import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { UsersService } from '../../core/services/users.service';
import { User } from 'src/app/core/models/models';
import { SubscriptionsService } from '../../core/services/subscriptions.service';
import { PaymentsService } from '../../core/services/payments.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  userName: string = '';
  totalUsers = 0;
  totalMembers = 0;
  totalTrainers = 0;
  totalAdmins = 0;
  totalActiveSubscriptions = 0;
  totalMonthlyRevenue = 0;
  recentUsers: User[] = [];
  isLoading = true;

  constructor(public authService: AuthService, private usersService: UsersService, private subscriptionsService: SubscriptionsService, private paymentsService: PaymentsService) { }

  ngOnInit(): void {
    // 1. Check all common places user data is stored
    const localUserRaw = localStorage.getItem('user') || localStorage.getItem('currentUser');
    let localUser: any = null;
    try {
      localUser = localUserRaw ? JSON.parse(localUserRaw) : null;
    } catch (e) {
      localUser = null;
    }

    const authUser = (this.authService as any)?.currentUserValue ||
      (this.authService as any)?.user ||
      (this.authService as any)?.currentUser;

    const user = authUser || localUser || {};

    // 2. Extract username / name from whichever field your API returned
    const resolvedName =
      user.username ||
      user.userName ||
      user.name ||
      user.fullName ||
      user.user?.username ||
      user.user?.name ||
      user.email?.split('@')[0] ||
      '';

    this.userName = resolvedName;

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
    this.subscriptionsService.getAll().subscribe({
      next: (res: any) => {
        const subscriptions: any[] = Array.isArray(res) ? res : (res.data || res.subscriptions || []);
        this.totalActiveSubscriptions = subscriptions.filter((s) => s.status === 'Active').length;
        console.log(this.totalActiveSubscriptions);
      },
      error: (err) => {
        console.error('Failed to load subscriptions data:', err);
      }
    });

    this.paymentsService.getAll().subscribe({
      next: (res: any) => {
        const payments: any[] = Array.isArray(res) ? res : (res.data || res.payments || []).filter((p: any) => p.status === 'Completed');
        this.totalMonthlyRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
        console.log(this.totalMonthlyRevenue);
      },
      error: (err) => {
        console.error('Failed to load payments data:', err);
      }
    });
  }
}