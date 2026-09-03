import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { UsersService } from '../../core/services/users.service';
import { User } from '../../core/models/models';
import { WorkoutFormComponent } from '../workout-form/workout-form.component';

export interface ClassMembersDialogData {
  classId: string;
  className: string;
}

@Component({
  selector: 'app-class-members-dialog',
  templateUrl: './class-members-dialog.component.html',
  styleUrls: ['./class-members-dialog.component.css'],
})
export class ClassMembersDialogComponent implements OnInit {
  loading = true;
  members: User[] = [];

  /** Being enrolled in the trainer's class doesn't make them the trainer's assigned member —
   *  only members actually assigned to this trainer (My Members) can have a plan created here. */
  private myMemberIds = new Set<string>();

  constructor(
    private enrollment: EnrollmentService,
    private usersSvc: UsersService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: ClassMembersDialogData
  ) {}

  ngOnInit(): void {
    this.enrollment.classMembers(this.data.classId).subscribe({
      next: (members) => { this.members = members; this.loading = false; },
      error: () => (this.loading = false),
    });
    this.usersSvc.getMyMembers().subscribe((mine) => {
      this.myMemberIds = new Set(mine.map((m) => m._id!));
    });
  }

  initials(name: string): string {
    return name.split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  }

  canCreatePlan(member: User): boolean {
    return this.myMemberIds.has(member._id!);
  }

  createPlan(member: User): void {
    this.dialog.open(WorkoutFormComponent, {
      width: '540px',
      data: { memberId: member._id!, memberName: member.name },
    });
  }
}
