import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { NavItem, navForRole } from '../../core/nav/nav-items';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  @Output() navigate = new EventEmitter<void>();

  items: NavItem[] = navForRole(this.auth.role);

  constructor(private auth: AuthService) {}
}
