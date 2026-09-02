import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { UsersService } from '../../core/services/users.service';
import { PlansService } from '../../core/services/plans.service';
import { SubscriptionsService } from '../../core/services/subscriptions.service';
// Ensure you create this service to connect to your /payments route
import { PaymentsService } from '../../core/services/payments.service'; 
import { User, Plan, Subscription } from '../../core/models/models';

@Component({
  selector: 'app-subscription-form',
  templateUrl: './subscription-form.component.html',
  styleUrls: ['./subscription-form.component.css']
})
export class SubscriptionFormComponent implements OnInit {
  isEdit = !!this.data.subscription; // Determine mode[cite: 20]
  saving = false;
  
  // Aligning with your backend enum[cite: 6]
  statuses = ['Pending', 'Active', 'Expired', 'Cancelled', 'Frozen']; 

  members: User[] = [];
  plans: Plan[] = [];
  payments: any[] = []; // Replace 'any' with your Payment model

  filteredMembers!: Observable<User[]>;
  filteredPlans!: Observable<Plan[]>;
  filteredPayments!: Observable<any[]>;

  // We bind the entire object to the form to make the displayWith function work
  form = this.fb.group({
    member: [null as User | null, Validators.required],
    plan: [null as Plan | null, Validators.required],
    payment: [null as any | null],
    status: [this.data.subscription?.status ?? 'Pending', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private usersSvc: UsersService,
    private plansSvc: PlansService,
    private subSvc: SubscriptionsService,
    private paymentsSvc: PaymentsService, // Inject Payments Service
    private snack: MatSnackBar,
    private dialogRef: MatDialogRef<SubscriptionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { subscription?: Subscription } // Receive data[cite: 20]
  ) {}

  ngOnInit(): void {
    this.loadDropdownData();
  }

  loadDropdownData(): void {
    // 1. Load Members
    this.usersSvc.getAll().subscribe((res: any) => {
      const users = res.data || res;
      this.members = users.filter((u: User) => u.role === 'Member');
      this.setupMemberFilter();
      this.patchInitialMember();
    });

    // 2. Load Plans
    this.plansSvc.getAll().subscribe((res: any) => {
      const plans = res.data || res;
      // In edit mode, we show all plans. In add mode, only active ones.
      this.plans = this.isEdit ? plans : plans.filter((p: Plan) => p.isActive !== false);
      this.setupPlanFilter();
      this.patchInitialPlan();
    });

    // 3. Load Payments
    this.paymentsSvc.getAll().subscribe((res: any) => {
      this.payments = res.data || res;
      this.setupPaymentFilter();
      this.patchInitialPayment();
    });
  }

  // --- Filtering Logic for Searchable Dropdowns ---
  
  setupMemberFilter(): void {
    this.filteredMembers = this.form.get('member')!.valueChanges.pipe(
      startWith(this.form.get('member')?.value || ''),
      map(value => (typeof value === 'string' ? value : value?.name || '')),
      map(name => (name ? this.members.filter(m => m.name.toLowerCase().includes(name.toLowerCase())) : this.members.slice()))
    );
  }

  setupPlanFilter(): void {
    this.filteredPlans = this.form.get('plan')!.valueChanges.pipe(
      startWith(this.form.get('plan')?.value || ''),
      map(value => (typeof value === 'string' ? value : value?.name || '')),
      map(name => (name ? this.plans.filter(p => p.name.toLowerCase().includes(name.toLowerCase())) : this.plans.slice()))
    );
  }

  setupPaymentFilter(): void {
    this.filteredPayments = this.form.get('payment')!.valueChanges.pipe(
      startWith(this.form.get('payment')?.value || ''),
      map(value => (typeof value === 'string' ? value : this.displayPayment(value))),
      map(searchStr => {
        if (!searchStr) return this.payments.slice();
        const lowerStr = searchStr.toLowerCase();
        return this.payments.filter(p => 
          this.displayPayment(p).toLowerCase().includes(lowerStr)
        );
      })
    );
  }

  // --- Display Formatters for the Inputs ---
  
  displayMember(member?: User): string {
    return member ? `${member.name} (${member.email})` : '';
  }

  displayPlan(plan?: Plan): string {
    return plan ? `${plan.name} (${plan.durationInDays} days) - EGP ${plan.price}` : '';
  }

  displayPayment(payment?: any): string {
    if (!payment) return '';
    // Format the date to a readable local string
    const date = new Date(payment.paymentDate).toLocaleDateString();
    return `(${date}) EGP ${payment.amount}`;
  }

  // --- Patching Initial Values for Edit Mode ---

  patchInitialMember() {
    if (this.isEdit && this.data.subscription?.memberId) {
      const mId = typeof this.data.subscription.memberId === 'object' ? (this.data.subscription.memberId as any)._id : this.data.subscription.memberId;
      const found = this.members.find(m => m._id === mId);
      if (found) this.form.patchValue({ member: found });
    }
  }

  patchInitialPlan() {
    if (this.isEdit && this.data.subscription?.planId) {
      const pId = typeof this.data.subscription.planId === 'object' ? (this.data.subscription.planId as any)._id : this.data.subscription.planId;
      const found = this.plans.find(p => p._id === pId);
      if (found) this.form.patchValue({ plan: found });
    }
  }

  patchInitialPayment() {
    if (this.isEdit && this.data.subscription?.paymentId) {
      const pId = typeof this.data.subscription.paymentId === 'object' ? (this.data.subscription.paymentId as any)._id : this.data.subscription.paymentId;
      const found = this.payments.find(p => p._id === pId);
      if (found) this.form.patchValue({ payment: found });
    }
  }

  // --- Submission Logic ---

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;

    // Extract the raw _id strings from the selected objects to match backend requirements[cite: 6]
    const v = this.form.value;
    const body: any = {
      memberId: v.member?._id,
      planId: v.plan?._id,
      status: v.status
    };
    
    if (v.payment?._id) {
      body.paymentId = v.payment._id;
    }

    const req = this.isEdit
      ? this.subSvc.update(this.data.subscription!._id!, body)
      : this.subSvc.create(body); //[cite: 20]

    req.subscribe({
      next: () => {
        this.snack.open(`Subscription ${this.isEdit ? 'updated' : 'created'}`, 'OK', { duration: 3000 }); //[cite: 20]
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error(err);
        this.saving = false;
        this.snack.open(`Error: ${err.error?.message || 'Something went wrong'}`, 'OK', { duration: 3000 });
      },
    });
  }
}