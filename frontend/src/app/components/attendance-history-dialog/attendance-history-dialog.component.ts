import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AttendanceService } from '../../core/services/attendance.service';
import { Attendance } from '../../core/models/models';

export interface AttendanceHistoryDialogData {
  userId: string;
  userName: string;
}

@Component({
  selector: 'app-attendance-history-dialog',
  templateUrl: './attendance-history-dialog.component.html',
  styleUrls: ['./attendance-history-dialog.component.css'],
})
export class AttendanceHistoryDialogComponent implements OnInit {
  loading = true;
  records: Attendance[] = [];
  cols = ['checkIn', 'checkOut'];

  constructor(
    private svc: AttendanceService,
    @Inject(MAT_DIALOG_DATA) public data: AttendanceHistoryDialogData
  ) {}

  ngOnInit(): void {
    this.svc.byUser(this.data.userId).subscribe({
      next: (r) => { this.records = r; this.loading = false; },
      error: () => (this.loading = false),
    });
  }
}
