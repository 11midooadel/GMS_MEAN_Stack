import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HealthRecordsService } from '../../core/services/health-records.service';
import { AuthService } from '../../core/services/auth.service';
import { HealthRecord } from '../../core/models/models';

@Component({
  selector: 'app-health-page',
  templateUrl: './health-page.component.html',
  styleUrls: ['./health-page.component.css'],
})
export class HealthPageComponent implements OnInit {
  loading = true;
  saving = false;
  records: HealthRecord[] = [];
  cols = ['date', 'weight', 'bmi'];

  form = this.fb.group({
    weight: [null as number | null, [Validators.required, Validators.min(1)]],
    height: [null as number | null, [Validators.required, Validators.min(1)]],
    bodyFatPercentage: [null as number | null],
    muscleMass: [null as number | null],
    notes: [''],
  });

  constructor(
    private fb: FormBuilder,
    private svc: HealthRecordsService,
    private auth: AuthService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.svc.memberHistory(this.auth.currentUser!.id).subscribe({
      next: (r) => { this.records = r; this.loading = false; },
      error: () => (this.loading = false),
    });
  }

  bmi(r: HealthRecord): string {
    if (!r.height) return '—';
    const m = r.height / 100;
    return (r.weight / (m * m)).toFixed(1);
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const body = { ...this.form.value, memberId: this.auth.currentUser!.id } as any;
    this.svc.create(body).subscribe({
      next: () => {
        this.snack.open('Record saved', 'OK', { duration: 3000 });
        this.form.reset();
        this.saving = false;
        this.load();
      },
      error: () => (this.saving = false),
    });
  }
}
