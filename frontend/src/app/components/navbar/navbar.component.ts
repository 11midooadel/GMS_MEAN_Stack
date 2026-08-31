import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  @Output() menuClick = new EventEmitter<void>();

  constructor(private auth: AuthService, private router: Router) {}

  get user() {
    return this.auth.currentUser;
  }

  get initials(): string {
    const n = this.user?.name?.trim() ?? '?';
    return n.split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
