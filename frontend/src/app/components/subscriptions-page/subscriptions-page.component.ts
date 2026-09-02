import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SubscriptionsService } from '../../core/services/subscriptions.service';
import { AuthService } from '../../core/services/auth.service';
import { Plan, Subscription } from '../../core/models/models';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-subscriptions-page',
  templateUrl: './subscriptions-page.component.html',
  styleUrls: ['./subscriptions-page.component.css'],
})
export class SubscriptionsPageComponent implements OnInit {
  loading = true;
  subs: Subscription[] = [];

  constructor(
    private svc: SubscriptionsService,
    private auth: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.svc.byMember(this.auth.currentUser!.id).subscribe({
      next: (s) => { this.subs = Array.isArray(s) ? s : [s]; this.loading = false; },
      error: () => (this.loading = false),
    });
  }
  planName(s: Subscription): string {
    return typeof s.planId === 'object' ? (s.planId as Plan).name : 'Membership';
  }
  cancel(s: Subscription): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        width: '360px',
        data: {
          title: 'Cancel subscription?',
          message: `This will cancel your ${this.planName(s)} subscription immediately.`,
          confirmText: 'Cancel subscription',
          cancelText: 'Keep it',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.svc.cancel(s._id!).subscribe(() => this.load());
      });
  }
}
