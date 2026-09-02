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

  constructor(private auth: AuthService) {}

  get items(): NavItem[] {
    return navForRole(this.auth.role);
  }
}