import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from '../../core/services/users.service';
import { User } from '../../core/models/models';
import { WorkoutFormComponent } from '../workout-form/workout-form.component';
import { HealthHistoryDialogComponent } from '../health-history-dialog/health-history-dialog.component';

@Component({
  selector: 'app-my-members',
  templateUrl: './my-members.component.html',
  styleUrls: ['./my-members.component.css'],
})
export class MyMembersComponent implements OnInit {
  loading = true;
  members: User[] = [];

  constructor(
    private usersSvc: UsersService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.usersSvc.getMyMembers().subscribe({
      next: (data) => { this.members = data; this.loading = false; },
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

  createPlan(member: User): void {
    this.dialog.open(WorkoutFormComponent, {
      width: '540px',
      data: { memberId: member._id!, memberName: member.name },
    });
  }
}
