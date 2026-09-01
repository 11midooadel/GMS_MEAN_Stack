import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AttendanceService } from '../../core/services/attendance.service';
import { Attendance } from '../../core/models/models';

@Component({
  selector: 'app-attendance-page',
  templateUrl: './attendance-page.component.html',
  styleUrls: ['./attendance-page.component.css'],
})
export class AttendancePageComponent implements OnInit {
  loading = true;
  records: Attendance[] = [];
  cols = ['checkIn', 'checkOut'];

  constructor(private svc: AttendanceService, private snack: MatSnackBar) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.svc.myAttendance().subscribe({
      next: (r) => { this.records = r; this.loading = false; },
      error: () => (this.loading = false),
    });
  }

  checkIn(): void {
    this.svc.checkIn().subscribe(() => {
      this.snack.open('Checked in ✅', 'OK', { duration: 3000 });
      this.load();
    });
  }
  checkOut(): void {
    this.svc.checkOut().subscribe(() => {
      this.snack.open('Checked out 👋', 'OK', { duration: 3000 });
      this.load();
    });
  }
}
