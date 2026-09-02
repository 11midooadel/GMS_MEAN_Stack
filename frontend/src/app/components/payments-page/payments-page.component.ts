import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PaymentsService } from '../../core/services/payments.service';
import { AuthService } from '../../core/services/auth.service';
import { Payment, User } from '../../core/models/models';
import { PaymentFormComponent } from '../payment-form/payment-form.component';

@Component({
  selector: 'app-payments-page',
  templateUrl: './payments-page.component.html',
  styleUrls: ['./payments-page.component.css'],
})
export class PaymentsPageComponent implements OnInit {
  loading = true;
  payments: Payment[] = [];
  isAdmin = false;
  totalRevenue = 0;
  completedCount = 0;
  pendingCount = 0;
  
  // Added 'actions' to the table columns[cite: 30]
  cols = ['member', 'amount', 'method', 'status', 'date', 'actions']; 

  constructor(
    private svc: PaymentsService, 
    private auth: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.auth.hasRole('Admin', 'Super Admin');
    // If not admin, remove the 'actions' column so members don't see an empty column
    if (!this.isAdmin) {
      this.cols = ['member', 'amount', 'method', 'status', 'date'];
    }
    this.load();
  }

  load(): void {
    this.loading = true;
    const req = this.isAdmin ? this.svc.getAll() : this.svc.byMember(this.auth.currentUser!.id);
    
    req.subscribe({
      next: (res: any) => { 
        const data = res.data || res;
        this.payments = Array.isArray(data) ? data : [data]; 
        
        // Call the calculation method if the user is an admin
        if (this.isAdmin) {
          this.calculateStats();
        }
        
        this.loading = false; 
      },
      error: () => (this.loading = false),
    });
  }

  calculateStats(): void {
    // Reset values in case of reload
    this.totalRevenue = 0;
    this.completedCount = 0;
    this.pendingCount = 0;

    this.payments.forEach(p => {
      if (p.status === 'Completed') {
        this.totalRevenue += (p.amount || 0);
        this.completedCount++;
      } else if (p.status === 'Pending') {
        this.pendingCount++;
      }
    });
  }

  memberName(p: any): string {
    // If the backend populated the member object
    if (p.memberId && typeof p.memberId === 'object') {
      return p.memberId.name || p.memberId.email || 'Unknown Member';
    }
    
    // If it's a regular user viewing their own payments (backend doesn't populate the object)
    if (!this.isAdmin && this.auth.currentUser) {
      // Return their own name from the auth service (adjust 'name' if your currentUser uses a different property)
      return (this.auth.currentUser as any).name || 'Me';
    }
    
    return 'Member';
  }

  openAddPaymentDialog(): void {
    const dialogRef = this.dialog.open(PaymentFormComponent, { width: '500px', disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(res => { if (res) this.load(); });
  }

  openEditPaymentDialog(payment: Payment): void {
    const dialogRef = this.dialog.open(PaymentFormComponent, { width: '500px', disableClose: true, data: { payment } });
    dialogRef.afterClosed().subscribe(res => { if (res) this.load(); });
  }
}