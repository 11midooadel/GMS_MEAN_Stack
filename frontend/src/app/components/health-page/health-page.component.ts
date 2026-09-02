import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, of, map, catchError } from 'rxjs';
import { HealthRecordsService } from '../../core/services/health-records.service';
import { UsersService } from '../../core/services/users.service';
import { AuthService } from '../../core/services/auth.service';
import { HealthRecord, User } from '../../core/models/models';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { HealthHistoryDialogComponent } from '../health-history-dialog/health-history-dialog.component';

@Component({
  selector: 'app-health-page',
  templateUrl: './health-page.component.html',
  styleUrls: ['./health-page.component.css'],
})
export class HealthPageComponent implements OnInit {
  loading = true;
  saving = false;
  records: HealthRecord[] = [];
  cols = ['date', 'weight', 'bmi', 'actions'];

  /** Admin/Super Admin view: every member, view-only access to their history. */
  members: User[] = [];

  /** Set while editing an existing record; null means the form is creating a new one. */
  editingId: string | null = null;

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
    private usersSvc: UsersService,
    private auth: AuthService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}

  get isAdmin(): boolean {
    return this.auth.hasRole('Admin', 'Super Admin');
  }

  ngOnInit(): void {
    this.isAdmin ? this.loadMembers() : this.load();
  }

  /** Admin/Super Admin: only members who actually have at least one health record, view-only. */
  loadMembers(): void {
    this.loading = true;
    this.usersSvc.getAll().subscribe({
      next: (all) => {
        const candidates = all.filter((u) => u.role === 'Member');
        if (!candidates.length) {
          this.members = [];
          this.loading = false;
          return;
        }
        forkJoin(
          candidates.map((m) =>
            this.svc.memberHistory(m._id!).pipe(
              map((records) => ({ member: m, hasRecords: records.length > 0 })),
              catchError(() => of({ member: m, hasRecords: false }))
            )
          )
        ).subscribe((results) => {
          this.members = results.filter((r) => r.hasRecords).map((r) => r.member);
          this.loading = false;
        });
      },
      error: () => (this.loading = false),
    });
  }

  initials(name: string): string {
    return name.split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  }

  viewHealth(member: User): void {
    this.dialog.open(HealthHistoryDialogComponent, {
      width: '640px',
      data: { memberId: member._id!, memberName: member.name },
    });
  }

  /** Member: their own create/edit/delete history. */
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

  edit(r: HealthRecord): void {
    this.editingId = r._id!;
    this.form.patchValue({
      weight: r.weight,
      height: r.height,
      bodyFatPercentage: r.bodyFatPercentage ?? null,
      muscleMass: r.muscleMass ?? null,
      notes: r.notes ?? '',
    });
  }

  cancelEdit(): void {
    this.editingId = null;
    this.form.reset();
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const body = { ...this.form.value, memberId: this.auth.currentUser!.id } as any;

    const req = this.editingId
      ? this.svc.update(this.editingId, body)
      : this.svc.create(body);

    req.subscribe({
      next: () => {
        this.snack.open(`Health record ${this.editingId ? 'updated' : 'saved'} successfully.`, 'OK', { duration: 3000 });
        this.editingId = null;
        this.form.reset();
        this.saving = false;
        this.load();
      },
      error: () => (this.saving = false),
    });
  }

  remove(r: HealthRecord): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        width: '360px',
        data: {
          title: 'Do you want to delete this record?',
          message: `Your health record from ${new Date(r.date).toLocaleDateString()} will be permanently removed. This can't be undone.`,
          confirmText: 'Delete',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.svc.delete(r._id!).subscribe(() => this.load());
      });
  }
}
