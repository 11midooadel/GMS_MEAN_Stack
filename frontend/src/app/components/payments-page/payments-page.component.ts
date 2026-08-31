import { Component, OnInit } from '@angular/core';
import { PaymentsService } from '../../core/services/payments.service';
import { AuthService } from '../../core/services/auth.service';
import { Payment, User } from '../../core/models/models';

@Component({
  selector: 'app-payments-page',
  templateUrl: './payments-page.component.html',
  styleUrls: ['./payments-page.component.css'],
})
export class PaymentsPageComponent implements OnInit {
  loading = true;
  payments: Payment[] = [];
  cols = ['member', 'amount', 'method', 'status', 'date'];

  constructor(private svc: PaymentsService, private auth: AuthService) {}

  ngOnInit(): void {
    const req = this.auth.hasRole('Admin', 'Super Admin')
      ? this.svc.getAll()
      : this.svc.byMember(this.auth.currentUser!.id);
    req.subscribe({
      next: (p) => { this.payments = p; this.loading = false; },
      error: () => (this.loading = false),
    });
  }
  memberName(p: Payment): string {
    return typeof p.memberId === 'object' ? (p.memberId as User).name : 'Member';
  }
}
