import { Component, OnInit } from '@angular/core';
import { PlansService } from '../../core/services/plans.service';
import { AuthService } from '../../core/services/auth.service';
import { Plan } from '../../core/models/models';

@Component({
  selector: 'app-plans-page',
  templateUrl: './plans-page.component.html',
  styleUrls: ['./plans-page.component.css'],
})
export class PlansPageComponent implements OnInit {
  loading = true;
  plans: Plan[] = [];

  constructor(private svc: PlansService, private auth: AuthService) {}

  get isAdmin() { return this.auth.hasRole('Admin', 'Super Admin'); }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: (p) => { this.plans = p; this.loading = false; },
      error: () => (this.loading = false),
    });
  }
  enable(p: Plan) { this.svc.enable(p._id!).subscribe(() => this.load()); }
  disable(p: Plan) { this.svc.disable(p._id!).subscribe(() => this.load()); }
}
