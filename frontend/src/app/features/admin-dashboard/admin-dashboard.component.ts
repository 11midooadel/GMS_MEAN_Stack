import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  userName: string = '';

  constructor(public authService: AuthService) {}

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

    // Useful for debugging in F12 console
    console.log('Logged-in user object:', user);

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
  }
}