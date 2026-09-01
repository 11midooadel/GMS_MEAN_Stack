import { Component, OnInit } from '@angular/core';
import { SubscriptionsService } from '../../core/services/subscriptions.service';
import { AuthService } from '../../core/services/auth.service';
import { Plan, Subscription } from '../../core/models/models';

@Component({
  selector: 'app-subscriptions-page',
  templateUrl: './subscriptions-page.component.html',
  styleUrls: ['./subscriptions-page.component.css'],
})
export class SubscriptionsPageComponent implements OnInit {
  loading = true;
  subs: Subscription[] = [];

  constructor(private svc: SubscriptionsService, private auth: AuthService) {}

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
    if (!confirm('Cancel this subscription?')) return;
    this.svc.cancel(s._id!).subscribe(() => this.load());
  }
}
