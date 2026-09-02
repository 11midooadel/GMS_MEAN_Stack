import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SubscriptionsService } from '../../core/services/subscriptions.service';
import { AuthService } from '../../core/services/auth.service';
import { Plan, Subscription } from '../../core/models/models';
import { SubscriptionFormComponent } from '../subscription-form/subscription-form.component';

@Component({
  selector: 'app-subscriptions-page',
  templateUrl: './subscriptions-page.component.html',
  styleUrls: ['./subscriptions-page.component.css'],
})
export class SubscriptionsPageComponent implements OnInit {
  loading = true;
  subs: Subscription[] = [];
  isAdmin = false; 

  constructor(
    private svc: SubscriptionsService, 
    private auth: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void { 
    this.isAdmin = this.auth.currentUser?.role === 'Admin' || this.auth.currentUser?.role === 'Super Admin';
    this.load(); 
  }

  load(): void {
    this.loading = true;
    
    // Choose the request based on the user's role
    const request = this.isAdmin 
      ? this.svc.getAll() 
      : this.svc.byMember(this.auth.currentUser!.id); //[cite: 12]

    request.subscribe({
      next: (res: any) => { 
        const subscriptions = res.data || res;
        this.subs = Array.isArray(subscriptions) ? subscriptions : [subscriptions]; 
        this.loading = false; 
      },
      error: () => (this.loading = false),
    });
  }

  planName(s: Subscription): string {
    return typeof s.planId === 'object' ? (s.planId as Plan).name : 'Membership';
  }

  // Add this new helper method to safely extract the member's name
  memberName(s: Subscription): string {
    if (typeof s.memberId === 'object' && s.memberId !== null) {
      return (s.memberId as any).name || 'Unknown';
    }
    return 'Unknown';
  }

  cancel(s: Subscription): void {
    if (!confirm('Cancel this subscription?')) return;
    this.svc.cancel(s._id!).subscribe(() => this.load());
  }

	// For Adding
  openAddSubscriptionDialog(): void {
    const dialogRef = this.dialog.open(SubscriptionFormComponent, {
      width: '500px',
      disableClose: true,
      data: {} // Empty data means isEdit = false[cite: 20]
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.load();
    });
  }

  // For Editing
  openEditSubscriptionDialog(sub: Subscription): void {
    const dialogRef = this.dialog.open(SubscriptionFormComponent, {
      width: '500px',
      disableClose: true,
      data: { subscription: sub } // Passing the data switches the form to Edit mode
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.load(); // Refresh the list if changes were saved
      }
    });
  }
}