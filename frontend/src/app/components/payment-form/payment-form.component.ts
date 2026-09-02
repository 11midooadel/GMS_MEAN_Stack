import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { PaymentsService } from '../../core/services/payments.service';
import { SubscriptionsService } from '../../core/services/subscriptions.service';
import { UsersService } from '../../core/services/users.service';
import { Payment, User, Subscription, PaymentStatus, Plan } from '../../core/models/models';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html'
})
export class PaymentFormComponent implements OnInit {
  isEdit = !!this.data.payment;
  saving = false;

  methods = ['Cash', 'Card']; // From backend enum[cite: 31]
  statuses = ['Pending', 'Completed', 'Failed', 'Refunded']; // From backend enum[cite: 31]

  members: User[] = [];
  subscriptions: Subscription[] = [];
  filteredMembers!: Observable<User[]>;

  form = this.fb.group({
    member: [{ value: null as User | null, disabled: this.isEdit }, Validators.required],
    subscriptionId: [{ value: this.data.payment?.subscriptionId ?? '', disabled: this.isEdit }, Validators.required],
    amount: [{ value: this.data.payment?.amount ?? '', disabled: this.isEdit }, [Validators.required, Validators.min(0)]],
    paymentMethod: [{ value: this.data.payment?.paymentMethod ?? 'Cash', disabled: this.isEdit }, Validators.required],
    transactionId: [{ value: this.data.payment?.transactionId ?? '', disabled: this.isEdit }],
    status: [this.data.payment?.status ?? 'Completed', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private paymentsSvc: PaymentsService,
    private subSvc: SubscriptionsService,
    private usersSvc: UsersService,
    private snack: MatSnackBar,
    private dialogRef: MatDialogRef<PaymentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { payment?: Payment }
  ) { }

  ngOnInit(): void {
    if (!this.isEdit) {
      this.loadMembers();
    }
  }

  loadMembers(): void {
    this.usersSvc.getAll().subscribe((res: any) => {
      const users = res.data || res;
      this.members = users.filter((u: User) => u.role === 'Member');
      this.filteredMembers = this.form.get('member')!.valueChanges.pipe(
        startWith(''),
        map(value => (typeof value === 'string' ? value : value?.name || '')),
        map(name => (name ? this.members.filter(m => m.name.toLowerCase().includes(name.toLowerCase())) : this.members.slice()))
      );
    });
  }

  displayMember(member?: User): string {
    return member ? `${member.name} (${member.email})` : '';
  }

  getPlanName(sub: Subscription): string {
    return typeof sub.planId === 'object' ? (sub.planId as Plan).name : 'Membership';
  }

  // When a member is selected, load their subscriptions so the admin can link the payment
  onMemberSelected(member: User): void {
    this.subSvc.byMember(member._id!).subscribe((res: any) => {
      const subs = res.data || res;
      this.subscriptions = Array.isArray(subs) ? subs : [subs];
    });
  }

  onSubscriptionSelected(subId: string): void {
    // Find the subscription that matches the selected ID
    const selectedSub = this.subscriptions.find(s => s._id === subId);
    
    if (selectedSub && typeof selectedSub.planId === 'object') {
      const plan = selectedSub.planId as Plan;
      
      // If the backend populated the price, patch the form
      if (plan.price !== undefined) {
        this.form.patchValue({ amount: plan.price });
      }
    }
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const v = this.form.getRawValue();

    if (this.isEdit) {
      // Add "as PaymentStatus" here
      this.paymentsSvc.updateStatus(this.data.payment!._id!, v.status as PaymentStatus).subscribe({
        next: () => this.handleSuccess('Payment status updated'),
        error: (err) => this.handleError(err)
      });
    } else {
      const body: any = {
        memberId: v.member?._id,
        subscriptionId: v.subscriptionId,
        amount: Number(v.amount),
        paymentMethod: v.paymentMethod,
        status: v.status
      };

      // Only add transactionId if it has a value
      if (v.transactionId && v.transactionId.trim() !== '') {
        body.transactionId = v.transactionId;
      }

      this.paymentsSvc.create(body).subscribe({
        next: () => this.handleSuccess('Payment recorded'),
        error: (err) => this.handleError(err)
      });
    }
  }

  private handleSuccess(msg: string) {
    this.snack.open(msg, 'OK', { duration: 3000 });
    this.dialogRef.close(true);
  }

  private handleError(err: any) {
    this.saving = false;
    this.snack.open(err.error?.message || 'Error saving payment', 'OK', { duration: 3000 });
  }
}