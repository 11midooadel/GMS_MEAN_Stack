import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PlansService } from '../../core/services/plans.service';
import { AuthService } from '../../core/services/auth.service';
import { Plan } from '../../core/models/models';
import { PlanFormComponent } from '../plan-form/plan-form.component';

@Component({
  selector: 'app-plans-page',
  templateUrl: './plans-page.component.html',
  styleUrls: ['./plans-page.component.css'],
})
export class PlansPageComponent implements OnInit {
  loading = true;
  plans: Plan[] = [];

  constructor(
    private svc: PlansService, 
    private auth: AuthService,
    private dialog: MatDialog // Inject MatDialog
  ) {}

  get isAdmin() { return this.auth.hasRole('admin', 'super_admin'); } // Checks admin role[cite: 23]

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    
    // Pass this.isAdmin so the service knows whether to append ?all=true
    this.svc.getAll(this.isAdmin).subscribe({
      next: (res: any) => { 
        const plansData = res.data || res;
        this.plans = Array.isArray(plansData) ? plansData : [plansData]; 
        this.loading = false; 
      },
      error: () => (this.loading = false),
    });
  }

  enable(p: Plan) { this.svc.enable(p._id!).subscribe(() => this.load()); }
  disable(p: Plan) { this.svc.disable(p._id!).subscribe(() => this.load()); }

  // Add the delete method
  deletePlan(p: Plan): void {
    if (!confirm(`Are you sure you want to permanently delete the "${p.name}" plan? This might affect members currently subscribed to it.`)) {
      return;
    }
    
    // Calls the delete endpoint from your service[cite: 24]
    this.svc.delete(p._id!).subscribe({
      next: () => this.load(),
      error: (err) => {
        console.error('Error deleting plan:', err);
        alert(err.error?.message || 'Could not delete the plan.');
      }
    });
  }

  // Add Dialog Triggers
  openAddPlanDialog(): void {
    const dialogRef = this.dialog.open(PlanFormComponent, { width: '500px', disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(res => { if (res) this.load(); });
  }

  openEditPlanDialog(plan: Plan): void {
    const dialogRef = this.dialog.open(PlanFormComponent, { width: '500px', disableClose: true, data: { plan } });
    dialogRef.afterClosed().subscribe(res => { if (res) this.load(); });
  }
}