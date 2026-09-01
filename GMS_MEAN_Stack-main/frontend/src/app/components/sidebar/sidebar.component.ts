import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { navForRole, NavItem } from '../../core/nav/nav-items';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Output() navigate = new EventEmitter<void>();
  items: NavItem[] = [];

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.items = navForRole(user?.role ?? this.authService.role);
    });
  }
}