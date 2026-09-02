import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HealthRecordsService } from '../../core/services/health-records.service';
import { HealthRecord } from '../../core/models/models';

export interface HealthHistoryDialogData {
  memberId: string;
  memberName: string;
}

@Component({
  selector: 'app-health-history-dialog',
  templateUrl: './health-history-dialog.component.html',
  styleUrls: ['./health-history-dialog.component.css'],
})
export class HealthHistoryDialogComponent implements OnInit {
  loading = true;
  records: HealthRecord[] = [];
  cols = ['date', 'weight', 'height', 'bmi', 'notes'];

  constructor(
    private svc: HealthRecordsService,
    @Inject(MAT_DIALOG_DATA) public data: HealthHistoryDialogData
  ) {}

  ngOnInit(): void {
    this.svc.memberHistory(this.data.memberId).subscribe({
      next: (r) => { this.records = r; this.loading = false; },
      error: () => (this.loading = false),
    });
  }

  bmi(r: HealthRecord): string {
    if (!r.height) return '—';
    const m = r.height / 100;
    return (r.weight / (m * m)).toFixed(1);
  }
}
